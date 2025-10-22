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
} from '@/lib/services/prisma';

/**
 * GET /api/equipment
 * 
 * 獲取裝備列表
 * Query Parameters:
 * - userId: 可選，過濾特定使用者的裝備
 * - tripId: 可選，過濾特定旅程的裝備
 * - includeTrips: 可選，是否包含關聯的旅程資訊
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;
    const tripId = searchParams.get('tripId') || undefined;
    const includeTrips = searchParams.get('includeTrips') === 'true';

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

