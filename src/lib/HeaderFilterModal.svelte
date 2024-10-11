<script>
  import { onMount } from "svelte";
  import SelectWithTags from "$lib/SelectWithTags.svelte";

  import {
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
    selectedDateRangeStore
  } from "$lib/headerfiltersStore"; // Import the stores

  import flatpickr from "flatpickr";
  import "flatpickr/dist/flatpickr.min.css"; // Flatpickr base styles

  // Access the stores
  let selectedCustomers = $selectedCustomersStore;
  let selectedCarriers = $selectedCarriersStore;
  let selectedShippers = $selectedShippersStore;
  let selectedShipperGroups = $selectedShipperGroupsStore;
  let selectedRunOptDisplayType = $selectedRunOptDisplayTypeStore;
  let selectedRunByOptions = $selectedRunByOptionsStore;
  let selectedDateOption = $selectedDateOptionStore;
  let selectedRollingPeriod = $selectedRollingPeriodStore;
  let lastDays = $lastDaysStore;
  let batchNumber = $batchNumberStore;
  let selectedDateRange = $selectedDateRangeStore;
  let showAlert = false; // Controls alert for customers
  
  let showCarrierAlert = false; // Controls alert for carriers
  let customers = [];
  let carriersRaw = [];
  let carriers = []; 
  let shipperGroupsRaw = [];
  let shipperGroups = []; // List of shipper groups fetched from the API 

  let shippersRaw = [];
  let shippers = []; // List of carriers fetched from the API
  let runPeriodSelection = [];
  let datepicker;
  let dateRange = "";

  
  // Function to close the modal
  function closeModal() {
    document.getElementById("filter-modal").checked = false; // Close the modal
  }
  // Initialize date picker
  function initializeDatePicker() {
    flatpickr(datepicker, {
      mode: "range",
      onChange: (selectedDates, dateStr) => {
        dateRange = dateStr;
        selectedDateRangeStore.set(selectedDates); // Persist selected date range
      },
    });
  }

  // Fetch customers on mount
  onMount(async () => {
    try {
      const res = await API.get(`accounts/customers`);
      customers = res.data.customers || [];
      carriersRaw = res.data.carriers || [];
      shippersRaw = res.data.shippers || [];
      shipperGroupsRaw = res.data.shipperGroups || [];
      runPeriodSelection = res.data.runPeriodSelection || [];
     
      if (customers.length > 0) {
        if (selectedCustomers.length === 0) {
          selectedCustomers = [customers[0]]; // Automatically select the first customer
          selectedCustomersStore.set(selectedCustomers);

          selectedRunOptDisplayType = res.data.runPeriodSelection[0].displayType;
          selectedRunByOptions = res.data.runPeriodSelection[0];
          // Store the values in the stores
          selectedRunOptDisplayTypeStore.set(selectedRunOptDisplayType);
          selectedRunByOptionsStore.set(selectedRunByOptions);


          fetchCarriers([customers[0].id]);
          applyFilters(); // Apply filters for the first customer
        } else {
          fetchCarriers(selectedCustomers.map((customer) => customer.id));
        }
      } else {
        alert("No customers available, please contact support or try again later.");
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
     
    }
  });
 
  const handleCustomerChange = async (event) => {
    const selectedOptions = event.detail.selectedItems;
    let selectedCustomersIds = selectedOptions.map((customer) => customer.id);
    fetchCarriers(selectedCustomersIds);
  };

  // Handle carrier selection change
  const handleCarrierChange = async (event) => {
    const selectedOptions = event.detail.selectedItems;
    let selectedCarrierIds = selectedOptions.map((carrier) => carrier.id);
    let selectedCustomerIds = selectedCustomers.map((customer) => customer.id); // Get currently selected customers

    // Fetch shipper groups and shippers based on selected customers and carriers
    fetchShipperGroupsAndShippers(selectedCustomerIds, selectedCarrierIds);
  };

  // Handle shipper group selection change
  const handleShipperGroupChange = async (event) => {
    const selectedShipperGroupsOptions = event.detail.selectedItems;
    let selectedShipperGroupNames = selectedShipperGroupsOptions.map(
      (group) => group.groupName,
    ); // Extract selected group names

    let selectedCarrierIds = selectedCarriers.map((carrier) => carrier.id); // Get currently selected carriers
    let selectedCustomerIds = selectedCustomers.map((customer) => customer.id); // Get currently selected customers

    // If no shipper groups are selected, fetch all shippers based on customers and carriers
    if (selectedShipperGroupNames.length === 0) {
      fetchShippers(selectedCustomerIds, selectedCarrierIds, null);
    } else {
      // Otherwise, fetch shippers filtered by selected shipper groups
      fetchShippers(
        selectedCustomerIds,
        selectedCarrierIds,
        selectedShipperGroupNames,
      );
    }
  };

  // Fetch carriers based on selected customer IDs
  async function fetchCarriers(customerIds) {
    if (customerIds.length) {
      // Get the shippers related to the selected customers
      const filteredShippers = shippersRaw.filter((shipper) =>
        customerIds.includes(shipper.customer),
      );
      shippers = filteredShippers;

      let filteredGroups = shipperGroupsRaw.filter((group) =>
        customerIds.includes(group.customerId),
      );

      // Create a Set to remove duplicates based on groupName
      const uniqueGroups = [
        ...new Set(filteredGroups.map((group) => group.groupName)),
      ];

      // Map the unique group names back to their full objects (if needed)
      shipperGroups = uniqueGroups.map((groupName) =>
        filteredGroups.find((group) => group.groupName === groupName),
      );

      // Automatically select all distinct shipper groups
      // selectedShipperGroups = [...shipperGroups];

      // Extract the carrier IDs from the filtered shippers
      const carrierIds = [
        ...new Set(filteredShippers.map((shipper) => shipper.carrier)),
      ];
      // Filter the carriers based on the extracted carrier IDs
      carriers = carriersRaw.filter((carrier) =>
        carrierIds.includes(carrier.id),
      );

      // carriers = carriersraw.filter(carrier => customerIds.includes(carrier.customer_id)) || [];

      if (carriers.length > 0) {
        // Automatically select all carriers by default after fetching
        selectedCarriers = [...carriers];
        showCarrierAlert = false; // No alert if carriers are available
      } else {
        // Show an alert if no carriers are available
        showCarrierAlert = true;
      }
    } else {
      carriers = [];
      selectedCarriers = []; // Reset carriers if no customer is selected
      showCarrierAlert = false; // Hide carrier alert when no customers are selected
      shippers = [];
      selectedShippers = []; // Reset carriers if no customer is selected
      shipperGroups = [];
      selectedShipperGroups = []; // Reset shipper groups if no customer is selected
    }
  }

  // Fetch shipper groups and shippers based on selected customers and carriers
  function fetchShipperGroupsAndShippers(customerIds, carrierIds) {
    if (customerIds.length && carrierIds.length) {
      // Filter shipper groups based on both customerIds and carrierIds
      let filteredGroups = shipperGroupsRaw.filter(
        (group) =>
          customerIds.includes(group.customerId) &&
          carrierIds.includes(group.carrierId),
      );

      // Filter shippers based on both customerIds and carrierIds
      let filteredShippers = shippersRaw.filter(
        (shipper) =>
          customerIds.includes(shipper.customer) &&
          carrierIds.includes(shipper.carrier),
      );

      shippers = filteredShippers;

      // Create a Set to remove duplicates based on groupName in filteredGroups
      const uniqueGroups = [
        ...new Set(filteredGroups.map((group) => group.groupName)),
      ];

      // Map the unique group names back to their full objects (if needed)
      shipperGroups = uniqueGroups.map((groupName) =>
        filteredGroups.find((group) => group.groupName === groupName),
      );

      // Automatically select all distinct shipper groups
      // selectedShipperGroups = [...shipperGroups];

      // Automatically select all shippers based on filtered shippers
      // selectedShippers = [...filteredShippers];
    } else {
      // Reset if no customerIds or carrierIds are selected
      shipperGroups = [];
      selectedShipperGroups = [];
      shippers = [];
      selectedShippers = [];
    }
  }

  // Fetch shippers based on selected customers, carriers, and shipper groups
  async function fetchShippers(customerIds, carrierIds, groupNames) {
    if (customerIds.length && carrierIds.length) {
      // Filter shippers based on customer IDs and carrier IDs
      shippers = shippersRaw.filter(
        (shipper) =>
          customerIds.includes(shipper.customer) &&
          carrierIds.includes(shipper.carrier) &&
          (groupNames ? groupNames.includes(shipper.groupName) : true), // If groupNames is null, don't filter by group
      );

      // Automatically select all filtered shippers by default
      // selectedShippers = [...shippers];
    } else {
      shippers = [];
      selectedShippers = [];
    }
  }

  function handleDateOptnDropdownChange() {
    selectedRunOptDisplayType = selectedRunByOptions.displayType;
    console.log("Selected run by option:", selectedRunByOptions.displayType);
  }

  function handleRollingPeriodChange(event) {
    selectedRollingPeriod = event.target.value;
    console.log("Selected rolling period:", selectedRollingPeriod);
  }

  function handleDateOptionChange(event) {
    selectedDateOption = event.target.value;
    console.log("Selected date option:", selectedDateOption);
  }

  // Function to ensure at least one customer is selected before closing the modal
  function validateSelection() {
    // Check if customers are selected
    if (selectedCustomers.length === 0 && customers.length > 0) {
      showAlert = true;
    } else {
      showAlert = false;
    }

    // Check if carriers are selected
    if (selectedCarriers.length === 0 && carriers.length > 0) {
      showCarrierAlert = true;
    } else {
      showCarrierAlert = false;
    }
  }

  function applyFilters() {
    validateSelection(); // Ensure validation before applying filters
    if (!showAlert && !showCarrierAlert) {
      console.log(
        "Filters applied:",
        selectedCustomers,
        selectedCarriers,
        selectedShippers,
        selectedShipperGroups,
      );
  

    // Set values from the local component data back into the stores
    selectedCustomersStore.set(selectedCustomers);
    selectedCarriersStore.set(selectedCarriers);
    selectedShippersStore.set(selectedShippers);
    selectedShipperGroupsStore.set(selectedShipperGroups);
    selectedRunOptDisplayTypeStore.set(selectedRunOptDisplayType);
    selectedRunByOptionsStore.set(selectedRunByOptions);
    selectedDateOptionStore.set(selectedDateOption);
    selectedRollingPeriodStore.set(selectedRollingPeriod);
    lastDaysStore.set(lastDays);
    batchNumberStore.set(batchNumber);
    selectedDateRangeStore.set(selectedDateRange);
    }
    console.log("Filters applied:", {
      selectedCustomers,
      selectedCarriers,
      selectedShippers,
      selectedShipperGroups,
      selectedRunOptDisplayType,
      selectedDateOption,
      selectedRollingPeriod,
      lastDays,
      batchNumber,
      selectedDateRange,selectedRunByOptions
    });

    closeModal();
  }

  function clearFilters() {
    selectedCustomersStore.set([]);
    selectedCarriersStore.set([]);
    selectedShippersStore.set([]);
    selectedShipperGroupsStore.set([]);
    selectedRunOptDisplayTypeStore.set("");
    selectedRunByOptionsStore.set([]);
    selectedDateOptionStore.set("RollingPeriod");
    selectedRollingPeriodStore.set("previous_week");
    lastDaysStore.set(1);
    batchNumberStore.set(null);
    selectedDateRangeStore.set([]);

    // Clear local variables as well
    selectedCustomers = [];
    selectedCarriers = [];
    selectedShippers = [];
    selectedShipperGroups = [];
    selectedRunOptDisplayType = "";
    selectedRunByOptions = [];
    selectedDateOption = "RollingPeriod";
    selectedRollingPeriod = "previous_week";
    lastDays = 1;
    batchNumber = null;
    selectedDateRange = [];

    console.log("All filters cleared.");
  }
  // Function to handle clicks outside the modal
  function handleClickOutside(event) {
    const modalBox = document.querySelector(".modal-box");
    if (!modalBox.contains(event.target)) {
      closeModal(); // Close modal if clicked outside
    }
  }
</script>

<div class="flex w-full">
  <div class="card bg-base-300 rounded-box grid h-50 flex-grow place-items-top">
    <div class="card-body space-y-2">
      <h2 class="card-title">Customer Selection</h2>
      <!-- Alert: Show when no customers are selected -->
      {#if showAlert}
        <div role="alert" class="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span
            >Please select at least one customer before applying filters!</span
          >
        </div>
      {/if}

      <!-- Alert: Show when no carriers are selected -->
      {#if showCarrierAlert}
        <div role="alert" class="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span
            >No carriers available for the selected customer(s). Please contact
            support or try again later.</span
          >
        </div>
      {/if}

      <!-- Customer Selector -->
      <SelectWithTags
        items={customers}
        bind:selectedItems={selectedCustomers}
        on:update={handleCustomerChange}
        displayProperty="name"
        placeholder="Select customers..."
        class="input input-bordered w-full"
      />

      <!-- Carrier Selector -->
      <SelectWithTags
        items={carriers}
        bind:selectedItems={selectedCarriers}
        on:update={handleCarrierChange}
        displayProperty="name"
        placeholder="Select carriers..."
        class="input input-bordered w-full"
        badgeSize="text-md"
        badgePadding="px-3 py-2"
        boxWidth="full"
        maxHeight="150px"
      />

      <!-- Shipper Group Selector -->
      {#if shipperGroups.length > 0}
        <SelectWithTags
          items={shipperGroups}
          bind:selectedItems={selectedShipperGroups}
          on:update={handleShipperGroupChange}
          displayProperty="groupName"
          placeholder="Select shipper groups..."
          class="input input-bordered w-full"
        />
      {/if}

      <!-- Shippers Selector -->
      {#if shippers.length > 0}
        <SelectWithTags
          items={shippers}
          bind:selectedItems={selectedShippers}
          displayProperty="accountNumber"
          placeholder="Select shippers..."
          class="input input-bordered w-full"
        />
      {/if}
    </div>
  </div>
  <div class="divider divider-horizontal"></div>
  <div class="card bg-base-300 rounded-box grid h-50 flex-grow place-items-top">
    <div class="card-body space-y-2">
      <h2 class="card-title">Run Period Selection</h2>

      <select
        class="select select-primary w-full max-w-xs"
        id="report-runByOptions"
        bind:value={selectedRunByOptions}
        on:change={handleDateOptnDropdownChange}
      >
        <option disabled selected>Select run by options</option>

        {#each runPeriodSelection as runByOptions}
          <option value={runByOptions}>{runByOptions.displayName}</option>
        {/each}
      </select>

      {#if selectedRunOptDisplayType === "Date"}
        <div class="form-group col-span-2">
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="dateOption"
                value="DateRange"
                bind:group={selectedDateOption}
                on:change={handleDateOptionChange}
                class="radio radio-primary"
              />
              <span class="ml-2">Date Range</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="dateOption"
                value="RollingPeriod"
                bind:group={selectedDateOption}
                on:change={handleDateOptionChange}
                class="radio radio-primary"
              />
              <span class="ml-2">Rolling Period</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                name="dateOption"
                value="LastDays"
                bind:group={selectedDateOption}
                on:change={handleDateOptionChange}
                class="radio radio-primary"
              />
              <span class="ml-2">Last Days</span>
            </label>
          </div>
        </div>

        {#if selectedDateOption === "DateRange"}
          <div class="grid grid-cols-2 gap-4 items-start">
            <!-- Date Picker Section -->
            <div class="col-span-2">
              <div class="relative mt-2">
                <input
                  id="datepicker"
                  bind:this={datepicker}
                  type="text"
                  placeholder="Select a date range"
                  class="input input-bordered w-full max-w-xs"
                  on:focus={initializeDatePicker}
                />
              </div>
              <p class="mt-2 text-sm text-gray-600">
                Selected Range: {dateRange || "None selected"}
              </p>
            </div>
          </div>
        {/if}
        {#if selectedDateOption === "RollingPeriod"}
          <div class="form-group">
            <select
              id="rolling-period"
              class="select select-primary w-full max-w-xs"
              bind:value={selectedRollingPeriod}
              on:change={handleRollingPeriodChange}
            >
              <option value="current_week">Current Week</option>
              <option value="current_month">Current Month</option>
              <option value="current_quarter">Current Quarter</option>
              <option value="previous_week">Previous Week</option>
              <option value="previous_month">Previous Month</option>
              <option value="previous_quarter">Previous Quarter</option>
              <option value="ytd">Year-to-Date</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        {/if}
        {#if selectedDateOption === "LastDays"}
          <div class="flex items-center space-x-2">
            <!-- Compact Input Box for Last Days -->
            <div class="w-16">
              <input
                type="number"
                bind:value={lastDays}
                min="1"
                max="30"
                class="border rounded-lg p-1 w-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Range Slider for Last Days -->
            <div class="flex-1">
              <input
                type="range"
                min="1"
                max="30"
                bind:value={lastDays}
                step="1"
                class="range w-full"
              />
              <div class="flex w-full justify-between text-xs px-2">
                <span>1</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
                <span>25</span>
                <span>30</span>
              </div>
            </div>
          </div>
        {/if}
      {:else if selectedRunOptDisplayType === "Multi Dropdown"}
        <div class="form-group col-span-2">
          <label
            for="batchnumber"
            class="block text-sm font-medium text-gray-700"
            >Select/Enter Batchnumber:</label
          >
          <input
            type="text"
            id="batchnumber"
            bind:value={batchNumber}
            placeholder="Enter text"
            class="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Apply and Cancel Button at the bottom -->
<div class="modal-action">
  <button class="btn" on:click={applyFilters}>Apply Filters</button>
  <button class="btn btn-outline" on:click={clearFilters}>Clear Filters</button>
</div>
