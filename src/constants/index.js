// Product categories
export const PRODUCT_CATEGORIES = ["Electronics", "Clothing", "Home", "Sports"];

// API base URL
export const API_BASE_URL = "http://localhost:8000";

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 10;

// Order status colors
export const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  done: "bg-green-100 text-green-800",
};

// Format currency helper
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date helper
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
