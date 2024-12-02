<script>
  import { onMount } from "svelte";
  import Sortable from "sortablejs";
  import data from "$lib/dashboards.json";
  import { SortingIcon } from '$lib/SortorderIcon.js';
  let newDashboardName = "";
  let dashboards = [];
  let charts = [];
  let selectedDashboardId = null;
  let selectedDashboardCharts = [];
  let selectedChartIds = [];
  let isDropdownOpen = false;
  let inputTags = [];
  let editingDashboardId = null; // To track which dashboard is being edited
  let tempDashboardName = ""; // Temporary storage for the dashboard name being edited
  let editingChartId = null; // To track which chart is being edited
  let tempChartName = ""; // Temporary storage for the chart name being edited

  const LOCAL_STORAGE_KEY = "dashboard_data";

  // Load initial data
  const loadDashboardAndCharts = () => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      dashboards = parsedData.dashboards || [];
      charts = parsedData.charts || [];
    } else {
      resetToInitialData();
    }
  };

  // Save data to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ dashboards, charts }));
    alert("Data saved successfully!");
  };

  // Reset to the initial data from the JSON file
  const resetToInitialData = () => {
    if (!confirm("Are you sure you want to reset all data?")) return;

    const firstDashboard = data.dashboards[0];
    dashboards = firstDashboard.subitems.map((item, index) => ({
      id: index + 1,
      name: item.name,
      charts: item.charts || [],
    }));

    charts = firstDashboard.charts.map((chart) => ({
      id: chart.id,
      name: chart.name,
      chartCustomizedName: chart.chartCustomizedName,
    }));

    selectedDashboardId = null;
    selectedDashboardCharts = [];
    saveToLocalStorage();
  };

  // Discard changes
  const discardChanges = () => {
    if (!confirm("Are you sure you want to discard all unsaved changes?")) return;

    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      dashboards = parsedData.dashboards || [];
      charts = parsedData.charts || [];
    } else {
      resetToInitialData();
    }
    selectedDashboardId = null;
    selectedDashboardCharts = [];
  };

  // Add a new dashboard
  const addDashboard = () => {
    if (!newDashboardName.trim()) return;
    dashboards.push({ id: Date.now(), name: newDashboardName.trim(), charts: [] });
    newDashboardName = "";
    saveToLocalStorage();
  };

  // Delete a dashboard
  const deleteDashboard = (dashboardId) => {
    if (!confirm("Are you sure you want to delete this dashboard?")) return;
    dashboards = dashboards.filter((dashboard) => dashboard.id !== dashboardId);
    if (selectedDashboardId === dashboardId) {
      selectedDashboardId = null;
      selectedDashboardCharts = [];
    }
    saveToLocalStorage();
  };

  // Edit dashboard
  const editDashboard = (dashboardId) => {
    editingDashboardId = dashboardId;
    const dashboard = dashboards.find((d) => d.id === dashboardId);
    tempDashboardName = dashboard.name; // Store the current name
  };

  // Save changes to the dashboard name
  const saveDashboardEdit = () => {
    const dashboard = dashboards.find((d) => d.id === editingDashboardId);
    if (dashboard) {
      dashboard.name = tempDashboardName.trim();
      saveToLocalStorage();
    }
    editingDashboardId = null;
    tempDashboardName = "";
  };

  // Cancel dashboard edit
  const cancelDashboardEdit = () => {
    editingDashboardId = null;
    tempDashboardName = "";
  };

  // Toggle dropdown for charts
  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  // Handle selected charts
  const handleSelectChange = (event) => {
    const selectedIds = Array.from(event.target.selectedOptions).map((option) =>
      parseInt(option.value)
    );
    inputTags = [
      ...inputTags,
      ...selectedIds.map((id) => charts.find((chart) => chart.id === id)?.name).filter(Boolean),
    ];
    selectedChartIds = [...new Set([...selectedChartIds, ...selectedIds])];
  };

  const removeTag = (tag) => {
    const chart = charts.find((c) => c.name === tag);
    if (chart) {
      inputTags = inputTags.filter((t) => t !== tag);
      selectedChartIds = selectedChartIds.filter((id) => id !== chart.id);
    }
  };

  const addCharts = () => {
    if (!selectedChartIds.length) {
      alert("Please select at least one chart.");
      return;
    }

    const dashboard = dashboards.find((dash) => dash.id === selectedDashboardId);
    if (!dashboard) {
      alert("Please select a valid dashboard.");
      return;
    }

    const newChartIds = selectedChartIds.filter((id) => !(dashboard.charts || []).includes(id));
    if (!newChartIds.length) {
      alert("All selected charts already exist in this dashboard.");
      return;
    }

    dashboard.charts.push(...newChartIds);
    selectedChartIds = [];
    inputTags = [];
    isDropdownOpen = false;
    saveToLocalStorage();
    selectDashboard(selectedDashboardId);
  };

  // Delete a chart
  const deleteChart = (chartId) => {
    if (!confirm("Are you sure you want to delete this chart?")) return;

    charts = charts.filter((chart) => chart.id !== chartId);
    dashboards.forEach((dashboard) => {
      dashboard.charts = (dashboard.charts || []).filter((id) => id !== chartId);
    });

    if (selectedDashboardId) selectDashboard(selectedDashboardId);
    saveToLocalStorage();
  };

  // Edit chart
  const editChart = (chartId) => {
    editingChartId = chartId;
    const chart = charts.find((c) => c.id === chartId);
    tempChartName = chart.name; // Store the current name
  };

  // Save changes to the chart name
  const saveChartEdit = () => {
    const chart = charts.find((c) => c.id === editingChartId);
    if (chart) {
      chart.name = tempChartName.trim();
      saveToLocalStorage();
    }
    editingChartId = null;
    tempChartName = "";
  };

  // Cancel chart edit
  const cancelChartEdit = () => {
    editingChartId = null;
    tempChartName = "";
  };

  // Reset charts
  const resetCharts = () => {
    resetToInitialData(); // Resets both dashboards and charts
  };

  // Discard changes to charts
  const discardChartChanges = () => {
    discardChanges(); // Discards both dashboards and charts
  };

  // Select a dashboard
  const selectDashboard = (dashboardId) => {
    selectedDashboardId = dashboardId;
    const dashboard = dashboards.find((d) => d.id === dashboardId);
    selectedDashboardCharts = dashboard?.charts.map((id) => charts.find((c) => c.id === id)).filter(Boolean) || [];
    initializeChartSortable();
  };

  // Initialize SortableJS
  const initializeSortable = (id, items, onEnd) => {
    const element = document.getElementById(id);
    if (element) {
      Sortable.create(element, {
        animation: 150,
        onEnd,
      });
    }
  };

  const initializeDashboardSortable = () =>
    initializeSortable("dashboard-list", dashboards, (event) => {
      const [movedItem] = dashboards.splice(event.oldIndex, 1);
      dashboards.splice(event.newIndex, 0, movedItem);
      saveToLocalStorage();
    });

  const initializeChartSortable = () =>
    initializeSortable("chart-list", selectedDashboardCharts, (event) => {
      const dashboard = dashboards.find((d) => d.id === selectedDashboardId);
      if (dashboard) {
        const [movedChartId] = dashboard.charts.splice(event.oldIndex, 1);
        dashboard.charts.splice(event.newIndex, 0, movedChartId);
        saveToLocalStorage();
      }
    });

  onMount(() => {
    loadDashboardAndCharts();
    initializeDashboardSortable();
  });
