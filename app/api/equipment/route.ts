/**
 * Equipment API Route
 *
 * 處理裝備相關的 API 請求
 * GET /api/equipment - 獲取裝備列表
 * POST /api/equipment - 建立新裝備
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getEquipmentList,
  createEquipment,
} from '@/lib/services/db';

/**
 * GET /api/equipment
 *
 * 獲取裝備列表（公開 API，支援多種查詢模式）
 * Query Parameters:
 * - userId: 過濾特定使用者的裝備
 * - tripId: 過濾特定旅程的裝備
 * - includeTrips: 是否包含關聯的旅程資訊
 *
 * ⚠️ 安全限制：必須至少提供 userId 或 tripId 其中之一，防止全站資料外洩
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;
    const tripId = searchParams.get('tripId') || undefined;
    const includeTrips = searchParams.get('includeTrips') === 'true';

    // 安全檢查：必須至少提供 userId 或 tripId
    if (!userId && !tripId) {
      return NextResponse.json(
        {
          error: 'Must provide either userId or tripId parameter',
          hint: 'Public equipment viewing requires explicit user or trip identification'
        },
        { status: 400 }
      );
    }

    const { data, error } = await getEquipmentList({
      userId,
      tripId,
      includeTrips,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET /api/equipment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/equipment
 *
 * 建立新裝備
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
    const { name, category, description, image_url, specs, tags } = body;

    // 驗證必填欄位
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // 建立裝備
    const { data, error } = await createEquipment(
      {
        name,
        category,
        description,
        image_url,
        specs,
        tags,
      },
      user.id
    );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/equipment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
