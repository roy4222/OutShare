# 🔧 組件架構重構指南

## 📋 重構概述

本次重構將原有的單體組件拆分成職責清晰的架構，遵循以下原則：
- **關注點分離**：業務邏輯、資料存取、UI 渲染分離
- **可測試性**：邏輯層獨立，易於單元測試
- **可重用性**：共用邏輯抽取為 hooks 和 services
- **型別安全**：完整的 TypeScript 型別定義

## 🗂️ 新的目錄結構

```
lib/
├── types/                    # 型別定義（新位置）
│   ├── equipment.ts          # 裝備型別（修正拼寫）
│   ├── trip.ts               # 旅程型別
│   ├── profile.ts            # 個人資料型別（新增）
│   └── index.ts              # Barrel export
├── services/                 # 業務邏輯層（新增）
│   ├── equipment.service.ts  # 裝備業務邏輯
│   ├── trips.service.ts      # 旅程業務邏輯
│   └── index.ts
├── hooks/                    # Custom Hooks（新增）
│   ├── useEquipment.ts       # 裝備資料 hook
│   ├── useTripStats.ts       # 旅程統計 hook
│   ├── useProfile.ts         # 個人資料 hook
│   ├── useSwiperControl.ts   # Swiper 控制 hook
│   └── index.ts
└── utils.ts                  # 純工具函數（已清理）

components/
├── features/                 # 功能組件（新增）
│   ├── profile/
│   │   ├── ProfileHeader.tsx # 個人資料標題
│   │   ├── SocialLinks.tsx   # 社交連結
│   │   └── index.ts
│   ├── trips/
│   │   ├── TripCard.tsx      # 旅程卡片（重構）
│   │   ├── TripDetail.tsx    # 旅程詳細資訊（新增）
│   │   ├── TripDialog.tsx    # 旅程對話框（重構）
│   │   ├── TripList.tsx      # 旅程列表（新增）
│   │   └── index.ts
│   ├── equipment/
│   │   ├── EquipmentCard.tsx     # 裝備卡片（重構）
│   │   ├── EquipmentGroup.tsx    # 裝備分組（新增）
│   │   ├── EquipmentList.tsx     # 裝備列表（重構）
│   │   └── index.ts
│   ├── layout/
│   │   ├── TabLayout.tsx         # 通用 Tab 組件（新增）
│   │   ├── TripsToggleGroup.tsx  # 旅程切換組件（重構，修正拼寫）
│   │   └── index.ts
│   └── index.ts
├── [舊組件].tsx              # 向後相容層（標記為 deprecated）
└── ui/                       # 基礎 UI 組件（保持不變）
```

## 🔄 遷移指南

### 1. 型別定義

**舊版：**
```typescript
import { Trip } from "@/types/trip";
import { Equipment } from "@/types/equiment"; // 拼寫錯誤
```

**新版：**
```typescript
import { Trip, TripStats } from "@/lib/types/trip";
import { Equipment, EquipmentStats } from "@/lib/types/equipment"; // 修正拼寫
```

### 2. 組件引用

**舊版：**
```typescript
import TripCard from "@/components/TripCard";
import TripDialog from "@/components/TripDialog";
import EquimentCard from "@/components/EquimentCard";
import ProfileBlock from "@/components/profileBlock";
import TripsToogleGroup from "@/components/TripsToogleGroup"; // 拼寫錯誤
```

**新版（推薦）：**
```typescript
import { TripCard, TripDialog, TripList } from "@/components/features/trips";
import { EquipmentCard, EquipmentList } from "@/components/features/equipment";
import { ProfileHeader, SocialLinks } from "@/components/features/profile";
import { TripsToggleGroup } from "@/components/features/layout"; // 修正拼寫
```

### 3. 業務邏輯使用

**舊版（在組件內計算）：**
```typescript
const TripCard = ({ trip }) => {
  const { totalWeight, totalPrice } = calculateTripEquipmentTotals(trip.title);
  // ...
}
```

**新版（使用 Hook）：**
```typescript
import { useTripStats } from "@/lib/hooks/useTripStats";

const TripCard = ({ trip }) => {
  const stats = useTripStats(trip.title);
  // stats.totalWeight, stats.totalPrice, stats.equipmentCount
}
```

### 4. 裝備過濾

