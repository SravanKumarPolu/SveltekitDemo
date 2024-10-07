<script>
	import { page } from "$app/stores";
	import logo from "$lib/Images/logo.png";
import shipment from "$lib/Images/shipment.png";



	import {
		selectedCustomersStore,
		selectedCarriersStore,
		selectedShippersStore,selectedShipperGroupsStore,
	} from "$lib/headerfiltersStore"; // Import the store

	export let activeMainPage = "";
	import FilterModal from "$lib/HeaderFilterModal.svelte"; // Assuming FilterModal.svelte is in the same folder
	let selectedCustomers = [];
	let selectedCarriers = [];
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
			? selectedCustomers.map((c) => c.name).join(", ")
			: "No customers selected";
	});
	// Subscribe to the selectedCarriersStore to automatically update
	selectedCarriersStore.subscribe((value) => {
		selectedCarriers = value;
		appliedFilters.carriers = selectedCarriers.length
			? selectedCarriers.map((carrier) => carrier.name).join(", ")
			: "No carriers selected";
	});
	// Subscribe to the selectedShippersStore to automatically update
	selectedShippersStore.subscribe((value) => {
		selectedShippers = value;
		appliedFilters.shippers = selectedShippers.length
			? selectedShippers
					.map((shipper) => shipper.accountNumber)
					.join(", ")
			: "No shippers selected";
	});

	// Subscribe to the selectedShipperGroupsStore to automatically update
selectedShipperGroupsStore.subscribe((value) => {
	selectedShipperGroups = value;
	appliedFilters.shipperGroups = selectedShipperGroups.length
		? selectedShipperGroups.map((group) => group.groupName).join(", ")
		: "No shipper groups selected";
});


</script>

<div class="navbar flex  px-5  sticky top-2 left-0 right-0 z-50 bg-base-100 shadow-lg">

<div class="flex px-1 flex">
		<a href="/" class=" flex pl-8 px-2 text-xl ">
			<img src={logo} alt="SvelteKit" class="h-8 mr-2" />KRISHNA
		</a>
    <nav class="flex-grow ">
		<ul class="flex ">
			<li
				aria-current={$page.url.pathname === "/admin"
					? "page"
					: undefined}
			>
				<a href="/admin" class= " btn btn-ghost">Admin</a>
			</li>
			<li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
				<a href="/profile" class="btn btn-ghost">Home</a>
			</li>
			<li
				aria-current={$page.url.pathname === "/dashboard"
					? "page"
					: undefined}
			>
				<a href="/dashboard" class="btn btn-ghost">Dashboard</a>
			</li>
			<li
				aria-current={$page.url.pathname === "/reports"
					? "page"
					: undefined}
			>
				<a href="/reports" class="btn btn-ghost">Reports</a>
			</li>
			<li
				aria-current={$page.url.pathname === "/parcel"
					? "page"
					: undefined}
			>
				<a href="/parcel" class="btn btn-ghost">Parcel</a>
			</li>
		</ul>
	</nav>
	</div>

	<!-- Display Right side item in Nabar -->
<div class="gap-4  pl-10" >
	<!-- Display selected filters in the navbar -->
<div class="w-[24rem] h-[4rem] overflow-y-auto cursor-pointer scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-green-400 scrollbar-track-pink-300">
  <div class="grid grid-cols-2 justify-items-center items-center  p-4 h-[10rem]">

  <!-- Customers Section -->
  <div class="text-sm flex flex-col space-y-1">
    <div class="flex-grow relative group">
      <div
        class="truncate max-w-xs"
        style="max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        title={appliedFilters.customersTooltip}
      >
        <!-- Customers content with truncation and ellipsis -->
        <div class="flex gap-1 items-center "> 
        <div  class="flex items-center ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
  <g fill="none" stroke="currentColor" stroke-width="2">
    <!-- Head -->
    <circle cx="12" cy="7" r="4"/>
    <!-- Body -->
    <path d="M5 21c0-4 3.582-7 7-7s7 3 7 7"/>
  </g>
</svg>
<span>&#58;<span>
        </div>
        <p> {appliedFilters.customers}</p>
        </div>
      </div>
      <div
        class="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white p-2 rounded shadow-lg max-w-xs z-10"
      >
        <ul class="text-sm">
          {appliedFilters.customers}
        </ul>
      </div>
    </div>
  </div>
    <!-- Carriers Section -->
  <div class="text-sm flex flex-col gap-1">
    <div class="flex-grow relative group">
      <div
        class="truncate max-w-xs"
        style="max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        title={appliedFilters.carriersTooltip}
      >
        <!-- Carriers content with truncation and ellipsis -->
