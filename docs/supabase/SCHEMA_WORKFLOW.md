# 📐 Supabase Schema Workflow

> 目的：統一資料庫結構的修改、同步與回滾流程，確保 Supabase SQL 與 Prisma 型別維持一致。

## 🔄 日常開發流程

1. **啟動本地 Supabase**
   ```bash
   supabase start
   ```
2. **進行結構修改**
   - 透過 Supabase Studio、`psql` 或直接編輯 SQL。
   - 僅在本地資料庫操作，並記錄修改內容。
3. **產生 SQL 變更檔**
   ```bash
   supabase db diff --use-mig-dir
   ```
   - 產生的檔案會新增到 `supabase/migrations/`。
   - 確認內容包含 `CREATE/ALTER TABLE`、RLS、Trigger 等結構調整。
4. **同步 Prisma 型別**
   ```bash
   npm run db:sync
   ```
   - `prisma db pull` 會更新 `schema.prisma`。
   - `prisma generate` 會刷新 Prisma Client 型別。
5. **驗證程式碼**
   - 執行相關單元測試或手動檢查受影響的 API。
   - 確認 `schema.prisma` 與 SQL 檔案有一起提交。

## ♻️ 回滾流程

1. **切換到目標版本**
   ```bash
   git checkout <commit> supabase/migrations schema.prisma
   ```
2. **重設本地資料庫**
   ```bash
   supabase db reset --linked
   ```
3. **重新同步 Prisma**
   ```bash
   npm run db:sync
   ```
4. **資料還原（選用）**
   - 若有資料備份，透過 `psql` 或匯入腳本復原。

> ⚠️ 建議在執行回滾前，透過 Supabase Dashboard 將生產環境資料庫備份成快照。

## ✅ 檢查清單

- [ ] SQL 檔案已生成並經過審查。
- [ ] `schema.prisma` 與 SQL 內容保持相符。
- [ ] Prisma Client 已重新生成 (`npm run db:sync`)。
- [ ] 文件 (`SCHEMA_WORKFLOW.md`) 已按需要更新。
- [ ] 相關 PR 描述提及 Schema 變更與驗證方式。

---

如需進一步的資料遷移或批次操作，請於 PR 中附上手動執行步驟，並在部署計畫中安排維護時段。*** End Patch
