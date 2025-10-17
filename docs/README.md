# 📚 OutShare 文件索引

歡迎來到 OutShare 專案文件中心！這裡包含了所有開發、部署和維護所需的文件。

---

## 🎯 快速導航

### 🏗️ 架構與開發

| 文件 | 描述 | 適合對象 |
|------|------|----------|
| [**架構指南**](./ARCHITECTURE_GUIDE.md) | 完整的架構設計、分層說明、開發規範和最佳實踐 | 所有開發者 |
| [**快速參考**](./QUICK_REFERENCE.md) | 常用指令、路徑和模式的速查表 | 所有開發者 |
| [**重構指南**](./REFACTORING_GUIDE.md) | 從舊架構遷移到新架構的完整指南 | 維護者 |
| [**重構總結**](./REFACTORING_SUMMARY.md) | 重構成果、變更記錄和驗證結果 | 專案管理者 |

### ⚙️ 設定與部署

| 文件 | 描述 | 適合對象 |
|------|------|----------|
| [**Google 登入設定**](./SETUP_GOOGLE_AUTH.md) | Google OAuth 完整設定步驟 | DevOps, 新成員 |
| [**部署說明**](./DEPLOYMENT_NOTE.md) | 部署到 Vercel/Netlify/Cloudflare 的詳細步驟 | DevOps |
| [**快速開始**](./QUICK_START.md) | 本地開發環境設定快速指南 | 新成員 |
| [**重定向流程**](./REDIRECT_FLOW.md) | OAuth 重定向流程說明 | 開發者 |

### 🔧 技術文件

| 文件 | 描述 | 適合對象 |
|------|------|----------|
| [**已修復問題**](./Issues/FIXED_ISSUES.md) | 已解決的技術問題和解決方案記錄 | 所有開發者 |
| [**實作總結**](./Issues/IMPLEMENTATION_SUMMARY.md) | Google 登入功能實作總結 | 開發者 |
| [**檢查清單**](./Issues/CHECKLIST.md) | 開發和部署檢查清單 | 所有開發者 |

### 🚀 部署相關

| 文件 | 描述 | 適合對象 |
|------|------|----------|
| [**OpenNext 快速參考**](./Issues/OPENNEXT_QUICK_REFERENCE.md) | 常用指令和快速修復方案 ⚡ | 所有開發者 |
| [**OpenNext Cloudflare 遷移**](./Issues/OPENNEXT_CLOUDFLARE_MIGRATION.md) | 從 next-on-pages 遷移到 OpenNext 的完整指南 | DevOps, 維護者 |
| [**Cloudflare Workers 部署**](./Issues/CLOUDFLARE_WORKERS_DEPLOYMENT.md) | Cloudflare Workers 部署詳細步驟 | DevOps |
| [**Cloudflare 部署修正**](./Issues/CLOUDFLARE_DEPLOY_FIX.md) | Cloudflare 部署常見問題修正 | DevOps |
| [**Windows 環境設定**](./Issues/CLOUDFLARE_WINDOWS_SETUP.md) | Windows/WSL 環境特殊設定 | 開發者 |

---

## 📖 文件使用指南

### 🆕 新成員上手流程

1. 閱讀 [專案 README](../README.md) 了解專案概述
2. 按照 [快速開始](./QUICK_START.md) 設定開發環境
3. 閱讀 [架構指南](./ARCHITECTURE_GUIDE.md) 了解專案架構
4. 參考 [快速參考](./QUICK_REFERENCE.md) 開始開發
5. 遇到問題時查閱 [已修復問題](./Issues/FIXED_ISSUES.md)
6. 部署前閱讀 [OpenNext Cloudflare 遷移](./Issues/OPENNEXT_CLOUDFLARE_MIGRATION.md)

### 👨‍💻 日常開發

- **開發新功能** → [架構指南](./ARCHITECTURE_GUIDE.md) + [快速參考](./QUICK_REFERENCE.md)
- **查找常用指令** → [快速參考](./QUICK_REFERENCE.md)
- **解決技術問題** → [已修復問題](./Issues/FIXED_ISSUES.md)
- **了解架構設計** → [架構指南](./ARCHITECTURE_GUIDE.md)

### 🚀 部署與維護

