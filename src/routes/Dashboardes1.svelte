<script>
  import { onMount } from "svelte";
  import Sortable from "sortablejs";




  // State Variables
let newDashboardName = "";
let newChartName = "";
let selectedChartId = null;
let dashboards = [];
let charts = [];
let tempDashboardNames = {};
let tempChartNames = {};
let filteredDashboards = [];
let selectedDashboardId = null;
let searchDashboard = "";
let editingDashboards = false;
let showSuccess = false;
let showError = false;
let editingCharts = false;
let searchChart = "";




 
  

  // Load Initial Data with LocalStorage Integration
  const loadDashboardsAndCharts = () => {
    const savedDashboards = localStorage.getItem("dashboards");
    const savedCharts = localStorage.getItem("charts");

    dashboards = savedDashboards
      ? JSON.parse(savedDashboards)
      : [
          {
            id: 1,
            name: "Spend",
            charts: [103],
            icon: "DashboardIcon",
          },
          {
            id: 2,
            name: "ECharts",
            charts: [101],
            icon: "DashboardIcon",
          },
      
        ];

    charts = savedCharts
      ? JSON.parse(savedCharts)
      : [
          { id: 101, name: "Bar Chart", chartCustomizedName: "Custom Bar Chart" },
          { id: 102, name: "Line Chart", chartCustomizedName: "Custom Line Chart" },
          { id: 103, name: "Pie Chart", chartCustomizedName: "Custom Pie Chart" },
          { id: 104, name: "Scatter Plot", chartCustomizedName: "Custom Scatter Plot" },
          { id: 105, name: "Stacked Bar Chart", chartCustomizedName: "Custom Stacked Bar Chart" },
        ];
 
 
        filteredDashboards = [...dashboards];
dashboards.forEach((db) => (tempDashboardNames[db.id] = db.name));
charts.forEach(
  (chart) => (tempChartNames[chart.id] = chart.chartCustomizedName)
);
        };
// Save Dashboards and Charts to LocalStorage
const saveDashboardsToLocalStorage = () => {
  localStorage.setItem("dashboards", JSON.stringify(dashboards));
};

const saveChartsToLocalStorage = () => {
  localStorage.setItem("charts", JSON.stringify(charts));
};

// Initialize Sortable for dashboards list once
onMount(() => {
  loadDashboardsAndCharts();
  setTimeout(() => {
    const dashboardListElement = document.getElementById("dashboard-list");
    if (dashboardListElement) {
      new Sortable(dashboardListElement, {
        animation: 150,
        onEnd: (event) => {
          const [movedItem] = dashboards.splice(event.oldIndex, 1);
          dashboards.splice(event.newIndex, 0, movedItem);
          filteredDashboards = [...dashboards];
          saveDashboardsToLocalStorage(); // Save order change
        },
      });
    }
  });
});

// Reactively initialize Sortable on the charts list when selectedDashboardId changes
$: if (selectedDashboardId) {
  setTimeout(() => {
    const chartListElement = document.getElementById("chart-list");
    if (chartListElement) {
      new Sortable(chartListElement, {
        animation: 150,
        onEnd: (event) => {
          const selectedDashboard = dashboards.find(
            (d) => d.id === selectedDashboardId
          );
          if (selectedDashboard) {
            const [movedChart] = selectedDashboard.charts.splice(
              event.oldIndex,
              1
            );
            selectedDashboard.charts.splice(event.newIndex, 0, movedChart);
            saveDashboardsToLocalStorage(); // Save order change
          }
        },
      });
    }
  });
}


// Save Dashboard Changes
const saveAllDashboardChanges = () => {
  dashboards = dashboards.map((dashboard) => ({
    ...dashboard,
    name: tempDashboardNames[dashboard.id] || dashboard.name,
  }));
  editingDashboards = false;
  showSuccessNotification("Dashboard changes saved successfully.");
  saveDashboardsToLocalStorage();
};

// Cancel Dashboard Edit
const cancelDashboardEdit = () => {
  // Reset temp names to the original dashboard names
  dashboards.forEach((dashboard) => {
    tempDashboardNames = {
      ...tempDashboardNames,
      [dashboard.id]: dashboard.name,
    };
  });
  editingDashboards = false;
};

// Select a Dashboard
const selectDashboard = (dashboardId) => {
  selectedDashboardId = dashboardId;
  if (dashboardId == null) {
    filteredCharts = charts;
  } else {
    const selectedDashboard = dashboards.find(
      (dashboard) => dashboard.id === dashboardId
    );
    filteredCharts = selectedDashboard ? selectedDashboard.charts || [] : [];
  }
  searchChart = "";
};

// Filtered dashboards based on search input
$: filteredDashboards = dashboards.filter((dashboard) =>
  dashboard.name.toLowerCase().includes(searchDashboard.toLowerCase())
);

