<script>
  import * as echarts from 'echarts';
  import { onMount, onDestroy } from 'svelte';

  let chartInstance;
  export let chartData;

  // Options for grouping levels
  let groupingOptions = ['Quarter', 'Month', 'Week'];
  let selectedGrouping = 'Quarter'; // Default grouping
  let groupedData = {};

  // Layout options for the number of rows and columns per page
  let layoutOptions = ['1x3', '2x3', '3x4', '4x4','5x4','10x4'];
  let selectedLayout = '4x4'; // Default layout
  let currentPage = 1;
  let chartsPerPage = 12; // Default charts per page for 3x4 layout
  let totalPages = 1;

  const colorPalette = [
    '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC'
  ];

  // Group and aggregate data based on the selected grouping level
  const groupData = () => {
    groupedData = {}; // Reset grouped data

    chartData.forEach(item => {
      let key;
      if (selectedGrouping === 'Quarter') {
        key = item.quarter_year;
      } else if (selectedGrouping === 'Month') {
        key = item.month_year;
      } else if (selectedGrouping === 'Week') {
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

  // Update `chartsPerPage` based on the selected layout
  const updateLayout = () => {
    const [rows, cols] = selectedLayout.split('x').map(Number);
    chartsPerPage = rows * cols;
    groupData();
    renderChart();
  };

  // Sort keys based on grouping level in descending order
  const getSortedKeys = () => {
    const keys = Object.keys(groupedData);

    return keys.sort((a, b) => {
      if (selectedGrouping === 'Quarter' || selectedGrouping === 'Month') {
        const [aMonth, aYear] = a.split('-');
        const [bMonth, bYear] = b.split('-');

        return parseInt(bYear) - parseInt(aYear) || new Date(`1-${bMonth}-2000`) - new Date(`1-${aMonth}-2000`);
      } else if (selectedGrouping === 'Week') {
        return new Date(b) - new Date(a);
      }
      return 0;
    });
  };

  // Render the charts for the current page
  const renderChart = () => {
    if (chartInstance) {
      chartInstance.dispose();
    }

    chartInstance = echarts.init(document.getElementById('chartContainer'));

    const sortedKeys = getSortedKeys();
    const start = (currentPage - 1) * chartsPerPage;
    const end = start + chartsPerPage;
    const keysForPage = sortedKeys.slice(start, end);

    const [numRows, numCols] = selectedLayout.split('x').map(Number);

    const option = {
      color: colorPalette,
      tooltip: { trigger: 'item' },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        top: 'top',
        left: 'center',
        width: '100%',
        padding: [5, 5],
        itemWidth: 12,
        itemHeight: 8,
        textStyle: {
          fontSize: 9,
          overflow: 'break',
        }
      },
      title: keysForPage.map((key, index) => ({
        text: key,
        left: ((index % numCols) * 100 / numCols + 10) + '%',
        top: (Math.floor(index / numCols) * 100 / numRows + 5) + '%',
        textStyle: {
          fontSize: 10,
          fontWeight: 'bold'
        }
      })),
      series: keysForPage.map((key, index) => ({
        name: key,
        type: 'pie',
        radius: '14%',
        center: [
          ((index % numCols) * 100 / numCols + 12.5) + '%',
          (Math.floor(index / numCols) * 100 / numRows + 15) + '%'
        ],
        data: Object.entries(groupedData[key]).map(([service, spend]) => ({
          value: spend,
          name: service
        })),
        label: {
          show: true,
          formatter: '{b}: {d}%',
          fontSize: 8
        },
        labelLine: {
          show: true,
          length: 5,
          length2: 5
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        }
      })),
    };

    chartInstance.setOption(option);
  };

  const updateChart = () => {
    groupData();
    renderChart();
  };

  // Pagination controls
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
    updateLayout(); // Initialize with selected layout
  });

  onDestroy(() => {
    if (chartInstance) {
      chartInstance.dispose();
    }
  });
</script>

<style>
  #chartContainer {
    width: 100%;
    height: 800px;
    overflow-y: auto;
  }
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
  }
</style>

<!-- Dropdown to select grouping level -->
<label for="groupingLevel">Select Grouping Level: </label>
<select id="groupingLevel" bind:value={selectedGrouping} on:change={updateChart}>
  {#each groupingOptions as option}
    <option value={option}>{option}</option>
  {/each}
</select>

<!-- Dropdown to select layout -->
<label for="layoutSelection">Select Layout: </label>
<select id="layoutSelection" bind:value={selectedLayout} on:change={updateLayout}>
  {#each layoutOptions as option}
    <option value={option}>{option}</option>
  {/each}
</select>

<div id="chartContainer"></div>

<!-- Pagination controls -->
<div class="pagination">
  <button on:click={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
  <span>{currentPage} / {totalPages}</span>
  <button on:click={goToNextPage} disabled={currentPage === totalPages}>Next</button>
</div>
