/**
 * Profiles API Route
 * 
 * GET /api/profiles - 獲取當前使用者的 Profile
 * PUT /api/profiles - 更新當前使用者的 Profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getProfileByUserId,
  updateProfile,
} from '@/lib/services/prisma';

/**
 * GET /api/profiles
 * 
 * 獲取當前使用者的 Profile
 * ⚠️ 需要認證
 */
export async function GET(_request: NextRequest) {
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

    // 獲取 Profile
    const { data, error } = await getProfileByUserId(user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in GET /api/profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/profiles
 * 
 * 更新當前使用者的 Profile
 * ⚠️ 需要認證
 */
export async function PUT(request: NextRequest) {
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
    const { username, display_name, bio, avatar_url, social_links, gear_dashboard_title } = body;

    // 更新 Profile
    const { data, error } = await updateProfile(
      user.id,
      {
        username,
        display_name,
        bio,
        avatar_url,
        social_links,
        gear_dashboard_title,
      }
    );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in PUT /api/profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
