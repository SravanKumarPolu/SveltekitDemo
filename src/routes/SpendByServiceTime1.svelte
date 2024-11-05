<script lang="ts">
  import { onMount } from "svelte";
  import * as echarts from "echarts";
  import { format, parseISO, getWeek } from "date-fns";
  import SpendByServiceTimeData from '$lib/SpendByServiceTime.json'; // Import JSON data

  // Directly assign JSON data to chartData
  let chartData = SpendByServiceTimeData.charts[0].chartData;

 

  let chart;
  let currentLevel = "month";
  let displayedData = [];

  function getMonthlyData(data) {
    const monthlyData = {};
    data.forEach(({ invoice_date, service, spend }) => {
      const month = format(parseISO(invoice_date), "yyyy-MM");
      if (!monthlyData[month]) monthlyData[month] = {};
      if (!monthlyData[month][service]) monthlyData[month][service] = 0;
      monthlyData[month][service] += spend;
    });
    return formatDataForChart(monthlyData);
  }

  function getWeeklyData(data, month) {
    const weeklyData = {};
    data.forEach(({ week_end_date, invoice_date, service, spend }) => {
      const monthFormatted = format(parseISO(invoice_date), "yyyy-MM");
      if (monthFormatted === month) {
        const week = `Week ${getWeek(parseISO(week_end_date))}`;
        if (!weeklyData[week]) weeklyData[week] = {};
        if (!weeklyData[week][service]) weeklyData[week][service] = 0;
        weeklyData[week][service] += spend;
      }
    });
    return formatDataForChart(weeklyData);
  }

  function getDailyData(data, week_end_date) {
    const dailyData = {};
    data.forEach(({ invoice_date, week_end_date: week, service, spend }) => {
      const formattedWeek = `Week ${getWeek(parseISO(week))}`;
      if (formattedWeek === week_end_date) {
        const day = format(parseISO(invoice_date), "yyyy-MM-dd");
        if (!dailyData[day]) dailyData[day] = {};
        if (!dailyData[day][service]) dailyData[day][service] = 0;
        dailyData[day][service] += spend;
      }
    });
    return formatDataForChart(dailyData);
  }

  function formatDataForChart(data) {
    const services = Array.from(new Set(chartData.map((d) => d.service)));

    const series = services.map((service) => ({
      name: service,
      type: "bar",
      stack: "Total",
      data: Object.entries(data).map(
        ([date, services]) => services[service] || 0,
      ),
    }));

    const xData = Object.keys(data);
    return { series, xData, services };
  }

  function drilldown(level, category) {
    if (level === "month") {
      displayedData = getWeeklyData(chartData, category);
      currentLevel = "week";
    } else if (level === "week") {
      displayedData = getDailyData(chartData, category);
      currentLevel = "day";
    }
    updateChart();
  }

  function goBack() {
    if (currentLevel === "day") {
      displayedData = getWeeklyData(
        chartData,
        displayedData.xData[0]?.split(" ")[1],
      );
      currentLevel = "week";
    } else if (currentLevel === "week") {
      displayedData = getMonthlyData(chartData);
      currentLevel = "month";
    }
    updateChart();
  }
  function updateChart() {
    const { series, xData, services } = displayedData;

    chart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend: { data: services },
      xAxis: { 
      type: 'category', 
      data: xData,
      axisLabel: { 
        rotate: 45, 
        interval: 0,
        formatter: (value) => {
          const date = new Date(value); // Assuming xData contains date values as strings or timestamps

          // Customize the format based on the level (month, week, day)
          if (currentLevel === 'month') {
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }); // e.g., Dec-24
          } else if (currentLevel === 'week') {
            return `Week ${getWeekNumber(date)} ${date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}`;
          } else if (currentLevel === 'day') {
            return date.toLocaleDateString('en-US', { weekday: 'short', year: '2-digit', month: 'short' }); // e.g., Fri 2024 Feb
          } else {
            return value; // Default to the original value if no format matches
          }
        }
      }
    },
      yAxis: { type: "value" },
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["line", "bar", "stack"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      series: series.map((s) => ({
        ...s,
        type: "bar", // Set the default type to 'bar'
        label: {
          show: true,
          position: "top",
          formatter: (params) => (params.value > 10000 ? params.value : ""), // Show labels only if value > 10000
        },
      })),
    });
  }


  // Helper function to get the week number
function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

  onMount(() => {
    displayedData = getMonthlyData(chartData);

    if (!chart) {
      chart = echarts.init(document.getElementById("chart"));
    }

    chart.on("click", (params) => {
      drilldown(currentLevel, params.name);
    });
    updateChart();
  });
</script>
<div class="ml-0 flex flex-col  border border-gray-600 rounded-lg mt-6 ">
  <div class="controls  flex items-center justify-between bg-base-200 p-4 shadow-md rounded-t-lg space-x-8">
    {#if currentLevel !== "month"}
      <button on:click={goBack}>Go Back</button>
    {/if}
    <span>Current Level: {currentLevel}</span>
  </div>
  <div id="chart" class="bg-base-100 rounded-b-lg border border-t-gray-400  " ></div>
</div>


<style>
  #chart { 
    height: 500px;
  }

</style>
