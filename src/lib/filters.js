// src/lib/filters.js
import { writable, derived } from 'svelte/store';

// Writable stores to manage filters
export const categoryFilter = writable(["All"]);  // Default to 'All'
export const subCategoryFilter = writable(null);  // Tracks selected subcategory
export const productList = writable([]);  // List of all products

// Derived store to filter products based on selected filters
export const filteredProducts = derived(
  [productList, categoryFilter, subCategoryFilter],
  ([$productList, $categoryFilter, $subCategoryFilter]) => {
    let products = $productList;

    // Apply subcategory filter
    if ($subCategoryFilter) {
      products = products.filter((product) => product.subCategory === $subCategoryFilter);
    }

    // Apply category filter if 'All' is not selected
    if (!$categoryFilter.includes("All")) {
      products = products.filter((product) => $categoryFilter.includes(product.category));
    }

    return products;
  }
);

// Function to handle category changes
export function handleCategoryChange(category) {
  categoryFilter.update((filters) => {
    let updatedFilters = filters.filter((f) => f !== "All");  // Remove 'All' if present

    if (updatedFilters.includes(category)) {
      updatedFilters = updatedFilters.filter((f) => f !== category);
    } else {
      updatedFilters.push(category);
    }

    // Default to 'All' if no categories are selected
    if (updatedFilters.length === 0) {
      updatedFilters.push("All");
    }

    return updatedFilters;
  });
}

// Function to handle subcategory changes
export function handleSubCategoryChange(subCategory) {
  subCategoryFilter.set(subCategory);
}
