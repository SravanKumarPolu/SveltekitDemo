<script>
  import { onMount } from "svelte";

  // Mock Data for Categories and Reports
  let newCategoryName = "";
  let newReportName = "";
  let categories = [];
  let reports = [];
  let tempCategoryNames = {};
  let tempReportNames = {};
  let selectedCategoryId = null;
  let showSuccess = false;
  let showError = false;
  let searchCategory = "";
  let searchReport = "";
  let editingCategories = false;
  let editingReports = false;

  const mockCategories = [
    { id: 1, name: "Sales Reports", reports: [101] },
    { id: 2, name: "Marketing Reports", reports: [102] },
  ];

  const mockReports = [
    { id: 101, name: "Sales Q1", customizedName: "Custom Sales Q1", description: "Quarterly sales report for Q1" },
    { id: 102, name: "Marketing Q1", customizedName: "Custom Marketing Q1", description: "Marketing analysis for Q1" },
  ];

  // Fetch Initial Data
  const loadCategoriesAndReports = () => {
    categories = [...mockCategories];
    reports = [...mockReports];
    categories.forEach(cat => (tempCategoryNames[cat.id] = cat.name));
    reports.forEach(rep => (tempReportNames[rep.id] = rep.customizedName));
  };

  // Add New Category
  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory = { id: Date.now(), name: newCategoryName.trim(), reports: [] };
    categories = [...categories, newCategory];
    tempCategoryNames[newCategory.id] = newCategory.name;
    newCategoryName = "";
    showSuccessNotification("Category added successfully.");
  };

  const addReport = () => {
  if (!newReportName.trim()) return;

  const newReport = {
    id: Date.now(),
    name: newReportName.trim(),
    customizedName: newReportName.trim(),
    description: "",
  };

  // Add the report to the reports array
  reports = [...reports, newReport];

  // Associate the new report with the selected category
  if (selectedCategoryId) {
    const category = categories.find(cat => cat.id === selectedCategoryId);
    if (category) {
      category.reports = [...category.reports, newReport.id]; // Add report ID to the category
    }
  }

  tempReportNames[newReport.id] = newReport.customizedName;
  newReportName = "";
  showSuccessNotification("New report added successfully.");
};


  // Show Success Notification
  const showSuccessNotification = (message) => {
    showSuccess = true;
    setTimeout(() => (showSuccess = false), 3000);
    console.log(message);
  };

  // Select Category to View Its Reports
  const selectCategory = (categoryId) => {
    selectedCategoryId = categoryId;
  };

  onMount(loadCategoriesAndReports);
</script>

<!-- Page Layout -->
<div class="flex flex-col md:flex-row gap-4 mt-4">
  <!-- Categories Column -->
  <div class="w-full md:w-1/2 p-4 bg-white rounded-md shadow-md border">
    <h2 class="text-lg font-bold mb-2">Categories</h2>
    
    <input
      type="text"
      placeholder="Enter new category name..."
      bind:value={newCategoryName}
      class="input input-bordered w-full mb-2"
    />
    <button class="btn btn-primary mb-4" on:click={addCategory}>Add Category</button>

    {#if categories.length}
      <ul class="menu bg-base-100 rounded-md overflow-y-auto h-64">
        {#each categories as category}
          <li class="flex justify-between items-center">
            <span>{category.name}</span>
            <button class="btn btn-sm btn-outline" on:click={() => selectCategory(category.id)}>View Reports</button>
          </li>
        {/each}
      </ul>
    {:else}
      <p>No categories available.</p>
    {/if}
  </div>

  <!-- Reports Column -->
  <div class="w-full md:w-1/2 p-4 bg-white rounded-md shadow-md border">
    <h2 class="text-lg font-bold mb-2">Reports</h2>
    
    <input
      type="text"
      placeholder="Enter new report name..."
      bind:value={newReportName}
      class="input input-bordered w-full mb-2"
    />
    <button class="btn btn-primary mb-4" on:click={addReport}>Add Report</button>

    {#if selectedCategoryId}
      <h3 class="text-md font-semibold mb-2">Reports for Category ID: {selectedCategoryId}</h3>
      <ul class="menu bg-base-100 rounded-md overflow-y-auto h-64">
        {#each reports.filter(r => categories.find(c => c.id === selectedCategoryId)?.reports.includes(r.id)) as report}
          <li class="flex justify-between items-center">
            <span>{report.customizedName}</span>
            <button class="btn btn-sm btn-outline" on:click={() => console.log(`Running Report: ${report.id}`)}>Run</button>
          </li>
        {/each}
      </ul>
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
