# 🚀 OutShare 快速參考

> 常用指令、路徑和模式的速查表

---

## 📦 常用指令

```bash
# 開發
npm run dev              # 啟動開發伺服器
npm run build            # 建置專案
npm run start            # 啟動生產伺服器
npm run lint             # 執行 ESLint

# Prisma
npx prisma generate      # 生成 Prisma Client
npx prisma db push       # 同步資料庫結構
npx prisma studio        # 開啟 Prisma Studio

# Supabase
supabase start           # 啟動本地 Supabase
supabase status          # 查看狀態
supabase db reset        # 重置資料庫
```

---

## 📁 常用路徑

```typescript
// 型別
import { Trip, TripStats } from '@/lib/types';

// Services
import { calculateTripStats } from '@/lib/services';

// Hooks
import { useTripStats, useEquipment } from '@/lib/hooks';

// 組件
import { TripCard, TripList } from '@/components/features/trips';
import { EquipmentList } from '@/components/features/equipment';
import { ProfileHeader } from '@/components/features/profile';

// UI 組件
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Supabase
import { createClient } from '@/lib/supabase/client';      // 客戶端
import { createClient } from '@/lib/supabase/server';      // 伺服器端

// 資料
import { tripsData } from '@/data/trips';
import { equipmentData } from '@/data/equiment';
```

---

## 🎯 新增功能檢查清單

- [ ] 1. 定義型別 (`lib/types/`)
- [ ] 2. 建立 Service (`lib/services/`)
- [ ] 3. 建立 Hook (`lib/hooks/`)
- [ ] 4. 建立組件 (`components/features/`)
- [ ] 5. 更新 barrel exports (`index.ts`)
- [ ] 6. 撰寫測試
- [ ] 7. 更新文件
- [ ] 8. 執行 `npm run build` 驗證
- [ ] 9. 執行 `npm run lint` 檢查
- [ ] 10. 提交 PR

---

## 🏗️ 常用模式

### 建立新的功能組件

```typescript
// 1. 定義型別 (lib/types/feature.ts)
export interface Feature {
  id: string;
  name: string;
}

export interface FeatureCardProps {
  feature: Feature;
  className?: string;
}

// 2. 建立 Service (lib/services/feature.service.ts)
export function processFeature(feature: Feature) {
  // 業務邏輯
  return processedFeature;
}

// 3. 建立 Hook (lib/hooks/useFeature.ts)
export function useFeature(id: string) {
  const data = useMemo(() => {
    return processFeature(featureData);
  }, [id]);
  
  return data;
}

// 4. 建立組件 (components/features/feature/FeatureCard.tsx)
const FeatureCard = ({ feature, className }: FeatureCardProps) => {
  return <Card className={className}>...</Card>;
};

export default FeatureCard;

// 5. 更新 barrel export (components/features/feature/index.ts)
export { default as FeatureCard } from './FeatureCard';
```

### 建立新頁面

```typescript
// app/feature/page.tsx
"use client";

import { FeatureCard } from '@/components/features/feature';
import { useFeature } from '@/lib/hooks/useFeature';

export default function FeaturePage() {
  const data = useFeature('id');
  
  return (
    <div>
      <FeatureCard feature={data} />
    </div>
  );
}
```

---

## 🎨 組件模板

### 基礎組件

```typescript
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

const Component = ({ className, children }: ComponentProps) => {
  return (
    <div className={cn("base-styles", className)}>
      {children}
    </div>
  );
};

export default Component;
```

### 使用 Hook 的組件

```typescript
"use client";

import { useSomeHook } from '@/lib/hooks/useSomeHook';

interface ComponentProps {
  id: string;
}

const Component = ({ id }: ComponentProps) => {
  const data = useSomeHook(id);
  
  if (!data) {
    return <div>載入中...</div>;
  }
  
  return <div>{data.name}</div>;
};

export default Component;
```

---

## 🧪 測試模板

### Service 測試

```typescript
import { functionName } from './service-name.service';

describe('functionName', () => {
  it('should do something', () => {
    const result = functionName(input);
    expect(result).toBe(expected);
  });
});
```

### Hook 測試

```typescript
import { renderHook } from '@testing-library/react';
import { useHookName } from './useHookName';

describe('useHookName', () => {
  it('should return expected value', () => {
    const { result } = renderHook(() => useHookName(input));
    expect(result.current).toBeDefined();
  });
});
```

### 組件測試

```typescript
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

---

## 🔍 常見問題

### Q: 組件應該放在哪裡？

**A:** 
- 功能相關組件 → `components/features/[功能名]/`
- 通用 UI 組件 → `components/ui/`
- 共用組件 → `components/`

### Q: 什麼時候用 Service？什麼時候用 Hook？

**A:**
- **Service**: 純業務邏輯，不依賴 React
- **Hook**: 需要使用 React 特性（state, effect, context）

### Q: 如何處理錯誤？

**A:**
```typescript
// Hook 中
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Error:', error);
  return defaultValue;
}

// 組件中
if (error) {
  return <div>發生錯誤：{error.message}</div>;
}
```

### Q: 如何優化效能？

**A:**
1. 使用 `React.memo` 避免不必要的重渲染
2. 使用 `useMemo` 快取計算結果
3. 使用 `useCallback` 快取函數
4. 使用 Next.js Image 優化圖片

### Q: 型別定義應該放在哪裡？

**A:**
- 所有型別 → `lib/types/`
- 按領域分檔案（trip.ts, equipment.ts, profile.ts）
- 使用 barrel export (`lib/types/index.ts`)

---

## 📝 Commit Message 範例

```bash
# 新功能
git commit -m "feat(trips): add trip filtering by tags"

# 修復 bug
git commit -m "fix(equipment): correct weight calculation"

# 重構
git commit -m "refactor(profile): extract SocialLinks component"

# 文件
git commit -m "docs: update architecture guide"

# 樣式
git commit -m "style: format code with prettier"

# 測試
git commit -m "test: add tests for useTripStats hook"
```

---

## 🔗 相關文件

- [完整架構指南](./ARCHITECTURE_GUIDE.md)
- [重構指南](./REFACTORING_GUIDE.md)
- [重構總結](./REFACTORING_SUMMARY.md)
- [專案 README](../README.md)

---

**最後更新：** 2025-10-16

