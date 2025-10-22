/**
 * Profile API Route (按 username 查詢)
 * 
 * GET /api/profiles/[username] - 獲取指定 username 的 Profile
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getProfileByUsername,
  getProfileWithStats,
} from '@/lib/services/prisma';

/**
 * GET /api/profiles/[username]
 * 
 * 獲取指定 username 的 Profile
 * Query Parameters:
 * - includeStats: 是否包含統計資料（tripCount, gearCount）
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const searchParams = request.nextUrl.searchParams;
    const includeStats = searchParams.get('includeStats') === 'true';

    // 先獲取 Profile
    const { data: profile, error: profileError } = await getProfileByUsername(username);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // 如果需要統計資料
    if (includeStats && profile.user_id) {
      const { data: profileWithStats, error: statsError } = await getProfileWithStats(profile.user_id);

      if (statsError) {
        return NextResponse.json(
          { error: statsError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ data: profileWithStats });
    }

    return NextResponse.json({ data: { profile, stats: null } });
  } catch (error) {
    console.error('Error in GET /api/profiles/[username]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

