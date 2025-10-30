/**
 * Trip API Route (單一旅程)
 *
 * GET /api/trips/[id] - 獲取單一旅程
 * PUT /api/trips/[id] - 更新旅程
 * DELETE /api/trips/[id] - 刪除旅程
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getPublicTrip,
  getTripWithEquipment,
  updateTrip,
  deleteTrip,
} from '@/lib/services/db';

/**
 * GET /api/trips/[id]
 *
 * 獲取單一旅程（可選：包含裝備）
 * Query Parameters:
 * - includeEquipment: 是否包含關聯的裝備
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const includeEquipment = searchParams.get('includeEquipment') === 'true';

    if (includeEquipment) {
      const { data, error } = await getTripWithEquipment(id);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: 'Trip not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ data });
    } else {
      const { data, error } = await getPublicTrip(id);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: 'Trip not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ data });
    }
  } catch (error) {
    console.error('Error in GET /api/trips/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/trips/[id]
 *
 * 更新旅程
 * ⚠️ 需要認證，且只能更新自己的旅程
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // 更新旅程
    const { data, error } = await updateTrip(
      id,
      {
        title,
        description,
        location,
        duration,
        date: date !== undefined ? (date ? new Date(date) : null) : undefined,
        images,
        tags,
        slug,
      },
      user.id
    );

    if (error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in PUT /api/trips/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/trips/[id]
 *
 * 刪除旅程
 * ⚠️ 需要認證，且只能刪除自己的旅程
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 驗證使用者身份
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 刪除旅程
    const { success, error } = await deleteTrip(id, user.id);

    if (error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error in DELETE /api/trips/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
