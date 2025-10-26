/**
 * TripsToggleGroup 組件（重構版，修正拼寫）
 * 
 * 旅程和裝備切換組件
 * 基於通用的 TabLayout 組件實作
 */

"use client";

import TabLayout from "./TabLayout";
import { TabItem, TripsToggleGroupProps } from "@/lib/types";

/**
 * TripsToggleGroup - 旅行和裝備切換組件
 * 
 * @param tripsContent - 旅行標籤頁要顯示的內容
 * @param gearContent - 裝備標籤頁要顯示的內容
 */
const TripsToggleGroup = ({
  tripsContent,
  gearContent,
  gearDashboardTitle,
}: TripsToggleGroupProps) => {
  const gearLabel = gearDashboardTitle || "我的裝備";
  const tabs: TabItem[] = [
    {
      value: "trips",
      label: "我的旅程",
      content: tripsContent,
    },
    {
      value: "gear",
      label: gearLabel,
      content: gearContent,
    },
  ];

  return <TabLayout tabs={tabs} defaultTab="trips" />;
};

export default TripsToggleGroup;

