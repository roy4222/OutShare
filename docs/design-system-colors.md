# 設計系統顏色使用指南

本文件說明如何使用專案中定義的設計系統顏色。

## 可用顏色

### 綠色系列
- `green-200` - #F2FBF9 (淺綠色背景)
- `green-600` - #B3E6DD (中等綠色)
- `green-700` - #00AC8E (主要品牌綠色)
- `green-800` - #008A72 (深綠色)

### 灰色系列
- `grey-100` - #FAFAFA (極淺灰)
- `grey-200` - #F2F2F2 (淺灰)
- `grey-300` - #EAEBEB (邊框灰)
- `grey-400` - #DDDEDE (分隔線灰)
- `grey-500` - #A1A1A1 (中等灰)
- `grey-600` - #76797B (深灰)
- `grey-800` - #54585A (更深灰)
- `grey-900` - #222222 (接近黑色)

### 特殊顏色
- `white` - #ffffff (白色)
- `red-100` - #F44444 (錯誤/警告紅色)

### 漸層色
- `gradient-from` - #00AC8E (漸層起點)
- `gradient-to` - #0097E0 (漸層終點)

## 使用方式

### 1. 基本顏色使用

#### 背景色
```tsx
<div className="bg-green-700">主要綠色背景</div>
<div className="bg-grey-100">淺灰色背景</div>
```

#### 文字色
```tsx
<p className="text-green-700">綠色文字</p>
<p className="text-grey-600">深灰色文字</p>
```

#### 邊框色
```tsx
<div className="border border-grey-300">淺灰色邊框</div>
<button className="border-2 border-green-700">綠色邊框按鈕</button>
```

### 2. 狀態變化

#### Hover 效果
```tsx
<button className="bg-green-700 hover:bg-green-800">
  滑鼠懸停變深
</button>

<a className="text-grey-600 hover:text-green-700">
  連結 hover 變綠色
</a>
```

#### Focus 效果
```tsx
<input 
  className="border border-grey-300 focus:border-green-700 focus:ring-2 focus:ring-green-600"
  type="text"
/>
```

#### Active 效果
```tsx
<button className="bg-green-700 active:bg-green-800 active:scale-95">
  按下時的效果
</button>
```

### 3. 漸層背景

根據 [Tailwind CSS v4 文件](https://tailwindcss.com/docs/theme)，使用漸層色的方式：

#### 水平漸層（從左到右）
```tsx
<div className="bg-gradient-to-r from-gradient-from to-gradient-to">
  水平漸層背景
</div>
```

#### 垂直漸層（從上到下）
```tsx
<div className="bg-gradient-to-b from-gradient-from to-gradient-to">
  垂直漸層背景
</div>
```

#### 對角線漸層
```tsx
<div className="bg-gradient-to-br from-gradient-from to-gradient-to">
  對角線漸層背景
</div>
```

#### 放射狀漸層（需要使用任意值）
```tsx
<div className="bg-[radial-gradient(circle,var(--color-gradient-from),var(--color-gradient-to))]">
  放射狀漸層
</div>
```

### 4. 響應式設計

```tsx
{/* 小螢幕白色背景，大螢幕綠色背景 */}
<div className="bg-white md:bg-green-700">
  響應式背景色
</div>

{/* 不同螢幕尺寸使用不同文字顏色 */}
<p className="text-grey-600 md:text-grey-800 lg:text-green-700">
  響應式文字色
</p>
```

### 5. 透明度變化

```tsx
{/* 使用 Tailwind 的透明度修飾符 */}
<div className="bg-green-700/50">50% 透明度的綠色</div>
<div className="bg-green-700/75">75% 透明度的綠色</div>
<div className="bg-green-700/10">10% 透明度的綠色（淡背景）</div>
```

### 6. 在自訂 CSS 中使用

如果需要在自訂 CSS 中使用這些顏色：

```css
.my-custom-class {
  background-color: var(--color-green-700);
  border-color: var(--color-grey-300);
}

.my-gradient {
  background: linear-gradient(
    135deg,
    var(--color-gradient-from) 0%,
    var(--color-gradient-to) 100%
  );
}
```

### 7. 在 JavaScript/TypeScript 中使用

```typescript
// 讀取 CSS 變數
const greenColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-green-700');

// 或在 inline style 中使用
<div style={{ backgroundColor: 'var(--color-green-700)' }}>
  動態背景色
</div>
```

## 實際範例

### 按鈕元件
```tsx
export function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="
      bg-green-700 
      hover:bg-green-800 
      active:scale-95
      text-white 
      px-6 py-3 
      rounded-lg 
      transition-all 
      duration-200
      shadow-md 
      hover:shadow-lg
    ">
      {children}
    </button>
  );
}
```

### 卡片元件
```tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-white 
      border border-grey-300 
      rounded-xl 
      p-6 
      shadow-sm 
      hover:shadow-md 
      transition-shadow
    ">
      {children}
    </div>
  );
}
```

### 漸層標題
```tsx
export function GradientHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="
      text-4xl 
      font-bold 
      bg-gradient-to-r 
      from-gradient-from 
      to-gradient-to 
      bg-clip-text 
      text-transparent
    ">
      {children}
    </h1>
  );
}
```

### 輸入框
```tsx
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="
        w-full 
        px-4 py-2 
        border border-grey-300 
        rounded-lg 
        focus:border-green-700 
        focus:ring-2 
        focus:ring-green-600/20 
        outline-none 
        transition-all
      "
      {...props}
    />
  );
}
```

## 顏色使用建議

### 主要用途
- **green-700**: 主要 CTA 按鈕、重要連結、品牌強調
- **green-800**: 按鈕 hover 狀態、深色主題強調
- **green-600**: 輔助強調、通知背景
- **green-200**: 淺色背景、標籤背景

### 文字顏色
- **grey-900**: 主要內容文字
- **grey-800**: 次要標題
- **grey-600**: 說明文字、輔助資訊
- **grey-500**: placeholder、禁用狀態

### UI 元素
- **grey-300**: 邊框、分隔線
- **grey-200**: 輸入框背景、卡片背景
- **grey-100**: 頁面背景、區塊背景
- **white**: 卡片、彈窗背景

### 錯誤狀態
- **red-100**: 錯誤訊息、警告提示、刪除按鈕

### 特殊效果
- **漸層色**: Hero 區塊、特殊標題、品牌元素

## 注意事項

1. **對比度**: 確保文字與背景有足夠對比度（WCAG AA 標準）
2. **一致性**: 同類型元件使用相同顏色
3. **品牌識別**: 優先使用 green-700 作為品牌主色
4. **可訪問性**: 重要訊息不能僅依賴顏色傳達

## 參考資源

- [Tailwind CSS v4 Theme 文件](https://tailwindcss.com/docs/theme)
- [Tailwind CSS 漸層背景](https://tailwindcss.com/docs/background-image)
- [WCAG 顏色對比度檢查工具](https://webaim.org/resources/contrastchecker/)

