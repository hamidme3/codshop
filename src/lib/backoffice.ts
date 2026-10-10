// Backoffice — lean helpers + re-exports
// Types are canonical in ./types, mock data in ./mocks.
// This barrel keeps existing `from '@/lib/backoffice'` imports working.

export type { OrderStatus, OrderItem, Order, Product, Category, Customer, FunnelStep, PaymentGateway } from './types';



export {
  normalizeSkuToken,
  deriveBaseSkuPrefix,
  cartesianProduct,
  generateVariantMatrix,
  batchFillStock,
  computeTotalStock,
  setPrimaryImage,
  reorderImages,
  addProductImage,
  removeProductImage,
  MOROCCAN_PRODUCT_IMAGE_PRESETS,
} from './variant-matrix';
export type { MatrixGenerationConfig, ImagePreset } from './variant-matrix';

export {
  calculateUnitEconomics,
  calculateQuantityPackEconomics,
  getMarginHealth,
  calculateDailyProfit,
  MOROCCAN_COD_DEFAULTS,
} from './moroccan-cod-economics';
export type {
  CodEconomicsInputs,
  UnitEconomicsResult,
  QuantityPackEconomics,
  HealthEvaluation,
} from './moroccan-cod-economics';



// mock stubs for things that don't exist yet but UI still imports:
export const ORDERS = [];
export const PRODUCTS = [];
export const CATEGORIES = [];
export const CUSTOMERS = [];
export const PAYMENT_GATEWAYS = [];

export const updateOrderStatus = (...args: any[]) => {};
export const deleteOrder = (...args: any[]) => {};
export const getPaymentGateways = (...args: any[]) => [];
export const togglePaymentGateway = (...args: any[]) => {};
export const checkInventory = (...args: any[]) => ({ inStock: true, message: "" });
export const decrementInventory = (...args: any[]) => {};
export const updateProductStock = (...args: any[]) => {};
