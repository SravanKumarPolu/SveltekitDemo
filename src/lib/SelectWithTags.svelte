<script>
  import { onMount, onDestroy } from 'svelte'; // Import the lifecycle functions
  export let badgeSize = 'text-sm'; // Default size for the badge text
  export let badgePadding = 'px-3 py-1'; // Default padding for the badge 
  export let boxWidth = 'w-full'; // Default width of the outer container (select box)
  export let maxHeight = '200px'; // Max height for the container, with scroll
  export let items = []; // List of items (e.g., customers, carriers, etc.)
  export let selectedItems = []; // Pre-selected items if any
  export let displayProperty = 'name'; // Primary property to display in the dropdown
  export let extraProperties = []; // Optional additional fields (e.g., ['code', 'address'])
  export let placeholder = 'Select...'; // Placeholder for the input field

  let searchTerm = '';
  let showDropdown = false;
  let filteredItems = []; // Initialize as an empty array
  let highlightedIndex = -1; // For keyboard navigation

  // Emit selectedItems back to the parent
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Reference for the component wrapper
  let componentWrapper;

  // Reactively filter items based on the searchTerm and selected items
  $: filteredItems = items.filter(item => {
    return (
      !selectedItems.some(selected => selected.id === item.id) &&  // Exclude already selected items
      item[displayProperty].toLowerCase().includes(searchTerm.toLowerCase())  // Filter by search term
    );
  });

  // Add item only if it hasn't been selected already
  function addItem(item) {
    if (!selectedItems.some(selected => selected.id === item.id)) {
      selectedItems = [...selectedItems, item]; // Ensure reactive update
      dispatch('update', { selectedItems });
    }
    showDropdown = false;
    searchTerm = ''; // Clear search field
  }

  // Remove item from the selected list
  function removeItem(id) {
    selectedItems = selectedItems.filter(item => item.id !== id);
    dispatch('update', { selectedItems });
  }

  // Handle clicks outside the component to close the dropdown
  function handleClickOutside(event) {
    if (!componentWrapper.contains(event.target)) {
      showDropdown = false;
      highlightedIndex = -1; // Reset index
    }
  }

  // Keyboard navigation
  function handleKeyDown(event) {
    if (showDropdown && filteredItems.length > 0) {
      if (event.key === 'ArrowDown') {
        highlightedIndex = (highlightedIndex + 1) % filteredItems.length;
      } else if (event.key === 'ArrowUp') {
        highlightedIndex = (highlightedIndex - 1 + filteredItems.length) % filteredItems.length;
      } else if (event.key === 'Enter') {
        if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
          addItem(filteredItems[highlightedIndex]);
        }
      }
    }
  }

 // Add and remove event listener for outside clicks
onMount(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside);
  }
});

onDestroy(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleClickOutside);
  }
});
</script>

<!-- Selected Items as Tags -->
<div bind:this={componentWrapper} class="form-group relative" on:keydown={handleKeyDown} style={`width: ${boxWidth};`} >
  <div
    class="flex flex-wrap gap-2 mb-2 p-2 border border-base-300 rounded-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary cursor-text bg-base-100"
    on:click={() => showDropdown = true}
    style={`max-height: ${maxHeight}; overflow-y: auto;`} 
  >
    {#each selectedItems as item}
      <div class="badge badge-outline bg-primary text-primary-content flex items-center gap-2 ${badgePadding} rounded-lg shadow-md">
        <span class={badgeSize}>{item[displayProperty]}</span>
        {#each extraProperties as prop}
          {#if item[prop]}
            <span class="ml-1 text-sm text-gray-100">({item[prop]})</span>
          {/if}
        {/each}
        <button 
        type="button" 
        class="ml-2 text-white bg-red-500 rounded-full w-6 h-4 flex items-center justify-center hover:bg-red-600 focus:outline-none" 
        on:click={() => removeItem(item.id)}
      >
        ✕
      </button>
      </div>
    {/each}
    <!-- Input Field -->
    <input
      type="text"
      placeholder={placeholder}
      bind:value={searchTerm}
      class="input input-xs text-base-content bg-base-100 flex-grow border-none focus:outline-none"
      on:focus={() => showDropdown = true}
    />
  </div>

  <!-- Dropdown for selecting items -->
  {#if showDropdown && filteredItems.length > 0}
    <ul class="absolute z-10 mt-1 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-auto">
      {#each filteredItems as item, index (item.id)}
        <li
          class="p-2 cursor-pointer flex justify-between items-center {highlightedIndex === index ? 'bg-base-200' : ''}"
          on:click={() => addItem(item)}
        >
          <span>{item[displayProperty]}</span>
          {#each extraProperties as prop}
            {#if item[prop]}
              <span class="ml-2 text-sm text-base-content">({item[prop]})</span>
            {/if}
          {/each}
        </li>
      {/each}
    </ul>
  {/if}
</div>
