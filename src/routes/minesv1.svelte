<script>
  import { page } from "$app/stores";

  // Define the navigation links array once
  const links = [
    { path: "/admin", label: "Admin" },
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/reports", label: "Reports" },
    { path: "/parcel", label: "Parcel" }
  ];
	import logo from "$lib/images/logo.png";
	import github from "$lib/images/github.svg";
	import API, { logout } from "$lib/api";
	import { isAuthenticated } from "$lib/stores";
	console.log("Login isAuthenticated: header", $isAuthenticated); // Log for debugging
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
		selectedDateRangeStore,
		selectedRunOptDisplayTextStore,
		selectedCurrenciesStore,
	} from "$lib/stores/headerfiltersStore";

	// Show/Hide Menu for Small Layouts
	let showMenu = false;

	export let activeMainPage = "";
	import FilterModal from "$lib/components/HeaderFilterModal.svelte"; // Assuming FilterModal.svelte is in the same folder
	let selectedCustomers = [];
	let selectedCarriers = [];
	let selectedShipperGroups = [];
	let selectedShippers = [];
	let selectedDateRange = [];
	let selectedRunOptDisplayText = "";
	let selectedCurrencies = [];
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

	// Subscribe to the selectedShipperGroupsStore to automatically update
	selectedRunOptDisplayTextStore.subscribe((value) => {
		selectedRunOptDisplayText = value;
	});

	// Subscribe to the selectedCurrenciesStore to automatically update
	selectedCurrenciesStore.subscribe((value) => {
		selectedCurrencies = value;
		appliedFilters.selectedCurrencies = selectedCurrencies.length
			? selectedCurrencies.map((currency) => currency.name).join(", ")
			: "No currency selected";
	});

	console.log(
		"============selectedRunOptDisplayText",
		selectedRunOptDisplayText,
	);
</script>


