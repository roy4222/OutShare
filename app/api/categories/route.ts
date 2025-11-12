/**
 * Categories API Route
 *
 * 處理裝備類別相關的 API 請求
 * GET /api/categories - 獲取類別列表
 * POST /api/categories - 建立新類別
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getCategoriesByUserId,
  createCategory,
} from '@/lib/services/db';

/**
 * GET /api/categories
 *
 * 獲取當前使用者的所有類別
 * ⚠️ 需要認證
 */
export async function GET() {
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

    // 獲取類別
    const { data, error } = await getCategoriesByUserId(user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 *
 * 建立新類別
 * ⚠️ 需要認證
 */
export async function POST(request: NextRequest) {
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

    // 建立類別
    const { data, error } = await createCategory(name, user.id);

    if (error) {
      // 根據錯誤訊息返回適當的狀態碼
      if (error.message.includes('already exists')) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
