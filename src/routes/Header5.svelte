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
			<div class="text-sm grid grid-cols-2 space-x-2 space-y-1">
      
             <!-- Customers Section -->
<div class="text-sm flex flex-col gap-1">
    <div class="flex-grow relative group">
      <div
        class="truncate max-w-xs"
        style=" max-width:150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        title={appliedFilters.customersTooltip}
      >
        <!-- Customers content with truncation and ellipsis -->
               <div class="flex gap-1 items-center">
          <div class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center">
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
        <p class="font-bold"> {appliedFilters.customers}</p>
        </div>
      </div>
    <div
    class="absolute left-0 top-full mt-1 hidden group-hover:block text-white p-2 rounded shadow-lg max-w-xs z-10"
>
    <ul class="flex flex-row bg-gray-500 p-1 text-sm">
          {appliedFilters.customers}
        </ul>
      </div>
    </div>
  </div>
<!-- Carriers Section -->
<div class="text-sm flex flex-col gap-1">
  <div class="flex-grow relative group">
    <!-- Truncated text with ellipsis -->
    <div
      class="truncate max-w-xs" 
      style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" 
      title={appliedFilters.carriersTooltip}
    >
      <!-- Carriers content with truncation and ellipsis -->
      <div class="flex gap-1 items-center">
        <div class="flex w-[2rem] min-w-[2rem] gap-1  justify-center items-center">
          <!-- Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
          </svg>



          <span>&#58;</span>
        </div>
        <!-- Truncated Carriers text -->
       <p class="font-bold">{appliedFilters.carriers}</p>
      </div>
    </div>

    <!-- Full content on hover -->
    <div
    class="absolute left-0 top-full mt-1 hidden group-hover:block text-white p-2 rounded shadow-lg max-w-xs z-10"
>
    <ul class="flex flex-row bg-gray-500 p-1 text-sm">
        {appliedFilters.carriers}
      </ul>
    </div>
  </div>
</div>

  <!-- Shipper Groups Section -->
<div class="text-sm flex flex-col gap-1">
    <div class="flex-grow relative group">
      <div
        class="truncate max-w-xs"
        style="max-width:150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        title={appliedFilters.shipperGroupsTooltip}
      >
        <!-- Shipper Groups content with truncation and ellipsis -->
         <div class="flex gap-1 items-center">
          <div class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center">

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="25" height="24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6a2 2 0 012-2h3m4 9a2 2 0 104 0 2 2 0 00-4 0zm-9 2a2 2 0 100-4 2 2 0 000 4zm11-4V9a2 2 0 00-2-2h-1l-2-2H8a2 2 0 00-2 2v9h13z" />
</svg>

<span>&#58;<span>
</div>
 <p class="font-bold">{appliedFilters.shipperGroups}</p>
</div>
 
      </div>
  <div
    class="absolute left-0 top-full mt-1 hidden group-hover:block text-white p-2 rounded shadow-lg max-w-xs z-10"
>
    <ul class="flex flex-row bg-gray-500 p-1 text-sm">
          {appliedFilters.shipperGroups}
        </ul>
      </div>
    </div>
  </div>

  <!-- Date Groups Section -->
<div class="text-sm flex flex-col gap-1">
    <div class="flex-grow relative group">
      <div
        class="truncate max-w-xs"
        style=" max-width:150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        title={appliedFilters.dateTooltip}
      >
        <!-- Date Groups content with truncation and ellipsis -->
           <div class="flex gap-1 items-center">
          <div class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center">


<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10m-12 9h14a2 2 0 002-2V7a2 2 0 00-2-2h-14a2 2 0 00-2 2v10a2 2 0 002 2z"/>
</svg>
<span>&#58;<span>
</div>
<p class="font-bold">{appliedFilters.date}</p>
</div>
 
      </div>
     <div
    class="absolute left-0 top-full mt-1 hidden group-hover:block text-white p-2 rounded shadow-lg max-w-xs z-10"
>
    <ul class="flex flex-row bg-gray-500 p-1 text-sm">
          {appliedFilters.date}
        </ul>
      </div>
    </div>
  </div>


     <!-- Shippers Section -->
  <div class="text-sm flex flex-col gap-1">
    <div class="flex-grow relative group">
      <div
        class="truncate max-w-xs"
        style="width:150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
        title={appliedFilters.shippersTooltip}
      >
        <!-- Shippers content with truncation and ellipsis -->
          <div class="flex gap-1 items-center">
          <div class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path fill="none" stroke="currentColor" stroke-width="2" d="M21 16V8l-9-5l-9 5v8l9 5l9-5zm-9-11v10"/>
</svg>


<span>&#58;<span>
</div>
<p class="font-bold">  {appliedFilters.shippers}</div>
      </div>
     <div
    class="absolute left-0 top-full mt-1 hidden group-hover:block text-white p-2 rounded shadow-lg max-w-xs z-10"
>
    <ul class="flex flex-row bg-gray-500 p-1 text-sm">
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



