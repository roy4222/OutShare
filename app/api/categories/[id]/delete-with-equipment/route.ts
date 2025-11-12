/**
 * Category Delete with Equipment API Route
 *
 * POST /api/categories/[id]/delete-with-equipment - 使用交易刪除類別並刪除所有相關裝備
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteCategoryWithEquipment } from '@/lib/services/db';

/**
 * POST /api/categories/[id]/delete-with-equipment
 *
 * 使用交易刪除類別並批次刪除所有相關裝備
 * ⚠️ 需要認證，且只能刪除自己的類別
 * ⚠️ 使用資料庫交易確保原子性：如果任何操作失敗，整個交易會回滾
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 驗證使用者身份
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 獲取 ID
    const params = await context.params;
    const { id } = params;

    // 解析請求 body
    const body = await request.json();
    const { equipmentIds } = body;

    // 驗證必填欄位
    if (!Array.isArray(equipmentIds)) {
      return NextResponse.json(
        { error: 'equipmentIds must be an array' },
        { status: 400 }
      );
    }

    // 使用交易刪除類別並刪除裝備
    const { data, error } = await deleteCategoryWithEquipment(
      id,
      equipmentIds,
      user.id
    );

    if (error) {
      // 根據錯誤訊息返回適當的狀態碼
      if (error.message.includes('not found')) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      message: `Category and ${equipmentIds.length} equipment items deleted successfully`
    });
  } catch (error) {
    console.error('Error in POST /api/categories/[id]/delete-with-equipment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
