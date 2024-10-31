<script>
  import { onMount } from "svelte";

  // State Variables
  let newCategoryName = "";
  let selectedReportId = null; // Bind the selected report ID from the dropdown
  let categories = [];
  let reports = [];
  let tempCategoryNames = {};
  let tempReportNames = {};
  let filteredCategories = [];
  let selectedCategoryId = null;
  let searchCategory = "";
  let editingCategories = false;
  let showSuccess = false;
  let showError = false;
  let editingReports = false;
  let searchReport = "";
  // Updated Mock Data with New Reports
  const mockCategories = [
    { id: 1, name: "Sales Reports", reports: [101] },
    { id: 2, name: "Marketing Reports", reports: [102] },
  ];

  const mockReports = [
    { id: 101, name: "Sales Q1", reportCustomizedName: "Custom Sales Q1", description: "Quarterly sales report for Q1" },
    { id: 102, name: "Marketing Q1", reportCustomizedName: "Custom Marketing Q1", description: "Marketing analysis for Q1" },
    { id: 103, name: "Finance Q1", reportCustomizedName: "Custom Finance Q1", description: "Financial performance for Q1" },
    { id: 104, name: "HR Q1", reportCustomizedName: "Custom HR Q1", description: "HR data for Q1" },
    { id: 105, name: "IT Q1", reportCustomizedName: "Custom IT Q1", description: "IT infrastructure report for Q1" },
  ];

  // Load Initial Data
  const loadCategoriesAndReports = () => {
    categories = [...mockCategories];
    reports = [...mockReports];
    filteredCategories = [...categories];
    categories.forEach(cat => (tempCategoryNames[cat.id] = cat.name));
    reports.forEach(rep => (tempReportNames[rep.id] = rep.reportCustomizedName));
  };




   // Save Category Changes
   const saveAllCategoryChanges = () => {
    categories = categories.map((category) => ({
      ...category,
      name: tempCategoryNames[category.id] || category.name,
    }));
    editingCategories = false;
    showSuccessNotification("Category changes saved successfully.");
  };
  const cancelCategoryEdit = () => {
    // Reset temp names
    categories.forEach((category) => {
      tempCategoryNames[category.id] = category.name;
    });
    editingCategories = false;
  };

  // Select a Category
  const selectCategory = (categoryId) => {
    selectedCategoryId = categoryId;
    if (categoryId == null) {
      filteredReports = reports;
    } else {
      const selectedCategory = categories.find(
        (category) => category.id === categoryId,
      );
      filteredReports = selectedCategory ? selectedCategory.reports || [] : [];
    }
    searchReport = "";
    selectedReportInfo = null;
  };

   // Filtered categories based on search input
   $: filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchCategory.toLowerCase()),
  );
  // Add a New Category
  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory = { id: Date.now(), name: newCategoryName.trim(), reports: [] };
    categories = [...categories, newCategory];
    filteredCategories = [...categories];
    newCategoryName = "";
    showSuccessNotification("Category added successfully.");
  };

  // Delete a Category
  const deleteCategory = async (categoryId) => {
    const confirmed = confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;
    categories = categories.filter(category => category.id !== categoryId);
    filteredCategories = [...categories];
    showSuccessNotification("Category deleted successfully.");
  };

//Report

// Save Report Changes
const saveAllReportChanges = () => {
    reports = reports.map((report) => ({
      ...report,
      customizedName: tempReportNames[report.id] || report.customizedName,
    }));
    editingReports = false;
    showSuccessNotification("Report changes saved successfully.");
  };

  // Cancel Report Edit
  const cancelReportEdit = () => {
    reports.forEach((report) => {
      tempReportNames[report.id] = report.customizedName;
    });
    editingReports = false;
  };

  // Add a Selected Report to the Current Category
  let selectedReportIds = []; // Store multiple selected report IDs
  let isDropdownOpen = false; // Toggle dropdown visibility

   // Add selected reports to the category
   const addReports = () => {
    if (selectedReportIds.length === 0) {
      showErrorNotification("Please select at least one report.");
      return;
    }

    const selectedReports = reports.filter(report =>
      selectedReportIds.includes(report.id)
    );

    const categoryIndex = categories.findIndex(cat => cat.id === selectedCategoryId);
    if (categoryIndex === -1) {
      showErrorNotification("Please select a category.");
      return;
    }

    const category = categories[categoryIndex];

    const newReportIds = selectedReports
      .map(report => report.id)
      .filter(id => !category.reports.includes(id));

    if (newReportIds.length === 0) {
      showErrorNotification("All selected reports already exist in this category.");
      return;
    }

    const updatedCategory = {
      ...category,
      reports: [...category.reports, ...newReportIds],
    };

    // Update categories array
    categories = [
      ...categories.slice(0, categoryIndex),
      updatedCategory,
      ...categories.slice(categoryIndex + 1),
    ];

    showSuccessNotification(`${newReportIds.length} report(s) added successfully.`);
    selectedReportIds = []; // Reset selected reports
    isDropdownOpen = false; // Close dropdown
  };

  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown-container")) {
      isDropdownOpen = false;
    }
  };

  window.addEventListener("click", handleClickOutside);


  // Notifications
  const showSuccessNotification = (message) => {
    showSuccess = true;
    console.log(message);
    setTimeout(() => (showSuccess = false), 3000);
  };

  const showErrorNotification = (message) => {
    showError = true;
    console.error(message);
    setTimeout(() => (showError = false), 3000);
  };

  onMount(loadCategoriesAndReports);
</script>

