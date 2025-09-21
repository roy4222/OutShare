"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * TripsToogleGroup 組件的 Props 介面
 */
interface TripsToogleGroupProps {
  /** Trips 標籤頁的內容 */
  tripsContent: React.ReactNode;
  /** Gear 標籤頁的內容 */
  gearContent: React.ReactNode;
}

/**
 * TripsToogleGroup - 旅行和裝備切換組件
 * 
 * 提供一個切換式的標籤頁介面，讓使用者可以在 "Trips" 和 "Gear" 兩個內容區塊之間切換
 * 
 * @param tripsContent - 旅行標籤頁要顯示的內容
 * @param gearContent - 裝備標籤頁要顯示的內容
 */
const TripsToogleGroup = ({ tripsContent, gearContent }: TripsToogleGroupProps) => {
  // 追蹤目前選中的標籤頁，預設為 "trips"
  const [selectedTab, setSelectedTab] = useState<string>("trips");

  /**
   * 處理標籤頁切換的事件處理器
   * @param value - 新選中的標籤頁值
   */
  const handleTabChange = (value: string) => {
    // 確保 value 不為空才更新狀態
    if (value) {
      setSelectedTab(value);
    }
  };

  return (
    <>
      {/* 標籤頁切換按鈕區域 */}
      <div className="flex items-center justify-center pb-4">
        <ToggleGroup
          type="single" // 單選模式，一次只能選擇一個標籤
          className="mt-10"
          value={selectedTab} // 綁定當前選中的標籤
          onValueChange={handleTabChange} // 標籤切換時的回調函數
        >
          <ToggleGroupItem value="trips">我的旅程</ToggleGroupItem>
          <ToggleGroupItem value="gear">我的裝備</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* 根據選中的標籤顯示對應的內容 */}
      {selectedTab === "trips" && tripsContent}
      {selectedTab === "gear" && gearContent}
    </>
  );
};

export default TripsToogleGroup;