<div class="flex gap-1 justify-center items-center ">
      <div class="flex gap-1 justify-center items-center">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>

<span>&#58;<span>

</div>
      <p> {appliedFilters.carriers}</p>
</div>
      </div>
      <div
        class="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white p-2 rounded shadow-lg max-w-xs z-10"
      >
        <ul class="text-sm">
          {appliedFilters.carriers}
        </ul>
      </div>
    </div>
  </div>
  <!-- Shipper Groups Section -->
  <div class="text-sm flex flex-col space-y-1">
    <div class="flex-grow relative group">
      <div
        class="truncate max-w-xs"
        style="max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        title={appliedFilters.dateTooltip}
      >
        <!-- Shipper Groups content with truncation and ellipsis -->
<div class="flex items-center gap-1 ">
<div class="flex items-center gap-1 ">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10m-12 9h14a2 2 0 002-2V7a2 2 0 00-2-2h-14a2 2 0 00-2 2v10a2 2 0 002 2z"/>
</svg>


<span>&#58;<span>
</div>
 <p> {appliedFilters.date}</p>
</div>
 
      </div>
      <div
        class="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white p-2 rounded shadow-lg max-w-xs z-10"
      >
        <ul class="text-sm">
          {appliedFilters.date}
        </ul>
      </div>
    </div>
  </div>

  <!-- Shipper Groups Section -->
  <div class="text-sm flex flex-col space-y-1">
    <div class="flex-grow relative group">
      <div
        class="truncate max-w-xs"
        style="max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        title={appliedFilters.shipperGroupsTooltip}
      >
        <!-- Shipper Groups content with truncation and ellipsis -->
<div class="flex items-center gap-1 ">
<div class="flex items-center gap-1 ">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6a2 2 0 012-2h3m4 9a2 2 0 104 0 2 2 0 00-4 0zm-9 2a2 2 0 100-4 2 2 0 000 4zm11-4V9a2 2 0 00-2-2h-1l-2-2H8a2 2 0 00-2 2v9h13z" />
</svg>

<span>&#58;<span>
</div>
 <p> {appliedFilters.shipperGroups}</p>
</div>
 
      </div>
      <div
        class="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white p-2 rounded shadow-lg max-w-xs z-10"
      >
        <ul class="text-sm">
          {appliedFilters.shipperGroups}
        </ul>
      </div>
    </div>
  </div>
  <!-- Shippers Section -->
  <div class="text-sm flex flex-col space-y-1">
    <div class="flex-grow relative group">
      <div
        class="truncate max-w-xs"
        style="max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        title={appliedFilters.shippersTooltip}
      >
        <!-- Shippers content with truncation and ellipsis -->
       <div class="flex items-center gap-1 ">
<div class="flex items-center gap-1 ">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path fill="none" stroke="currentColor" stroke-width="2" d="M21 16V8l-9-5l-9 5v8l9 5l9-5zm-9-11v10"/>
</svg>


<span>&#58;<span>
</div>
 <p>  {appliedFilters.shippers}</div>
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

    	<div class="dropdown dropdown-end  ">

			<div tabindex="0" role="button" class="btn m-1 relative">
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
				class="dropdown-content bg-base-500 absolute bg-gray-300 rounded-md my-1 w-52 p-2 shadow-sm"
			>
				<li class="">
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
  class="btn btn-ghost btn-circle avatar border-2  border-gray-400"
>
  <div class="bg-neutral text-neutral-content w-16 rounded-full">
    <span class="text-xl">{firstLetter}</span>
  </div>
</div>


<ul
  tabindex="0"
  class="menu menu-sm dropdown-content bg-base-700 absolute bg-gray-400 rounded-md z-[1] mt-3 w-52 p-2  shadow-md gap-2"
>
  <li>
    <a class="flex justify-between px-4 py-2">
      <p class="text-white">Profile</p>
      <span class="badge">New</span>
    </a>
  </li>
  <li class="flex justify-center items-center px-4 text-white">
    <a class="px-4 py-2">Settings</a>
  </li>
  <li class="text-white">
    <a
      href="/logout"
      class="btn btn-ghost"
      on:click={() => logout()}
    >Logout</a>
  </li>
</ul>

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



</div>
<style>
	.navbar {
		height: 5rem; /* Adjust this to match the height of your header */
	}
</style>
