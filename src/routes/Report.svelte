<script>
  import { onMount } from "svelte";

  // Mock Data for Categories and Reports
  let newCategoryName = "";
  let newReportName = "";
const mockCategories = [
  { id: 1, name: "Sales Reports asdfgh dferyadgkkccvffdgh Quarterly sales report for Q1", reports: [{ id: 101, name: "Sales Q1", reportCustomizedName: "Custom Sales Q1", description: "Quarterly sales report for Q1 Quarterly sales report for Q1" }] },
  { id: 2, name: "Marketing Reports", reports: [{ id: 102, name: "Marketing Q1", reportCustomizedName: "Custom Marketing Q1", description: "Marketing analysis for Q1" }] },
  
];

const mockReports = [
  { id: 101, report: { id: 101, name: "Sales Q1", description: "Quarterly sales report for Q1" }, reportCustomizedName: "Custom Sales Q1" },
  { id: 102, report: { id: 102, name: "Marketing Q1", description: "Marketing analysis for Q1" }, reportCustomizedName: "Custom Marketing Q1" },
  { id: 103, report: { id: 103, name: "Finance Q1", description: "Financial performance for Q1" }, reportCustomizedName: "Custom Finance Q1" },

];


  // Mock Functions
  const fetchCategoriesAndReports = async () => {
    return { data: { categories: mockCategories, allReports: mockReports } };
  };

  const runReport = (reportId) => {
    console.log(`Running report with ID: ${reportId}`);
  };

  const bulkUpdateCategories = async (categoriesToUpdate) => {
    console.log("Bulk updating categories:", categoriesToUpdate);
    return Promise.resolve();  // Simulate a successful update
  };

  const bulkUpdateReports = async (reportsToUpdate) => {
    console.log("Bulk updating reports:", reportsToUpdate);
    return Promise.resolve();  // Simulate a successful update
  };

  // Variables for categories and reports
  let categories = [];
  let reports = [];
  let filteredReports = [];
  let searchCategory = "";
  let searchReport = "";
  let selectedCategoryId = null;
  let selectedReportInfo = null;

  let editingCategories = false;
  let editingReports = false;

  let tempCategoryNames = {};
  let tempReportNames = {};

  let showSuccess = false;
  let showError = false;

  let deleteSuccess = false; // State to show success message
  // Load categories and reports data
  const loadCategoriesAndReports = async () => {
    try {
      const response = await fetchCategoriesAndReports();
      if (response && response.data) {
        categories = response.data.categories || [];
        reports = response.data.allReports || [];
        filteredReports = reports;

        categories.forEach((category) => {
          tempCategoryNames[category.id] = category.name;
        });
        reports.forEach((report) => {
          tempReportNames[report.id] = report.reportCustomizedName;
        });
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  onMount(loadCategoriesAndReports);

  // Bulk save all category changes
  const saveAllCategoryChanges = async () => {
    try {
      const categoriesToUpdate = Object.keys(tempCategoryNames).map((id) => ({
        id,
        name: tempCategoryNames[id],
      }));

      await bulkUpdateCategories(categoriesToUpdate); // Send bulk update request

      // Show success notification
      showSuccess = true;
      setTimeout(() => {
        showSuccess = false; // Hide after 3 seconds
      }, 3000);
      // Reload categories and reports
      await loadCategoriesAndReports();
      editingCategories = false;
      console.log("All category changes saved in DB successfully.");
    } catch (error) {
      console.error("Error saving category changes in DB:", error);
      showError = true; // Optionally, show error state
    }
  };

  // Bulk save all report changes
  const saveAllReportChanges = async () => {
    try {
      const reportsToUpdate = Object.keys(tempReportNames).map((id) => ({
        id,
        name: tempReportNames[id],
      }));

      await bulkUpdateReports(reportsToUpdate); // Send bulk update request
      // Show success notification
      showSuccess = true;
      setTimeout(() => {
        showSuccess = false; // Hide after 3 seconds
      }, 3000);

      // Reload categories and reports
      await loadCategoriesAndReports();
      editingReports = false;
      console.log("All report changes saved in DB successfully.");
    } catch (error) {
      console.error("Error saving report changes in DB:", error);
      showError = true; // Optionally, show error state
    }
  };

  async function saveChanges(type) {
    try {
      if (type === "categories") {
        const updates = Object.keys(tempCategoryNames).map((id) => ({
          id,
          name: tempCategoryNames[id]
        }));
        await bulkUpdateCategories(updates);
      } else {
        const updates = Object.keys(tempReportNames).map((id) => ({
          id,
          name: tempReportNames[id]
        }));
        await bulkUpdateReports(updates);
      }
      showSuccess = true;
      setTimeout(() => (showSuccess = false), 3000);
      loadData();
    } catch (error) {
      console.error("Error saving changes:", error);
      showError = true;
    }
  }
  const addCategory = async () => {
  if (!newCategoryName.trim()) return; // Avoid empty input

  const newCategory = {
    id: Date.now(), // Use timestamp for unique ID
    name: newCategoryName.trim(),
    reports: [],
  };

  categories = [...categories, newCategory]; // Add new category
  tempCategoryNames[newCategory.id] = newCategory.name; // Track temp changes

  newCategoryName = ""; // Clear input field

  showSuccess = true;
  setTimeout(() => (showSuccess = false), 3000); // Hide success message

  console.log("New category added:", newCategory);
};
const addReport = () => {
    if (!newReportName.trim()) {
      showError = true;
      return;
    }

    const newReport = {
      id: Date.now(),
      report: { id: Date.now(), name: newReportName.trim(), description: '' },
      reportCustomizedName: newReportName.trim(),
    };

    reports.update((currentReports) => [...currentReports, newReport]);
    newReportName = '';
    showError = false;

    console.log('New report added:', newReport);
  };
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




  const cancelCategoryEdit = () => {
    // Reset temp names
    categories.forEach((category) => {
      tempCategoryNames[category.id] = category.name;
    });
    editingCategories = false;
  };

  const cancelReportEdit = () => {
    // Reset temp names
    reports.forEach((report) => {
      tempReportNames[report.report.id] = report.reportCustomizedName;
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

  // Filtered reports based on search input
  $: filteredReportsBySearch = filteredReports.filter(
    (report) =>
      report.report.name.toLowerCase().includes(searchReport.toLowerCase()) ||
      report.reportCustomizedName?.toLowerCase().includes(searchReport.toLowerCase())
  );

  // Show report info
  const showReportInfo = (report) => {
    selectedReportInfo = report;
  };

  const closeReportInfo = () => {
    selectedReportInfo = null; // Close the report info by setting it to null
  };
</script>



<div class="flex flex-col  md:flex-row gap-2 mt-2 py-4 ">
 
<!-- Categories Column -->
<div class="flex flex-col bg-base-100 border border-gray-400 w-full md:w-1/2 h-auto p-4 rounded-md shadow-lg">
  
  <!-- Success Notifications -->
  {#if showSuccess}
    <div class="alert alert-success">
      <span>Category added successfully.</span>
    </div>
  {/if}
  


  <!-- Header and Search Section -->
  <div class="bg-gray-300 shadow-md w-full flex flex-col md:flex-row justify-center items-center rounded-lg h-auto p-4 mb-4">
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
          <button class="btn btn-sm btn-outline" on:click={() => (editingCategories = !editingCategories)}>Edit</button>
        {/if}
      </div>
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
    <button class="btn btn-sm btn-secondary" on:click={addCategory}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
      </svg>
    </button>
  </div>

<!-- Categories List -->
{#if filteredCategories && filteredCategories.length}
  <div class="h-[32rem] md:h-[31rem] overflow-y-auto scrollbar scrollbar-thin">
    <ul class="menu bg-base-100 rounded-md">
      <li>
        <button
          type="button"
          class={`btn btn-ghost w-full flex justify-between items-center ${selectedCategoryId === null ? "bg-blue-100" : ""}`}
          on:click={() => selectCategory(null)}
        >
          All Reports
          {selectedCategoryId === null ? "➡" : ""}
        </button>
      </li>
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
              {selectedCategoryId === category.id ? "➡" : ""}
            </button>
          {/if}
          <button
            class="btn btn-sm btn-error ml-2"
            on:click={() => deleteCategory(category.id)}
          >
           
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg>
          </button>
        </li>
      {/each}
    </ul>
  </div>
{:else}
  <p>No categories found.</p>
{/if}

</div>



  <!-- Reports Column -->
   <div class="flex flex-col bg-base-100 border border-gray-400 w-full md:w-1/2 h-auto p-4 rounded-md shadow-lg">
      <!-- Success Notifications -->

    <!-- Error Ribbon -->
    {#if showError}
      <div class="alert alert-error mb-4">
        <span>There was an error saving changes.</span>
      </div>
    {/if}
    <div class="bg-gray-300 shadow-md w-full flex flex-col md:flex-row justify-center items-center rounded-lg h-auto p-4 mb-4">
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
            <button class="btn btn-sm btn-outline" on:click={() => editingReports = !editingReports}>
              Edit Reports
            </button>
          {/if}
        </div>
      </div>
    </div>
      <!-- New  Report Form -->
  <div class="flex flex-col items-center md:flex-row gap-2 mt-4 m-1">
    <input
      type="text"
      placeholder="Enter new  Report name..."
      bind:value={newReportName}
      class="input input-bordered h-10 w-full md:w-2/3 rounded-md shadow-lg"
    />
    <button class="btn btn-sm btn-secondary" on:click={addReport}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
      </svg>
    </button>
  </div>

    {#if filteredReportsBySearch && filteredReportsBySearch.length}
      <div class="h-[32rem] md:h-[31rem] overflow-y-auto scrollbar scrollbar-thin ">
        <ul class="menu bg-base-100 rounded-box ">
          {#each filteredReportsBySearch as report}
            <li class="py-1">
              {#if editingReports}
                <input
                  type="text"
                  bind:value={tempReportNames[report.report.id]}
                  class="input input-bordered flex-grow mr-2"
                />
              {:else}
                <div class="flex justify-between py-0 ">
                  <span class="truncate w-72 " title={report.name}>{report.reportCustomizedName}</span>
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
      <p>No reports found.</p>
    {/if}
  </div>
</div>






<!-- Modal for Report Info -->
{#if selectedReportInfo}
  <div class="modal modal-open">
    <div class="modal-box  flex flex-col gap-2 relative">
      <h2 class="font-bold text-lg">{selectedReportInfo.report.name}</h2>
      <p class="flex flex-col ">{selectedReportInfo.report.description}</p>
      
      <!-- Close Button at the bottom-right corner -->
      <div class="absolute bottom-4 right-4">
        <button class="btn " on:click={closeReportInfo}>Close</button>
      </div>
    </div>
  </div>
{/if}


<style>
.btn {
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden; /* Hide overflow text */
  text-overflow: ellipsis; /* Add ellipsis for overflowed text */
}

  /* Your custom styles for scrollbars can go here if needed */
</style>
