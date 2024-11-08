<script>
  import { onMount } from "svelte";

  // State Variables
  let newDashboardName = "";
  let selectedDashboardId = null;
  let selectedChartIds = [];
  let dashboards = [];
  let charts = [];
  let tempDashboardNames = {};
  let tempChartNames = {};
  let inputTags = [];
  let isDropdownOpen = false;
  let showSuccess = false;
  let showError = false;
  let filteredCharts = [];

  // Load dashboards and charts from localStorage
  const loadDashboardsAndCharts = () => {
    const savedDashboards = localStorage.getItem("dashboards");
    const savedCharts = localStorage.getItem("charts");

    dashboards = savedDashboards
      ? JSON.parse(savedDashboards)
      : [
          { id: 1, name: "Spend", charts: [103] },
          { id: 2, name: "ECharts", charts: [101] },
        ];

    charts = savedCharts
      ? JSON.parse(savedCharts)
      : [
          { id: 101, name: "Bar Chart", chartCustomizedName: "Custom Bar Chart" },
          { id: 102, name: "Line Chart", chartCustomizedName: "Custom Line Chart" },
          { id: 103, name: "Pie Chart", chartCustomizedName: "Custom Pie Chart" },
        ];

    dashboards.forEach((dash) => (tempDashboardNames[dash.id] = dash.name));
    charts.forEach((chart) => (tempChartNames[chart.id] = chart.chartCustomizedName));
  };

  // Save dashboards and charts to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem("dashboards", JSON.stringify(dashboards));
    localStorage.setItem("charts", JSON.stringify(charts));
  };

  // Add a new dashboard
  const addDashboard = () => {
    if (!newDashboardName.trim()) return;

    const newDashboard = {
      id: Date.now(),
      name: newDashboardName.trim(),
      charts: [],
    };

    dashboards = [...dashboards, newDashboard];
    newDashboardName = "";
    showNotification("Dashboard added successfully.", "success");
    saveToLocalStorage();
  };

  // Select a dashboard
  const selectDashboard = (dashboardId) => {
    selectedDashboardId = dashboardId;

    const selectedDashboard = dashboards.find((d) => d.id === selectedDashboardId);

    if (!selectedDashboard || !Array.isArray(selectedDashboard.charts)) {
      // If no valid dashboard or charts array, clear filteredCharts and return
      filteredCharts = [];
      return;
    }

    filteredCharts = selectedDashboard.charts
      .map((chartId) => charts.find((chart) => chart.id === chartId))
      .filter(Boolean); // Remove undefined values in case a chart is missing
  };

  // Add selected charts to the current dashboard
  const addCharts = () => {
    if (!selectedDashboardId) {
      showNotification("Please select a dashboard.", "error");
      return;
    }

    const dashboard = dashboards.find((d) => d.id === selectedDashboardId);
    if (!dashboard) return;

    const newChartIds = selectedChartIds.filter((id) => !dashboard.charts.includes(id));
    if (newChartIds.length === 0) {
      showNotification("Selected charts are already in the dashboard.", "error");
      return;
    }

    dashboard.charts = [...dashboard.charts, ...newChartIds];
    dashboards = [...dashboards];
    selectDashboard(selectedDashboardId); // Refresh charts for the selected dashboard
    inputTags = [];
    selectedChartIds = [];
    isDropdownOpen = false;
    showNotification(`${newChartIds.length} chart(s) added successfully.`, "success");
    saveToLocalStorage();
  };

  // Notifications
  const showNotification = (message, type) => {
    type === "success" ? (showSuccess = true) : (showError = true);
    console[type === "success" ? "log" : "error"](message);
    setTimeout(() => {
      showSuccess = false;
      showError = false;
    }, 3000);
  };

  // Dropdown logic for charts
  const toggleDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
  };

  const handleSelectChange = (event) => {
    const selectedIds = Array.from(event.target.selectedOptions).map((opt) => parseInt(opt.value));
    const newTags = selectedIds.map((id) => charts.find((chart) => chart.id === id)?.chartCustomizedName);
    const uniqueTags = newTags.filter((tag) => !inputTags.includes(tag));

    inputTags = [...inputTags, ...uniqueTags];
    selectedChartIds = [...new Set([...selectedChartIds, ...selectedIds])];
  };

  const removeTag = (tag) => {
    const chartToRemove = charts.find((chart) => chart.chartCustomizedName === tag);
    if (chartToRemove) {
      selectedChartIds = selectedChartIds.filter((id) => id !== chartToRemove.id);
      inputTags = inputTags.filter((t) => t !== tag);
    }
  };

  // Initialize data on component mount
  onMount(() => {
    loadDashboardsAndCharts();
  });
</script>

<!-- Layout -->
<div class="flex flex-col md:flex-row gap-4 py-4">
  <!-- Dashboards Column -->
  <div class="w-full md:w-1/2 p-4 border rounded-md">
    <div class="flex gap-2">
      <input
        type="text"
        bind:value={newDashboardName}
        placeholder="Enter new dashboard name..."
        class="input input-bordered w-full"
      />
      <button class="btn btn-primary" on:click={addDashboard}>Add</button>
    </div>

    <ul class="menu mt-4">
      {#each dashboards as dashboard}
        <li>
          <button
            class="btn btn-block"
            on:click={() => selectDashboard(dashboard.id)}
          >
            {dashboard.name}
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Charts Column -->
  <div class="w-full md:w-1/2 p-4 border rounded-md">
    <div>
      <div class="flex gap-2">
        <div class="input input-bordered w-full flex flex-wrap gap-2">
          {#each inputTags as tag}
            <span class="badge">{tag} <button on:click={() => removeTag(tag)}>✕</button></span>
          {/each}
        </div>
        <button class="btn btn-primary" on:click={addCharts}>Add Charts</button>
      </div>

      <select
        multiple
        class="select select-bordered mt-2 w-full"
        on:change={handleSelectChange}
      >
        {#each charts as chart}
          <option value={chart.id}>{chart.chartCustomizedName}</option>
        {/each}
      </select>
    </div>

    <div class="mt-4">
      <h3 class="text-lg font-semibold">
        {#if selectedDashboardId}
          Charts for "{dashboards.find((d) => d.id === selectedDashboardId)?.name}"
        {/if}
      </h3>

      <ul class="menu mt-2">
        {#each filteredCharts as chart}
          <li>
            <div class="flex justify-between">
              <span>{chart.chartCustomizedName}</span>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<style>
  .badge {
    background-color: #4a90e2;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 0.25rem;
  }
</style>
