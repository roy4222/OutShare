/**
 * Trips API Route
 * 
 * 處理旅程相關的 API 請求
 * GET /api/trips - 獲取旅程列表
 * POST /api/trips - 建立新旅程
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getTripList,
  createTrip,
} from '@/lib/services/prisma';

/**
 * GET /api/trips
 * 
 * 獲取旅程列表
 * Query Parameters:
 * - userId: 可選，過濾特定使用者的旅程
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;

    const { data, error } = await getTripList({ userId });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET /api/trips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/trips
 * 
 * 建立新旅程
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
    const { title, description, location, duration, date, images, tags, slug } = body;

    // 驗證必填欄位
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // 建立旅程
    const { data, error } = await createTrip(
      {
        title,
        description,
        location,
        duration,
        date: date ? new Date(date) : undefined,
        images,
        tags,
        slug,
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
    console.error('Error in POST /api/trips:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

