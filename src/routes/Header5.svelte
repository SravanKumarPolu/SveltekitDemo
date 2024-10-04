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

<div class="navbar flex px-5   fixed left-0 right-0 z-50 bg-base-100 shadow-lg">

<div class="  flex ">
		<a href="/" class=" flex  text-xl ">
			<img src={logo} alt="SvelteKit" class="h-8 mr-2" />KRISHNA
		</a>
    <nav class="flex-grow pl-4 ">
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
<div class=" flex-1  gap-4  pl-10" >
	<!-- Display selected filters in the navbar -->

<div class="w-[38rem] h-[4.5rem]  ">
  <div class="grid grid-cols-3 justify-center items-center pt-1 ">
     <!-- Customers Section -->
  <div class="text-sm flex flex-col py-1 space-y-1">
    <div class="flex-grow relative group">
      <div
        class="truncate max-w-xs"
        style=" width:160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        title={appliedFilters.customersTooltip}
      >
        <!-- Customers content with truncation and ellipsis -->
        <div class="flex gap-1 items-center "> 
        <div  class="flex items-center ">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- User group icon -->
  <path 
    fill-rule="evenodd" 
    clip-rule="evenodd" 
    d="M7 19C6.44772 19 6 18.5523 6 18C6 16.3077 6.81186 15.0179 7.98298 14.1851C9.12436 13.3734 10.5892 13 12 13C13.4108 13 14.8756 13.3734 16.017 14.1851C17.1881 15.0178 18 16.3076 18 18C18 18.5523 17.5523 19 17 19C15.6012 19 8.39878 19 7 19Z" 
    fill="currentColor" 
  />
  <path 
    d="M19.5 18C19.5 18 19.5 18 19.5 18C19.5 16.0565 18.6712 14.498 17.4529 13.4137C18.0999 13.1329 18.8086 13 19.5 13C20.5581 13 21.6567 13.3112 22.5128 13.9875C23.3911 14.6815 24 15.7564 24 17.1667C24 17.6269 23.6642 18 23.25 18H19.5Z" 
    fill="currentColor" 
  />
  <path 
    d="M6.54712 13.4137C5.32885 14.498 4.5 16.0564 4.5 18C4.5 18 4.5 18 4.5 18L0.75 18C0.335786 18 0 17.6269 0 17.1667C0 15.7564 0.608892 14.6815 1.48723 13.9875C2.34327 13.3112 3.44193 13 4.5 13C5.19138 13 5.90009 13.1329 6.54712 13.4137Z" 
    fill="currentColor" 
  />
  <path 
    d="M12 5C10.067 5 8.5 6.567 8.5 8.5C8.5 10.433 10.067 12 12 12C13.933 12 15.5 10.433 15.5 8.5C15.5 6.567 13.933 5 12 5Z" 
    fill="currentColor" 
  />
  <path 
    d="M4.5 7C3.11929 7 2 8.11929 2 9.5C2 10.8807 3.11929 12 4.5 12C5.88071 12 7 10.8807 7 9.5C7 8.11929 5.88071 7 4.5 7Z" 
    fill="currentColor" 
  />
  <path 
    d="M19.5 7C18.1193 7 17 8.11929 17 9.5C17 10.8807 18.1193 12 19.5 12C20.8807 12 22 10.8807 22 9.5C22 8.11929 20.8807 7 19.5 7Z" 
    fill="currentColor" 
  />
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
        style=" width:160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
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
        style=" width:160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
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
        style=" width:160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
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
        style="width:160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
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

  <div class="  flex-1/23 flex justify-center items-center gap-3 "> 
 
	<!-- Theme Dropdown using DaisyUI and Tailwind -->
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
				<path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
			</svg>
		</div>
		<ul
			tabindex="0"
			class="dropdown-content bg-base-100 rounded-md shadow-md w-52 p-2 mt-2 z-10"
		>
			<li>
				<label class="label cursor-pointer justify-start">
					<input
						type="radio"
						name="theme-dropdown"
						class="radio checked:bg-primary"
						value="default"
					/>
					<span class="ml-2">Default</span>
				</label>
			</li>
			<li>
				<label class="label cursor-pointer justify-start">
					<input
						type="radio"
						name="theme-dropdown"
						class="radio checked:bg-primary"
						value="retro"
					/>
					<span class="ml-2">Retro</span>
				</label>
			</li>
			<li>
				<label class="label cursor-pointer justify-start">
					<input
						type="radio"
						name="theme-dropdown"
						class="radio checked:bg-primary"
						value="cyberpunk"
					/>
					<span class="ml-2">Cyberpunk</span>
				</label>
			</li>
			<li>
				<label class="label cursor-pointer justify-start">
					<input
						type="radio"
						name="theme-dropdown"
						class="radio checked:bg-primary"
						value="valentine"
					/>
					<span class="ml-2">Valentine</span>
				</label>
			</li>
			<li>
				<label class="label cursor-pointer justify-start">
					<input
						type="radio"
						name="theme-dropdown"
						class="radio checked:bg-primary"
						value="aqua"
					/>
					<span class="ml-2">Aqua</span>
				</label>
			</li>
		</ul>
	</div>

	<!-- User Avatar Dropdown -->
	<div class="dropdown dropdown-end">
		<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar border-2 border-gray-400">
			<div class="bg-neutral text-neutral-content w-16 pt-1 rounded-full">
				<span class="text-xl">AI</span>
			</div>
		</div>

		<ul
			tabindex="0"
			class="dropdown-content menu bg-base-200 rounded-box w-52 mt-3 p-2 shadow-md gap-2 z-10"
		>
			<li>
				<a class="flex justify-between px-4 py-2">
					<p class="">Profile</p>
					<span class="badge">New</span>
				</a>
			</li>
			<li class="flex justify-center items-center px-4 ">
				<a class="px-4 py-2">Settings</a>
			</li>
			<li class="">
				<a href="/logout" class="btn btn-ghost" on:click={() => logout()}>Logout</a>
			</li>
		</ul>
	</div>

	<!-- DaisyUI Modal for Filter Options -->
	<input type="checkbox" id="filter-modal" class="modal-toggle" />
	<div class="modal">
		<div class="modal-box w-11/12 max-w-4xl">
    
			<FilterModal bind:selectedCustomers bind:selectedShippers bind:selectedCarriers />
		</div>
	</div>
</div>



</div>
</div>
<style>
	.navbar {
		height: 5rem; /* Adjust this to match the height of your header */
	}
 
   .scrollbar-custom {
    scrollbar-width: thin; /* For Firefox */
    scrollbar-color: #22c55e #f3a1a1; /* Thumb (green) and Track (pink) */
  }

  /* Custom scrollbar for WebKit browsers (Chrome, Safari) */
  .scrollbar-custom::-webkit-scrollbar {
    width: 5px; /* Scrollbar width for vertical scroll */
    height: 10px; /* Scrollbar height for horizontal scroll */
  }

  .scrollbar-custom::-webkit-scrollbar-thumb {
    background-color: #22c55e; /* Thumb color (green) */
    border-radius: 10px;
  }

  .scrollbar-custom::-webkit-scrollbar-track {
    background-color: #f3a1a1; /* Track color (pink) */
  }

  /* Style for the scrollbar at the top */
  .scrollbar-top {
    transform: rotate(180deg);
  }

  /* Re-invert the content */
  .scrollbar-top > * {
    transform: rotate(180deg);
  }


</style>

