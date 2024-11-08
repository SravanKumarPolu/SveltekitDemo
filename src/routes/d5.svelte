<script>
  import { onMount } from "svelte";
  import data from "$lib/dashboards.json";

  let newDashboardName = "";
  let dashboards = [];
  let charts = [];
  let selectedDashboardId = null;
  let selectedDashboardCharts = [];
  let selectedChartIds = [];
  let isDropdownOpen = false;
  let inputTags = [];

  // Load initial data
  const loadDashboardAndCharts = () => {
    const firstDashboard = data.dashboards[0];
    dashboards = firstDashboard.subitems.map((item, index) => ({
      id: index + 1,
      name: item.name,
      charts: item.charts || [], // Ensure charts exist as an array
    }));

    charts = firstDashboard.charts.map((chart) => ({
      id: chart.id,
      name: chart.name,
      chartCustomizedName: chart.chartCustomizedName,
    }));
  };

  // Add a new dashboard
  const addDashboard = () => {
    if (!newDashboardName.trim()) return;
    dashboards = [
      ...dashboards,
      { id: Date.now(), name: newDashboardName.trim(), charts: [] },
    ];
    newDashboardName = "";
  };

  // Delete a dashboard
  const deleteDashboard = (dashboardId) => {
    const confirmed = confirm("Are you sure you want to delete this dashboard?");
    if (!confirmed) return;
    dashboards = dashboards.filter((dashboard) => dashboard.id !== dashboardId);
    if (selectedDashboardId === dashboardId) {
      selectedDashboardId = null;
      selectedDashboardCharts = [];
    }
  };

  // Select a dashboard
  const selectDashboard = (dashboardId) => {
    selectedDashboardId = dashboardId;
    const dashboard = dashboards.find((d) => d.id === dashboardId);
    if (dashboard && Array.isArray(dashboard.charts)) {
      selectedDashboardCharts = dashboard.charts
        .map((id) => charts.find((c) => c.id === id))
        .filter((chart) => chart); // Filter out undefined charts
    } else {
      selectedDashboardCharts = [];
    }
  };

  // Add charts to a dashboard
  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  const handleSelectChange = (event) => {
    const selectedIds = Array.from(event.target.selectedOptions).map((option) =>
      parseInt(option.value)
    );
    const newTags = selectedIds.map(
      (id) => charts.find((chart) => chart.id === id)?.name
    );
    const uniqueTags = newTags.filter((tag) => !inputTags.includes(tag));

    inputTags = [...inputTags, ...uniqueTags];
    selectedChartIds = [...new Set([...selectedChartIds, ...selectedIds])];
  };

  const removeTag = (tag) => {
    const chartToRemove = charts.find((chart) => chart.name === tag);
    if (chartToRemove) {
      selectedChartIds = selectedChartIds.filter((id) => id !== chartToRemove.id);
      inputTags = inputTags.filter((t) => t !== tag);
    }
  };

  const addCharts = () => {
    if (selectedChartIds.length === 0) {
      alert("Please select at least one chart.");
      return;
    }

    const dashboard = dashboards.find((dash) => dash.id === selectedDashboardId);
    if (!dashboard) {
      alert("Please select a valid dashboard.");
      return;
    }

    const existingCharts = new Set(dashboard.charts || []);
    const newChartIds = selectedChartIds.filter((id) => !existingCharts.has(id));

    if (newChartIds.length === 0) {
      alert("All selected charts already exist in this dashboard.");
      return;
    }

    dashboard.charts = [...(dashboard.charts || []), ...newChartIds];
    dashboards = [...dashboards];
    selectDashboard(selectedDashboardId);

    selectedChartIds = [];
    inputTags = [];
    isDropdownOpen = false;
  };

  // Delete a chart
  const deleteChart = (chartId) => {
    const confirmed = confirm("Are you sure you want to delete this chart?");
    if (!confirmed) return;

    charts = charts.filter((chart) => chart.id !== chartId);
    dashboards = dashboards.map((dashboard) => ({
      ...dashboard,
      charts: (dashboard.charts || []).filter((id) => id !== chartId),
    }));

    if (selectedDashboardId) {
      selectDashboard(selectedDashboardId);
    }
  };

  onMount(loadDashboardAndCharts);
</script>

<div class="flex flex-col md:flex-row gap-2 mt-2 py-4">
  <!-- Dashboards Column -->
  <div class="w-full md:w-1/2 p-4 rounded-md shadow-md border border-gray-400">
    <h2 class="text-lg md:text-xl font-bold mb-2">Dashboards</h2>
    <div class="flex flex-col items-center md:flex-row gap-2 mt-4">
      <input
        type="text"
        placeholder="Enter new dashboard name..."
        bind:value={newDashboardName}
        class="input input-bordered h-10 w-full md:w-2/3 rounded-md"
      />
      <button class="btn btn-sm btn-secondary" on:click={addDashboard}>
        Add Dashboard
      </button>
    </div>
    <ul class="mt-4">
      {#each dashboards as dashboard}
        <li class="flex justify-between items-center py-2 border-b">
          <span class="cursor-pointer" on:click={() => selectDashboard(dashboard.id)}>
            {dashboard.name}
          </span>
          <button class="btn btn-sm btn-error" on:click={() => deleteDashboard(dashboard.id)}>
            Delete
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Charts Column -->
  <div class="w-full md:w-1/2 p-4 rounded-md shadow-md border border-gray-400">
    <h2 class="text-lg md:text-xl font-bold mb-2">Charts</h2>
    <div class="dropdown-container w-full md:w-full p-2 rounded-md relative">
      <div
        class="input input-bordered h-auto w-full md:w-2/3 rounded-md shadow-lg flex flex-wrap overflow-y-auto scrollbar scrollbar-thin items-start gap-2 p-2 cursor-pointer"
        on:click={toggleDropdown}
      >
        {#if inputTags.length > 0}
          {#each inputTags as tag}
            <div class="badge badge-xs badge-primary text-[9px] flex items-center gap-1 whitespace-nowrap">
              {tag}
              <button class="w-3 h-3 bg-error rounded-full" on:click={() => removeTag(tag)}>
                ✕
              </button>
            </div>
          {/each}
        {:else}
          <span class="text-gray-400">Select charts...</span>
        {/if}
      </div>
      <button class="btn btn-sm h-10 btn-secondary" on:click={addCharts}>
        Add
      </button>
    </div>

    <div
      class={`dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full mt-2 ${
        isDropdownOpen ? "block" : "hidden"
      }`}
    >
      <select multiple class="select select-bordered h-56 w-full" on:change={handleSelectChange}>
        {#each charts as chart (chart.id)}
          <option value={chart.id}>{chart.name}</option>
        {/each}
      </select>
    </div>

    {#if selectedDashboardId}
      <ul class="mt-4">
        <h3>Charts for Selected Dashboard:</h3>
        {#each selectedDashboardCharts as chart}
          <li class="flex justify-between items-center py-2 border-b">
            <span>{chart.name}</span>
            <button class="btn btn-sm btn-error" on:click={() => deleteChart(chart.id)}>
              Delete
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<style>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    background-color: #4a90e2;
    color: white;
    cursor: pointer;
  }
  .btn-error {
    background-color: #e74c3c;
  }
  .btn-secondary {
    background-color: #2ecc71;
  }
  .input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }
  .select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }
</style>
