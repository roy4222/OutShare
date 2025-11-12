/**
 * Category Rename with Equipment API Route
 *
 * POST /api/categories/[id]/rename - 使用交易重新命名類別並更新所有相關裝備
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renameCategoryWithEquipment } from '@/lib/services/db';

/**
 * POST /api/categories/[id]/rename
 *
 * 使用交易重新命名類別並批次更新所有相關裝備
 * ⚠️ 需要認證，且只能更新自己的類別
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
    const { newName, equipmentIds } = body;

    // 驗證必填欄位
    if (!newName || newName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    if (newName.trim().length > 20) {
      return NextResponse.json(
        { error: 'Category name must be 20 characters or less' },
        { status: 400 }
      );
    }

    if (!Array.isArray(equipmentIds)) {
      return NextResponse.json(
        { error: 'equipmentIds must be an array' },
        { status: 400 }
      );
    }

    // 使用交易重新命名類別並更新裝備
    const { data, error } = await renameCategoryWithEquipment(
      id,
      newName,
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
      if (error.message.includes('already exists')) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      message: `Category renamed and ${equipmentIds.length} equipment items updated successfully`
    });
  } catch (error) {
    console.error('Error in POST /api/categories/[id]/rename:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
