import { browser } from '$app/environment'; // Check if it's client-side
import { writable } from 'svelte/store';

// Utility function to create a persistent store with validation
function createPersistentStore(key, initialValue) {
  let storedValue = initialValue;

  if (browser) {
    try {
      const rawValue = localStorage.getItem(key);
      storedValue = rawValue ? JSON.parse(rawValue) : initialValue;
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage:`, error);
      storedValue = initialValue; // Fallback to initial value on parse error
    }
  }

  const store = writable(storedValue);

  // Subscribe to store updates and save to localStorage
  store.subscribe((value) => {
    if (browser) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });

  return store;
}

// Create persistent stores
export const selectedCustomersStore = createPersistentStore('selectedCustomers', []);
export const selectedReportStore = createPersistentStore('	selectedReportStore', 1);
export const selectedCarriersStore = createPersistentStore('selectedCarriers', []);
export const selectedShippersStore = createPersistentStore('selectedShippers', []);
export const selectedShipperGroupsStore = createPersistentStore('selectedShipperGroups', []);
export const selectedRunOptDisplayTypeStore = createPersistentStore('selectedRunOptDisplayType', null);
export const selectedRunByOptionsStore = createPersistentStore('selectedRunByOptions', []);
export const selectedDateOptionStore = createPersistentStore('selectedDateOption', 'RollingPeriod');
export const selectedRollingPeriodStore = createPersistentStore('selectedRollingPeriod', 'previous_week');
export const lastDaysStore = createPersistentStore('lastDays', 1);
export const batchNumberStore = createPersistentStore('batchNumber', null);
export const selectedDateRangeStore = createPersistentStore('selectedDateRange', []);
export const allselectedDatesOrBatchNumberStore = createPersistentStore('allselectedDatesOrBatchNumberStore', []);

export const selectedRunOptDisplayTextStore = createPersistentStore('selectedRunOptDisplayTextStore', null);

export const selectedCurrenciesStore = createPersistentStore('selectedCurrencies', []);

export const selectedFilterFromDateStore = createPersistentStore('selectedFilterFromDateStore', "");
export const selectedFilterToDateStore = createPersistentStore('selectedFilterToDateStore', "");

