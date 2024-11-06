<script>
  import { onMount } from "svelte";
  import Sortable from "sortablejs";

  // State Variables
  let newCategoryName = "";
  let newReportName = "";
  let selectedReportId = null;
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

  // Load Initial Data with LocalStorage Integration
  const loadCategoriesAndReports = () => {
    const savedCategories = localStorage.getItem("categories");
    const savedReports = localStorage.getItem("reports");

    categories = savedCategories
      ? JSON.parse(savedCategories)
      : [
          { id: 1, name: "Sales Reports", reports: [101] },
          { id: 2, name: "Marketing Reports", reports: [102] },
        ];

    reports = savedReports
      ? JSON.parse(savedReports)
      : [
          {
            id: 101,
            name: "Sales Q1",
            reportCustomizedName: "Custom Sales Q1",
            description: "Quarterly sales report for Q1",
          },
          {
            id: 102,
            name: "Marketing Q1",
            reportCustomizedName: "Custom Marketing Q1",
            description: "Marketing analysis for Q1",
          },
          {
            id: 103,
            name: "Finance Q1",
            reportCustomizedName: "Custom Finance Q1",
            description: "Financial performance for Q1",
          },
          {
            id: 104,
            name: "HR Q1",
            reportCustomizedName: "Custom HR Q1",
            description: "HR data for Q1",
          },
          {
            id: 105,
            name: "IT Q1",
            reportCustomizedName: "Custom IT Q1",
            description: "IT infrastructure report for Q1",
          },
          {
            id: 106,
            name: "IT Q1",
            reportCustomizedName: "Report IT Q1",
            description: "IT infrastructure report for Q1",
          },
        ];

    filteredCategories = [...categories];
    categories.forEach((cat) => (tempCategoryNames[cat.id] = cat.name));
    reports.forEach(
      (rep) => (tempReportNames[rep.id] = rep.reportCustomizedName)
    );
  };

  // Save Categories and Reports to LocalStorage
  const saveCategoriesToLocalStorage = () => {
    localStorage.setItem("categories", JSON.stringify(categories));
  };

  const saveReportsToLocalStorage = () => {
    localStorage.setItem("reports", JSON.stringify(reports));
  };

  // Initialize Sortable for categories list once
  onMount(() => {
    loadCategoriesAndReports();
    setTimeout(() => {
      const categoryListElement = document.getElementById("category-list");
      if (categoryListElement) {
        new Sortable(categoryListElement, {
          animation: 150,
          onEnd: (event) => {
            const [movedItem] = categories.splice(event.oldIndex, 1);
            categories.splice(event.newIndex, 0, movedItem);
            filteredCategories = [...categories];
            saveCategoriesToLocalStorage(); // Save order change
          },
        });
      }
    });
  });

  // Reactively initialize Sortable on the reports list when selectedCategoryId changes
  $: if (selectedCategoryId) {
    setTimeout(() => {
      const reportListElement = document.getElementById("report-list");
      if (reportListElement) {
        new Sortable(reportListElement, {
          animation: 150,
          onEnd: (event) => {
            const selectedCategory = categories.find(
              (c) => c.id === selectedCategoryId
            );
            if (selectedCategory) {
              const [movedReport] = selectedCategory.reports.splice(
                event.oldIndex,
                1
              );
              selectedCategory.reports.splice(event.newIndex, 0, movedReport);
              saveCategoriesToLocalStorage(); // Save order change
            }
          },
        });
      }
    });
  }

  // Save Category Changes
  const saveAllCategoryChanges = () => {
    categories = categories.map((category) => ({
      ...category,
      name: tempCategoryNames[category.id] || category.name,
    }));
    editingCategories = false;
    showSuccessNotification("Category changes saved successfully.");
    saveCategoriesToLocalStorage();
  };

  // Cancel Category Edit
  const cancelCategoryEdit = () => {
    // Reset temp names to the original category names
    categories.forEach((category) => {
      tempCategoryNames = {
        ...tempCategoryNames,
        [category.id]: category.name,
      };
    });
    editingCategories = false;
  };

  const selectCategory = (categoryId) => {
    selectedCategoryId = categoryId;
    if (categoryId == null) {
      filteredReports = reports;
    } else {
      const selectedCategory = categories.find(
        (category) => category.id === categoryId
      );
      filteredReports = selectedCategory ? selectedCategory.reports || [] : [];
    }
    searchReport = "";
    selectedReportInfo = null;
  };

  // Filtered categories based on search input
  $: filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  // Add New Category with LocalStorage Update
  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory = {
      id: Date.now(),
      name: newCategoryName.trim(),
      reports: [],
    };
    categories = [...categories, newCategory];
    filteredCategories = [...categories];
    newCategoryName = "";
    showSuccessNotification("Category added successfully.");
    saveCategoriesToLocalStorage();
  };

  // Delete Category with LocalStorage Update
  const deleteCategory = (categoryId) => {
    const confirmed = confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;
    categories = categories.filter((category) => category.id !== categoryId);
    filteredCategories = [...categories];
    showSuccessNotification("Category deleted successfully.");
    saveCategoriesToLocalStorage();
  };

  // Save Report Changes
  const saveAllReportChanges = () => {
    reports = reports.map((report) => ({
      ...report,
      reportCustomizedName:
        tempReportNames[report.id] || report.reportCustomizedName,
    }));
    editingReports = false;
    showSuccessNotification("Report changes saved successfully.");
    saveReportsToLocalStorage();
  };

  // Cancel Report Edit
  const cancelReportEdit = () => {
    // Reset temp names to original report names
    reports.forEach((report) => {
      tempReportNames = {
        ...tempReportNames,
        [report.id]: report.reportCustomizedName,
      };
    });
    editingReports = false;
  };

  // Delete Report with LocalStorage Update
  const deleteReport = (reportId) => {
    const confirmed = confirm("Are you sure you want to delete this report?");
    if (!confirmed) return;

    reports = reports.filter((report) => report.id !== reportId);
    // Remove deleted report from categories if linked
    categories = categories.map((category) => ({
      ...category,
      reports: category.reports?.filter((id) => id !== reportId),
    }));
    showSuccessNotification("Report deleted successfully.");
    saveReportsToLocalStorage();
    saveCategoriesToLocalStorage();
  };

  // Add a Selected Report to the Current Category
  let selectedReportIds = []; // Store multiple selected report IDs
  let isDropdownOpen = false; // Toggle dropdown visibility
  let inputTags = []; // Store selected report names as tags

  // Toggle Dropdown Visibility
  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  // Handle Dropdown Selection Changes
  const handleSelectChange = (event) => {
    const selectedIds = Array.from(event.target.selectedOptions).map((option) =>
      parseInt(option.value)
    );
    const newTags = selectedIds.map(
      (id) => reports.find((report) => report.id === id)?.reportCustomizedName
    );
    const uniqueTags = newTags.filter((tag) => !inputTags.includes(tag)); // Avoid duplicate tags

    inputTags = [...inputTags, ...uniqueTags]; // Add new tags to input field
    selectedReportIds = [...new Set([...selectedReportIds, ...selectedIds])]; // Keep unique report IDs
  };

  // Remove a Tag from Input
  const removeTag = (tag) => {
    const reportToRemove = reports.find(
      (report) => report.reportCustomizedName === tag
    );
    if (reportToRemove) {
      selectedReportIds = selectedReportIds.filter(
        (id) => id !== reportToRemove.id
      );
      inputTags = inputTags.filter((t) => t !== tag);
    }
  };

  // Add All Selected Reports to the Selected Category
  const addReports = () => {
    if (selectedReportIds.length === 0) {
      showErrorNotification("Please select at least one report.");
      return;
    }

    const categoryIndex = categories.findIndex(
      (cat) => cat.id === selectedCategoryId
    );
    if (categoryIndex === -1) {
      showErrorNotification("Please select a category.");
      return;
    }

    const category = categories[categoryIndex];
    const existingReports = new Set(category.reports); // Use a Set for efficient lookups

    // Add only new report IDs
    const newReportIds = selectedReportIds.filter(
      (id) => !existingReports.has(id)
    );

    if (newReportIds.length === 0) {
      showErrorNotification(
        "All selected reports already exist in this category."
      );
      return;
    }

    // Update the category's reports
    category.reports = [...category.reports, ...newReportIds];

    // Update the categories array to trigger reactivity
    categories = [
      ...categories.slice(0, categoryIndex),
      category,
      ...categories.slice(categoryIndex + 1),
    ];

    showSuccessNotification(`${newReportIds.length} report(s) added successfully.`);
    saveCategoriesToLocalStorage();

    // Clear the input field and selected reports after adding
    selectedReportIds = [];
    inputTags = [];
    isDropdownOpen = false;
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
<div class="flex flex-col  md:flex-row gap-2 mt-2 py-4 ">
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
            <button class="btn btn-sm btn-outline" on:click={saveAllCategoryChanges}>
              Save
            </button>
            <button class="btn btn-sm btn-outline" on:click={cancelCategoryEdit}>
              Cancel
            </button>
          </div>
        {:else}
          <button
            class="btn btn-sm btn-outline"
            on:click={() => (editingCategories = true)}
          >
            Edit
          </button>
        {/if}
      </div>
    </div>

    <div class="flex flex-col items-center md:flex-row gap-1 mt-4 m-1">
      <input
        type="text"
        placeholder="Enter new category name..."
        bind:value={newCategoryName}
        class="input input-bordered h-10 w-full md:w-2/3 rounded-md shadow-lg"
      />
      <button class="btn btn-sm h-10 btn-secondary" on:click={addCategory}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="bi bi-plus-square"
          viewBox="0 0 16 16"
        >
          <path
            d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
          />
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
          />
        </svg>
      </button>
    </div>

    <!-- Category List with SortableJS -->
    {#if filteredCategories.length > 0}
      <div class="h-[32rem] md:h-[31rem] overflow-y-auto scrollbar scrollbar-thin">
        <ul id="category-list" class="menu bg-base-100 rounded-md">
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
                  class={`btn-sm btn-ghost flex-grow flex justify-between items-center ${
                    selectedCategoryId === category.id ? "bg-blue-100" : ""
                  }`}
                  on:click={() => selectCategory(category.id)}
                >
                  
                  <span class="truncate min-w-80 flex gap-1" title={category.name}>
                    <div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title">
                       
                        
                        <!-- Up arrow with more spacing from bars -->
                        <path d="M12 2L8 7H16L12 2Z" fill="currentColor"/>
                        
                        <!-- Three horizontal bars with further increased spacing -->
                        <rect x="6" y="8" width="12" height="2" rx="1" fill="currentColor"/>
                        <rect x="6" y="11" width="12" height="2" rx="1" fill="currentColor"/>
                        <rect x="6" y="14" width="12" height="2" rx="1" fill="currentColor"/>
                        
                        <!-- Down arrow with additional spacing from bars -->
                        <path d="M12 22L8 17.2H16L12 22Z" fill="currentColor"/>
                      </svg>
                      
                      
                      
                    </div>

                    {category.name}
                  </span>
                  <div class="flex gap-2">
                    <button class="ml-2" on:click={() => deleteCategory(category.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-trash3 text-error"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
                        />
                      </svg>
                    </button>
                  </div>
                </button>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {:else}
      <p>No categories available.</p>
    {/if}
  </div>

  <!-- Reports Column -->
  <div class="w-full md:w-1/2 p-4 border border-gray-500 rounded-lg shadow-lg relative">
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
            <button class="btn btn-sm btn-outline" on:click={saveAllReportChanges}>
              Save
            </button>
            <button class="btn btn-sm btn-outline" on:click={cancelReportEdit}>
              Cancel
            </button>
          </div>
        {:else}
          <button
            class="btn btn-sm btn-outline"
            on:click={() => (editingReports = true)}
          >
            Edit
          </button>
        {/if}
      </div>
    </div>

    <div class="dropdown-container w-full md:w-full p-2 rounded-md  relative">
      <!-- Input Field with Tags -->
      <div class="flex flex-col items-center md:flex-row gap-1 mt-4 m-1">
        <div
          class="input input-bordered h-auto w-full md:w-2/3 rounded-md shadow-lg flex flex-wrap overflow-y-auto scrollbar scrollbar-thin items-start gap-2 p-2 cursor-pointer"
          on:click={toggleDropdown}
        >
          {#if inputTags.length > 0}
            {#each inputTags as tag}
              <div
                class="badge badge-xs badge-primary text-[9px] flex items-center gap-1 whitespace-nowrap relative"
              >
                {tag}
                <button class="w-3 h-3 bg-error rounded-full" on:click={() => removeTag(tag)}>
                  ✕
                </button>
              </div>
            {/each}
          {:else}
            <span class="text-gray-400">Select reports...</span>
          {/if}
        </div>
        <button class="btn btn-sm h-10 btn-secondary" on:click={addReports}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-plus-square btn-secondary"
            viewBox="0 0 16 16"
          >
            <path
              d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
            />
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
            />
          </svg>
        </button>
      </div>

      <!-- Dropdown Menu -->
      <div
        class={`dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full mt-2 ${
          isDropdownOpen ? "block" : "hidden"
        }`}
      >
        <select
          multiple
          class="select select-bordered h-56 w-full"
          on:change={handleSelectChange}
        >
          {#each reports as report (report.id)}
            <option value={report.id}>{report.reportCustomizedName}</option>
          {/each}
        </select>
      </div>
    </div>

    <!-- Reports Column for Selected Category -->
    {#if selectedCategoryId}
      <div class="h-[32rem] md:h-[31rem] overflow-y-auto scrollbar scrollbar-thin">
        <h3 class="flex text-md font-semibold px-2 mb-2">
          Reports for Category: {categories.find((c) => c.id === selectedCategoryId)?.name}
        </h3>

        <ul id="report-list" class="menu bg-base-100 rounded-box px-0 ">
          {#each categories.find((c) => c.id === selectedCategoryId)?.reports as reportId}
            <li class=" py-1 p-0">
              {#if editingReports}
                <input
                  type="text"
                  bind:value={tempReportNames[reportId]}
                  class="input input-bordered flex-grow mr-2"
                />
              {:else}
                <div class="flex justify-between  py-1">
                 
                  <span class="truncate w-72 flex gap-1">
                    <div>
                  
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L9 5L10.5 6.5L12 5V9H14V5L15.5 6.5L17 5L14 2H12ZM12 22L15 19L13.5 17.5L12 19V15H10V19L8.5 17.5L7 19L10 22H12ZM2 12L5 15L6.5 13.5L5 12H9V10H5L6.5 8.5L5 7L2 10V12ZM22 12L19 9L17.5 10.5L19 12H15V14H19L17.5 15.5L19 17L22 14V12Z" fill="currentColor"/>
                      </svg>
                      
                    </div>
                    {reports.find((r) => r.id === reportId)?.reportCustomizedName}
                  </span>
                  <div class="flex gap-2">
                    <button class="ml-2" on:click={() => deleteReport(reportId)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-trash3 text-error"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
                        />
                      </svg>
                    </button>
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
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    background-color: #4a90e2;
    color: white;
  }
  .btn-circle {
    width: 1.5rem;
    height: 1.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: red;
    color: white;
    cursor: pointer;
  }
</style>
