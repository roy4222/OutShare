/**
 * Loading System 品牌色彩常數
 * 
 * 根據 Outdoor Trails Hub 設計系統定義的色彩
 * 參考: app/globals.css @theme 區塊
 */

export const BRAND_COLORS = {
  // 綠色系列 (主色調)
  green200: '#F2FBF9',
  green600: '#B3E6DD',
  green700: '#008A72',
  green800: '#00AC8E',
  
  // 灰色系列 (中性色)
  grey100: '#FAFAFA',
  grey200: '#F2F2F2',
  grey300: '#EAEBEB',
  grey400: '#DDDEDE',
  grey500: '#A1A1A1',
  grey600: '#76797B',
  grey800: '#54585A',
  grey900: '#222222',
  
  // 特殊色
  white: '#ffffff',
  red100: '#F44444',
} as const;

/**
 * Loading 訊息多語系（未來擴展）
 */
export const LOADING_MESSAGES = {
  default: '載入中...',
  verifying: '驗證身分中...',
  preparing: '準備您的冒險...',
  processing: '處理中，請稍候...',
  loadingStats: '載入統計資料中...',
  loadingEquipment: '載入裝備資料中...',
} as const;

