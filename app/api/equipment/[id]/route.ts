import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  updateEquipment,
  deleteEquipment,
  NotFoundError,
  UnauthorizedError,
} from '@/lib/services/db/equipment.service';
import { GearSpecs } from '@/lib/mappers/equipment';
import { z } from 'zod';

// 驗證 Schema
const updateEquipmentSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long").optional(),
  category: z.string().min(1, "Category is required").optional(),
  description: z.string().max(80, "Description too long").optional(),
  image_url: z.string().url("Invalid image URL").optional().or(z.literal("")),
  specs: z.object({
    brand: z.string().max(50, "Brand too long").optional(),
    weight_g: z.number().min(0, "Weight must be positive").optional(),
    price_twd: z.number().min(0, "Price must be positive").optional(),
    buy_link: z.string().url("Invalid buy link URL").optional().or(z.literal("")),
    link_name: z.string().max(20, "Link name too long").optional(),
  }).optional(),
  tags: z.array(z.string().max(20, "Tag too long")).max(10, "Too many tags").optional(),
});

type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>;

function normalizeSpecs(specs?: UpdateEquipmentInput['specs']): GearSpecs | undefined {
  if (!specs) return undefined;

  const { brand, weight_g, price_twd, buy_link, link_name, ...rest } = specs;

  return {
    ...rest,
    brand,
    weight_g,
    price_twd,
    buy_link: buy_link || undefined,
    link_name: link_name || undefined,
  };
}

/**
 * PUT /api/equipment/[id]
 * 
 * 更新裝備
 * ⚠️ 需要認證
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Equipment ID is required' },
        { status: 400 }
      );
    }

    // 解析請求 body
    const body = await request.json();

    // 驗證輸入
    const validationResult = updateEquipmentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, category, description, image_url, specs, tags } = validationResult.data;

    const normalizedSpecs = normalizeSpecs(specs);

    // 更新裝備
    const { data, error } = await updateEquipment(
      id,
      {
        name,
        category,
        description,
        image_url: image_url || undefined,
        specs: normalizedSpecs,
        tags,
      },
      user.id
    );

    if (error) {
      if (error instanceof NotFoundError) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error instanceof UnauthorizedError) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in PUT /api/equipment/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/equipment/[id]
 * 
 * 刪除裝備
 * ⚠️ 需要認證
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Equipment ID is required' },
        { status: 400 }
      );
    }

    // 刪除裝備
    const { success, error } = await deleteEquipment(id, user.id);

    if (error) {
       if (error instanceof NotFoundError) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error instanceof UnauthorizedError) {
        return NextResponse.json({ error: error.message }, { status: 403 });
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error in DELETE /api/equipment/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
