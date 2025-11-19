import { EquipmentFormData } from "@/components/features/dashboard";

/**
 * 建立或更新裝備
 * 
 * @param data - 裝備表單資料
 * @param equipmentId - (選填) 裝備 ID，若有則為更新，否則為建立
 * @returns API 回應結果
 */
export async function createOrUpdateEquipment(
  data: EquipmentFormData,
  equipmentId?: string
) {
  const url = equipmentId ? `/api/equipment/${equipmentId}` : '/api/equipment';
  const method = equipmentId ? 'PUT' : 'POST';
  
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      category: data.category,
      description: data.description,
      image_url: data.image_url,
      specs: {
        brand: data.brand,
        weight_g: data.weight,
        price_twd: data.price,
        buy_link: data.buy_link,
        link_name: data.link_name,
      },
      tags: data.tags || [],
    }),
  });

  const result = await response.json();

  if (!response.ok || result.error) {
    throw new Error(result.error || '操作失敗');
  }

  return result.data;
}

/**
 * 刪除裝備
 * 
 * @param equipmentId - 裝備 ID
 */
export async function deleteEquipment(equipmentId: string) {
  const response = await fetch(`/api/equipment/${equipmentId}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok || result.error) {
    throw new Error(result.error || "刪除裝備失敗");
  }

  return result.success;
}

