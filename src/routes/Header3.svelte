<script>
	import { page } from "$app/stores";
	import logo from "$lib/Images/logo.png";
import shipment from "$lib/Images/shipment.png";

  export let username="subbu" // Receive the username as a prop
  let firstLetter = username.charAt(0).toUpperCase();

	import {
		selectedCustomersStore,
		selectedCarriersStore,
		selectedShippersStore,selectedShipperGroupsStore,
    selectedDateRangeStore
	} from "$lib/headerfiltersStore"; // Import the store

	export let activeMainPage = "";
	import FilterModal from "$lib/HeaderFilterModal.svelte"; // Assuming FilterModal.svelte is in the same folder
	let selectedCustomers = [];
	let selectedCarriers = [];
  let selectedInvoiceDate=[];
	let selectedShipperGroups = [];
	let selectedShippers = []; 
	let appliedFilters = {
		customers: "No customers selected",
		shipperGroups: "",
		carriers: "",
	};

	// Subscribe to the selectedCustomersStore to automatically update
	selectedCustomersStore.subscribe((value) => {
		selectedCustomers = value;
		appliedFilters.customers = selectedCustomers.length
			? selectedCustomers.map((c) => c.name).join(" ")
			: "No customers selected";
	});
	// Subscribe to the selectedCarriersStore to automatically update
	selectedCarriersStore.subscribe((value) => {
		selectedCarriers = value;
		appliedFilters.carriers = selectedCarriers.length
			? selectedCarriers.map((carrier) => carrier.name).join(" ")
			: "No carriers selected";
	});
	// Subscribe to the selectedShippersStore to automatically update
	selectedShippersStore.subscribe((value) => {
		selectedShippers = value;
		appliedFilters.shippers = selectedShippers.length
			? selectedShippers
					.map((shipper) => shipper.accountNumber)
					.join(" ")
			: "No shippers selected";
	});

	// Subscribe to the selectedShipperGroupsStore to automatically update
selectedShipperGroupsStore.subscribe((value) => {
	selectedShipperGroups = value;
	appliedFilters.shipperGroups = selectedShipperGroups.length
		? selectedShipperGroups.map((group) => group.groupName).join(" ")
		: "No shipper groups selected";
});


</script>

<div class="navbar fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-lg">
<div class="flex-1">
  <!-- Logo and branding -->
  <a href="/" class="flex text-xl items-center">
    <img src={logo} alt="Logo" class="h-8 mr-2" /> KRISHNA
  </a>

  <!-- Desktop Navigation -->
  <nav class="hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      {#each [
        { path: "/admin", label: "Admin" },
        { path: "/", label: "Home" },
        { path: "/dashboard", label: "Dashboard" },
        { path: "/reports", label: "Reports" },
        { path: "/parcel", label: "Parcel" },
      ] as link}
        <li class={$page.url.pathname === link.path ? "active" : ""}>
          <!-- Navigation link -->
          <a href={link.path} class="btn btn-ghost">{link.label}</a>
        </li>
      {/each}
    </ul>
  </nav>
</div>
	<div class="flex-none flex items-center space-x-4">
	
		<!-- Display selected filters in the navbar -->
<div class="flex-grow">
    <div class="text-sm grid grid-cols-2  gap-2">
        <!-- Customers Section -->
        <div class="flex-grow relative group">
            <div
                class="truncate max-w-xs"
                style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                title={appliedFilters.customersTooltip}
            >
                <strong>Customers:</strong> {appliedFilters.customers}
            </div>
            <div
                class="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white p-2 rounded shadow-lg max-w-xs z-10"
            >
                <ul class="text-sm">
                    {appliedFilters.customers}
                </ul>
            </div>
        </div>

        <!-- Carriers Section -->
        <div class="flex-grow relative group">
            <div
                class="truncate max-w-xs"
                style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                title={appliedFilters.carriersTooltip}
            >
                <strong>Carriers:</strong> {appliedFilters.carriers}
            </div>
            <div
                class="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white p-2 rounded shadow-lg max-w-xs z-10"
            >
                <ul class="text-sm">
                    {appliedFilters.carriers}
                </ul>
            </div>
        </div>

        <!-- Shipper Groups Section -->
        <div class="flex-grow relative group">
            <div
                class="truncate max-w-xs"
                style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                title={appliedFilters.shipperGroupsTooltip}
            >
                <strong>Shipper Groups:</strong> {appliedFilters.shipperGroups}
            </div>
            <div
                class="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white p-2 rounded shadow-lg max-w-xs z-10"
            >
                <ul class="text-sm">
                    {appliedFilters.shipperGroups}
                </ul>
            </div>
        </div>

        <!-- Shippers Section -->
        <div class="flex-grow relative group">
            <div
                class="truncate max-w-xs"
                style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                title={appliedFilters.shippersTooltip}
            >
                <strong>Shippers:</strong> {appliedFilters.shippers}
            </div>
            <div
                class="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white p-2 rounded shadow-lg max-w-xs z-10"
            >
                <ul class="text-sm">
                    {appliedFilters.shippers}
                </ul>
            </div>
        </div>
    </div>
</div>


		<!-- Filter Icon -->

		{#if activeMainPage == "dashboard" || activeMainPage == "reports"}
			<!-- Filter Icon (Shown only when activeMainPage is 'reports', 'dashboard', or 'parcel') -->
			<label for="filter-modal" class="btn btn-square btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-5.32 5.32A3 3 0 0014 14.83V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-6.17a3 3 0 00-.88-2.12l-5.32-5.32A1 1 0 011 6V4z"
					/>
				</svg>
			</label>
		{/if}


		<div class="dropdown dropdown-end">
			<div tabindex="0" role="button" class="btn m-1">
				Theme
				<svg
					width="12px"
					height="12px"
					class="inline-block h-2 w-2 fill-current opacity-60"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 2048 2048"
				>
					<path
						d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"
					></path>
				</svg>
			</div>
			<ul
				tabindex="0"
				class="dropdown-content bg-base-100 rounded-box w-52 rounded-box z-[1] w p-2 shadow-2xl"
			>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Default"
						value="default"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Retro"
						value="retro"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Cyberpunk"
						value="cyberpunk"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Valentine"
						value="valentine"
					/>
				</li>
				<li>
					<input
						type="radio"
						name="theme-dropdown"
						class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
						aria-label="Aqua"
						value="aqua"
					/>
				</li>
			</ul>
		</div>
		<div class="dropdown dropdown-end">
	<div
  tabindex="0"
  role="button"
  class=" avatar online placeholder rounded-full border border-neutral"
>
  <div class="btn btn-ghost btn-circle text-neutral-content  flex items-center justify-center">
    <span class="text-xl">{firstLetter}</span>
  </div>
</div>


			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content bg-base-100  rounded-box z-[1] mt-3 w-52 p-2 shadow"
			>
				<li>
					<a class="justify-between">
						Profile
						<span class="badge">New</span>
					</a>
				</li>
				<li><a>Settings</a></li>
				<li>
					<a
						href="/logout"
						class="btn btn-ghost"
						on:click={() => logout()}>Logout</a
					>
				</li>
			</ul>
		</div>
	</div>
</div>




<!-- DaisyUI Modal for Filter Options -->
<input type="checkbox" id="filter-modal" class="modal-toggle" />
<div class="modal">
	<div class="modal-box w-11/12 max-w-4xl">
		<FilterModal
			bind:selectedCustomers
			bind:selectedShippers
			bind:selectedCarriers
		/>
	</div>
</div>


<style>
	.navbar {
		height: 6rem; /* Adjust this to match the height of your header */
	}
</style>



