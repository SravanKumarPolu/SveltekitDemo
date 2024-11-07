<script>
  import { onMount } from "svelte";
  import Sortable from "sortablejs";
  import data from "$lib/dashboards.json"; // Import JSON file

  // State Variables
  let dashboards = [];
  let filteredDashboards = [];
  let tempDashboardNames = {};
  let newDashboardName = "";
  let searchDashboard = "";
  let editingDashboards = false;

  // Chart IDs State
  let selectedDashboardId = null;
  let chartIds = [];
  let tempChartIds = {};
  let newChartId = "";
  let editingChartIds = false;

  // Save dashboards and chart IDs to localStorage
  const saveDashboardsToLocalStorage = () => {
    localStorage.setItem("dashboards", JSON.stringify(dashboards));
  };

  // Load dashboards and chart IDs from localStorage
  const loadDashboardsFromLocalStorage = () => {
    const savedDashboards = localStorage.getItem("dashboards");
    if (savedDashboards) {
      dashboards = JSON.parse(savedDashboards);
      filteredDashboards = [...dashboards];
      dashboards.forEach((dashboard) => {
        tempDashboardNames[dashboard.id] = dashboard.name;
      });
    } else {
      transformData(); // Fallback to initial data if no localStorage data is found
    }
  };

  // Transform JSON data into usable format
  const transformData = () => {
    dashboards = data.dashboards[0].subitems.map((subitem, index) => ({
      id: index + 1,
      name: subitem.name,
      chartIds: subitem.chatIds || [],
    }));
    filteredDashboards = [...dashboards];
    dashboards.forEach((dashboard) => {
      tempDashboardNames[dashboard.id] = dashboard.name;
    });
  };

  // Load initial data
  onMount(() => {
    loadDashboardsFromLocalStorage();
    initializeSortable();
  });

  // Initialize Sortable for dashboards
  const initializeSortable = () => {
    const dashboardListElement = document.getElementById("dashboard-list");
    if (dashboardListElement) {
      new Sortable(dashboardListElement, {
        animation: 150,
        onEnd: (event) => {
          const [movedItem] = dashboards.splice(event.oldIndex, 1);
          dashboards.splice(event.newIndex, 0, movedItem);
          filteredDashboards = [...dashboards]; // Trigger reactivity
          saveDashboardsToLocalStorage(); // Save changes
        },
      });
    }
  };

  // Add a new dashboard
  const addDashboard = () => {
    if (!newDashboardName.trim()) return;
    dashboards = [
      ...dashboards,
      { id: Date.now(), name: newDashboardName.trim(), chartIds: [] },
    ];
    filteredDashboards = [...dashboards];
    newDashboardName = "";
    initializeSortable();
    saveDashboardsToLocalStorage(); // Save new dashboard
  };

  // Delete a dashboard
  const deleteDashboard = (dashboardId) => {
    if (confirm("Are you sure you want to delete this dashboard?")) {
      dashboards = dashboards.filter((dashboard) => dashboard.id !== dashboardId);
      filteredDashboards = [...dashboards];
      if (selectedDashboardId === dashboardId) {
        selectedDashboardId = null;
        chartIds = [];
      }
      initializeSortable();
      saveDashboardsToLocalStorage(); // Save changes
    }
  };

  // Save dashboard edits
  const saveAllDashboardChanges = () => {
    dashboards = dashboards.map((dashboard) => ({
      ...dashboard,
      name: tempDashboardNames[dashboard.id] || dashboard.name,
    }));
    editingDashboards = false;
    saveDashboardsToLocalStorage(); // Save changes
  };

  // Select a dashboard to view/edit its chart IDs
  const selectDashboard = (dashboardId) => {
    selectedDashboardId = dashboardId;
    const selectedDashboard = dashboards.find((dash) => dash.id === dashboardId);
    chartIds = selectedDashboard ? selectedDashboard.chartIds : [];
    tempChartIds = Object.fromEntries(chartIds.map((id) => [id, id])); // Initialize temp state
  };

  // Add a new chart ID
  const addChartId = () => {
    if (!newChartId.trim()) return;
    const selectedDashboard = dashboards.find((dash) => dash.id === selectedDashboardId);
    if (selectedDashboard) {
      selectedDashboard.chartIds = [...selectedDashboard.chartIds, newChartId.trim()];
      chartIds = [...selectedDashboard.chartIds];
      tempChartIds[newChartId.trim()] = newChartId.trim(); // Add to temp state
      newChartId = "";
      saveDashboardsToLocalStorage(); // Save changes
    }
  };

  // Delete a chart ID
  const deleteChartId = (chartId) => {
    const selectedDashboard = dashboards.find((dash) => dash.id === selectedDashboardId);
    if (selectedDashboard) {
      selectedDashboard.chartIds = selectedDashboard.chartIds.filter((id) => id !== chartId);
      chartIds = [...selectedDashboard.chartIds];
      saveDashboardsToLocalStorage(); // Save changes
    }
  };

  // Save chart ID edits
  const saveAllChartIdChanges = () => {
    const selectedDashboard = dashboards.find((dash) => dash.id === selectedDashboardId);
    if (selectedDashboard) {
      selectedDashboard.chartIds = Object.values(tempChartIds);
      chartIds = [...selectedDashboard.chartIds];
    }
    editingChartIds = false;
    saveDashboardsToLocalStorage(); // Save changes
  };

  // Cancel dashboard edits
  const cancelDashboardEdit = () => {
    dashboards.forEach((dashboard) => {
      tempDashboardNames[dashboard.id] = dashboard.name;
    });
    editingDashboards = false;
  };

  // Cancel chart ID edits
  const cancelChartIdEdit = () => {
    tempChartIds = Object.fromEntries(chartIds.map((id) => [id, id])); // Reset to original
    editingChartIds = false;
  };

  // Search filter for dashboards
  $: filteredDashboards = dashboards.filter((dashboard) =>
    dashboard.name.toLowerCase().includes(searchDashboard.toLowerCase())
  );
