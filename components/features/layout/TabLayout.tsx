/**
 * TabLayout 組件
 * 
 * 通用的 Tab 切換佈局組件
 * 可重用於任何需要標籤頁切換的場景
 */

"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * Tab 項目定義
 */
export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabLayoutProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  toggleClassName?: string;
}

/**
 * TabLayout - 通用標籤頁佈局
 * 
 * @param tabs - 標籤頁陣列
 * @param defaultTab - 預設選中的標籤（不提供則使用第一個）
 * @param className - 容器樣式
 * @param toggleClassName - Toggle 按鈕容器樣式
 */
const TabLayout = ({
  tabs,
  defaultTab,
  className,
  toggleClassName,
}: TabLayoutProps) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    defaultTab || tabs[0]?.value || ""
  );

  const handleTabChange = (value: string) => {
    if (value) {
      setSelectedTab(value);
    }
  };

  const activeTab = tabs.find((tab) => tab.value === selectedTab);

  return (
    <div className={className}>
      {/* 標籤頁切換按鈕 */}
      <div className={toggleClassName || "flex items-center justify-center pb-4"}>
        <ToggleGroup
          type="single"
          className="mt-10"
          value={selectedTab}
          onValueChange={handleTabChange}
        >
          {tabs.map((tab) => (
            <ToggleGroupItem key={tab.value} value={tab.value}>
              {tab.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* 顯示當前選中的標籤內容 */}
      {activeTab && activeTab.content}
    </div>
  );
};

export default TabLayout;