</script>



<div class="flex flex-col md:flex-row gap-4 mt-4 py-6">
  <!-- Dashboard Management Column -->
  <div class="w-full md:w-2/3 p-6 bg-base-100 shadow-lg rounded-lg border border-gray-400">
    <div class="bg-base-100 p-4 shadow-md rounded-lg mb-6 flex flex-col gap-4">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-700">Manage Dashboards</h2>
        
        <!-- Reset and Discard Buttons -->
        <div class="flex gap-2">
          <button class="btn btn-warning btn-sm" on:click={resetToInitialData}>
            Reset
          </button>
          <button class="btn btn-error btn-sm" on:click={discardChanges}>
            Discard
          </button>
        </div>
      </div>
    </div>
    
   
    
  <!-- Add New Dashboard -->
<div class="form-control flex flex-row gap-2 items-center mb-6">
  <input
    type="text"
    placeholder="Enter new dashboard name..."
    bind:value={newDashboardName}
    class="input input-bordered flex-grow"
  />
  <button class="btn btn-primary flex items-center gap-2 px-4" on:click={addDashboard}>
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

    
    <!-- Dashboard List -->
    <ul id="dashboard-list" class="space-y-4 h-[32rem] md:h-[31rem] overflow-y-auto scrollbar scrollbar-thin">
      {#each dashboards as dashboard}
        <li class="bg-gray-50 rounded-lg p-4 flex items-center justify-between shadow-md">
          {#if editingDashboardId === dashboard.id}
            <input
              type="text"
              bind:value={tempDashboardName}
              class="input input-bordered flex-grow"
            />
            <div class="ml-4 flex gap-2">
              <button class="btn btn-sm btn-success" on:click={saveDashboardEdit}>
                Save
              </button>
              <button class="btn btn-sm btn-error" on:click={cancelDashboardEdit}>
                Cancel
              </button>
            </div>
          {:else}

          <div class=" flex gap-1 items-center">
         <span>{@html SortingIcon}</span>   
              <span
                class="font-medium cursor-pointer flex-grow"
                on:click={() => selectDashboard(dashboard.id)}
              >
                {dashboard.name}
              </span>
          </div>
         
            <div class="ml-4 flex gap-2">
              <button class="btn btn-sm btn-secondary" on:click={() => editDashboard(dashboard.id)}>
                Edit
              </button>
              <button class="" on:click={() => deleteDashboard(dashboard.id)}>
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
          {/if}
        </li>
      {/each}
    </ul>

   
  </div>

  <!-- Charts Column -->
  <div class="w-full md:w-2/3 p-6 bg-base-100 shadow-lg rounded-lg border border-gray-400">
    <div class="flex justify-between items-center bg-base-100 p-4 shadow-md rounded-lg mb-6">
      <h2 class="text-2xl font-bold text-gray-700">Charts</h2>
      
      <!-- Reset and Discard Buttons -->
      <div class="flex gap-2">
        <button class="btn btn-warning btn-sm" on:click={resetCharts}>
          Reset
        </button>
        <button class="btn btn-error btn-sm" on:click={discardChartChanges}>
          Discard
        </button>
      </div>
    </div>
    
    
 <!-- Dropdown to Select Charts -->
 <div class="form-control flex flex-row gap-2 items-center mb-6">
  <!-- Input and Tags Section -->
  <div
    class="input input-bordered  flex items-center flex-wrap gap-2  w-full cursor-pointer"
    on:click={toggleDropdown}
  >
    {#if inputTags.length > 0}
      {#each inputTags as tag}
        <div class="badge badge-primary flex items-center gap-2">
          {tag}
          <button
            class="btn btn-xs btn-error"
            on:click={() => removeTag(tag)}
          >
            ✕
          </button>
        </div>
      {/each}
    {:else}
      <span class="text-gray-400">Select charts...</span>
    {/if}
  </div>

  <!-- Add Button Section -->
  <button
   class="btn btn-primary flex items-center gap-2 px-4"
    on:click={addCharts}
  >
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


    <!-- Dropdown for Selecting Charts -->
    <div class={`dropdown-content menu mt-2 ${isDropdownOpen ? "block" : "hidden"}`}>
      <select
        multiple
        class="select select-bordered w-full h-56"
        on:change={handleSelectChange}
      >
        {#each charts as chart (chart.id)}
          <option value={chart.id}>{chart.name}</option>
        {/each}
      </select>
    </div>

  

    <!-- List of Charts for Selected Dashboard -->
    {#if selectedDashboardId}
      <ul id="chart-list" class="mt-6 space-y-4 h-[32rem] md:h-[31rem] overflow-y-auto scrollbar scrollbar-thin">
        <h3 class="text-md font-semibold mb-2">Charts for Selected Dashboard:</h3>
        {#each selectedDashboardCharts as chart}
          <li class="bg-gray-50 rounded-lg p-4 flex items-center justify-between shadow-md">
            {#if editingChartId === chart.id}
              <input
                type="text"
                bind:value={tempChartName}
                class="input input-bordered flex-grow"
              />
              <div class="ml-4 flex gap-2">
                <button class="btn btn-sm btn-success" on:click={saveChartEdit}>
                  Save
                </button>
                <button class="btn btn-sm btn-error" on:click={cancelChartEdit}>
                  Cancel
                </button>
              </div>
            {:else}
                       <div class=" flex items-center gap-1">
                        <span>{@html SortingIcon}</span>   
                          <span class="font-medium flex-grow">{chart.name}</span>
                       </div>
              <div class="ml-4 flex gap-2">
                <button class="btn btn-sm btn-secondary" on:click={() => editChart(chart.id)}>
                  Edit
                </button>
                <button class="" on:click={() => deleteChart(chart.id)}>
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
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

