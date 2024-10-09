<script>
  import { onMount } from "svelte";
  import {
    fetchCategoriesAndReports,
    runReport,
    bulkUpdateCategories,
    bulkUpdateReports,
  } from "./reports";

  let categories = [];
  let reports = [];
  let filteredReports = [];
  let searchCategory = "";
  let searchReport = "";
  let selectedCategoryId = null;
  let selectedReportInfo = null;

  let editingCategories = false; // State to toggle edit mode for categories
  let editingReports = false; // State to toggle edit mode for reports

  // Track temporary edited names
  let tempCategoryNames = {};
  let tempReportNames = {};

  let showSuccess = false; // State to show success ribbon
  let showError = false; // State to show error ribbon

  // Load categories and reports data
  const loadCategoriesAndReports = async () => {
    try {
      const response = await fetchCategoriesAndReports();
      if (response && response.data) {
        categories = response.data.categories || [];
        reports = response.data.allReports || [];
        filteredReports = reports;

        // Initialize temp names
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
      report.report_customized_name
        ?.toLowerCase()
        .includes(searchReport.toLowerCase()),
  );


  // Show report info
  const showReportInfo = (report) => {
    selectedReportInfo = report;
  };

  const closeReportInfo = () => {
    selectedReportInfo = null; // Close the report info by setting it to null
  };
</script>

<div class="flex flex-col md:flex-row gap-4 p-4">
  

  <!-- Categories Column -->
  <div class="flex-1 bg-base-100 p-4 rounded-lg shadow-lg">
    <!-- Success Ribbon -->
  {#if showSuccess}  
  <div class="alert alert-success">
    <span>Message sent successfully.</span>
  </div> 
{/if}
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Categories</h2>

      <!-- Toggle between Edit mode and Save -->
      {#if editingCategories}
        <div class="flex gap-2">
          <button class="btn btn-sm btn-outline" on:click={saveAllCategoryChanges}>
            Save All Categories
          </button>
          <button class="btn btn-sm btn-outline" on:click={cancelCategoryEdit}>
            Cancel
          </button>
        </div>
      {:else}
        <button class="btn btn-sm btn-outline" on:click={() => editingCategories = !editingCategories}>
          Edit Categories
        </button>
      {/if}
    </div>

    <!-- Search bar for categories -->
    <input
      type="text"
      placeholder="Search categories..."
      bind:value={searchCategory}
      class="input input-bordered w-full mb-4"
    />

    {#if filteredCategories && filteredCategories.length}
      <ul class="menu bg-base-100 rounded-box">
        <!-- "All" button to show all reports -->
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
        <!-- Filtered Category buttons with edit functionality -->
        {#each filteredCategories as category}
          <li>
            {#if editingCategories}
              <input
                type="text"
                bind:value={tempCategoryNames[category.id]}
                class="input input-bordered flex-grow mr-2"
              />
            {:else}
              <button
                type="button"
                class={`btn btn-ghost w-full flex justify-between items-center ${selectedCategoryId === category.id ? "bg-blue-100" : ""}`}
                on:click={() => selectCategory(category.id)}
              >
                {category.name}
                {selectedCategoryId === category.id ? "➡" : ""}
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-error">No matching categories found.</p>
    {/if}
  </div>

  <!-- Reports Column -->
  <div class="flex-1 bg-base-100 p-4 rounded-lg shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Reports</h2>

      <!-- Toggle between Edit mode and Save -->
      {#if editingReports}
        <div class="flex gap-2">
          <button class="btn btn-sm btn-outline" on:click={saveAllReportChanges}>
            Save All Reports
          </button>
          <button class="btn btn-sm btn-outline" on:click={cancelReportEdit}>
            Cancel
          </button>
        </div>
      {:else}
        <button class="btn btn-sm btn-outline" on:click={() => editingReports = !editingReports}>
          Edit Reports
        </button>
      {/if}
    </div>

    <!-- Search bar for reports -->
    <input
      type="text"
      placeholder="Search reports..."
      bind:value={searchReport}
      class="input input-bordered w-full mb-4"
    />
    {#if filteredReportsBySearch && filteredReportsBySearch.length}
      <ul class="space-y-4">
        {#each filteredReportsBySearch as report}
          <li class="flex justify-between items-center">
            {#if editingReports}
              <input
                type="text"
                bind:value={tempReportNames[report.report.id]}
                class="input input-bordered flex-grow mr-2"
              />
            {:else}
              <span class="flex-1 text-lg font-semibold">
                <div class="tooltip" data-tip={report.report.name}>
                  {report.reportCustomizedName || "No Custom Name"}
                </div>
              </span>
              <div class="flex gap-2">
                <button class="btn btn-primary btn-sm" on:click={() => runReport(report.report.id)}>Run</button>
                <button class="btn btn-secondary btn-sm" on:click={() => showReportInfo(report)}>Info</button>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-error">No reports available.</p>
    {/if}
  </div>

  
  <!-- Report Info Column -->
  {#if selectedReportInfo}
    <div class="flex-1 bg-base-100 p-4 rounded-lg shadow-lg relative">
      <h2 class="text-xl font-bold mb-4">Report Info</h2>

      <!-- Close button (X) -->
      <button
        class="absolute top-2 right-2 text-xl font-bold"
        on:click={closeReportInfo}>✕</button
      >

      <p><strong>Name:</strong> {selectedReportInfo.report.name}</p>
      <p>
        <strong>Customized Name:</strong>
        {selectedReportInfo.report_customized_name}
      </p>
      <p>
        <strong>Description:</strong>
        {selectedReportInfo.report.description || "No description available"}
      </p>
    </div>
  {/if}
</div>
