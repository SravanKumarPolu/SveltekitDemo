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
  let showSuccess = false;
  let showError = false;

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

  // Select a Category
  const selectCategory = (categoryId) => {
    selectedCategoryId = categoryId;
  };

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

  const addReport = () => {
  if (!selectedReportId) {
    showErrorNotification("Please select a report.");
    return;
  }

  const selectedReport = reports.find(report => report.id === selectedReportId);
  if (!selectedReport) {
    showErrorNotification("Selected report not found.");
    return;
  }

  const categoryIndex = categories.findIndex(cat => cat.id === selectedCategoryId);
  if (categoryIndex === -1) {
    showErrorNotification("Please select a category.");
    return;
  }

  const category = categories[categoryIndex];

  if (category.reports.includes(selectedReport.id)) {
    showErrorNotification("Report already exists in this category.");
    return;
  }

  // Add the report ID to the selected category's reports
  const updatedCategory = {
    ...category,
    reports: [...category.reports, selectedReport.id],
  };

  // Update the categories array with the modified category
  categories = [
    ...categories.slice(0, categoryIndex),
    updatedCategory,
    ...categories.slice(categoryIndex + 1),
  ];

  showSuccessNotification(`Report "${selectedReport.reportCustomizedName}" added successfully.`);
  
  // Reset the dropdown after adding the report
  selectedReportId = null;
};


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
          <li class="py-1 flex items-center">
            <button
              class={`btn-sm btn-ghost flex-grow flex justify-between items-center ${
                selectedCategoryId === category.id ? "bg-blue-100" : ""
              }`}
              on:click={() => selectCategory(category.id)}
            >
              <span class="truncate max-w-80" title={category.name}>{category.name}</span>
            </button>
            <button class="btn btn-sm btn-error ml-2" on:click={() => deleteCategory(category.id)}>Delete</button>
          </li>
        {/each}
      </ul>
    {:else}
      <p>No categories available.</p>
    {/if}
  </div>

  <!-- Reports Column -->
  <div class="w-full md:w-1/2 p-4 border-gray-400 rounded-md shadow-md border">
    <div class="flex flex-col items-center md:flex-row gap-2 mt-4 m-1">
      <select
        bind:value={selectedReportId}
        class="select select-bordered h-10 w-full md:w-2/3 rounded-md shadow-lg"
      >
        <option value="" disabled selected>Select a report...</option>
        {#each reports as report (report.id)}
          <option value={report.id}>{report.reportCustomizedName}</option>
        {/each}
      </select>
      <button class="btn btn-sm btn-secondary" on:click={addReport}>Add</button>
    </div>

    {#if selectedCategoryId}
      <div class="h-[32rem] md:h-[31rem] overflow-y-auto scrollbar scrollbar-thin">
        <h3 class="text-md font-semibold mb-2">Reports for Category ID: {selectedCategoryId}</h3>
        <ul class="menu bg-base-100 rounded-md overflow-y-auto h-64">
          {#each reports.filter(r => categories.find(c => c.id === selectedCategoryId)?.reports.includes(r.id)) as report}
            <li class="flex items-center py-2">
              <div class="flex justify-between py-0">
                <span class="truncate w-72" title={report.name}>{report.reportCustomizedName}</span>
                <div class="flex gap-2">
                  <button class="btn btn-primary btn-sm">Run</button>
                  <button class="btn btn-secondary btn-sm">Info</button>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {:else}
      <p>Select a category to view its reports.</p>
    {/if}
  </div>
</div>

<style>
  .btn {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
