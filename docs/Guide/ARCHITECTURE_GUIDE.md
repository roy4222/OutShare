# 🏗️ OutShare 架構指南

> 本文件為 OutShare 專案的架構指南，定義了程式碼組織、開發規範和最佳實踐。

**最後更新：** 2025-10-16  
**適用版本：** v2.0+（重構後）

---

## 📚 目錄

- [架構概覽](#架構概覽)
- [目錄結構](#目錄結構)
- [分層架構](#分層架構)
- [開發規範](#開發規範)
- [命名規範](#命名規範)
- [型別定義](#型別定義)
- [狀態管理](#狀態管理)
- [資料流](#資料流)
- [最佳實踐](#最佳實踐)
- [常見模式](#常見模式)

---

## 🎯 架構概覽

OutShare 採用**分層架構**，遵循**關注點分離**原則：

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │  ← UI 組件
│         (Components & Pages)            │
├─────────────────────────────────────────┤
│           Logic Layer                   │  ← Hooks & Services
│      (Custom Hooks & Services)          │
├─────────────────────────────────────────┤
│           Data Layer                    │  ← 資料存取
│    (Repository & External APIs)         │
└─────────────────────────────────────────┘
```

### 核心原則

1. **單一職責** - 每個模組只做一件事
2. **依賴反轉** - 高層模組不依賴低層模組
3. **開放封閉** - 對擴展開放，對修改封閉
4. **型別安全** - 完整的 TypeScript 型別定義
5. **可測試性** - 邏輯層可獨立測試

---

## 📁 目錄結構

```
outdoor-trails-hub/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 認證相關頁面（未來）
│   ├── (public)/                 # 公開頁面（未來）
│   ├── (protected)/              # 受保護頁面（未來）
│   ├── auth/                     # OAuth 回調
│   ├── dashboard/                # 後台管理
│   ├── profile/                  # 使用者公開頁面
│   ├── layout.tsx                # 根佈局
│   ├── page.tsx                  # 首頁（登入頁）
│   └── globals.css               # 全域樣式
│
├── components/                   # React 組件
│   ├── features/                 # 功能組件（業務邏輯相關）
│   │   ├── profile/              # 個人資料組件
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── SocialLinks.tsx
│   │   │   └── index.ts
│   │   ├── trips/                # 旅程組件
│   │   │   ├── TripCard.tsx
│   │   │   ├── TripDetail.tsx
│   │   │   ├── TripDialog.tsx
│   │   │   ├── TripList.tsx
│   │   │   └── index.ts
│   │   ├── equipment/            # 裝備組件
│   │   │   ├── EquipmentCard.tsx
│   │   │   ├── EquipmentGroup.tsx
│   │   │   ├── EquipmentList.tsx
│   │   │   └── index.ts
│   │   ├── layout/               # 佈局組件
│   │   │   ├── TabLayout.tsx
│   │   │   ├── TripsToggleGroup.tsx
│   │   │   └── index.ts
│   │   └── index.ts              # 統一匯出
│   ├── ui/                       # 基礎 UI 組件（shadcn/ui）
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── [共用組件].tsx            # 其他共用組件
│
├── lib/                          # 核心邏輯層
│   ├── types/                    # TypeScript 型別定義
│   │   ├── equipment.ts
│   │   ├── trip.ts
│   │   ├── profile.ts
│   │   └── index.ts
│   ├── services/                 # 業務邏輯層
│   │   ├── equipment.service.ts
│   │   ├── trips.service.ts
│   │   └── index.ts
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useEquipment.ts
│   │   ├── useTripStats.ts
│   │   ├── useProfile.ts
│   │   ├── useSwiperControl.ts
│   │   └── index.ts
│   ├── supabase/                 # Supabase 客戶端
│   │   ├── client.ts             # 瀏覽器端
│   │   ├── server.ts             # 伺服器端
│   │   └── middleware.ts         # Middleware
│   ├── database.types.ts         # Supabase 自動生成
│   ├── prisma.ts                 # Prisma 客戶端
│   └── utils.ts                  # 工具函數
│
├── data/                         # 靜態資料（暫時）
│   ├── trips.ts                  # 旅程資料
│   └── equiment.ts               # 裝備資料
│
├── asset/                        # 靜態資源
│   ├── icons/                    # SVG 圖標組件
│   ├── images/                   # 圖片
│   └── logo/                     # Logo 組件
│
├── docs/                         # 文件
│   ├── ARCHITECTURE_GUIDE.md     # 本文件
│   ├── REFACTORING_GUIDE.md      # 重構指南
│   └── ...
│
├── prisma/                       # Prisma Schema
├── supabase/                     # Supabase 配置
└── public/                       # 公開靜態檔案
```

---

## 🏛️ 分層架構

### 1. Presentation Layer（展示層）

**職責：** UI 渲染、使用者互動、路由

**包含：**
- `app/` - Next.js 頁面和路由
- `components/features/` - 功能組件
- `components/ui/` - 基礎 UI 組件

**規則：**
- ✅ 只負責 UI 渲染和使用者互動
- ✅ 使用 Hooks 獲取資料和邏輯
- ✅ 保持組件純淨，避免複雜邏輯
- ❌ 不直接調用 Services
- ❌ 不包含業務邏輯

**範例：**
```typescript
// ✅ 好的做法
const TripCard = ({ trip, stats }: TripCardProps) => {
  return (
    <Card>
      <CardTitle>{trip.title}</CardTitle>
      <CardDescription>{stats.totalWeight} 公斤</CardDescription>
    </Card>
  );
};

// ❌ 壞的做法
const TripCard = ({ trip }: TripCardProps) => {
  // 不應該在組件內計算業務邏輯
  const stats = calculateTripStats(trip.title, equipmentData);
  return <Card>...</Card>;
};
```

### 2. Logic Layer（邏輯層）

**職責：** 業務邏輯、資料處理、狀態管理

**包含：**
- `lib/hooks/` - Custom React Hooks
- `lib/services/` - 業務邏輯服務

**規則：**
- ✅ 封裝可重用的邏輯
- ✅ 提供清晰的 API 介面
- ✅ 可獨立測試
- ❌ 不包含 UI 相關程式碼
- ❌ 不直接操作 DOM

#### 2.1 Custom Hooks

**用途：** 封裝 React 相關的邏輯（狀態、副作用、資料獲取）

**命名：** `use[功能名稱]`

**範例：**
```typescript
// lib/hooks/useTripStats.ts
export function useTripStats(tripTitle: string): TripStats {
  const stats = useMemo(() => {
    return calculateTripStats(tripTitle, equipmentData);
  }, [tripTitle]);

  return stats;
}
```

#### 2.2 Services

**用途：** 純業務邏輯，不依賴 React

**命名：** `[領域名稱].service.ts`

**範例：**
```typescript
// lib/services/trips.service.ts
export function calculateTripStats(
  tripTitle: string,
  allEquipment: Equipment[]
): TripStats {
  const relatedEquipment = filterEquipmentByTrip(allEquipment, tripTitle);
  const equipmentStats = calculateEquipmentStats(relatedEquipment);

  return {
    totalWeight: equipmentStats.totalWeight / 1000,
    totalPrice: equipmentStats.totalPrice,
    equipmentCount: equipmentStats.count,
  };
}
```

### 3. Data Layer（資料層）

**職責：** 資料存取、API 呼叫、資料庫操作

**包含：**
- `lib/supabase/` - Supabase 客戶端
- `lib/prisma.ts` - Prisma ORM
- `data/` - 靜態資料（暫時）

**規則：**
- ✅ 統一的資料存取介面
- ✅ 錯誤處理
- ✅ 資料驗證
- ❌ 不包含業務邏輯

**未來擴展（Repository Pattern）：**
```typescript
// lib/repositories/trips.repository.ts
export class TripsRepository {
  async findByUserId(userId: string): Promise<Trip[]> {
    return await prisma.trip.findMany({
      where: { userId },
    });
  }

  async findById(id: string): Promise<Trip | null> {
    return await prisma.trip.findUnique({
      where: { id },
    });
  }
}
```

---

## 📝 開發規範

### 新增功能流程

1. **定義型別** (`lib/types/`)
2. **建立 Service** (`lib/services/`)
3. **建立 Hook**（如需要）(`lib/hooks/`)
4. **建立組件** (`components/features/`)
5. **建立頁面**（如需要）(`app/`)
6. **撰寫測試**
7. **更新文件**

### 檔案組織原則

#### 按功能分組（Feature-based）

```
components/features/trips/
├── TripCard.tsx          # 旅程卡片
├── TripDetail.tsx        # 旅程詳情
├── TripDialog.tsx        # 旅程對話框
├── TripList.tsx          # 旅程列表
└── index.ts              # 統一匯出
```

#### Barrel Exports

每個目錄都應該有 `index.ts` 統一匯出：

```typescript
// components/features/trips/index.ts
export { default as TripCard } from './TripCard';
export { default as TripDetail } from './TripDetail';
export { default as TripDialog } from './TripDialog';
export { default as TripList } from './TripList';
```

使用時：
```typescript
// ✅ 好的做法
import { TripCard, TripList } from '@/components/features/trips';

// ❌ 壞的做法
import TripCard from '@/components/features/trips/TripCard';
import TripList from '@/components/features/trips/TripList';
```

---

## 🏷️ 命名規範

### 檔案命名

| 類型 | 規則 | 範例 |
|------|------|------|
| React 組件 | PascalCase | `TripCard.tsx` |
| Hooks | camelCase, use 開頭 | `useTripStats.ts` |
| Services | camelCase, .service 結尾 | `trips.service.ts` |
| Types | camelCase | `trip.ts`, `equipment.ts` |
| Utils | camelCase | `utils.ts` |
| 頁面 | kebab-case | `profile/page.tsx` |

### 變數命名

```typescript
// 組件 - PascalCase
const TripCard = () => {};

// 函數 - camelCase
function calculateTripStats() {}

// 常數 - UPPER_SNAKE_CASE
const MAX_TRIPS_PER_PAGE = 10;

// 變數 - camelCase
const tripTitle = "日本熊野古道";

// 型別/介面 - PascalCase
interface TripStats {}
type Equipment = {};

// 私有變數 - 下劃線開頭（未使用的參數）
function handleClick(_event: MouseEvent) {}
```

### 布林值命名

```typescript
// ✅ 好的做法
const isLoading = true;
const hasError = false;
const canEdit = true;
const shouldUpdate = false;

// ❌ 壞的做法
const loading = true;
const error = false;
```

---

## 📐 型別定義

### 型別組織

```
lib/types/
├── equipment.ts          # 裝備相關型別
├── trip.ts              # 旅程相關型別
├── profile.ts           # 個人資料相關型別
└── index.ts             # 統一匯出
```

### 型別分類

#### Domain Model（領域模型）

資料庫實體或核心業務物件：

```typescript
// lib/types/trip.ts
export interface Trip {
  id: string;
  title: string;
  image: string[];
  location: string;
  duration: string;
  tags: string[];
  description?: string;
}
```

#### View Model（視圖模型）

UI 特定的資料結構：

```typescript
// lib/types/trip.ts
export interface TripStats {
  totalWeight: number;    // 公斤
  totalPrice: number;     // 台幣
  equipmentCount: number;
}
```

#### Props 介面

組件的 Props 定義：

```typescript
// lib/types/trip.ts
export interface TripCardProps {
  trip: Trip;
  stats?: TripStats;
  className?: string;
}
```

### 型別命名規範

```typescript
// 介面 - 描述性名詞
interface UserProfile {}
interface TripStats {}

// Props - 組件名 + Props
interface TripCardProps {}
interface ProfileHeaderProps {}

// 選項 - 功能名 + Options
interface UseEquipmentOptions {}

// 結果 - 功能名 + Result
interface UseEquipmentResult {}
```

---

## 🔄 狀態管理

### 本地狀態（useState）

用於組件內部的簡單狀態：

```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState('trips');
```

### 衍生狀態（useMemo）

用於計算衍生的值：

```typescript
const stats = useMemo(() => {
  return calculateTripStats(tripTitle, equipmentData);
}, [tripTitle]);
```

### 副作用（useEffect）

用於資料獲取、訂閱、DOM 操作：

```typescript
useEffect(() => {
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      router.push('/dashboard');
    }
  };
  checkUser();
}, [router, supabase.auth]);
```

### 全域狀態（未來）

當需要跨組件共享狀態時，考慮使用：
- React Context（輕量級）
- Zustand（中型應用）
- Redux Toolkit（大型應用）

---

## 🌊 資料流

### 單向資料流

```
Data Source (Supabase/Prisma)
        ↓
    Services
        ↓
      Hooks
        ↓
   Components
        ↓
       UI
```

### 範例：顯示旅程統計

```typescript
// 1. 資料來源
// data/equiment.ts
export const equipmentData: Equipment[] = [...];

// 2. Service 層
// lib/services/trips.service.ts
export function calculateTripStats(tripTitle: string, allEquipment: Equipment[]): TripStats {
  // 業務邏輯
}

// 3. Hook 層
// lib/hooks/useTripStats.ts
export function useTripStats(tripTitle: string): TripStats {
  return useMemo(() => calculateTripStats(tripTitle, equipmentData), [tripTitle]);
}

// 4. 組件層
// components/features/trips/TripCard.tsx
const TripCard = ({ trip }: TripCardProps) => {
  const stats = useTripStats(trip.title);
  return <div>{stats.totalWeight} 公斤</div>;
}
```

---

## ✨ 最佳實踐

### 1. 組件設計

#### 保持組件純淨

```typescript
// ✅ 好的做法 - 純展示組件
const TripCard = ({ trip, stats }: TripCardProps) => {
  return (
    <Card>
      <CardTitle>{trip.title}</CardTitle>
      <CardDescription>{stats.totalWeight} 公斤</CardDescription>
    </Card>
  );
};

// ❌ 壞的做法 - 混合邏輯
const TripCard = ({ trip }: { trip: Trip }) => {
  const equipment = equipmentData.filter(e => e.trips?.includes(trip.title));
  const totalWeight = equipment.reduce((sum, e) => sum + e.weight, 0) / 1000;
  
  return <Card>...</Card>;
};
```

#### 使用組合而非繼承

```typescript
// ✅ 好的做法 - 組合
const TripDialog = ({ trip, trigger }: TripDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <TripDetail trip={trip} />
      </DialogContent>
    </Dialog>
  );
};

// 使用
<TripDialog 
  trip={trip} 
  trigger={<TripCard trip={trip} />} 
/>
```

#### 提取可重用邏輯到 Hooks

```typescript
// ✅ 好的做法
const useSwiperControl = () => {
  const swiperRef = useRef<SwiperCarouselRef>(null);
  const paginationRef = useRef<SwiperPaginationRef>(null);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    if (paginationRef.current) {
      paginationRef.current.update(swiper.activeIndex);
    }
  }, []);

  return { swiperRef, paginationRef, handleSlideChange };
};
```

### 2. 效能優化

#### 使用 React.memo

```typescript
const TripCard = React.memo(({ trip, stats }: TripCardProps) => {
  return <Card>...</Card>;
});
```

#### 使用 useMemo 和 useCallback

```typescript
// 計算值
const filteredTrips = useMemo(() => {
  return trips.filter(trip => trip.tags.includes(selectedTag));
}, [trips, selectedTag]);

// 回調函數
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

### 3. 錯誤處理

```typescript
// Hook 中的錯誤處理
export function useTripStats(tripTitle: string): TripStats {
  try {
    const stats = useMemo(() => {
      return calculateTripStats(tripTitle, equipmentData);
    }, [tripTitle]);
    
    return stats;
  } catch (error) {
    console.error('Failed to calculate trip stats:', error);
    // 返回預設值
    return {
      totalWeight: 0,
      totalPrice: 0,
      equipmentCount: 0,
    };
  }
}
```

### 4. TypeScript 使用

#### 避免使用 any

```typescript
// ❌ 壞的做法
const handleData = (data: any) => {
  console.log(data.name);
};

// ✅ 好的做法
interface UserData {
  name: string;
  email: string;
}

const handleData = (data: UserData) => {
  console.log(data.name);
};
```

#### 使用泛型

```typescript
// 通用的列表組件
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <div>{items.map(renderItem)}</div>;
}
```

---

## 🎨 常見模式

### 1. Container/Presenter Pattern

```typescript
// Container（邏輯）
const TripListContainer = () => {
  const { equipment, groupedEquipment } = useEquipment({ groupByCategory: true });
  const stats = useTripStats(tripTitle);
  
  return <TripListPresenter equipment={equipment} stats={stats} />;
};

// Presenter（展示）
const TripListPresenter = ({ equipment, stats }: Props) => {
  return <div>...</div>;
};
```

### 2. Compound Components Pattern

```typescript
// 複合組件
const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className="card">{children}</div>;
};

Card.Header = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-header">{children}</div>;
};

Card.Body = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-body">{children}</div>;
};

// 使用
<Card>
  <Card.Header>標題</Card.Header>
  <Card.Body>內容</Card.Body>
</Card>
```

### 3. Render Props Pattern

```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // ... fetch logic

  return <>{children(data, loading, error)}</>;
}

// 使用
<DataFetcher<Trip[]> url="/api/trips">
  {(data, loading, error) => {
    if (loading) return <div>載入中...</div>;
    if (error) return <div>錯誤：{error.message}</div>;
    return <TripList trips={data} />;
  }}
</DataFetcher>
```

### 4. Custom Hook Pattern

```typescript
// 封裝複雜邏輯
function useTrips(userId?: string) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const data = await getTrips(userId);
        setTrips(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [userId]);

  return { trips, loading, error };
}
```

---

## 🧪 測試策略

### Services 測試

```typescript
// lib/services/trips.service.test.ts
import { calculateTripStats } from './trips.service';

describe('calculateTripStats', () => {
  it('should calculate total weight correctly', () => {
    const mockEquipment = [
      { weight: 1000, price: 5000, trips: ['Trip 1'] },
      { weight: 2000, price: 10000, trips: ['Trip 1'] },
    ];

    const result = calculateTripStats('Trip 1', mockEquipment);

    expect(result.totalWeight).toBe(3); // 3kg
    expect(result.totalPrice).toBe(15000);
    expect(result.equipmentCount).toBe(2);
  });
});
```

### Hooks 測試

```typescript
// lib/hooks/useTripStats.test.ts
import { renderHook } from '@testing-library/react';
import { useTripStats } from './useTripStats';

describe('useTripStats', () => {
  it('should return trip statistics', () => {
    const { result } = renderHook(() => useTripStats('Trip 1'));

    expect(result.current.totalWeight).toBeGreaterThan(0);
    expect(result.current.totalPrice).toBeGreaterThan(0);
  });
});
```

### 組件測試

```typescript
// components/features/trips/TripCard.test.tsx
import { render, screen } from '@testing-library/react';
import TripCard from './TripCard';

describe('TripCard', () => {
  const mockTrip = {
    id: '1',
    title: 'Test Trip',
    image: ['/test.jpg'],
    location: 'Test Location',
    duration: '3 天',
    tags: ['#test'],
  };

  const mockStats = {
    totalWeight: 5.5,
    totalPrice: 10000,
    equipmentCount: 5,
  };

  it('should render trip information', () => {
    render(<TripCard trip={mockTrip} stats={mockStats} />);

    expect(screen.getByText('Test Trip')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('5.50 公斤')).toBeInTheDocument();
  });
});
```

---

## 🚀 未來擴展

### 1. 資料庫整合

當整合 Prisma + Supabase 時：

```typescript
// lib/repositories/trips.repository.ts
export class TripsRepository {
  async findAll(): Promise<Trip[]> {
    return await prisma.trip.findMany();
  }

  async findByUserId(userId: string): Promise<Trip[]> {
    return await prisma.trip.findMany({
      where: { userId },
      include: { equipment: true },
    });
  }

  async create(data: CreateTripInput): Promise<Trip> {
    return await prisma.trip.create({ data });
  }
}

// lib/services/trips.service.ts
export class TripsService {
  constructor(private repository: TripsRepository) {}

  async getUserTrips(userId: string): Promise<Trip[]> {
    const trips = await this.repository.findByUserId(userId);
    // 業務邏輯處理
    return trips;
  }
}
```

### 2. 動態路由

```
app/
├── [username]/
│   ├── page.tsx              # 使用者公開頁面
│   ├── trips/
│   │   └── [tripId]/
│   │       └── page.tsx      # 單一旅程頁面
│   └── equipment/
│       └── page.tsx          # 裝備頁面
```

### 3. API Routes

```typescript
// app/api/trips/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const trips = await tripsService.getUserTrips(userId);

  return Response.json(trips);
}

export async function POST(request: Request) {
  const body = await request.json();
  const trip = await tripsService.createTrip(body);

  return Response.json(trip, { status: 201 });
}
```

---

## 📚 參考資源

### 官方文件
- [Next.js 文件](https://nextjs.org/docs)
- [React 文件](https://react.dev/)
- [TypeScript 文件](https://www.typescriptlang.org/docs/)
- [Prisma 文件](https://www.prisma.io/docs)
- [Supabase 文件](https://supabase.com/docs)

### 內部文件
- [重構指南](./REFACTORING_GUIDE.md)
- [重構總結](./REFACTORING_SUMMARY.md)
- [Google 登入設定](./SETUP_GOOGLE_AUTH.md)
- [部署說明](./DEPLOYMENT_NOTE.md)

### 推薦閱讀
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Refactoring](https://refactoring.com/)
- [Design Patterns](https://refactoring.guru/design-patterns)

---

## 🤝 貢獻指南

### 提交 Pull Request 前

1. ✅ 確保程式碼符合本架構指南
2. ✅ 執行 `npm run build` 確保無錯誤
3. ✅ 執行 `npm run lint` 確保符合 ESLint 規範
4. ✅ 撰寫或更新相關測試
5. ✅ 更新相關文件

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat`: 新功能
- `fix`: 修復 bug
- `docs`: 文件更新
- `style`: 程式碼格式（不影響功能）
- `refactor`: 重構
- `test`: 測試相關
- `chore`: 建置工具或輔助工具

**範例:**
```
feat(trips): add trip filtering by tags

- Add filterTripsByTags service function
- Add tag filter UI component
- Update TripList to support filtering

Closes #123
```

---

## 📞 聯絡與支援

如有任何問題或建議，請：
1. 查閱相關文件
2. 搜尋現有 Issues
3. 建立新的 Issue

---

**最後更新：** 2025-10-16  
**維護者：** OutShare Team  
**版本：** 2.0

