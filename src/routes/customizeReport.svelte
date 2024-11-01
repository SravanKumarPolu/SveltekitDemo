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
  


  let selectedReportInfo = null; // Track selected report info

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

   // Save Category Changes
  const saveAllCategoryChanges = () => {
    categories = categories.map((category) => ({
      ...category,
      name: tempCategoryNames[category.id] || category.name,
    }));
    editingCategories = false;
    showSuccessNotification("Category changes saved successfully.");
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
   //  Delete  Category
  const deleteCategory = async (categoryId) => {
  const confirmed = confirm("Are you sure you want to delete this category?");
  if (!confirmed) return; // Exit if the user cancels

  // Filter out the category to delete
  categories = categories.filter((category) => category.id !== categoryId);

  // Remove the deleted category from tempCategoryNames
  delete tempCategoryNames[categoryId];

  // Update the filtered categories after deletion
  filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  // Display success notification

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
  //  Delete  Category
  const deleteReport = async (reportId) => {
  const confirmed = confirm("Are you sure you want to delete this category?");
  if (!confirmed) return; // Exit if the user cancels

  // Filter out the category to delete
  reports = reports.filter((rep) => category.id !== categoryId);

  // Remove the deleted category from tempCategoryNames
  delete tempCategoryNames[categoryId];

  // Update the filtered categories after deletion
  filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  // Display success notification

}; 

  // Show Success Notification
  const showSuccessNotification = (message) => {
    showSuccess = true;
    setTimeout(() => (showSuccess = false), 3000);
    console.log(message);
  };



  onMount(loadCategoriesAndReports);

  const cancelCategoryEdit = () => {
    // Reset temp names
    categories.forEach((category) => {
      tempCategoryNames[category.id] = category.name;
    });
    editingCategories = false;
  };

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


  // Show Report Info
  const showReportInfo = (report) => {
    selectedReportInfo = report; // Assign the entire report object
  };

  // Close Report Info
  const closeReportInfo = () => {
    selectedReportInfo = null; // Clear the selected report info
  };
</script>

<!-- Page Layout -->
<div class="flex flex-col md:flex-row gap-4 mt-4">

 <!-- Categories Column -->
<div class="w-full md:w-1/2 p-4 rounded-md shadow-md border border-gray-400" >
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

  <!-- New Category Form -->
  <div class="flex flex-col items-center md:flex-row gap-2 mt-4 m-1">
    <input
      type="text"
      placeholder="Enter new category name..."
      bind:value={newCategoryName}
      class="input input-bordered h-10 w-full md:w-2/3 rounded-md shadow-lg"
    />
    <button class="btn btn-sm btn-secondary" on:click={addCategory}>Add</button>
  </div>

  <!-- Category List -->
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
<div class="w-full md:w-1/2 p-4 border-gray-400 rounded-md shadow-md border">
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

  <div class="flex flex-col items-center md:flex-row gap-2 mt-4 m-1">
    <input
      type="text"
      placeholder="Enter new report name..."
      bind:value={newReportName}
      class="input input-bordered h-10 w-full md:w-2/3 rounded-md shadow-lg"
    />
    <button class="btn btn-sm btn-secondary" on:click={addReport}>Add</button>
  </div>
  {#if selectedCategoryId}

  <div class="h-[32rem] md:h-[31rem] overflow-y-auto scrollbar scrollbar-thin ">
    <h3 class="text-md font-semibold mb-2">Reports for Category ID: {selectedCategoryId}</h3>
    <ul class="menu bg-base-100 rounded-md overflow-y-auto h-64">
      {#each reports.filter((r) => categories.find((c) => c.id === selectedCategoryId)?.reports.includes(r.id)) as report}
        <li class="flex items-center py-2">
          {#if editingReports}
            <input
              type="text"
              bind:value={tempReportNames[report.id]}
              class="input input-bordered flex-grow mr-2"
            />
          {:else}
          <div class="flex justify-between py-0 ">
            <span class="truncate w-72 " title={report.name}>{report.customizedName}</span>
            <div class="flex gap-2">
              <button class="btn btn-primary btn-sm" on:click={() => runReport(report.report.id)}>Run</button>
              <button class="btn btn-secondary btn-sm" on:click={() => showReportInfo(report)}>Info</button>
            </div>
            
          </div>
          {/if}
        
        </li>
      {/each}
    </ul>
  </div>
  {:else}
    <p>Select a category to view its reports.</p>
  {/if}

</div>

  <!-- Report Info Modal -->
  {#if selectedReportInfo}
    <div class="modal modal-open">
      <div class="modal-box flex flex-col gap-2">
        <h2 class="font-bold text-lg">{selectedReportInfo.name}</h2>
        <p>{selectedReportInfo.description}</p>
        <button class="btn btn-md mr-0 " on:click={closeReportInfo}>Close</button>
      </div>
    </div>
  {/if}
</div>






<style>
  .btn {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
