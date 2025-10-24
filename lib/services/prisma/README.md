# Prisma Services

這個目錄包含所有使用 Prisma ORM 的資料庫服務。

## 📁 檔案結構

```
prisma/
├── trips.service.ts       - 旅程 CRUD 操作
├── equipment.service.ts   - 裝備 CRUD 操作
├── profiles.service.ts    - 使用者 Profile 操作
└── index.ts              - 統一導出
```

## 🚀 使用方式

### 在 API Routes 中使用

```typescript
// app/api/trips/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTripList, createTrip } from '@/lib/services/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { data, error } = await getTripList();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  // 1. 驗證使用者
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 2. 建立資料
  const body = await request.json();
  const { data, error } = await createTrip(body, user.id);
  
  return NextResponse.json({ data }, { status: 201 });
}
```

## ⚠️ 重要提醒

### 1. 僅在 Server Side 使用
- ✅ API Routes
- ✅ Server Components
- ✅ Server Actions
- ❌ Client Components (使用 API Routes 代替)

### 2. 權限檢查
所有寫入操作（create, update, delete）都需要：
- 驗證使用者身份
- 確認使用者擁有資源的權限

```typescript
// ✅ 正確
const { data: { user } } = await supabase.auth.getUser();
const { data, error } = await updateTrip(id, updateData, user.id);

// ❌ 錯誤 - 沒有驗證使用者
const { data, error } = await updateTrip(id, updateData, 'unknown');
```

### 3. 錯誤處理
所有 service 函數都返回 `{ data, error }` 格式：

```typescript
const { data, error } = await getTripList();

if (error) {
  // 處理錯誤
  return NextResponse.json({ error: error.message }, { status: 500 });
}

// 使用 data
return NextResponse.json({ data });
```

## 📚 API 參考

### Trips Service

```typescript
// 獲取旅程列表
getTripList(options?: { userId?: string })

// 獲取單一旅程（公開存取）
getPublicTrip(identifier: string)

// 確認擁有權後獲取旅程
getOwnedTrip(id: string, userId: string)

// 根據 slug 獲取旅程
getTripUuidBySlug(slug: string)

// 建立旅程
createTrip(data: CreateTripInput, userId: string)

// 更新旅程
updateTrip(id: string, data: UpdateTripInput, userId: string)

// 刪除旅程
deleteTrip(id: string, userId: string)

// 獲取旅程及其裝備
getTripWithEquipment(id: string)
```

### Equipment Service

```typescript
// 獲取裝備列表
getEquipmentList(options?: { 
  userId?: string;
  tripId?: string;
  includeTrips?: boolean;
})

// 獲取單一裝備
getEquipmentById(id: string)

// 確認擁有權後獲取裝備
getOwnedEquipment(id: string, userId: string)

// 獲取旅程的裝備
getEquipmentByTrip(tripId: string)

// 建立裝備
createEquipment(data: CreateEquipmentInput, userId: string)

// 更新裝備
updateEquipment(id: string, data: UpdateEquipmentInput, userId: string)

// 刪除裝備
deleteEquipment(id: string, userId: string)

// 為旅程新增裝備
addEquipmentToTrip(tripId: string, gearId: string, userId: string)

// 從旅程移除裝備
removeEquipmentFromTrip(tripId: string, gearId: string, userId: string)
```

### Profiles Service

```typescript
// 根據 user_id 獲取 Profile
getProfileByUserId(userId: string)

// 根據 username 獲取 Profile
getProfileByUsername(username: string)

// 建立 Profile
createProfile(data: CreateProfileInput)

// 更新 Profile
updateProfile(userId: string, data: UpdateProfileInput)

// 檢查 username 是否可用
isUsernameAvailable(username: string, excludeUserId?: string)

// 獲取 Profile 及統計資料
getProfileWithStats(userId: string)
```

## 🔒 權限模型

### 讀取操作 (Read)
- ✅ 公開：任何人都可以讀取
- 無需驗證

### 寫入操作 (Write)
- 🔐 需要認證
- 只能操作自己的資料
- Service 層會自動檢查權限

### 範例
```typescript
// 讀取 - 無需認證
const { data } = await getTripList();

// 建立 - 需要認證
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
const { data } = await createTrip(tripData, user.id);

// 更新 - 需要認證 + 擁有者檢查
const { data } = await updateTrip(tripId, updateData, user.id);
// 如果 user.id 不是 trip 的擁有者，會返回 error
```

## 🧪 測試

### 本地測試
```bash
# 確保本地 Supabase 正在運行
npx supabase status

# 檢查資料
docker exec supabase_db_outdoor-trails-hub psql -U postgres -d postgres -c "SELECT * FROM public.trip;"

# 重置資料庫
npx supabase db reset
```

### 使用 Prisma Studio
```bash
npx prisma studio
```

在瀏覽器開啟 `http://localhost:5555` 查看和編輯資料。

## 📖 延伸閱讀

- [Prisma 文件](https://www.prisma.io/docs)
- [Supabase 文件](https://supabase.com/docs)
- `../../prisma.ts` - Prisma Client 設定
- `../../../prisma/schema.prisma` - 資料庫 Schema

---

**記住**: Prisma Services 只處理資料，Auth 交給 Supabase！🔐