<!-- Page Layout -->
<div class="flex flex-col md:flex-row gap-4 mt-4">
  <!-- Categories Column -->
  <div class="w-full md:w-1/2 p-4 rounded-md shadow-md border border-gray-400">
    
    <div class="flex flex-col md:flex-row gap-2 justify-between items-center w-full">
      <h2 class="text-lg md:text-xl font-bold mb-2 md:mb-0">Categories</h2>
      <input
        type="text"
        placeholder="Search categories..."
        bind:value={searchCategory}
        class="input input-bordered w-full md:w-[11rem] mb-4 md:mb-0 h-10 rounded-md shadow-lg"
      />
      <div class="w-full md:w-auto flex justify-center">
        {#if editingCategories}
        <div class="flex gap-2 flex-col md:flex-row">
          <button class="btn btn-sm btn-outline" on:click={saveAllCategoryChanges}>Save</button>
          <button class="btn btn-sm btn-outline" on:click={cancelCategoryEdit}>Cancel</button>
        </div>
      {:else}
        <button class="btn btn-sm btn-outline" on:click={() => (editingCategories = true)}>Edit</button>
      {/if}
      </div>
    </div>


    <div class="flex flex-col items-center md:flex-row gap-2 mt-4 m-1">
      <input
        type="text"
        placeholder="Enter new category name..."
        bind:value={newCategoryName}
        class="input input-bordered h-10 w-full md:w-2/3 rounded-md shadow-lg"
      />
      <button class="btn btn-sm btn-secondary" on:click={addCategory}>Add</button>
    </div>

    {#if filteredCategories.length > 0}
      <ul class="menu bg-base-100 rounded-md overflow-y-auto h-64">
        {#each filteredCategories as category}
        <li class="py-1 flex flex-row items-center">
          {#if editingCategories}
            <input
              type="text"
              bind:value={tempCategoryNames[category.id]}
              class="input input-bordered flex-grow mr-2"
            />
          {:else}
            <button
              type="button"
              class={`btn-sm btn-ghost flex-grow flex justify-between items-center ${selectedCategoryId === category.id ? "bg-blue-100" : ""}`}
              on:click={() => selectCategory(category.id)}
            >
              <span class="truncate max-w-80" title={category.name}>{category.name}</span>
            </button>
          {/if}
          <button class="btn btn-sm btn-error ml-2" on:click={() => deleteCategory(category.id)}>Delete</button>
        </li>
      {/each}
      </ul>
    {:else}
      <p>No categories available.</p>
    {/if}
  </div>

  <!-- Reports Column -->
  <div class="w-full md:w-1/2 p-4 border border-gray-300 rounded-lg shadow-lg relative">

    <div class="flex flex-col md:flex-row gap-2 justify-between items-center w-full">
      <h2 class="text-lg md:text-xl font-bold mb-2 md:mb-0">Reports</h2>
      <input
        type="text"
        placeholder="Search reports..."
        bind:value={searchReport}
        class="input input-bordered w-full md:w-[11rem] mb-4 md:mb-0 h-10 rounded-md shadow-lg"
      />
      <div class="w-full md:w-auto flex justify-center">
        {#if editingReports}
          <div class="flex gap-2 flex-col md:flex-row">
            <button class="btn btn-sm btn-outline" on:click={saveAllReportChanges}>Save</button>
            <button class="btn btn-sm btn-outline" on:click={cancelReportEdit}>Cancel</button>
          </div>
        {:else}
          <button class="btn btn-sm btn-outline" on:click={() => (editingReports = true)}>
            Edit
          </button>
        {/if}
      </div>
    </div>

    <div class="flex flex-col items-center md:flex-row gap-4 mt-4 dropdown-container">
      <input
        type="text"
        placeholder="Select a report..."
        class="input input-bordered h-10 w-full md:w-2/3 rounded-md shadow-lg"
        on:click={toggleDropdown}
      />
  
      <!-- Dropdown menu that opens below the input -->
      <div class={`mt-28 w-full dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
        <select
          multiple
          bind:value={selectedReportIds}
          class="select select-bordered h-56 p-1 rounded-md shadow-md"
        >
          {#each reports as report (report.id)}
            <option value={report.id}>{report.reportCustomizedName}</option>
          {/each}
        </select>
      </div>
  
      <button class="btn btn-secondary btn-sm" on:click={addReports}>Add</button>
    </div>
  
    <!-- Category Reports Display -->
    {#if selectedCategoryId}
      <div class="h-[32rem] md:h-[31rem] overflow-y-auto scrollbar-thin mt-4">
        <h3 class="text-md font-semibold mb-2">
          Reports for Category ID: {selectedCategoryId}
        </h3>
        <ul class="menu  bg-base-100 rounded-lg overflow-y-auto h-64">
          {#each reports.filter(r => 
            categories.find(c => c.id === selectedCategoryId)?.reports.includes(r.id)
          ) as report}
            <li class="flex flex-row items-center  py-2">
              {#if editingReports}
              <input
              type="text"
              bind:value={tempReportNames[report.id]}
              class="input input-bordered flex-grow mr-2"
            />
          {:else}
          <div class="flex justify-between py-0 ">
            <span class="truncate w-72" title={report.name}>
              {report.reportCustomizedName}
            </span>
            <div class="flex gap-2">
              <button class="btn btn-primary btn-sm">Run</button>
              <button class="btn btn-secondary btn-sm">Info</button>
            </div>
            
          </div>
          {/if}
            </li>
          {/each}
        </ul>
      </div>
    {:else}
      <p class="text-center">Select a category to view its reports.</p>
    {/if}
  </div>
  

</div>

<style>
  .btn {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }  
  .dropdown-menu {
    position: relative;
    display: none;
  }
  .dropdown-menu.open {
   
    display: block;
    position: absolute;
  }
</style>