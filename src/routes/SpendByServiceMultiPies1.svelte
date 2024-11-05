<script>
  import * as echarts from "echarts";
  import { onMount, onDestroy } from "svelte";
  import chartData from "$lib/SpendByServiceMultiPies.json";

  let chartInstance;

  // Options for grouping levels
  let groupingOptions = ["Quarter", "Month", "Week"];
  let selectedGrouping = "Quarter"; // Default grouping
  let groupedData = {};

  // Layout options for the number of rows and columns per page
  let layoutOptions = ["1x3", "2x3", "3x4", "4x4", "5x4"];
  let selectedLayout = "4x4"; // Default layout
  let currentPage = 1;
  let chartsPerPage = 12; // Default charts per page for 3x4 layout
  let totalPages = 1;

  const colorPalette = [
    "#5470C6",
    "#91CC75",
    "#FAC858",
    "#EE6666",
    "#73C0DE",
    "#3BA272",
    "#FC8452",
    "#9A60B4",
    "#EA7CCC",
  ];

  // Group and aggregate data based on the selected grouping level
  const groupData = () => {
    groupedData = {}; // Reset grouped data

    chartData.charts[0].chartData.forEach((item) => {
      let key;
      if (selectedGrouping === "Quarter") {
        key = item.quarter_year;
      } else if (selectedGrouping === "Month") {
        key = item.month_year;
      } else if (selectedGrouping === "Week") {
        key = item.week_end_date;
      }

      if (key) {
        if (!groupedData[key]) {
          groupedData[key] = {};
        }

        if (!groupedData[key][item.service]) {
          groupedData[key][item.service] = 0;
        }
        groupedData[key][item.service] += item.spend;
      }
    });

    const totalCharts = Object.keys(groupedData).length;
    totalPages = Math.ceil(totalCharts / chartsPerPage);
    currentPage = 1;
  };

  const updateLayout = () => {
    const [rows, cols] = selectedLayout.split("x").map(Number);
    chartsPerPage = rows * cols;
    groupData();
    renderChart();
  };

  const getSortedKeys = () => {
    const keys = Object.keys(groupedData);
    return keys.sort((a, b) => {
      if (selectedGrouping === "Quarter" || selectedGrouping === "Month") {
        const [aMonth, aYear] = a.split("-");
        const [bMonth, bYear] = b.split("-");
        return (
          parseInt(bYear) - parseInt(aYear) ||
          new Date(`1-${bMonth}-2000`) - new Date(`1-${aMonth}-2000`)
        );
      } else if (selectedGrouping === "Week") {
        return new Date(b) - new Date(a);
      }
      return 0;
    });
  };

  const renderChart = () => {
    if (chartInstance) {
      chartInstance.dispose();
    }

    chartInstance = echarts.init(document.getElementById("chartContainer"));

    const sortedKeys = getSortedKeys();
    const start = (currentPage - 1) * chartsPerPage;
    const end = start + chartsPerPage;
    const keysForPage = sortedKeys.slice(start, end);

    const [numRows, numCols] = selectedLayout.split('x').map(Number);
    const pieRadius = numRows === 5 && numCols <= 5 ? '10%' : (numRows > 5 || numCols > 5 ? '8.6%' : '14%');
  


    const option = {
      color: colorPalette,
      tooltip: { trigger: 'item' },
      legend: { type: 'scroll', orient: 'horizontal', top: 'top', left: 'center', width: '90%', padding: [5, 5], itemWidth: 28, itemHeight: 10, textStyle: { fontSize: 9, overflow: 'break' } },
      title: keysForPage.map((key, index) => ({ text: key, left: ((index % numCols) * 100 / numCols + 10) + '%', top: (Math.floor(index / numCols) * 100 / numRows + 5) + '%', textStyle: { fontSize: 10, fontWeight: 'bold' } })),
      series: keysForPage.map((key, index) => ({
        name: key,
        type: 'pie',
        radius: pieRadius,
        center: [((index % numCols) * 100 / numCols + 12.5) + '%', (Math.floor(index / numCols) * 100 / numRows + 15) + '%'],
        data: Object.entries(groupedData[key]).map(([service, spend]) => ({ value: spend, name: service })),
        label: { show: true, formatter: '{b}: {d}%', fontSize: 8 },
        labelLine: { show: true, length: 5, length2: 5 },
        emphasis: { itemStyle: { shadowBlur: 5, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.3)' } }
      })),
    };

    chartInstance.setOption(option);
  };

  const updateChart = () => {
    groupData();
    renderChart();
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      currentPage--;
      renderChart();
    }
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderChart();
    }
  };

  onMount(() => {
    updateLayout();
  });
  onDestroy(() => {
    if (chartInstance) {
      chartInstance.dispose();
    }
  });
</script>
<div class="ml-0 flex flex-col  border border-gray-600 rounded-lg mt-6 bg-base-200">
  <div class="flex items-center justify-between bg-base-200 p-4 shadow-md rounded-t-lg space-x-8">
    <!-- Grouping Level Selection -->
    <div class="flex items-center space-x-2">
      <label class="text-sm font-medium" for="groupingLevel">Select Grouping Level:</label>
      <select 
        id="groupingLevel" 
        bind:value={selectedGrouping} 
        on:change={updateChart} 
        class="select select-bordered select-sm max-w-xs"
      >
        {#each groupingOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
    
    <!-- Layout Selection -->
    <div class="flex items-center space-x-2">
      <label class="text-sm font-medium" for="layoutSelection">Select Layout:</label>
      <select 
        id="layoutSelection" 
        bind:value={selectedLayout} 
        on:change={updateLayout} 
        class="select select-bordered select-sm max-w-xs"
      >
        {#each layoutOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
  </div>
  
  
<div id="chartContainer" class="scrollbar scrollbar-thin bg-base-100 border border-t-gray-400  scrollbar-thumb-rounded scrollbar-thumb-gray-500">
  <!-- Chart content goes here -->
</div>

  <!-- Pagination Controls -->
  <div class="pagination flex justify-center border border-t-gray-400  items-center bg-base-200 rounded-b-lg gap-4 ">
    <button 
      on:click={goToPreviousPage} 
      disabled={currentPage === 1} 
      class=" btn-primary btn-sm"
    >
      Previous
    </button>
    <span class="text-sm font-medium">
      {currentPage} / {totalPages}
    </span>
    <button 
      on:click={goToNextPage} 
      disabled={currentPage === totalPages} 
      class=" btn-primary btn-sm"
    >
      Next
    </button>
  </div>
</div>

<style>
  #chartContainer {
    width: 100%;
    height: 800px;
    overflow-y: auto;
  }
</style>


