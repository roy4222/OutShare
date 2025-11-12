/**
 * Categories Detail API Route
 *
 * 處理單一類別的操作
 * PUT /api/categories/[id] - 更新類別名稱
 * DELETE /api/categories/[id] - 刪除類別
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  updateCategory,
  deleteCategory,
} from '@/lib/services/db';

/**
 * PUT /api/categories/[id]
 *
 * 更新類別名稱
 * ⚠️ 需要認證，且只能更新自己的類別
 */
export async function PUT(
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
    const { name } = body;

    // 完整驗證
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    if (name.trim().length > 20) {
      return NextResponse.json(
        { error: 'Category name must be 20 characters or less' },
        { status: 400 }
      );
    }

    // 更新類別
    const { data, error } = await updateCategory(id, name, user.id);

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

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in PUT /api/categories/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 *
 * 刪除類別
 * ⚠️ 需要認證，且只能刪除自己的類別
 */
export async function DELETE(
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

    // 刪除類別
    const { data, error } = await deleteCategory(id, user.id);

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

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/categories/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
