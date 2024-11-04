<script>
  import * as echarts from "echarts";
  import { onMount } from "svelte";

  // Data passed to the component
  export let chartData;

  let chart;
  let currentLevel = "service";
  let currentService = null;
  let currentQuarterYear = null;

  // Dropdown state for selecting chart type
  let chartType = "pie";

  function groupDataBy(data, field, valueField) {
    return data.reduce((acc, item) => {
      const key = item[field];
      acc[key] = (acc[key] || 0) + item[valueField];
      return acc;
    }, {});
  }

  function getChartData() {
    if (currentLevel === "service") {
      return groupDataBy(chartData, "service", "spend");
    } else if (currentLevel === "quarter") {
      const filteredData = chartData.filter(
        (item) => item.service === currentService,
      );
      return groupDataBy(filteredData, "quarter_year", "spend");
    } else if (currentLevel === "month") {
      const filteredData = chartData.filter(
        (item) =>
          item.service === currentService &&
          item.quarter_year === currentQuarterYear,
      );
      return groupDataBy(filteredData, "month_year", "spend");
    }
  }

  function updateChart() {
    // Clear any previous chart settings to avoid conflicts
    chart.clear();

    const data = getChartData();
    const chartDataArray = Object.entries(data).map(([name, value]) => ({
      name,
      value,
    }));
    const xAxisData = chartDataArray.map((item) => item.name);
    const yAxisData = chartDataArray.map((item) => item.value);

    const titleMap = {
      service: "Spend by Service",
      quarter: `Spend for ${currentService} by Quarter`,
      month: `Spend for ${currentService} in ${currentQuarterYear} by Month`,
    };

    // Basic chart configuration
    let option = {
      title: { text: titleMap[currentLevel], left: "center" },
      tooltip: { trigger: "item" },
      legend: {
        show: true,
        orient: "vertical",
        right: "10%",
        top: "middle",
        data: chartDataArray.map((item) => item.name),
      },
      color: [
        "#5470C6",
        "#91CC75",
        "#FAC858",
        "#EE6666",
        "#73C0DE",
        "#3BA272",
        "#FC8452",
        "#9A60B4",
        "#EA7CCC",
        "#4A69BB",
        "#63A375",
        "#FFBA93",
        "#E15554",
        "#3D5A80",
        "#98C1D9",
        "#EE9B00",
        "#606C38",
        "#FFD60A",
      ],
    };

    switch (chartType) {
      case "pie":
        option.series = [
          {
            name: titleMap[currentLevel],
            type: "pie",
            center: ["20%", "50%"],
            radius: ["30%", "70%"],
            roseType: "radius",
            itemStyle: { borderRadius: 8, borderColor: "#fff", borderWidth: 1 },
            label: {
              show: true,
              position: "outside",
              formatter: function (params) {
                const formattedValue = Math.round(
                  params.value,
                ).toLocaleString();
                const formattedPercent = params.percent.toFixed(1);
                const position = params.percent > 5 ? "inside" : "outside";
                params.position = position;
                return position === "inside"
                  ? `${params.name}\n$${formattedValue}`
                  : `{b|${params.name}}\n$${formattedValue} (${formattedPercent}%)`;
              },
              rich: {
                b: { fontSize: 12, color: "#333", align: "center" },
              },
            },
            labelLine: {
              length: 25,
              length2: 15,
              smooth: true,
              maxSurfaceAngle: 45,
            },
            data: chartDataArray,
          },
        ];
        break;

      case "line":
        option.xAxis = {
          type: "category",
          data: xAxisData,
          axisLabel: { rotate: 45 },
        };
        option.yAxis = { type: "value" };
        option.series = [
          {
            name: titleMap[currentLevel],
            type: "line",
            data: yAxisData,
            smooth: true,
            label: { show: true, position: "top", formatter: "${c}" },
          },
        ];
        break;

      case "bar":
        option.xAxis = {
          type: "category",
          data: xAxisData,
          axisLabel: { rotate: 45 },
        };
        option.yAxis = { type: "value" };
        option.series = [
          {
            name: titleMap[currentLevel],
            type: "bar",
            data: yAxisData,
            label: { show: true, position: "top", formatter: "${c}" },
          },
        ];
        break;

      case "scatter":
        option.xAxis = { type: "category", data: xAxisData };
        option.yAxis = { type: "value" };
        option.series = [
          {
            name: titleMap[currentLevel],
            type: "scatter",
            data: chartDataArray.map((item) => [item.name, item.value]),
            symbolSize: 20,
          },
        ];
        break;

      case "area":
        option.xAxis = { type: "category", data: xAxisData };
        option.yAxis = { type: "value" };
        option.series = [
          {
            name: titleMap[currentLevel],
            type: "line",
            data: yAxisData,
            areaStyle: {},
            label: { show: true, position: "top", formatter: "${c}" },
          },
        ];
        break;

      case "radar":
        option.radar = {
          indicator: chartDataArray.map((item) => ({
            name: item.name,
            max: Math.max(...yAxisData) * 1.1,
          })),
        };
        option.series = [
          {
            name: titleMap[currentLevel],
            type: "radar",
            data: [{ value: yAxisData, name: titleMap[currentLevel] }],
          },
        ];
        break;

      case "funnel":
        option.series = [
          {
            name: titleMap[currentLevel],
            type: "funnel",
            left: "10%",
            top: 60,
            bottom: 60,
            width: "80%",
            min: 0,
            max: Math.max(...yAxisData) * 1.1,
            data: chartDataArray,
          },
        ];
        break;

      default:
        break;
    }

    chart.setOption(option);
  }

  function drillDown(params) {
    if (currentLevel === "service") {
      currentLevel = "quarter";
      currentService = params.name;
    } else if (currentLevel === "quarter") {
      currentLevel = "month";
      currentQuarterYear = params.name;
    }
    updateChart();
  }

  function resetChart() {
    currentLevel = "service";
    currentService = null;
    currentQuarterYear = null;
    updateChart();
  }

  function handleChartTypeChange(event) {
    chartType = event.target.value;
    updateChart();
  }

  onMount(() => {
    chart = echarts.init(document.getElementById("chart-container"));
    updateChart();

    chart.on("click", drillDown);
  });
</script>

<div style="display: flex; align-items: center; gap: 20px;">
  <label for="chartType">Chart Type:</label>
  <select id="chartType" on:change={handleChartTypeChange}>
    <option value="pie">Pie</option>
    <option value="line">Line</option>
    <option value="bar">Bar</option>
    <option value="scatter">Scatter</option>
    <option value="area">Area</option>
    <option value="radar">Radar</option>
    <option value="funnel">Funnel</option>
  </select>
</div>

<div
  id="chart-container"
  style="width: 100%; height: 500px; margin-top: 20px;"
></div>
{#if currentLevel !== "service"}
  <button on:click={resetChart}>Back</button>
{/if}