</script>

<!-- Layout -->
<div class="flex flex-col lg:flex-row gap-6 p-6">
  <!-- Dashboards Section -->
  <div class="w-full bg-base-100 shadow-md rounded-lg p-6">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <!-- Title -->
      <h2 class="text-2xl font-semibold text-gray-800">Dashboards</h2>
      
      <!-- Search Input -->
      <input
        type="text"
        placeholder="Search dashboards..."
        bind:value={searchDashboard}
        class="input input-bordered input-sm w-full md:w-auto"
      />
      
      <!-- Edit Mode Buttons -->
      {#if editingDashboards}
        <div class="flex gap-2">
          <button class="btn btn-sm btn-success" on:click={saveAllDashboardChanges}>Save</button>
          <button class="btn btn-sm btn-warning" on:click={cancelDashboardEdit}>Cancel</button>
        </div>
      {:else}
        <button class="btn btn-sm btn-primary" on:click={() => (editingDashboards = true)}>Edit</button>
      {/if}
    </div>

    <!-- Add New Dashboard -->
    <div class="mt-4 flex gap-2">
      <input
        type="text"
        placeholder="Enter new dashboard name..."
        bind:value={newDashboardName}
        class="input input-bordered input-sm flex-grow"
      />
      <button class="btn btn-sm btn-secondary" on:click={addDashboard}>Add</button>
    </div>

    <!-- Dashboard List -->
    <ul class="menu bg-base-200 mt-4 rounded-lg p-2">
      {#if filteredDashboards.length > 0}
        {#each filteredDashboards as dashboard}
          <li class="flex justify-between items-center gap-4 py-2 px-4 rounded-md hover:bg-base-300">
            {#if editingDashboards}
              <input
                type="text"
                bind:value={tempDashboardNames[dashboard.id]}
                class="input input-sm flex-grow"
              />
            {:else}
                 <div class="flex justify-between">
                  <span class="cursor-pointer text-sm font-medium text-gray-800 truncate flex-grow"
                  on:click={() => selectDashboard(dashboard.id)}
                  title={dashboard.name} >
               
                  {dashboard.name}
                </span>
                <button
                class="btn btn-xs btn-error"
                on:click={() => deleteDashboard(dashboard.id)}
              >
                Delete
              </button>
                 </div>
             
            {/if}
      
          </li>
        {/each}
      {:else}
        <p class="text-gray-500 text-center mt-4">No dashboards available.</p>
      {/if}
    </ul>
  </div>

  <!-- Chart IDs Section -->
  {#if selectedDashboardId}
    <div class="w-full bg-base-100 shadow-md rounded-lg p-6">
       <div class="flex justify-between">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Chart IDs</h3>
        {#if editingChartIds}
          <div class="flex gap-2 mb-4">
            <button class="btn btn-sm btn-success" on:click={saveAllChartIdChanges}>Save</button>
            <button class="btn btn-sm btn-warning" on:click={cancelChartIdEdit}>Cancel</button>
          </div>
        {:else}
          <button class="btn btn-sm btn-outline" on:click={() => (editingChartIds = true)}>Edit</button>
        {/if}
       </div>

      <ul class="mt-4 space-y-2">
        {#each chartIds as id}
          <li class="flex justify-between items-center">
            {#if editingChartIds}
              <input
                type="text"
                bind:value={tempChartIds[id]}
                class="input input-sm input-bordered flex-grow"
              />
            {:else}
              <span class="text-gray-800">{id}</span>
            {/if}
            <button
              class="btn btn-xs btn-error"
              on:click={() => deleteChartId(id)}
            >
              Delete
            </button>
          </li>
        {/each}
      </ul>

      <div class="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Add new Chart ID..."
          bind:value={newChartId}
          class="input input-sm input-bordered flex-grow"
        />
        <button class="btn btn-sm btn-secondary" on:click={addChartId}>Add</button>
      </div>
    </div>
  {/if}
</div>


<style>
  .btn {
    white-space: nowrap;
  }
</style>
