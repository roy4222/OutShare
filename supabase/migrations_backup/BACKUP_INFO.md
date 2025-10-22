# 📦 Migration 備份說明

**備份時間**: 2025-10-21  
**原因**: 合併混亂的來回修正 migrations

---

## 📁 備份內容

這個目錄包含原始的 10+ 個 migration 檔案，它們是專案開發過程中來回修正的版本：

```
000_create_base_tables.sql              - 建立基礎表
001_create_trip_gear_table.sql          - 建立關聯表
002_add_trip_slug.sql                   - 新增 slug 欄位
003_seed_initial_data.sql               - 測試資料
004_setup_rls_policies.sql              - RLS 政策
005_add_gear_dashboard_title.sql        - 新增欄位（後來移到 profiles）
006_auto_create_profile.sql             - Auto profile trigger（舊版）
007_fix_profiles_table.sql              - 修正 profiles
008_setup_profiles_rls.sql              - Profiles RLS
009_move_dashboard_title_to_profiles.sql - 移動欄位
010_auto_create_profile_trigger.sql     - Auto profile trigger（新版）
```

---

## ⚠️ 注意事項

**這些檔案僅供參考，不會被執行！**

現在所有 migrations 已合併為單一檔案：
```
../migrations/001_init_complete_schema.sql
```

---

## 🔍 為什麼合併？

原始的 migrations 有以下問題：
1. ❌ 來回修正（如 005 新增欄位，009 又移動欄位）
2. ❌ 重複的 trigger 定義（006 和 010）
3. ❌ 測試資料與 schema 不符（003 使用舊的欄位名稱）
4. ❌ 執行順序混亂

合併後的好處：
1. ✅ 單一檔案，清晰明確
2. ✅ 沒有重複或衝突
3. ✅ 測試資料與 schema 一致
4. ✅ 維護更容易

---

## 🗑️ 可以刪除嗎？

**建議保留**，原因：
- 記錄專案開發歷程
- 未來可能需要參考某些邏輯
- 佔用空間不大（總共約 50KB）

如果確定不需要，可以刪除整個 `migrations_backup/` 目錄。

---

**整理完成！現在專案的 migrations 清晰乾淨了！** 🎉

