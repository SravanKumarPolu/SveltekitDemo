<script>
	import Sortable from "sortablejs";
	import { onMount, onDestroy,afterUpdate } from "svelte";
	import { writable } from "svelte/store"; 
	 import reportsData from "$lib/2.json"
   import rep from "$lib/1.json"
	import {
		selectedReportStore,
	  selectedCustomersStore,
	  selectedCarriersStore,
	  selectedShippersStore,
	  selectedShipperGroupsStore,
	  selectedRunOptDisplayTypeStore,
	  selectedRunByOptionsStore,
	  selectedDateOptionStore,
	  selectedRollingPeriodStore,
	  lastDaysStore,
	  batchNumberStore,
	  selectedDateRangeStore,
	  selectedRunOptDisplayTextStore,
	  selectedCurrenciesStore,
	  selectedFilterFromDateStore,
	  selectedFilterToDateStore,
	} from "$lib/store";
  
	let reportDropDown = [];
	let selectedReport = "";
	let reportDetails = null;
	let reportColumnsBySections = {};
	let sortableColumnsBySections = {};
	let subtotalColumnsBySections = {};
	let criteriaColumnsBySections = {};
	let showCustomization = false;
	let activeCustomizationSection = null;
	let criteriaListBySection = {};
	let sortListBySection = {};
	let subtotalListBySection = {};
	let runCarriersTogether = false;
	let selectedRunOptDisplayType = "";
	let selectedRunByOptions = "";
	let selectedCustomers = [];
	let selectedCarriers = [];
	let selectedShipperGroups = [];
	let selectedShippers = [];
	let selectedDateOption = [];
	let selectedRollingPeriod = [];
	let formatId = "";
	let selectedLastDays = "";
	let fileName = writable("");
	let fileNameOptions = [
	  "$RUN_DATE$",
	  "$RUN_DATE_TIME$",
	  "$RUN_BY_OPT_NAME$",
	  "$DATE_RANGES$",
	  "$CUSTOMER_CODES$",
	  "$CUSTOMER_IDS$",
	  "$CUSTOMER_NAMES$",
	  "$CARRIER_NAMES$",
	];
  
	let showScheduler = false;
  
	let weekOption = "every_week";
	let dayOption = "monday";
  
	let monthOption = null;
	let monthSpecificDay = null;
	let weekOfMonth = null;
	let lastDaysDayOfWeek = null;
	let monthlyDayOfWeek = null;
	let quarterlyDayOfWeek = null;
	let quarterOption = null;
	let monthInQuarter = null;
	let weekInQuarter = null;
	let lastDaysOption = null;
	let lastDaysSpecificDay = null;
  
	let selectedDateRange = [];
	let selectedRunOptDisplayText = [];
	let selectedFilterFromDate = "";
	let selectedFilterToDate = "";
	const weekOptions = [
	  { value: "every_week", text: "Every Week" },
	  { value: "1st_week", text: "1st Week" },
	  { value: "2nd_week", text: "2nd Week" },
	  { value: "3rd_week", text: "3rd Week" },
	  { value: "4th_week", text: "4th Week" },
	];
  
	const dayOptions = [
	  { value: "sunday", text: "Sunday" },
	  { value: "monday", text: "Monday" },
	  { value: "tuesday", text: "Tuesday" },
	  { value: "wednesday", text: "Wednesday" },
	  { value: "thursday", text: "Thursday" },
	  { value: "friday", text: "Friday" },
	  { value: "saturday", text: "Saturday" },
	];
  
	const unsubscribe = selectedReportStore.subscribe((value) => {
	  selectedReport = value;
	  if (value) {
		fetchReportDetails(value);
	  }
	});
	onDestroy(unsubscribe);
  
	onMount(async () => {
	  try {
		const res = reportsData;
		reportDropDown = res.data || [];
	  } catch (error) {
		console.error("There was an error fetching the reports:", error.message);
	  }
	});
  
	async function fetchReportDetails(reportId) {
	  try {
		const res = rep;
		if (res) {
		  reportDetails = res;
		  fileName.set(
			reportDetails.report.name +
			  " $CUSTOMER_NAMES$ $CARRIER_NAMES$ $RUN_BY_OPT_NAME$ $DATE_RANGES$",
		  );
		  reportColumnsBySections = res.reportColumnsBySections || {};
		  sortableColumnsBySections = res.sortableColumnsBySections || {};
		  subtotalColumnsBySections = res.subtotalColumnsBySections || {};
		  criteriaColumnsBySections = res.criteriaColumnsBySections || {};
  
		  Object.keys(reportColumnsBySections).forEach((section) => {
			if (!criteriaListBySection[section]) {
			  criteriaListBySection[section] = [];
			}
			if (!sortListBySection[section]) {
			  sortListBySection[section] = [];
			}
			if (!subtotalListBySection[section]) {
			  subtotalListBySection[section] = [];
			}
		  });
  
		  // customers = res.data.customers || [];
		  //  carriers = res.data.carriers || [];
		  runCarriersTogether = Boolean(res?.report?.isRunCarriersTogether);
		  formatId = res.formats[0].id;
		} else {
		  console.error("Report data is empty.");
		}
	  } catch (error) {
		console.error(
		  `There was an error fetching the details for report ${reportId}:`,
		  error.message,
		);
	  }
	}
  
	$: if (selectedReport) {
	  fetchReportDetails(selectedReport);
	}
  
	function toggleCustomization() {
	  showCustomization = !showCustomization;
	}
  
	function toggleSection(section) {
	  if (activeCustomizationSection === section) {
		activeCustomizationSection = null;
	  } else {
		activeCustomizationSection = section;
	  }
	}
  
	function addCriteria(section) {
	  criteriaListBySection[section] = [
		...criteriaListBySection[section],
		{ id: Date.now(), column: "", condition: "=" },
	  ];
	}
  
	function removeCriteria(section, id) {
	  criteriaListBySection[section] = criteriaListBySection[section].filter(
		(c) => c.id !== id,
	  );
	}
  
	function addSort(section) {
	  sortListBySection[section] = [
		...sortListBySection[section],
		{ id: Date.now(), column: "", order: "ASC" },
	  ];
	}
  
	function removeSort(section, id) {
	  sortListBySection[section] = sortListBySection[section].filter(
		(s) => s.id !== id,
	  );
	}
  
	function addSubtotal(section) {
	  subtotalListBySection[section] = [
		...subtotalListBySection[section],
		{ id: Date.now(), column: "" },
	  ];
	}
  
	function removeSubtotal(section, id) {
	  subtotalListBySection[section] = subtotalListBySection[section].filter(
		(s) => s.id !== id,
	  );
	}
  
	function getConditionsForDataType(dataType) {
	  const conditions = {
		STRING: [
		  "=",
		  "<>",
		  "LIKE",
		  "NOT LIKE",
		  "STARTS WITH",
		  "ENDS WITH",
		  "CONTAINS",
		],
		NUMBER: ["=", "<>", "<", ">", "<=", ">="],
		DATE: ["=", "<>", "<", ">", "<=", ">=", "IN", "NOT IN"],
	  };
	  return conditions[dataType] || ["="];
	}
  
	let includedContainers = [];
	let excludedContainers = [];
  
	afterUpdate(() => {
	  Object.keys(reportColumnsBySections).forEach((section, index) => {
		const includedContainer = document.querySelector(
		  `[data-section-included="${section}"] .sortable-items`,
		);
		const excludedContainer = document.querySelector(
		  `[data-section-excluded="${section}"] .sortable-items`,
		);
  
		if (includedContainer && !Sortable.get(includedContainer)) {
		  Sortable.create(includedContainer, {
			group: `shared${section}`,
			animation: 150,
			handle: ".cursor-move",
			onEnd: () => updateLists(section),
		  });
		  includedContainers[index] = includedContainer;
		}
  
		if (excludedContainer && !Sortable.get(excludedContainer)) {
		  Sortable.create(excludedContainer, {
			group: `shared${section}`,
			animation: 150,
			handle: ".cursor-move",
			onEnd: () => updateLists(section),
		  });
		  excludedContainers[index] = excludedContainer;
		}
	  });
	});
  
	function updateLists(section) {
	  const includedContainer = includedContainers[section - 1];
	  const excludedContainer = excludedContainers[section - 1];
  
	  reportColumnsBySections[section].included = Array.from(
		includedContainer.children,
	  ).map((child) => {
		return {
		  id: parseInt(child.getAttribute("data-id")),
		  name: child.textContent.trim(),
		};
	  });
  
	  reportColumnsBySections[section].excluded = Array.from(
		excludedContainer.children,
	  ).map((child) => {
		return {
		  id: parseInt(child.getAttribute("data-id")),
		  name: child.textContent.trim(),
		};
	  });
	}
	$: userName =  "Guest";
	function appendToFileName(option) {
	  fileName.update((name) => `${name} ${option}`);
	}
  
	function resetSchedulerOptions() {
	  // Reset only scheduler related options
	  weekOption = null;
	  dayOption = null;
	  monthOption = null;
	  lastDaysSpecificDay = null;
	  monthSpecificDay = null;
	  weekOfMonth = null;
	  lastDaysDayOfWeek = null;
	  monthlyDayOfWeek = null;
	  quarterlyDayOfWeek = null;
	  quarterOption = null;
	  monthInQuarter = null;
	  weekInQuarter = null;
	  lastDaysOption = null;
	}
  
	function resetMonthOptions() {
	  // Reset only Month related options
	  weekOption = null;
	  dayOption = null;
	  lastDaysSpecificDay = null;
	  monthSpecificDay = null;
	  weekOfMonth = null;
	  lastDaysDayOfWeek = null;
	  monthlyDayOfWeek = null;
	  quarterlyDayOfWeek = null;
	  quarterOption = null;
	  monthInQuarter = null;
	  weekInQuarter = null;
	  lastDaysOption = null;
	}
  
	function resetLastDaysOptions() {
	  // Reset only scheduler related options
	  weekOption = null;
	  dayOption = null;
	  monthOption = null;
	  lastDaysSpecificDay = null;
	  monthSpecificDay = null;
	  weekOfMonth = null;
	  lastDaysDayOfWeek = null;
	  monthlyDayOfWeek = null;
	  quarterlyDayOfWeek = null;
	  quarterOption = null;
	  monthInQuarter = null;
	  weekInQuarter = null;
	}
  
	// Subscribe to the store
	$: selectedDateOptionStore.subscribe((value) => {
	  selectedDateOption = value;
	  resetSchedulerOptions();
	  console.log("Selected date option:", selectedDateOption);
	});
  
	// Subscribe to the store
	$: selectedRollingPeriodStore.subscribe((value) => {
	  selectedRollingPeriod = value;
	  resetSchedulerOptions();
	  console.log("Selected selectedRollingPeriod:", selectedRollingPeriod);
	});
  
	// Subscribe to the store
	$: selectedRunByOptionsStore.subscribe((value) => {
	  selectedRunByOptions = value;
	});
  
	// Subscribe to the selectedCustomersStore to automatically update
	$: selectedCustomersStore.subscribe((value) => {
	  selectedCustomers = value;
	});
	// Subscribe to the selectedCarriersStore to automatically update
	$: selectedCarriersStore.subscribe((value) => {
	  selectedCarriers = value;
	});
	// Subscribe to the selectedShippersStore to automatically update
	$: selectedShippersStore.subscribe((value) => {
	  selectedShippers = value;
	});
  
	// Subscribe to the selectedShipperGroupsStore to automatically update
	$: selectedShipperGroupsStore.subscribe((value) => {
	  selectedShipperGroups = value;
	});
  
	// Subscribe to the selectedShipperGroupsStore to automatically update
	selectedRunOptDisplayTextStore.subscribe((value) => {
	  selectedRunOptDisplayText = value;
	});
  
	// Subscribe to the selectedShipperGroupsStore to automatically update
	selectedFilterFromDateStore.subscribe((value) => {
	  selectedFilterFromDate = value;
	});
  
	// Subscribe to the selectedShipperGroupsStore to automatically update
	selectedFilterToDateStore.subscribe((value) => {
	  selectedFilterToDate = value;
	});
  
	// Subscribe to the selectedShipperGroupsStore to automatically update
	lastDaysStore.subscribe((value) => {
	  selectedLastDays = value;
	});
  
	console.log(
	  "============selectedRunOptDisplayText",
	  selectedRunOptDisplayText,
	);
  
	function handleMonthOptionChange(event) {
	  monthOption = event.target.value;
	  resetMonthOptions();
	  console.log("Selected month option:", monthOption);
	}
  
	function handleLastDaysOptionChange(event) {
	  lastDaysOption = event.target.value;
	  resetLastDaysOptions();
	  console.log("Selected last days option:", lastDaysOption);
	}
  
	// Add the handleSaveScheduler function
	async function handleSaveScheduler() {
	  await handleSubmit(true, false); // Pass true to indicate scheduler submission and false for template
	}
  
	// Add the handleSaveAsTemplate function
	async function handleSaveAsTemplate() {
	  await handleSubmit(false, true); // Pass false for scheduler submission and true to indicate template
	}
  
	// Add the handleRunReport function for running the report
	async function handleRunReport() {
	  await handleSubmit(false, false); // Ensure both flags are false for running the report
	}
  
	function formatDate(date) {
	  const year = date.getFullYear();
	  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
	  const day = String(date.getDate()).padStart(2, "0");
	  return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
	}
	// Modify handleSubmit to accept parameters
	async function handleSubmit(isScheduled = false, isTemplate = false) {
	  const postData = {
		reportId: selectedReport,
		includedColumns: parseColumns(reportColumnsBySections, "included"),
		excludedColumns: parseColumns(reportColumnsBySections, "excluded"),
		sortableColumns: parseSortColumns(sortListBySection),
		criteriaColumns: parseCriteriaColumns(criteriaListBySection),
		subtotalColumns: parseSubtotalColumns(subtotalListBySection),
		formatId: formatId,
  
		carrierIds: selectedCarriers,
		customerIds: selectedCustomers,
		selectedRunByOptions: selectedRunByOptions,
		runCarriersTogether,
		shipperGroupNames: selectedShipperGroups,
		shipperIds: selectedShippers,
		userName: userName,
		fileName: $fileName,
		dateOption: selectedDateOption,
		startDate: selectedFilterFromDate,
		endDate: selectedFilterToDate,
		rollingPeriod:
		  selectedDateOption === "RollingPeriod" ? selectedRollingPeriod : null,
		lastDays: selectedDateOption === "LastDays" ? selectedLastDays : null,
		batchNumber:
		  selectedRunOptDisplayType === "Multi Dropdown" ? batchNumber : null,
		weekOption,
		dayOption,
		monthOption,
		monthSpecificDay,
		weekOfMonth,
		lastDaysDayOfWeek,
		monthlyDayOfWeek,
		quarterlyDayOfWeek,
		quarterOption,
		monthInQuarter,
		weekInQuarter,
		lastDaysOption,
		lastDaysSpecificDay,
		isScheduled: !!isScheduled,
		isTemplate: !!isTemplate,
	  };
  
	  try {
		const response = await API.post("/submit-report/", postData);
		if (response.data.status === "success") {
		  console.log("Form submitted successfully:", response.data);
		} else {
		  console.error("Failed to submit form:", response.data);
		}
	  } catch (error) {
		console.error("Error submitting form:", error);
	  }
	}
  
	function parseColumns(columnsBySections, type) {
	  return Object.keys(columnsBySections).reduce((acc, section) => {
		acc[section] = (columnsBySections[section][type] || []).map((column) => {
		  return typeof column === "string" ? JSON.parse(column) : column; // Check if column is a string before parsing
		});
		return acc;
	  }, {});
	}
  
	function parseCriteriaColumns(criteriaListBySection) {
	  return Object.keys(criteriaListBySection).reduce((acc, section) => {
		acc[section] = criteriaListBySection[section].map((criteria) => {
		  return {
			...criteria,
			column:
			  typeof criteria.column === "string"
				? JSON.parse(criteria.column)
				: criteria.column, // Check if criteria.column is a string before parsing
		  };
		});
		return acc;
	  }, {});
	}
  
	function parseSortColumns(sortListBySection) {
	  return Object.keys(sortListBySection).reduce((acc, section) => {
		acc[section] = sortListBySection[section].map((sort) => {
		  return {
			...sort,
			column:
			  typeof sort.column === "string"
				? JSON.parse(sort.column)
				: sort.column, // Check if sort.column is a string before parsing
		  };
		});
		return acc;
	  }, {});
	}
  
	function parseSubtotalColumns(subtotalListBySection) {
	  return Object.keys(subtotalListBySection).reduce((acc, section) => {
		acc[section] = subtotalListBySection[section].map((subtotal) => {
		  return {
			...subtotal,
			column:
			  typeof subtotal.column === "string"
				? JSON.parse(subtotal.column)
				: subtotal.column, // Check if subtotal.column is a string before parsing
		  };
		});
		return acc;
	  }, {});
	}
  
	function toggleScheduler() {
	  showScheduler = !showScheduler;
	}
  
	onMount(() => {
	  return () => {
		unsubscribe();
	  };
	});
  </script>
  
  <div class="card shadow-lg p-2 rounded-lg mt-4">
	<!-- Form section with DaisyUI classes for spacing and responsiveness -->
	<form on:submit|preventDefault={handleRunReport} class="space-y-6">
	  <div class="card-body">
		<h2 class="card-title">Run Reports</h2>
  
		<div class="grid grid-cols-1 md:grid-cols-4 gap-5">
		  <!-- First Row with Select Inputs and Carriers -->
		  <select
			class="select select-primary w-full max-w-md"
			id="report-type"
			bind:value={selectedReport}
		  >
			<option disabled selected>Select Report</option>
			{#each reportDropDown as report}
			  <option value={report.id}>{report.name}</option>
			{/each}
		  </select>
  
		  <select
			class="select select-primary w-full max-w-xs"
			id="report-format"
			bind:value={formatId}
		  >
			<option disabled selected>Select a Format</option>
			{#if reportDetails}
			  {#each reportDetails.formats as format}
				<option value={format.id}>{format.name}</option>
			  {/each}
			{/if}
		  </select>
  
		  <div class="flex items-center space-x-2">
			<!-- Checkbox -->
			<div
			  class="form-check lg:tooltip"
			  data-tip="Run Selected Carriers Together"
			>
			  <input
				type="checkbox"
				class="checkbox checkbox-lg"
				id="runCarriersTogether"
				bind:checked={runCarriersTogether}
			  />
			</div>
		  </div>
		</div>
  
		<div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
		  <!-- Second Row with Filename Input and Add to Filename Dropdown -->
		  <div class="form-group flex-1">
			<input
			  type="text"
			  id="file-name"
			  bind:value={$fileName}
			  placeholder="Type here"
			  class="input input-bordered w-full max-w-lg"
			/>
		  </div>
  
		  <select
			class="select select-primary w-full max-w-xs"
			id="report-format"
			on:change={(e) => appendToFileName(e.target.value)}
		  >
			<option disabled selected>Add Details to File Name</option>
			{#each fileNameOptions as option}
			  <option value={option}>{option}</option>
			{/each}
		  </select>
		</div>
	  </div>
	  <div class="divider"></div>
  
	  <div class="flex flex-wrap justify-end space-x-2">
		<!-- Personalize Report Button -->
		<button
		  type="button"
		  class="btn btn-primary mt-1 flex items-center justify-center"
		  on:click={toggleCustomization}
		>
		  <svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 mr-2"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		  >
			<path
			  stroke-linecap="round"
			  stroke-linejoin="round"
			  stroke-width="2"
			  d="M5 12h14M7 16h10M9 8h6"
			/>
		  </svg>
		  Personalize Report
		</button>
  
		<!-- Schedule a Report Button -->
		<button
		  type="button"
		  class="btn btn-primary mt-1 flex items-center justify-center"
		  on:click={toggleScheduler}
		>
		  <svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 mr-2"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		  >
			<path
			  stroke-linecap="round"
			  stroke-linejoin="round"
			  stroke-width="2"
			  d="M8 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8zm4 0v2m0 4v6m4-6h2m-2 2h2m-8-2h2m-2 2h2m-2 2h2"
			/>
		  </svg>
		  Schedule a Report
		</button>
  
		<!-- Generate Report Button -->
		<button
		  class="btn btn-primary mt-1 flex items-center justify-center"
		  type="submit"
		>
		  Generate Report
		  <svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 ml-2"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		  >
			<path
			  stroke-linecap="round"
			  stroke-linejoin="round"
			  stroke-width="2"
			  d="M9 17v-2h6v2H9zM3 13h18M9 13V5h6v8H9zM5 11V7h14v4H5zM4 17h16a2 2 0 002-2v-2a2 2 0 00-2-2H4a2 2 0 00-2 2v2a2 2 0 002 2z"
			/>
		  </svg>
		</button>
  
		<!-- Save as Blueprint Button -->
		<button
		  class="btn btn-primary mt-1 flex items-center justify-center"
		  on:click={handleSaveAsTemplate}
		>
		  Save as Blueprint
		  <svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 ml-2"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		  >
			<path
			  stroke-linecap="round"
			  stroke-linejoin="round"
			  stroke-width="2"
			  d="M5 12l5 5L20 7"
			/>
		  </svg>
		</button>
	  </div>
  
	  {#if showCustomization}
		<div class="card bg-primary text-primary-content shadow-xl p-4">
		  <div class="card-body flex flex-row space-x-4">
			<!-- Flex container with row direction -->
			<button
			  type="button"
			  class="btn btn-secondary flex-1 flex items-center justify-center"
			  on:click={() => toggleSection("columns")}
			>
			  Include/Exclude Columns
			</button>
  
			<button
			  type="button"
			  class="btn btn-secondary flex-1 flex items-center justify-center"
			  on:click={() => toggleSection("criteria")}
			>
			  Criteria
			</button>
  
			<button
			  type="button"
			  class="btn btn-secondary flex-1 flex items-center justify-center"
			  on:click={() => toggleSection("sort")}
			>
			  Sort by Columns
			</button>
  
			<button
			  type="button"
			  class="btn btn-secondary flex-1 flex items-center justify-center"
			  on:click={() => toggleSection("subtotals")}
			>
			  Subtotals
			</button>
		  </div>
  
		  {#if activeCustomizationSection === "columns"}
			{#each Object.keys(reportColumnsBySections) as section, index}
			  <div class="flex justify-between mt-4">
				<div
				  class="w-1/2 p-4 border border-gray-300 rounded-lg mr-2"
				  data-section-included={section}
				>
				  <h3 class="text-lg font-bold mb-2">
					Included (Section {section})
				  </h3>
				  <div class="sortable-items">
					{#each reportColumnsBySections[section].included as item (item.id)}
					  <div
						class="p-2 mb-2 bg-gray-100 border border-gray-200 rounded cursor-move"
						data-id={item.id}
					  >
						{item.name}
					  </div>
					{/each}
				  </div>
				</div>
				<div
				  class="w-1/2 p-4 border border-gray-300 rounded-lg ml-2"
				  data-section-excluded={section}
				>
				  <h3 class="text-lg font-bold mb-2">
					Excluded (Section {section})
				  </h3>
				  <div class="sortable-items">
					{#each reportColumnsBySections[section].excluded as item (item.id)}
					  <div
						class="p-2 mb-2 bg-gray-100 border border-gray-200 rounded cursor-move"
						data-id={item.id}
					  >
						{item.name}
					  </div>
					{/each}
				  </div>
				</div>
			  </div>
			{/each}
		  {/if}
  
		  <!-- Criteria Section -->
		  {#if activeCustomizationSection === "criteria"}
			{#each Object.keys(criteriaColumnsBySections) as section, index}
			  <div class="mb-6 p-4 bg-base-100 rounded-lg shadow-lg">
				<h3 class="text-lg font-bold mb-4 text-secondary">
				  Criteria (Section {section})
				</h3>
  
				<!-- Loop through criteria -->
				{#each criteriaListBySection[section] as criteria (criteria.id)}
				  <div class="criteria-row space-x-4 mb-4 flex items-center">
					<select
					  bind:value={criteria.column}
					  class="select select-bordered w-full"
					>
					  {#each criteriaColumnsBySections[section].included.filter((col) => col.isCriteriaSelectable) as column}
						<option value={JSON.stringify(column)}>
						  {column.name}
						</option>
					  {/each}
					</select>
  
					{#if criteria.column}
					  <select
						bind:value={criteria.condition}
						class="select select-bordered w-full"
					  >
						{#each getConditionsForDataType(JSON.parse(criteria.column).dataType) as condition}
						  <option value={condition}>{condition}</option>
						{/each}
					  </select>
					{/if}
  
					<input
					  type="text"
					  bind:value={criteria.value}
					  placeholder="value*"
					  class="input input-bordered w-full"
					/>
  
					<div class="form-control">
					  <label class="cursor-pointer label">
						<span class="label-text">Match Case</span>
						<input
						  type="checkbox"
						  bind:checked={criteria.matchCase}
						  class="checkbox checkbox-secondary"
						/>
					  </label>
					</div>
  
					<select
					  bind:value={criteria.logicalOperator}
					  class="select select-bordered w-full"
					>
					  <option value="AND">AND</option>
					  <option value="OR">OR</option>
					</select>
  
					<button
					  type="button"
					  on:click={() => removeCriteria(section, criteria.id)}
					  class="btn btn-error btn-sm ml-2"
					>
					  Remove
					</button>
				  </div>
				{/each}
  
				<!-- Add Criteria Button (Small, Right-Aligned) -->
				<div class="flex justify-end">
				  <button
					type="button"
					on:click={() => addCriteria(section)}
					class="btn btn-success btn-sm"
				  >
					Add Criteria
				  </button>
				</div>
			  </div>
			{/each}
		  {/if}
  
		  {#if activeCustomizationSection === "sort"}
			{#each Object.keys(sortableColumnsBySections) as section, index}
			  <div class="mb-6 p-4 bg-base-100 rounded-lg shadow-lg">
				<h3 class="text-lg font-bold mb-4 text-secondary">
				  Sort by Columns (Section {section})
				</h3>
  
				<!-- Loop through sort list -->
				{#each sortListBySection[section] as sort (sort.id)}
				  <div class="sort-row space-x-4 mb-4 flex items-center">
					<select
					  bind:value={sort.column}
					  class="select select-bordered w-full"
					>
					  {#each sortableColumnsBySections[section].included.filter((col) => col.isSortable) as column}
						<option value={JSON.stringify(column)}>
						  {column.name}
						</option>
					  {/each}
					</select>
  
					{#if sort.column}
					  <select
						bind:value={sort.order}
						class="select select-bordered w-full"
					  >
						<option value="ASC">Ascending</option>
						<option value="DESC">Descending</option>
					  </select>
					{/if}
  
					<button
					  type="button"
					  on:click={() => removeSort(section, sort.id)}
					  class="btn btn-error btn-sm ml-2"
					>
					  Remove
					</button>
				  </div>
				{/each}
  
				<!-- Add Sort Button (Small, Right-Aligned) -->
				<div class="flex justify-end">
				  <button
					type="button"
					on:click={() => addSort(section)}
					class="btn btn-success btn-sm"
				  >
					Add Sort
				  </button>
				</div>
			  </div>
			{/each}
		  {/if}
  
		  {#if activeCustomizationSection === "subtotals"}
			{#each Object.keys(subtotalColumnsBySections) as section, index}
			  <div class="mb-6 p-4 bg-base-100 rounded-lg shadow-lg">
				<h3 class="text-lg font-bold mb-4 text-secondary">
				  Subtotals (Section {section})
				</h3>
  
				<!-- Loop through subtotals list -->
				{#each subtotalListBySection[section] as subtotal (subtotal.id)}
				  <div class="subtotal-row space-x-4 mb-4 flex items-center">
					<select
					  bind:value={subtotal.column}
					  class="select select-bordered w-full"
					>
					  {#each subtotalColumnsBySections[section].included.filter((col) => col.isSubtotable) as column}
						<option value={JSON.stringify(column)}>
						  {column.name}
						</option>
					  {/each}
					</select>
  
					<button
					  type="button"
					  on:click={() => removeSubtotal(section, subtotal.id)}
					  class="btn btn-error btn-sm ml-2"
					>
					  Remove
					</button>
				  </div>
				{/each}
  
				<!-- Add Subtotal Button (Small, Right-Aligned) -->
				<div class="flex justify-end">
				  <button
					type="button"
					on:click={() => addSubtotal(section)}
					class="btn btn-success btn-sm"
				  >
					Add Subtotal
				  </button>
				</div>
			  </div>
			{/each}
		  {/if}
		</div>
	  {/if}
  
	  {#if showScheduler}
		<div class="card bg-primary text-primary-content shadow-xl p-4">
		  <div class="card-body">
			{#if selectedDateOption === "RollingPeriod" && (selectedRollingPeriod === "current_week" || selectedRollingPeriod === "previous_week")}
			  <div class="flex items-center space-x-4">
				<p class="text-lg font-semibold">
				  You are scheduling the report for
				</p>
  
				<select
				  bind:value={weekOption}
				  class="select select-primary w-full max-w-xs"
				>
				  {#each weekOptions as { value, text }}
					<option {value}>{text}</option>
				  {/each}
				</select>
  
				<p class="text-lg font-semibold">on</p>
  
				<select
				  bind:value={dayOption}
				  class="select select-primary w-full max-w-xs"
				>
				  {#each dayOptions as { value, text }}
					<option {value}>{text}</option>
				  {/each}
				</select>
			  </div>
			{/if}
			{#if selectedDateOption === "RollingPeriod" && (selectedRollingPeriod === "current_month" || selectedRollingPeriod === "previous_month")}
			  <div class="flex items-center space-x-4">
				<p class="text-lg font-semibold">
				  You are scheduling the report for
				</p>
  
				<!-- Dropdown for month options -->
				<div class="form-control w-auto">
				  <select
					bind:value={monthOption}
					class="select select-primary w-full max-w-xs"
					on:change={handleMonthOptionChange}
				  >
					<option value="first_day">First Day of Month</option>
					<option value="last_day">Last Day of Month</option>
					<option value="specific_day">Specific Date</option>
					<option value="week_of_month">Specific Week of</option>
				  </select>
				</div>
  
				<!-- If the Specific Date option is selected -->
				{#if monthOption === "specific_day"}
				  <p class="text-lg font-semibold">on the</p>
				  <input
					type="number"
					id="specific-day"
					bind:value={monthSpecificDay}
					class="input input-bordered w-auto"
					placeholder="Date"
					min="2"
					max="28"
				  />
				  <p class="text-lg font-semibold">of every month.</p>
				{/if}
  
				<!-- If the Specific Week of option is selected -->
				{#if monthOption === "week_of_month"}
				  <p class="text-lg font-semibold">on the</p>
				  <div class="form-control w-auto">
					<select
					  id="week-of-month"
					  bind:value={weekOfMonth}
					  class="select select-primary w-full max-w-xs"
					>
					  <option value="first_week">First Week</option>
					  <option value="second_week">Second Week</option>
					  <option value="third_week">Third Week</option>
					  <option value="fourth_week">Fourth Week</option>
					</select>
				  </div>
				  <p class="text-lg font-semibold">on</p>
				  <div class="form-control w-auto">
					<select
					  id="day-of-week"
					  bind:value={monthlyDayOfWeek}
					  class="select select-primary w-full max-w-xs"
					>
					  <option value="sunday">Sunday</option>
					  <option value="monday">Monday</option>
					  <option value="tuesday">Tuesday</option>
					  <option value="wednesday">Wednesday</option>
					  <option value="thursday">Thursday</option>
					  <option value="friday">Friday</option>
					  <option value="saturday">Saturday</option>
					</select>
				  </div>
				  <p class="text-lg font-semibold">of every month.</p>
				{/if}
			  </div>
			{/if}
  
			{#if selectedDateOption === "RollingPeriod" && (selectedRollingPeriod === "current_quarter" || selectedRollingPeriod === "previous_quarter")}
			  <div class="flex items-center space-x-2">
				<p class="text-lg font-semibold">
				  You are scheduling the report for the
				</p>
  
				<!-- Select Quarter -->
				<div class="form-control w-auto">
				  <select
					bind:value={quarterOption}
					class="select select-primary w-full max-w-xs"
				  >
					<option value="Q1">1st Quarter</option>
					<option value="Q2">2nd Quarter</option>
					<option value="Q3">3rd Quarter</option>
					<option value="Q4">4th Quarter</option>
				  </select>
				</div>
  
				<p class="text-lg font-semibold">of the year, in</p>
  
				<!-- Select Month within Quarter -->
				<div class="form-control w-auto">
				  <select
					bind:value={monthInQuarter}
					class="select select-primary w-full max-w-xs"
				  >
					<option value="1">First Month</option>
					<option value="2">Second Month</option>
					<option value="3">Third Month</option>
				  </select>
				</div>
  
				<p class="text-lg font-semibold">during the</p>
  
				<!-- Select Week within Quarter -->
				<div class="form-control w-auto">
				  <select
					bind:value={weekInQuarter}
					class="select select-primary w-full max-w-xs"
				  >
					<option value="1">First Week</option>
					<option value="2">Second Week</option>
					<option value="3">Third Week</option>
					<option value="4">Fourth Week</option>
				  </select>
				</div>
  
				<p class="text-lg font-semibold">on</p>
  
				<!-- Select Day of the Week -->
				<div class="form-control w-auto">
				  <select
					bind:value={quarterlyDayOfWeek}
					class="select select-primary w-full max-w-xs"
				  >
					<option value="sunday">Sunday</option>
					<option value="monday">Monday</option>
					<option value="tuesday">Tuesday</option>
					<option value="wednesday">Wednesday</option>
					<option value="thursday">Thursday</option>
					<option value="friday">Friday</option>
					<option value="saturday">Saturday</option>
				  </select>
				</div>
  
				<p class="text-lg font-semibold">of every month.</p>
			  </div>
			{/if}
  
			{#if selectedDateOption === "LastDays"}
			  <div class="flex items-center space-x-4">
				<p class="text-lg font-semibold">
				  You are scheduling the report for the
				</p>
  
				<!-- Last Days Option -->
				<div class="form-control w-auto">
				  <select
					id="last-days-option"
					bind:value={lastDaysOption}
					on:change={handleLastDaysOptionChange}
					class="select select-primary w-full max-w-xs"
				  >
					<option value="every_day">Every Day</option>
					<option value="every_week">Every Week</option>
					<option value="every_month">Every Month</option>
				  </select>
				</div>
  
				<!-- Additional Options for Every Week -->
				{#if lastDaysOption === "every_week"}
				  <p class="text-lg font-semibold">on</p>
				  <div class="form-control w-auto">
					<select
					  id="day-of-week"
					  bind:value={lastDaysDayOfWeek}
					  class="select select-primary w-full max-w-xs"
					>
					  <option value="sunday">Sunday</option>
					  <option value="monday">Monday</option>
					  <option value="tuesday">Tuesday</option>
					  <option value="wednesday">Wednesday</option>
					  <option value="thursday">Thursday</option>
					  <option value="friday">Friday</option>
					  <option value="saturday">Saturday</option>
					</select>
				  </div>
				{/if}
  
				<!-- Additional Options for Every Month -->
				{#if lastDaysOption === "every_month"}
				  <p class="text-lg font-semibold">on the</p>
				  <div class="form-control w-auto">
					<input
					  type="number"
					  id="specific-day"
					  bind:value={lastDaysSpecificDay}
					  placeholder="Enter day of month"
					  min="1"
					  max="28"
					  class="input input-bordered w-auto"
					/>
				  </div>
				  <p class="text-lg font-semibold">of the month.</p>
				{/if}
			  </div>
			{/if}
  
			{#if selectedDateOption === "RollingPeriod" && selectedRollingPeriod === "ytd"}
			  <!-- Add year-to-date-specific options here -->
			{/if}
			{#if selectedDateOption === "RollingPeriod" && selectedRollingPeriod === "annual"}
			  <!-- Add annual-specific options here -->
			{/if}
  
			{#if (selectedDateOption === "RollingPeriod" && (selectedRollingPeriod === "current_week" || selectedRollingPeriod === "previous_week" || selectedRollingPeriod === "current_month" || selectedRollingPeriod === "previous_month" || selectedRollingPeriod === "current_quarter" || selectedRollingPeriod === "previous_quarter")) || selectedDateOption === "LastDays"}
			  <div class="flex justify-end mt-4">
				<button
				  type="button"
				  class="btn btn-success btn-sm flex items-center"
				  on:click={handleSaveScheduler}
				>
				  <svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 mr-2"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				  >
					<path
					  stroke-linecap="round"
					  stroke-linejoin="round"
					  stroke-width="2"
					  d="M8 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8zm0 0v2m0 4v6m0-6h6m4 4h2m-2-2h2m-4-2v6"
					/>
				  </svg>
				  Save Scheduler
				</button>
			  </div>
			{/if}
		  </div>
		</div>
	  {/if}
	</form>
  </div>
  
  <style>
	.criteria-row,
	.sort-row,
	.subtotal-row {
	  display: flex;
	  align-items: center;
	  gap: 1rem;
	}
  </style>
  