<!-- Navbar Section -->
<div class="navbar fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-lg">
<div class="flex-1 relative navbar">
  <!-- Hide logo on small screens and show it on larger screens -->
  <a href="/profile" class="hidden lg:flex text-xl items-center">
    <img src={logo} alt="Logo" class="h-20 w-60 mr-2" />
  </a>

  <!-- Desktop Navigation -->
  <nav class="hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      {#each links as link}
        <li class={$page.url.pathname === link.path ? "active" : ""}>
          <a href={link.path} class="btn btn-ghost">{link.label}</a>
        </li>
      {/each}
    </ul>
  </nav>

  <!-- Mobile Navigation (Hamburger Menu) -->
  <div class="lg:hidden flex items-center">
    <!-- Hamburger button toggles the menu -->
    <button
      class="btn btn-square btn-ghost"
      on:click={() => (showMenu = !showMenu)}
    >
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
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  </div>

  <!-- Mobile Menu (below the header, block style) -->
  {#if showMenu}
   <ul
  class="lg:hidden flex flex-col items-center mt-2 space-y-2 w-[14rem] shadow-lg bg-gray-100 rounded-sm absolute top-full left-0"
>
  {#each links as link}
   <li class="flex justify-center w-full">
  <a href={link.path} class="btn btn-ghost w-full text-left">
    {link.label}
  </a>
</li>
  {/each}
</ul>

  {/if}
</div>

	<!-- Profile and Theme Selector (Desktop Only) -->
	<div class=" lg:flex items-center space-x-4">
		<label for="filter-modal" class=" flex w-[22rem] justify-center items-center ">
		<!-- Filter Display -->
    <div class="h-[6rem] w-[19rem] overflow-x-auto md:overflow-x-hidden   cursor-pointer bg-base-100  rounded-lg overflow-y-auto scrollbar-thin">
    <!-- Display selected filters in the navbar -->
    <div class="flex flex-col sm:flex sm:gap-2 sm:w-auto h-auto mb-2 md:h-[8rem] w-[8rem]  md:w-[18.8rem] sm:space-y-1 md:grid md:grid-cols-4 md:gap-0  lg:grid-cols-4 font-bold">
        <!-- Item 1 (Customers) -->
        <div class="text-sm mb-1  flex flex-col col-span-2 space-y-1">
					<div class="flex-grow relative group">
						<div
							class="truncate max-w-xs"
							style=" max-width:150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
							title={appliedFilters.customersTooltip}
						>
							<!-- Customers content with truncation and ellipsis -->
							<div class="flex gap-1 items-center">
								<div class="flex items-center">
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

									<span>&#58;<span> </span></span>
								</div>
								<p>{appliedFilters.customers}</p>
							</div>
						</div>
					<div
							class="absolute left-0 h-auto  hidden group-hover:flex bg-gray-400 text-white p-2 rounded-sm shadow-lg max-w-xs z-10 pointer-events-none"
						>
							<ul class="text-sm">
								{appliedFilters.customers}
							</ul>
						</div>
					</div>
				</div>

      <!-- Item 2 (Carriers) -->
	<div class="text-sm mb-1  flex flex-col col-span-2 space-y-1  col-start-3 row-1">
						<div class="flex-grow relative group">
						<div
							class="truncate max-w-xs"
							style=" max-width:150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
							title={appliedFilters.carriersTooltip}
						>
							<!-- Carriers content with truncation and ellipsis -->
							<div class="flex gap-1  items-center">
							          <div class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="lucide lucide-truck"
										><path
											d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"
										/><path d="M15 18H9" /><path
											d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"
										/><circle
											cx="17"
											cy="18"
											r="2"
										/><circle cx="7" cy="18" r="2" /></svg
									>

									<span>&#58;<span> </span></span>
								</div>
								<p>{appliedFilters.carriers}</p>
							</div>
						</div>
				<div
							class="absolute left-0 h-auto  hidden group-hover:flex bg-gray-400 text-white p-2 rounded-sm shadow-lg max-w-xs z-10 pointer-events-none"
						>
							<ul class="text-sm">
								{appliedFilters.carriers}
							</ul>
						</div>
					</div>
				</div>
     
      
 
    <!-- Selected Run Option Display Section -->
  
  <!-- Item 3 (date) -->
				<div class="text-sm mb-1  flex flex-col col-span-4 space-y-1">
					<div class="flex-grow relative group">
						<div
							class="truncate max-w-xs"
							style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
								title={selectedRunOptDisplayText}	 
						>
							<!-- Display with truncation and ellipsis -->
							<div class="flex gap-1 items-center">
							 <div class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<!-- Calendar icon representing the date range -->
										<path
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											d="M21 16V8l-9-5l-9 5v8l9 5l9-5zm-9-11v10"
										/>
									</svg>
									<span>&#58;<span> </span></span>
								</div>
								<!-- Show truncated Run Option Display Text -->
									<p>{selectedRunOptDisplayText}</p>
							</div>
						</div>
						<!-- Tooltip for full text -->
						<div
							class="absolute left-0  h-auto hidden group-hover:flex bg-gray-400 text-white p-2 rounded-sm shadow-lg max-w-xs z-10 pointer-events-none"
						>
							<ul class="text-sm">
							<li>{selectedRunOptDisplayText} </li>
							</ul>
						</div>
					</div>
				</div>



     
           <!-- Item 4 (Shipper Groups) -->
				<div class="text-sm flex mb-1  flex-col col-span-2  space-y-1">
					<div class="flex-grow relative group">
						<div
							class="truncate max-w-xs"
							style="max-width:150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
							title={appliedFilters.shipperGroupsTooltip}
						>
							<!-- Shipper Groups content with truncation and ellipsis -->
							<div class="flex items-center gap-1">
							 <div class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										width="24"
										height="24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 17v-6a2 2 0 012-2h3m4 9a2 2 0 104 0 2 2 0 00-4 0zm-9 2a2 2 0 100-4 2 2 0 000 4zm11-4V9a2 2 0 00-2-2h-1l-2-2H8a2 2 0 00-2 2v9h13z"
										/>
									</svg>

									<span>&#58;<span> </span></span>
								</div>
								<p>{appliedFilters.shipperGroups}</p>
							</div>
						</div>
	<div
							class="absolute left-0 h-auto  hidden group-hover:flex bg-gray-400 text-white p-2 rounded-sm shadow-lg max-w-xs z-10 pointer-events-none"
						>
							<ul class="text-sm">
								{appliedFilters.shipperGroups}
							</ul>
						</div>
					</div>
				</div>

          <!-- Item 5 (Shippers) -->

			<div class="text-sm flex mb-1 flex-col col-span-2 col-start-3 space-y-1">
					<div class="flex-grow relative group">
						<div
							class="truncate max-w-xs"
							style="width:150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
							title={appliedFilters.shippersTooltip}
						>
							<!-- Shippers content with truncation and ellipsis -->
							<div class="flex items-center gap-1">
								<div class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										width="24"
										height="24"
									>
										<path
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											d="M21 16V8l-9-5l-9 5v8l9 5l9-5zm-9-11v10"
										/>
									</svg>

									<span>&#58;<span> </span></span>
								</div>
								<p>{appliedFilters.shippers}</p>
							</div>
						</div>
						<div
							class="absolute left-0 group-active:block  h-auto  hidden group-hover:block bg-gray-400 text-white p-2 rounded-sm shadow-lg max-w-xs z-10 pointer-events-none"
						>
							<ul class="text-sm">
								{appliedFilters.shippers}
							</ul>
						</div>
					</div>
				</div>

       
<!-- Item 6 (Currencies) -->
 <div class="text-sm flex flex-col mb-1  space-y-1  col-span-3 row-4 ">
					<div class="flex-grow relative group">
						<div
							class="truncate max-w-xs"
							style="max-width: 150px;  white-space: nowrap;"
							
						>
							<!-- Currencies content with truncation and ellipsis -->
							<div class="flex gap-1 items-center">
								 <div class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<!-- Currency icon -->
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.39.49-4.83-.15-6.54-1.72C5.16 17.16 5 15.12 5.89 13.46c.44-.83 1.15-1.49 2.05-1.84.86-.32 1.78-.45 2.67-.45 1.71 0 3.3.82 4.28 2.1.29.38.67.69 1.09.89v.05c-.69 1.45-1.92 2.7-3.48 3.39v.33zM16 11V7.07c-1.15.16-2.22.64-3 1.33V11h3zM13 4.07c-.47 0-.94.04-1.4.12C13.31 4.55 15 6.1 15 8v3h3V8c0-2.94-2.39-5.33-5.33-5.93-.34-.07-.69-.1-1.04-.1z"
											fill="currentColor"
										/>
									</svg>

									<span>&#58;<span> </span></span>
								</div>
								<p>{appliedFilters.selectedCurrencies}</p>
							</div>
						</div>
							<!-- 	<div
							class="absolute left-0 h-auto  hidden group-hover:flex bg-gray-400 text-white p-2 rounded-md shadow-lg max-w-xs z-10 pointer-events-none"
						>
							<ul class="text-sm">
								{appliedFilters.selectedCurrencies}
							</ul>
						</div>-->
					</div>
				</div>
      
   
</div>

</div>







		<!-- Filter Icon (Shown only when activeMainPage is 'reports', 'dashboard', or 'parcel') -->
	<div class="btn btn-square btn-ghost item-center">
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
			</div>
		</label>

		<!-- Theme Selector -->
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
				class="dropdown-content bg-base-300 rounded-md z-[1] w-52 p-2 shadow-2xl"
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

  
		<!-- User Profile Menu -->
		<div class="dropdown dropdown-end">
			<div
				tabindex="0"
				role="button"
				class="btn btn-ghost btn-circle avatar border-2 border-gray-400"
			>
				<div
					class="bg-neutral text-neutral-content w-16 pt-1 rounded-full"
				>
					<span class="text-xl">AI</span>
				</div>
			</div>

			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-md w-52"
			>
				<li>
					<a href="/profile" class="justify-between"
						>Profile <span class="badge">New</span></a
					>
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
<!-- Modal for Filter Options -->
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
    height: 6rem; /* Adjust to match the height of the header */
}

.menu.menu-horizontal > li > a {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
}

.menu.menu-compact {
    right: 0;
    left: auto;
}

.dropdown-content {
    position: absolute;
    top: 100%;
    right: 0;
}

	@media (max-width: 1024px) {
		.dropdown-content {
			left: 0;
			right: auto;
		}
	}
	 .group-hover:block {
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    opacity: 0;
    visibility: hidden;
}

.group:hover .group-hover:block {
    opacity: 1;
    visibility: visible;
}
/* Custom Scrollbar for WebKit Browsers (Chrome, Safari, Edge) */
/* Initially hide the scrollbar */
.scrollbar-hidden::-webkit-scrollbar {
    width: 0;
    height: 0;
}

/* Show the scrollbar on hover */
.scrollbar-hidden:hover::-webkit-scrollbar {
    width: 8px;  /* Adjust the width as needed */
    height: 8px;
}

.scrollbar-hidden:hover::-webkit-scrollbar-thumb {
    background-color: #22c55e;  /* Tailwind success color (green) */
    border-radius: 10px;
}

.scrollbar-hidden:hover::-webkit-scrollbar-track {
    background-color: #d1d5db;  /* Tailwind gray-300 */
    border-radius: 10px;
}

/* For Firefox, hide the scrollbar by default */
.scrollbar-hidden {
    scrollbar-width: none; /* Hide the scrollbar */
}

/* Show the scrollbar on hover for Firefox */
.scrollbar-hidden:hover {
    scrollbar-width: thin; /* Show thin scrollbar on hover */
    scrollbar-color: #22c55e #d1d5db;  /* Thumb and track colors */
}


</style>