- **快速查詢部署指令** → [OpenNext 快速參考](./Issues/OPENNEXT_QUICK_REFERENCE.md) ⚡
- **部署到 Cloudflare** → [OpenNext Cloudflare 遷移](./Issues/OPENNEXT_CLOUDFLARE_MIGRATION.md) ⭐ 最新
- **首次部署** → [部署說明](./DEPLOYMENT_NOTE.md)
- **設定 OAuth** → [Google 登入設定](./SETUP_GOOGLE_AUTH.md)
- **WSL 環境問題** → [Windows 環境設定](./Issues/CLOUDFLARE_WINDOWS_SETUP.md)
- **了解重構變更** → [重構總結](./REFACTORING_SUMMARY.md)
- **遷移舊程式碼** → [重構指南](./REFACTORING_GUIDE.md)

---

## 🎓 學習路徑

### Level 1: 基礎（新成員）

```
專案 README
    ↓
快速開始
    ↓
架構指南（概覽部分）
    ↓
快速參考
```

### Level 2: 進階（開發者）

```
架構指南（完整閱讀）
    ↓
重構指南
    ↓
已修復問題
    ↓
實作總結
```

### Level 3: 專家（架構師）

```
架構指南（深入研究）
    ↓
重構總結
    ↓
部署說明
    ↓
所有技術文件
```

---

## 📝 文件維護

### 文件更新原則

1. **即時更新** - 架構變更時立即更新相關文件
2. **版本標記** - 重大變更需標記版本和日期
3. **範例優先** - 盡可能提供程式碼範例
4. **清晰簡潔** - 使用簡單明瞭的語言

### 文件審查清單

- [ ] 內容準確且最新
- [ ] 包含足夠的範例
- [ ] 連結都可正常訪問
- [ ] 格式統一且易讀
- [ ] 包含目錄和導航

### 貢獻文件

如需更新或新增文件，請：

1. 確保內容準確且有用
2. 遵循現有的格式風格
3. 添加適當的範例
4. 更新此索引文件
5. 提交 PR 並說明變更原因

---

## 🔗 外部資源

### 技術棧文件

- [Next.js 官方文件](https://nextjs.org/docs)
- [React 官方文件](https://react.dev/)
- [TypeScript 官方文件](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 文件](https://tailwindcss.com/docs)
- [Prisma 文件](https://www.prisma.io/docs)
- [Supabase 文件](https://supabase.com/docs)

### 設計資源

- [shadcn/ui 組件](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

### 開發工具

- [ESLint 規則](https://eslint.org/docs/rules/)
- [Prettier 配置](https://prettier.io/docs/en/options.html)

---

## 📊 文件統計

| 類別 | 文件數量 | 總字數（約） |
|------|---------|-------------|
| 架構與開發 | 4 | 15,000+ |
| 設定與部署 | 4 | 8,000+ |
| 技術文件 | 3 | 5,000+ |
| 部署相關 | 5 | 13,000+ |
| **總計** | **16** | **41,000+** |

---

## 💡 文件改進建議

如果你發現：
- 文件有錯誤或過時
- 缺少某些重要資訊
- 範例不夠清楚
- 需要新的文件

請：
1. 建立 Issue 描述問題
2. 或直接提交 PR 改進文件
3. 或聯繫專案維護者

---

## 📞 取得協助

- **技術問題** → 查閱 [已修復問題](./Issues/FIXED_ISSUES.md)
- **架構疑問** → 參考 [架構指南](./ARCHITECTURE_GUIDE.md)
- **快速查詢** → 使用 [快速參考](./QUICK_REFERENCE.md)
- **部署問題** → 參考 [OpenNext Cloudflare 遷移](./Issues/OPENNEXT_CLOUDFLARE_MIGRATION.md)
- **WSL 環境問題** → 查閱 [Windows 環境設定](./Issues/CLOUDFLARE_WINDOWS_SETUP.md)
- **其他問題** → 建立 Issue 或聯繫團隊

---

## 🆕 最新更新

**2025-10-17 - OpenNext Cloudflare 遷移完成**
- ✅ 從 `@cloudflare/next-on-pages` 遷移到 `@opennextjs/cloudflare`
- ✅ 啟用 R2 快取功能
- ✅ 修復 Supabase vendor chunks 問題
- ✅ 解決 WSL 環境部署問題
- ✅ 新增完整遷移文件

詳見：[OpenNext Cloudflare 遷移指南](./Issues/OPENNEXT_CLOUDFLARE_MIGRATION.md)

---

**文件維護者：** OutShare Team  
**最後更新：** 2025-10-17  
**文件版本：** 2.1

