<script>
  import { onMount } from "svelte";

  // Mock Data for Categories and Reports
const mockCategories = [
  { id: 1, name: "Sales Reports", reports: [{ id: 101, name: "Sales Q1", reportCustomizedName: "Custom Sales Q1", description: "Quarterly sales report for Q1" }] },
  { id: 2, name: "Marketing Reports", reports: [{ id: 102, name: "Marketing Q1", reportCustomizedName: "Custom Marketing Q1", description: "Marketing analysis for Q1" }] },
  { id: 3, name: "Finance Reports", reports: [{ id: 103, name: "Finance Q1", reportCustomizedName: "Custom Finance Q1", description: "Financial performance for Q1" }] },
  { id: 4, name: "HR Reports", reports: [{ id: 104, name: "HR Q1", reportCustomizedName: "Custom HR Q1", description: "HR data for Q1" }] },
  { id: 5, name: "IT Reports", reports: [{ id: 105, name: "IT Q1", reportCustomizedName: "Custom IT Q1", description: "IT infrastructure report for Q1" }] },
  { id: 6, name: "Customer Feedback Reports", reports: [{ id: 106, name: "Customer Feedback Q1", reportCustomizedName: "Custom Customer Feedback Q1", description: "Customer feedback report for Q1" }] },
  { id: 7, name: "Product Performance Reports", reports: [{ id: 107, name: "Product Performance Q1", reportCustomizedName: "Custom Product Performance Q1", description: "Product performance report for Q1" }] },
  { id: 8, name: "Compliance Reports", reports: [{ id: 108, name: "Compliance Q1", reportCustomizedName: "Custom Compliance Q1", description: "Compliance report for Q1" }] },
  { id: 9, name: "Risk Management Reports", reports: [{ id: 109, name: "Risk Management Q1", reportCustomizedName: "Custom Risk Management Q1", description: "Risk management report for Q1" }] },
  { id: 10, name: "Operational Reports", reports: [{ id: 110, name: "Operational Q1", reportCustomizedName: "Custom Operational Q1", description: "Operational report for Q1" }] },
  { id: 11, name: "Training and Development Reports", reports: [{ id: 111, name: "Training Q1", reportCustomizedName: "Custom Training Q1", description: "Training and development report for Q1" }] },
  { id: 12, name: "Environmental Impact Reports", reports: [{ id: 112, name: "Environmental Q1", reportCustomizedName: "Custom Environmental Q1", description: "Environmental impact report for Q1" }] }
];

const mockReports = [
  { id: 101, report: { id: 101, name: "Sales Q1", description: "Quarterly sales report for Q1" }, reportCustomizedName: "Custom Sales Q1" },
  { id: 102, report: { id: 102, name: "Marketing Q1", description: "Marketing analysis for Q1" }, reportCustomizedName: "Custom Marketing Q1" },
  { id: 103, report: { id: 103, name: "Finance Q1", description: "Financial performance for Q1" }, reportCustomizedName: "Custom Finance Q1" },
  { id: 104, report: { id: 104, name: "HR Q1", description: "HR data for Q1" }, reportCustomizedName: "Custom HR Q1" },
  { id: 105, report: { id: 105, name: "IT Q1", description: "IT infrastructure report for Q1" }, reportCustomizedName: "Custom IT Q1" },
  { id: 106, report: { id: 106, name: "Customer Feedback Q1", description: "Customer feedback report for Q1" }, reportCustomizedName: "Custom Customer Feedback Q1" },
  { id: 107, report: { id: 107, name: "Product Performance Q1", description: "Product performance report for Q1" }, reportCustomizedName: "Custom Product Performance Q1" },
  { id: 108, report: { id: 108, name: "Compliance Q1", description: "Compliance report for Q1" }, reportCustomizedName: "Custom Compliance Q1" },
  { id: 109, report: { id: 109, name: "Risk Management Q1", description: "Risk management report for Q1" }, reportCustomizedName: "Custom Risk Management Q1" },
  { id: 110, report: { id: 110, name: "Operational Q1", description: "Operational report for Q1" }, reportCustomizedName: "Custom Operational Q1" },
  { id: 111, report: { id: 111, name: "Training Q1", description: "Training and development report for Q1" }, reportCustomizedName: "Custom Training Q1" },
  { id: 112, report: { id: 112, name: "Environmental Q1", description: "Environmental impact report for Q1" }, reportCustomizedName: "Custom Environmental Q1" }
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



<div class="flex flex-col md:flex-row gap-4 p-2">
  <!-- Categories Column -->
  <div class="flex flex-col bg-base-100 w-full md:w-1/2 h-auto p-4 rounded-md shadow-lg">
    <!-- Success Ribbon -->
    {#if showSuccess}
      <div class="alert alert-success">
        <span>Message sent successfully.</span>
      </div>
    {/if}
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
            <button class="btn btn-sm btn-outline" on:click={() => editingCategories = !editingCategories}>
              Edit
            </button>
          {/if}
        </div>
      </div>
    </div>

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
            <li class="p-1">
              {#if editingCategories}
                <input
                  type="text"
                  bind:value={tempCategoryNames[category.id]}
                  class="input input-bordered flex-grow mr-2"
                />
              {:else}
                <button
                  type="button"
                  class={`btn-sm btn-ghost w-full flex justify-between items-center ${selectedCategoryId === category.id ? "bg-blue-100" : ""}`}
                  on:click={() => selectCategory(category.id)}
                >
                  <span class="truncate">{category.name}</span>
                  {selectedCategoryId === category.id ? "➡" : ""}
                </button>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {:else}
      <p>No categories found.</p>
    {/if}
  </div>

  <!-- Reports Column -->
  <div class="flex flex-col bg-base-100 w-full md:w-1/2 h-auto p-4 rounded-md shadow-lg">
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

    {#if filteredReportsBySearch && filteredReportsBySearch.length}
      <div class="h-[32rem] md:h-[31rem] overflow-y-auto scrollbar scrollbar-thin">
        <ul class="menu bg-base-100 rounded-box">
          {#each filteredReportsBySearch as report}
            <li>
              {#if editingReports}
                <input
                  type="text"
                  bind:value={tempReportNames[report.report.id]}
                  class="input input-bordered flex-grow mr-2"
                />
              {:else}
                <div class="flex justify-between w-full">
                  <span class="truncate">{report.reportCustomizedName}</span>
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