// Add New Dashboard with LocalStorage Update
const addDashboard = () => {
  if (!newDashboardName.trim()) return;
  const newDashboard = {
    id: Date.now(),
    name: newDashboardName.trim(),
    charts: [],
  };
  dashboards = [...dashboards, newDashboard];
  filteredDashboards = [...dashboards];
  newDashboardName = "";
  showSuccessNotification("Dashboard added successfully.");
  saveDashboardsToLocalStorage();
};

// Delete Dashboard with LocalStorage Update
const deleteDashboard = (dashboardId) => {
  const confirmed = confirm("Are you sure you want to delete this dashboard?");
  if (!confirmed) return;
  dashboards = dashboards.filter((dashboard) => dashboard.id !== dashboardId);
  filteredDashboards = [...dashboards];
  showSuccessNotification("Dashboard deleted successfully.");
  saveDashboardsToLocalStorage();
};


// Save Chart Changes
const saveAllChartChanges = () => {
  charts = charts.map((chart) => ({
    ...chart,
    chartCustomizedName: tempChartNames[chart.id] || chart.chartCustomizedName,
  }));
  editingCharts = false;
  showSuccessNotification("Chart changes saved successfully.");
  saveChartsToLocalStorage();
};

// Cancel Chart Edit
const cancelChartEdit = () => {
  // Reset temp names to original chart names
  charts.forEach((chart) => {
    tempChartNames = {
      ...tempChartNames,
      [chart.id]: chart.chartCustomizedName,
    };
  });
  editingCharts = false;
};

// Delete Chart with LocalStorage Update
const deleteChart = (chartId) => {
  const confirmed = confirm("Are you sure you want to delete this chart?");
  if (!confirmed) return;

  // Remove the chart from the charts array
  charts = charts.filter((chart) => chart.id !== chartId);

  // Remove the deleted chart from dashboards if linked
  dashboards = dashboards.map((dashboard) => ({
    ...dashboard,
    charts: dashboard.charts?.filter((id) => id !== chartId),
  }));

  showSuccessNotification("Chart deleted successfully.");
  saveChartsToLocalStorage();
  saveDashboardsToLocalStorage();
};


// Add a Selected Chart to the Current Dashboard
let selectedChartIds = []; // Store multiple selected chart IDs
let isDropdownOpen = false; // Toggle dropdown visibility
let inputTags = []; // Store selected chart names as tags

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
    (id) => charts.find((chart) => chart.id === id)?.chartCustomizedName
  );
  const uniqueTags = newTags.filter((tag) => !inputTags.includes(tag)); // Avoid duplicate tags

  inputTags = [...inputTags, ...uniqueTags]; // Add new tags to input field
  selectedChartIds = [...new Set([...selectedChartIds, ...selectedIds])]; // Keep unique chart IDs
};

// Remove a Tag from Input
const removeTag = (tag) => {
  const chartToRemove = charts.find(
    (chart) => chart.chartCustomizedName === tag
  );
  if (chartToRemove) {
    selectedChartIds = selectedChartIds.filter(
      (id) => id !== chartToRemove.id
    );
    inputTags = inputTags.filter((t) => t !== tag);
  }
};

// Add All Selected Charts to the Selected Dashboard
const addCharts = () => {
  if (selectedChartIds.length === 0) {
    showErrorNotification("Please select at least one chart.");
    return;
  }

  const dashboardIndex = dashboards.findIndex(
    (dashboard) => dashboard.id === selectedDashboardId
  );
  if (dashboardIndex === -1) {
    showErrorNotification("Please select a dashboard.");
    return;
  }

  const dashboard = dashboards[dashboardIndex];
  const existingCharts = new Set(dashboard.charts); // Use a Set for efficient lookups

  // Add only new chart IDs
  const newChartIds = selectedChartIds.filter(
    (id) => !existingCharts.has(id)
  );

  if (newChartIds.length === 0) {
    showErrorNotification(
      "All selected charts already exist in this dashboard."
    );
    return;
  }

  // Update the dashboard's charts
  dashboard.charts = [...dashboard.charts, ...newChartIds];

  // Update the dashboards array to trigger reactivity
  dashboards = [
    ...dashboards.slice(0, dashboardIndex),
    dashboard,
    ...dashboards.slice(dashboardIndex + 1),
  ];

  showSuccessNotification(`${newChartIds.length} chart(s) added successfully.`);
  saveDashboardsToLocalStorage();

  // Clear the input field and selected charts after adding
  selectedChartIds = [];
  inputTags = [];
  isDropdownOpen = false;
};

// Handle Clicks Outside the Dropdown
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

onMount(loadDashboardsAndCharts);


</script>

<!-- Page Layout -->
<div class="flex flex-col  md:flex-row gap-2 mt-2 py-4 ">
  <!-- Dashboards Column -->
