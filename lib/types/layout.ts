/**
 * Layout 相關的類型定義
 */

/**
 * 導航選項類型定義
 * 用於 SideBar 組件的導航項目配置
 */
export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  };
}

/**
 * Tab 項目定義
 * 用於 TabLayout 組件的標籤頁配置
 */
export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

/**
 * TabLayout 組件的 Props
 */
export interface TabLayoutProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  toggleClassName?: string;
}

/**
 * TripsToggleGroup 組件的 Props
 */
export interface TripsToggleGroupProps {
  tripsContent: React.ReactNode;
  gearContent: React.ReactNode;
  gearDashboardTitle?: string;
}
