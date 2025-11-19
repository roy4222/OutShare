"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/features/layout/Navbar";
import SideBar from "@/components/features/layout/SideBar";
import {
  CategoryModal,
  AddCategoryDialog,
  EquipmentFormDialog,
  GearCategorySection,
  RenameCategoryDialog,
  DeleteCategoryDialog,
  DeleteEquipmentDialog,
  EquipmentFormData,
  EquipmentWithId,
} from "@/components/features/dashboard";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { FolderCodeIcon, SquarePenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProtectedUser } from "@/lib/hooks/useProtectedUser";
import { useEquipment } from "@/lib/hooks/useEquipment";
import { useCategories } from "@/lib/hooks/useCategories";
import { createOrUpdateEquipment, deleteEquipment } from "@/lib/services/equipment.client";

const DEFAULT_GEAR_DASHBOARD_TITLE = "我的裝備";

/**
 * 受保護的 GearDashboard 頁面
 *
 * 功能:
 * 1. 顯示使用者的裝備分類管理介面
 * 2. 支援新增/編輯/刪除類別
 * 3. 支援新增/編輯/刪除裝備
 * 4. 使用 Data Table 展示裝備列表
 */
export default function GearDashboardPage() {
  const user = useProtectedUser();

  // 對話框狀態
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEquipmentFormOpen, setIsEquipmentFormOpen] = useState(false);
  const [isRenameCategoryOpen, setIsRenameCategoryOpen] = useState(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [isDeleteEquipmentOpen, setIsDeleteEquipmentOpen] = useState(false);

  // 表單狀態
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryToEdit, setCategoryToEdit] = useState<string>("");
  const [categoryToDelete, setCategoryToDelete] = useState<string>("");
  const [equipmentToEdit, setEquipmentToEdit] = useState<EquipmentWithId | null>(null);
  const [equipmentToDelete, setEquipmentToDelete] = useState<EquipmentWithId | null>(null);

  // 批次操作載入狀態
  const [isBulkOperating, setIsBulkOperating] = useState(false);

  // 標題狀態
  const [dashboardTitle, setDashboardTitle] = useState<string>(
    DEFAULT_GEAR_DASHBOARD_TITLE
  );
  const [isTitleLoading, setIsTitleLoading] = useState(true);

  // 使用 useCategories hook 管理類別
  const {
    categories,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
    renameCategoryWithEquipment,
    deleteCategoryWithEquipment,
  } = useCategories();

  // 獲取裝備資料
  const { groupedEquipment, isEmpty, isLoading, error, refetch } = useEquipment({
    userId: user.id,
    groupByCategory: true,
  });

  // 載入使用者的自訂標題
  useEffect(() => {
    const loadDashboardTitle = async () => {
      try {
        const response = await fetch("/api/profiles");
        const result = await response.json();

        if (result.data?.gear_dashboard_title) {
          setDashboardTitle(
            result.data.gear_dashboard_title || DEFAULT_GEAR_DASHBOARD_TITLE
          );
        } else {
          setDashboardTitle(DEFAULT_GEAR_DASHBOARD_TITLE);
        }
      } catch (error) {
        console.error("Error loading dashboard title:", error);
      } finally {
        setIsTitleLoading(false);
      }
    };

    loadDashboardTitle();
  }, [user]);

  // 處理標題儲存
  const handleSaveTitle = async (newTitle: string) => {
    if (!newTitle || newTitle.trim().length === 0) {
      throw new Error("標題不可為空");
    }

    if (newTitle.length > 50) {
      throw new Error("標題長度不可超過 50 字元");
    }

    const response = await fetch("/api/profiles", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gear_dashboard_title: newTitle.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || "儲存失敗");
    }

    setDashboardTitle(newTitle);
  };

  // 處理新增類別
  const handleAddCategory = () => {
    setIsAddCategoryOpen(true);
  };

  // 處理類別確認（建立新類別到資料庫）
  const handleCategoryConfirm = async (categoryName: string) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || "新增類別失敗");
      }

      // 重新載入類別列表
      await refetchCategories();

      setIsAddCategoryOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  // 處理新增裝備（從類別區域觸發）
  const handleAddEquipment = (category: string) => {
    setSelectedCategory(category);
    setEquipmentToEdit(null);
    setIsEquipmentFormOpen(true);
  };

  // 處理裝備表單提交 (新增/編輯)
  const handleEquipmentSubmit = async (formData: EquipmentFormData) => {
    try {
      await createOrUpdateEquipment(formData, equipmentToEdit?.id);
      
      // 成功後重新獲取裝備資料以顯示新裝備
      await refetch();
    } catch (error) {
      console.error("Error saving equipment:", error);
      throw error;
    }
  };

  // 處理編輯裝備
  const handleEditEquipment = (equipment: EquipmentWithId) => {
    setEquipmentToEdit(equipment);
    setSelectedCategory(equipment.category);
    setIsEquipmentFormOpen(true);
  };

  // 處理刪除裝備
  const handleDeleteEquipment = async (equipment: EquipmentWithId) => {
    setEquipmentToDelete(equipment);
    setIsDeleteEquipmentOpen(true);
  };

  // 處理刪除裝備確認
  const handleDeleteEquipmentConfirm = async () => {
    if (!equipmentToDelete) return;

    try {
      await deleteEquipment(equipmentToDelete.id);

      // 成功後重新獲取裝備資料
      await refetch();

      setIsDeleteEquipmentOpen(false);
      setEquipmentToDelete(null);
    } catch (error) {
      console.error("Error deleting equipment:", error);
      throw error;
    }
  };

  // 處理編輯類別名稱
  const handleEditCategory = (category: string) => {
    setCategoryToEdit(category);
    setIsRenameCategoryOpen(true);
  };

  // 處理類別重新命名確認（使用交易）
  const handleRenameCategoryConfirm = async (newCategoryName: string) => {
    if (!categoryToEdit) return;

    try {
      setIsBulkOperating(true);

      // 1. 找到類別的 ID
      const category = categories.find((cat) => cat.name === categoryToEdit);
      if (!category) {
        throw new Error("Category not found");
      }

      // 2. 收集該類別下所有裝備的 ID
      const categoryEquipment = groupedEquipment?.[categoryToEdit] || [];
      const equipmentIds = categoryEquipment.map((eq) => eq.id);

      // 3. 使用 hook 的交易式方法更新類別和所有裝備
      await renameCategoryWithEquipment(category.id, newCategoryName, equipmentIds);

      // 4. 重新載入裝備資料
      await refetch();

      setIsRenameCategoryOpen(false);
      setCategoryToEdit("");
    } catch (error) {
      console.error("Error renaming category:", error);
      throw error;
    } finally {
      setIsBulkOperating(false);
    }
  };

  // 處理刪除類別
  const handleDeleteCategory = (category: string) => {
    setCategoryToDelete(category);
    setIsDeleteCategoryOpen(true);
  };

  // 處理刪除類別確認（使用交易）
  const handleDeleteCategoryConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setIsBulkOperating(true);

      // 1. 找到類別的 ID
      const category = categories.find((cat) => cat.name === categoryToDelete);
      if (!category) {
        throw new Error("Category not found");
      }

      // 2. 收集該類別下所有裝備的 ID
      const categoryEquipment = groupedEquipment?.[categoryToDelete] || [];
      const equipmentIds = categoryEquipment.map((eq) => eq.id);

      // 3. 使用 hook 的交易式方法刪除類別和所有裝備
      await deleteCategoryWithEquipment(category.id, equipmentIds);

      // 4. 重新載入裝備資料
      await refetch();

      setIsDeleteCategoryOpen(false);
      setCategoryToDelete("");
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    } finally {
      setIsBulkOperating(false);
    }
  };

  if (isTitleLoading || isLoading || isCategoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">載入失敗: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 批次操作載入中遮罩 */}
      {isBulkOperating && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            <p className="text-lg font-medium text-gray-900">處理中，請稍候...</p>
          </div>
        </div>
      )}

      {/* 頂部導航列 */}
      <Navbar />

      {/* 主要內容區域 */}
      <div className="flex pt-16">
        {/* 側邊導航欄 */}
        <SideBar gearDashboardTitle={dashboardTitle} />

        {/* 主內容區（預留空間給 Sidebar，左邊距 256px = w-64） */}
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-6xl mx-auto">
            {/* 標題列 */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {dashboardTitle}
                <button
                  onClick={() => setIsTitleModalOpen(true)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="編輯標題"
                >
                  <SquarePenIcon className="size-5 text-green-700" />
                </button>
              </h1>
              <Button
                onClick={handleAddCategory}
                className="bg-green-700 hover:bg-green-800 text-white"
              >
                + 新增類別
              </Button>
            </div>

            {/* 裝備列表或空狀態 */}
            {isEmpty && categories.length === 0 ? (
              <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FolderCodeIcon className="size-6" />
                    </EmptyMedia>
                    <EmptyTitle>新增類別</EmptyTitle>
                    <EmptyDescription>
                      開始新增你的第一個裝備，建立你的裝備清單
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      onClick={handleAddCategory}
                      className="bg-green-700 hover:bg-green-800 text-white"
                    >
                      + 新增類別
                    </Button>
                  </EmptyContent>
                </Empty>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 顯示空類別（還沒有裝備的類別） */}
                {categories
                  .filter((cat) => !groupedEquipment || !groupedEquipment[cat.name])
                  .map((category) => (
                    <GearCategorySection
                      key={`empty-${category.id}`}
                      category={category.name}
                      equipment={[]}
                      onAddEquipment={handleAddEquipment}
                      onEditCategory={handleEditCategory}
                      onDeleteCategory={handleDeleteCategory}
                      onEditEquipment={handleEditEquipment}
                      onDeleteEquipment={handleDeleteEquipment}
                    />
                  ))}

                {/* 顯示有裝備的類別 */}
                {groupedEquipment &&
                  Object.entries(groupedEquipment).map(
                    ([category, equipmentList]) => (
                      <GearCategorySection
                        key={category}
                        category={category}
                        equipment={equipmentList as EquipmentWithId[]}
                        onAddEquipment={handleAddEquipment}
                        onEditCategory={handleEditCategory}
                        onDeleteCategory={handleDeleteCategory}
                        onEditEquipment={handleEditEquipment}
                        onDeleteEquipment={handleDeleteEquipment}
                      />
                    )
                  )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 標題編輯彈窗 */}
      <CategoryModal
        open={isTitleModalOpen}
        onClose={() => setIsTitleModalOpen(false)}
        currentTitle={dashboardTitle}
        onSave={handleSaveTitle}
      />

      {/* 新增類別對話框 */}
      <AddCategoryDialog
        open={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onConfirm={handleCategoryConfirm}
      />

      {/* 裝備表單對話框 */}
      <EquipmentFormDialog
        open={isEquipmentFormOpen}
        onClose={() => {
          setIsEquipmentFormOpen(false);
          setSelectedCategory("");
          setEquipmentToEdit(null);
        }}
        defaultCategory={selectedCategory}
        initialData={equipmentToEdit}
        onSubmit={handleEquipmentSubmit}
      />

      {/* 重新命名類別對話框 */}
      <RenameCategoryDialog
        open={isRenameCategoryOpen}
        onClose={() => {
          setIsRenameCategoryOpen(false);
          setCategoryToEdit("");
        }}
        currentName={categoryToEdit}
        onConfirm={handleRenameCategoryConfirm}
      />

      {/* 刪除類別確認對話框 */}
      <DeleteCategoryDialog
        open={isDeleteCategoryOpen}
        onClose={() => {
          setIsDeleteCategoryOpen(false);
          setCategoryToDelete("");
        }}
        categoryName={categoryToDelete}
        onConfirm={handleDeleteCategoryConfirm}
      />

      {/* 刪除裝備確認對話框 */}
      <DeleteEquipmentDialog
        open={isDeleteEquipmentOpen}
        onClose={() => {
          setIsDeleteEquipmentOpen(false);
          setEquipmentToDelete(null);
        }}
        equipmentName={equipmentToDelete?.name || ""}
        onConfirm={handleDeleteEquipmentConfirm}
      />
    </div>
  );
}
