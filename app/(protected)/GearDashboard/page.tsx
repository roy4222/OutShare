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
import {
  createOrUpdateEquipment,
  deleteEquipment,
} from "@/lib/services/equipment.client";
import {
  DndContext,
  closestCorners, // Changed from closestCenter
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"; // Added import
import { LoadingOverlay } from "@/components/ui/loading/LoadingOverlay";
import { Skeleton } from "@/components/ui/loading/LoadingSkeleton";

const DEFAULT_GEAR_DASHBOARD_TITLE = "我的裝備";

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
  const [equipmentToEdit, setEquipmentToEdit] =
    useState<EquipmentWithId | null>(null);
  const [equipmentToDelete, setEquipmentToDelete] =
    useState<EquipmentWithId | null>(null);

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

  // Optimistic UI State
  const [orderedCategories, setOrderedCategories] = useState<typeof categories>(
    []
  );
  const [orderedEquipment, setOrderedEquipment] = useState<
    Record<string, EquipmentWithId[]>
  >({});

  // Initialize optimistic state when data loads
  useEffect(() => {
    if (categories) {
      setOrderedCategories(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (groupedEquipment && categories) {
      const newOrderedEquipment: Record<string, EquipmentWithId[]> = {};
      // Ensure all categories have an entry, even if empty
      categories.forEach((cat) => {
        newOrderedEquipment[cat.id] = []; // Use Category ID as key
      });
      
      // Map groupedEquipment (keyed by name) to ID-based structure
      // Note: groupedEquipment is currently keyed by category NAME from useEquipment
      // We need to map names to IDs for stable DnD keys
      Object.entries(groupedEquipment).forEach(([catName, items]) => {
        const cat = categories.find(c => c.name === catName);
        if (cat) {
            newOrderedEquipment[cat.id] = items as EquipmentWithId[];
        }
      });
      
      setOrderedEquipment(newOrderedEquipment);
    }
  }, [groupedEquipment, categories]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 處理拖曳結束
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Case 1: Reordering Categories
    // We check if activeId is a Category ID
    const isCategoryDrag = orderedCategories.some((cat) => cat.id === activeId);
    if (isCategoryDrag) {
      const oldIndex = orderedCategories.findIndex((cat) => cat.id === activeId);
      const newIndex = orderedCategories.findIndex((cat) => cat.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const originalOrder = orderedCategories; // Store original for rollback
        
        // Optimistic update
        const newOrder = arrayMove(orderedCategories, oldIndex, newIndex);
        setOrderedCategories(newOrder);

        // API Call
        try {
          const updates = newOrder.map((cat, index) => ({
            id: cat.id,
            sort_order: index,
          }));
          const response = await fetch("/api/categories/reorder", {
            method: "PUT",
            body: JSON.stringify({ updates }),
          });

          if (!response.ok) {
            throw new Error('API request failed');
          }
        } catch (error) {
          console.error("Failed to save category order:", error);
          // Rollback
          setOrderedCategories(originalOrder);
          // Optional: Add toast notification here
        }
      }
      return;
    }

    // Case 2: Reordering Equipment (within same category)
    // Find which category the items belong to
    let categoryId = "";
    for (const [catId, items] of Object.entries(orderedEquipment)) {
      if (items.some((item) => item.id === activeId)) {
        categoryId = catId;
        break;
      }
    }

    if (categoryId) {
        const items = orderedEquipment[categoryId];
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === overId);
        
        if (oldIndex !== -1 && newIndex !== -1) {
            const newItems = arrayMove(items, oldIndex, newIndex);
            const originalItems = items; // Store original for rollback

            // Optimistic update
            setOrderedEquipment({
                ...orderedEquipment,
                [categoryId]: newItems
            });

            // API Call
            try {
                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    sort_order: index,
                }));
                
                const response = await fetch("/api/equipment/reorder", {
                    method: "PUT",
                    body: JSON.stringify({ updates }),
                });

                if (!response.ok) {
                  throw new Error('API request failed');
                }
            } catch (error) {
                console.error("Failed to save equipment order:", error);
                // Rollback on failure
                setOrderedEquipment({
                    ...orderedEquipment,
                    [categoryId]: originalItems
                });
                // Optional: Add toast notification here
            }
        }
    }
  };

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
      await renameCategoryWithEquipment(
        category.id,
        newCategoryName,
        equipmentIds
      );

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
    return <GearDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">載入失敗: {error.message}</div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      <LoadingOverlay
        isLoading={isBulkOperating}
        message="處理中，請稍候..."
      />

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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
              >
                <div className="space-y-6">
                  <SortableContext
                    items={orderedCategories.map((c) => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {orderedCategories.map((category) => (
                      <GearCategorySection
                        key={category.id}
                        id={category.id}
                        category={category.name}
                        equipment={orderedEquipment[category.id] || []}
                        onAddEquipment={handleAddEquipment}
                        onEditCategory={handleEditCategory}
                        onDeleteCategory={handleDeleteCategory}
                        onEditEquipment={handleEditEquipment}
                        onDeleteEquipment={handleDeleteEquipment}
                      />
                    ))}
                  </SortableContext>
                </div>
                <DragOverlay />
              </DndContext>
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

const GearDashboardSkeleton = () => {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      <div className="border-b border-grey-400 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="flex">
        <div className="hidden w-64 border-r border-grey-400 bg-white p-6 md:block">
          <div className="space-y-4">
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-3/4" />
            ))}
          </div>
        </div>

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="space-y-3 rounded-lg border border-grey-400 bg-white p-4"
                >
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