<div class="w-full md:w-1/2 p-4 rounded-md shadow-md border border-gray-400">
  <div class="flex flex-col md:flex-row gap-2 justify-between items-center w-full">
    <h2 class="text-lg md:text-xl font-bold mb-2 md:mb-0">Dashboards</h2>
    <input
      type="text"
      placeholder="Search dashboards..."
      bind:value={searchDashboard}
      class="input input-bordered w-full md:w-[11rem] mb-4 md:mb-0 h-10 rounded-md shadow-lg"
    />
    <div class="w-full md:w-auto flex justify-center">
      {#if editingDashboards}
        <div class="flex gap-2 flex-col md:flex-row">
          <button class="btn btn-sm btn-outline" on:click={saveAllDashboardChanges}>
            Save
          </button>
          <button class="btn btn-sm btn-outline" on:click={cancelDashboardEdit}>
            Cancel
          </button>
        </div>
      {:else}
        <button
          class="btn btn-sm btn-outline"
          on:click={() => (editingDashboards = true)}
        >
          Edit
        </button>
      {/if}
    </div>
  </div>

  <div class="flex flex-col items-center md:flex-row gap-1 mt-4 m-1">
    <input
      type="text"
      placeholder="Enter new dashboard name..."
      bind:value={newDashboardName}
      class="input input-bordered h-10 w-full md:w-2/3 rounded-md shadow-lg"
    />
    <button class="btn btn-sm h-10 btn-secondary" on:click={addDashboard}>
      Add
    </button>
  </div>

  <!-- Dashboard List with SortableJS -->
  {#if filteredDashboards.length > 0}
    <div class="h-[32rem] md:h-[31rem] overflow-y-auto scrollbar scrollbar-thin">
      <ul id="dashboard-list" class="menu bg-base-100 rounded-md">
        {#each filteredDashboards as dashboard}
          <li class="py-1 flex flex-row items-center">
            {#if editingDashboards}
              <input
                type="text"
                bind:value={tempDashboardNames[dashboard.id]}
                class="input input-bordered flex-grow mr-2"
              />
            {:else}
              <button
                type="button"
                class={`btn-sm btn-ghost flex-grow flex justify-between items-center ${
                  selectedDashboardId === dashboard.id ? "bg-blue-100" : ""
                }`}
                on:click={() => selectDashboard(dashboard.id)}
              >
                <span class="truncate min-w-80 flex gap-1" title={dashboard.name}>
                  {dashboard.name}
                </span>
                <div class="flex gap-2">
                  <button class="ml-2 btn btn-sm btn-error" on:click={() => deleteDashboard(dashboard.id)}>
                    Delete
                  </button>
                </div>
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {:else}
    <p>No dashboards available.</p>
  {/if}
</div>


<!-- Charts Column -->
<div class="w-full md:w-1/2 p-4 border border-gray-500 rounded-lg shadow-lg relative">
  <div class="flex flex-col md:flex-row gap-2 justify-between items-center w-full">
    <h2 class="text-lg md:text-xl font-bold mb-2 md:mb-0">Charts</h2>
    <input
      type="text"
      placeholder="Search charts..."
      bind:value={searchChart}
      class="input input-bordered w-full md:w-[11rem] mb-4 md:mb-0 h-10 rounded-md shadow-lg"
    />
    <div class="w-full md:w-auto flex justify-center">
      {#if editingCharts}
        <div class="flex gap-2 flex-col md:flex-row">
          <button class="btn btn-sm btn-outline" on:click={saveAllChartChanges}>
            Save
          </button>
          <button class="btn btn-sm btn-outline" on:click={cancelChartEdit}>
            Cancel
          </button>
        </div>
      {:else}
        <button
          class="btn btn-sm btn-outline"
          on:click={() => (editingCharts = true)}
        >
          Edit
        </button>
      {/if}
    </div>
  </div>

  <div class="dropdown-container w-full md:w-full p-2 rounded-md relative">
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
          <span class="text-gray-400">Select charts...</span>
        {/if}
      </div>
      <button class="btn btn-sm h-10 btn-secondary" on:click={addCharts}>
        add
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
        {#each charts as chart (chart.id)}
          <option value={chart.id}>{chart.chartCustomizedName}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Charts Column for Selected Dashboard -->
  {#if selectedDashboardId}
    <div class="h-[32rem] md:h-[31rem] overflow-y-auto scrollbar scrollbar-thin">
      <h3 class="flex text-md font-semibold px-2 mb-2">
        Charts for Dashboard: {dashboards.find((d) => d.id === selectedDashboardId)?.name}
      </h3>

      <ul  id="chart-list" class="menu bg-base-100 rounded-box px-0">
        {#each dashboards.find((d) => d.id === selectedDashboardId)?.charts as chartId}
          <li class="py-1 p-0">
            {#if editingCharts}
              <input
                type="text"
                bind:value={tempChartNames[chartId]}
                class="input input-bordered flex-grow mr-2"
              />
            {:else}
              <div class="flex justify-between py-1">
                <span class="truncate w-72 flex gap-1">
               
                  {charts.find((c) => c.id === chartId)?.chartCustomizedName}
                </span>
                <div class="flex gap-2">
                  <button class="ml-2" on:click={() => deleteChart(chartId)}>
            dele
                  </button>
                </div>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {:else}
    <p>Select a dashboard to view its charts.</p>
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