**舊版（在組件內過濾）：**
```typescript
const filteredEquipment = tripTitle 
  ? equipmentData.filter(equipment => 
      equipment.trips && equipment.trips.includes(tripTitle)
    )
  : equipmentData;
```

**新版（使用 Hook）：**
```typescript
import { useEquipment } from "@/lib/hooks/useEquipment";

const { equipment, groupedEquipment } = useEquipment({ 
  tripTitle,
  groupByCategory: true 
});
```

## ✅ 向後相容性

所有舊的組件引用仍然可以使用，但已標記為 `@deprecated`：

```typescript
// ✅ 仍可正常運作（但不推薦）
import TripCard from "@/components/TripCard";

// ⚠️ 編輯器會顯示警告：
// @deprecated 請改用 components/features/trips/TripCard
```

舊的型別引用也保持相容：
```typescript
// ✅ 仍可正常運作
import { Trip } from "@/types/trip";
import { Equipment } from "@/types/equiment"; // 即使拼寫錯誤也能用
```

## 🚀 新功能

### 1. Services 層

集中管理業務邏輯，易於測試和重用：

```typescript
import { 
  calculateTripStats,
  filterTripsByTags,
  searchTrips 
} from "@/lib/services/trips.service";

import {
  filterEquipmentByTrip,
  groupEquipmentByCategory,
  calculateEquipmentStats
} from "@/lib/services/equipment.service";
```

### 2. Custom Hooks

封裝常用的資料邏輯：

```typescript
// 旅程統計
const stats = useTripStats(tripTitle);

// 裝備資料和分組
const { equipment, groupedEquipment, isEmpty } = useEquipment({ 
  tripTitle,
  groupByCategory: true 
});

// 個人資料
const profile = useProfile();

// Swiper 控制
const { swiperRef, paginationRef, handleSlideChange, handlePaginationClick } = useSwiperControl();
```

### 3. 通用 TabLayout

可重用的 Tab 切換組件：

```typescript
import TabLayout, { TabItem } from "@/components/features/layout/TabLayout";

const tabs: TabItem[] = [
  { value: "tab1", label: "標籤 1", content: <Content1 /> },
  { value: "tab2", label: "標籤 2", content: <Content2 /> },
];

<TabLayout tabs={tabs} defaultTab="tab1" />
```

## 📦 未來擴展

### 資料庫整合

Services 層已為資料庫整合預留介面：

```typescript
// lib/services/trips.service.ts
export function getTripsByUser(userId: string): Trip[] {
  // TODO: 未來從資料庫獲取
  // 目前返回空陣列作為預留介面
  return [];
}
```

未來只需修改 Services 層的實作，UI 層無需變動。

### Repository Pattern

可以進一步引入 Repository 層：

```
lib/
├── repositories/           # 資料存取層（未來）
│   ├── trips.repository.ts
│   └── equipment.repository.ts
├── services/               # 業務邏輯層（現在）
└── hooks/                  # UI 邏輯層（現在）
```

## 🧪 測試建議

### 測試 Services

```typescript
import { calculateTripStats } from "@/lib/services/trips.service";

describe('calculateTripStats', () => {
  it('should calculate total weight and price correctly', () => {
    const stats = calculateTripStats('旅程名稱', mockEquipmentData);
    expect(stats.totalWeight).toBe(7.5);
    expect(stats.totalPrice).toBe(50000);
  });
});
```

### 測試 Hooks

```typescript
import { renderHook } from '@testing-library/react';
import { useTripStats } from "@/lib/hooks/useTripStats";

describe('useTripStats', () => {
  it('should return trip statistics', () => {
    const { result } = renderHook(() => useTripStats('旅程名稱'));
    expect(result.current.totalWeight).toBeGreaterThan(0);
  });
});
```

## 📝 檢查清單

重構完成後的驗證項目：

- [x] 所有組件職責單一
- [x] 業務邏輯獨立於 UI
- [x] 無 TypeScript 錯誤
- [x] 無 ESLint 警告
- [x] 向後相容（舊程式碼仍可運作）
- [x] 可以輕鬆替換為資料庫資料源

## 🔗 相關文件

- [專案 README](../README.md)
- [Google 登入設定](./SETUP_GOOGLE_AUTH.md)
- [部署說明](./DEPLOYMENT_NOTE.md)

---

**重構完成時間：** 2025-10-16  
**重構範圍：** Phase 1-4（基礎設施、組件、頁面、清理）  
**向後相容：** ✅ 是

