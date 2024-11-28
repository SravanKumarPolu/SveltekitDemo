<script>
	import { page } from "$app/stores";

	// Define the navigation links array once
	const links = [
		{ path: "/admin", label: "Admin" },
		{ path: "/", label: "Home" },
		{ path: "/dashboard", label: "Dashboard" },
		{ path: "/reports", label: "Reports" },
		{ path: "/parcel", label: "Parcel" },
	];
	import logo from "$lib/Images/logo.png";
	import shipment from "$lib/Images/shipment.png";

	export let username = "subbu"; // Receive the username as a prop
	let firstLetter = username.charAt(0).toUpperCase();
	let showMenu = false;
	import {
		selectedCustomersStore,
		selectedCarriersStore,
		selectedShippersStore,
		selectedShipperGroupsStore,
		selectedDateRangeStore,
	} from "$lib/headerfiltersStore"; // Import the store

	import { themeStore } from '$lib/themeStore'; // Import the theme store
  import { get } from 'svelte/store'; // To get the current theme value

  // Function to change theme using the store
  function changeTheme(theme) {
    themeStore.set(theme); // Update the store, which also updates localStorage
  }

	export let activeMainPage = "";
	import FilterModal from "$lib/HeaderFilterModal.svelte"; // Assuming FilterModal.svelte is in the same folder
	let selectedCustomers = [];
	let selectedCarriers = [];
	let selectedInvoiceDate = [];
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
			? selectedShippers.map((shipper) => shipper.accountNumber).join(" ")
			: "No shippers selected";
	});

	// Subscribe to the selectedShipperGroupsStore to automatically update
	selectedShipperGroupsStore.subscribe((value) => {
		selectedShipperGroups = value;
		appliedFilters.shipperGroups = selectedShipperGroups.length
			? selectedShipperGroups.map((group) => group.groupName).join(" ")
			: "No shipper groups selected";
	});

  import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let tenant;
	let tenantName = tenant?.name;
	let themes = tenant?.themes || ['light', 'dark', 'retro']; // Default themes
	let activeTheme; // Holds the current active theme

	// Helper to create a tenant-specific theme key
	function getThemeStorageKey() {
		return `selectedTheme_${tenantName}`;
	}

	// Set the theme for the current tenant
	function setTheme(theme) {
		activeTheme = theme;
		document.documentElement.setAttribute('data-theme', theme); // Apply the theme
		localStorage.setItem(getThemeStorageKey(), theme); // Save tenant-specific theme
	}

	// Load the saved theme or set the default theme on mount
	onMount(() => {
		const savedTheme = localStorage.getItem(getThemeStorageKey());
		if (savedTheme && themes.includes(savedTheme)) {
			setTheme(savedTheme); // Apply saved theme
		} else {
			setTheme(themes[0]); // Default to the first theme
		}
	});

	let user = 'Sravankumar reddy polu venkata';

	// Logout function
	function logout() {
		const tenantThemeKey = getThemeStorageKey();
		performLogout(tenantName); // Call API logout
		clearStorageExcept([tenantThemeKey]); // Clear everything except the tenant-specific theme
	}

	// Clear all storage except specified keys
	function clearStorageExcept(excludedKeys) {
		const allKeys = Object.keys(localStorage);
		allKeys.forEach((key) => {
			if (!excludedKeys.includes(key)) {
				localStorage.removeItem(key);
			}
		});
	}

</script>

<!-- Navbar Section -->
<div class="navbar fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-lg">
	<div class="flex-1 relative navbar bg-base-100 px-4">
    <!-- Hide logo on small screens and show it on larger screens -->
    <a href="/profile" class="hidden lg:flex items-center text-xl font-bold space-x-2">
    
      <span class="text-primary">P.V.Sravan</span>
    </a>
  
    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex">
      <ul class="menu menu-horizontal px-1 space-x-4">
        {#each links as link}
          <li class={$page.url.pathname === link.path ? "active" : ""}>
            <a href={link.path} class="btn btn-ghost text-sm font-medium capitalize">
              {link.label}
            </a>
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
        class="lg:hidden flex flex-col items-center mt-2 space-y-2 w-60 shadow-lg bg-base-100 rounded-lg border border-gray-200 absolute top-full left-4"
      >
        {#each links as link}
          <li class="flex justify-center w-full">
            <a
              href={link.path}
              class="btn btn-ghost w-full text-left text-sm font-medium capitalize"
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  

	<!-- Profile and Theme Selector (Desktop Only) -->
	<div class=" lg:flex items-center space-x-4">
		<label
			for="filter-modal"
			class=" flex w-[22rem] justify-center items-center"
		>
    <div
    class="h-[6rem] overflow-x-auto md:overflow-x-hidden cursor-pointer bg-base-100 rounded-lg overflow-y-auto scrollbar-hidden"
  >
    <!-- Display selected filters in the navbar -->
    <div
      class="flex flex-col sm:flex-row sm:gap-2 sm:w-auto h-auto mb-2 md:h-[8rem] w-full md:w-[18.8rem] gap-4 md:grid md:grid-cols-4 lg:grid-cols-4 font-bold p-2"
    >
      <!-- Item 1 (Customers) -->
      <div class="flex items-center col-span-2 space-x-2 relative group">
     
          <div class="flex items-center">
            <div class="badge badge-primary">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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

          
          </div>

          <span>&#58;<span> </span></span>
        </div>
        
        <span
          class="truncate max-w-[150px]"
          title="{appliedFilters.customersTooltip}"
        >
          {appliedFilters.customers}
        </span>
        <div
          class="absolute hidden group-hover:flex bg-gray-800 text-white text-sm rounded-md p-2 shadow-md max-w-xs z-10 whitespace-normal"
          style="top: 100%; left: 0; transform: translateY(0.5rem);"
        >
          {appliedFilters.customersTooltip}
        </div>
      </div>
  
      <!-- Item 2 (Carriers) -->
      <div class="flex items-center col-span-2 space-x-2 relative group">
        <div  class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center">
          <div class="badge badge-secondary">
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
            /><circle cx="17" cy="18" r="2" /><circle
              cx="7"
              cy="18"
              r="2"
            /></svg
          >
          </div>

          <span>&#58;<span> </span></span>
          </div>
        <span
          class="truncate max-w-[150px]"
          title="{appliedFilters.carriersTooltip}"
        >
          {appliedFilters.carriers}
        </span>
        <div
          class="absolute hidden group-hover:flex bg-gray-800 text-white text-sm rounded-md p-2 shadow-md max-w-xs z-10 whitespace-normal"
          style="top: 100%; left: 0; transform: translateY(0.5rem);"
        >
          {appliedFilters.carriersTooltip}
        </div>
      </div>
  
      <!-- Item 3 (Date) -->
      <div class="flex items-center col-span-4 space-x-2 relative">
        <div class="badge badge-accent">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 16V8l-9-5l-9 5v8l9 5l9-5zm-9-11v10"></path>
          </svg>
        </div>
        <span>&#58;<span> </span></span>
        <span class="truncate max-w-[300px]" title="Invoice date: 12-09-1025 to 1024-8-19">
          Invoice date: 12-09-1025 to 1024-8-19
        </span>
      </div>
  
      <!-- Item 4 (Shipper Groups) -->
      <div class="flex items-center col-span-2 space-x-2 relative group">
        
          <div
          class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center"
        ><div class="badge badge-info">
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

         
        </div>
        <span>&#58;<span> </span></span>
        </div>
        <span
          class="truncate max-w-[150px]"
          title="{appliedFilters.shipperGroupsTooltip}"
        >
          {appliedFilters.shipperGroups}
        </span>
        <div
          class="absolute hidden group-hover:flex bg-gray-800 text-white text-sm rounded-md p-2 shadow-md max-w-xs z-10 whitespace-normal"
          style="top: 100%; left: 0; transform: translateY(0.5rem);"
        >
          {appliedFilters.shipperGroupsTooltip}
        </div>
      </div>
  
      <!-- Item 5 (Shippers) -->
      <div class="flex items-center col-span-2 space-x-2 relative group">
        
          <div
          class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center"
        >
        <div class="badge badge-warning">
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

       
        </div>
        <span>&#58;<span> </span></span>
        </div>
        <span
          class="truncate max-w-[150px]"
          title="{appliedFilters.shippersTooltip}"
        >
          {appliedFilters.shippers}
        </span>
        <div
          class="absolute hidden group-hover:flex bg-gray-800 text-white text-sm rounded-md p-2 shadow-md max-w-xs z-10 whitespace-normal"
          style="top: 100%; left: 0; transform: translateY(0.5rem);"
        >
          {appliedFilters.shippersTooltip}
        </div>
      </div>
  
      <!-- Item 6 (Currencies) -->
      <div class="flex items-center col-span-3 space-x-2 relative group">
     
          <div
										class="flex w-[2rem] min-w-[2rem] gap-1 justify-center items-center"
									>
                  <div class="badge badge-success">
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

										
									</div>
                  <span>&#58;<span> </span></span>
        </div>
        <span
          class="truncate max-w-[150px]"
          title="{appliedFilters.selectedCurrenciesTooltip}"
        >
          {appliedFilters.selectedCurrencies}
        </span>
        <div
          class="absolute hidden group-hover:flex bg-gray-800 text-white text-sm rounded-md p-2 shadow-md max-w-xs z-10 whitespace-normal"
          style="top: 100%; left: 0; transform: translateY(0.5rem);"
        >
          {appliedFilters.selectedCurrenciesTooltip}
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
	
	
<!-- Theme Selector Dropdown -->
<div class="dropdown dropdown-end">
  <label tabindex="0" class="btn m-1">Theme</label>
  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
    <li><a on:click={() => changeTheme('default')}>Default</a></li>
    <li><a on:click={() => changeTheme('retro')}>Retro</a></li>
    <li><a on:click={() => changeTheme('cyberpunk')}>Cyberpunk</a></li>
    <li><a on:click={() => changeTheme('valentine')}>Valentine</a></li>
    <li><a on:click={() => changeTheme('aqua')}>Aqua</a></li>
		<li><a on:click={() => changeTheme('emerald')}>Emerald </a></li>
    <li><a on:click={() => changeTheme('dark')}>Dark</a></li>
    <li><a on:click={() => changeTheme('luxury')}>Luxury</a></li>
    <li><a on:click={() => changeTheme('dracula')}>Dracula</a></li>
    <li><a on:click={() => changeTheme('coffee')}>Coffee</a></li>
    <li><a on:click={() => changeTheme('autumn')}>Autumn</a></li>
    <li><a on:click={() => changeTheme('business')}>Business</a></li>
    <li><a on:click={() => changeTheme('forest')}>Forest</a></li>
		<li><a on:click={() => changeTheme('night')}>Night</a></li>
    <li><a on:click={() => changeTheme('halloween')}>Halloween</a></li>
    <li><a on:click={() => changeTheme('pastel')}>Pastel</a></li>
    <li><a on:click={() => changeTheme('fantasy')}>Fantasy</a></li>
    <li><a on:click={() => changeTheme('emerald')}>Emerald</a></li>
    <li><a on:click={() => changeTheme('synthwave')}>Synthwave</a></li>
    <li><a on:click={() => changeTheme('winter')}>Winter</a></li>
    <li><a on:click={() => changeTheme('lofi')}>Lofi</a></li>
  </ul>
</div>

<div class="flex flex-col justify-center items-center gap-1  ">
  <!-- User Name -->
  <div class="relative group ">
    <div
      class="badge badge-outline text-lg px-4 py-2 h-[28px] text-center max-w-[120px] overflow-hidden"
    >
      <span class="truncate" title="{user}">
        {user}
      </span>
     
    </div>
 
  </div>
  
  
  
  
    <!-- Theme Toggle -->
    <div class="flex  items-center gap-2 w-28">
      {#each themes as themeOption}
        <label class="flex cursor-pointer items-center">
          <input
            type="radio"
            name="theme"
            value={themeOption}
            class="hidden "
            bind:group={activeTheme}
            on:change={() => setTheme(themeOption)}
          />
          <span class="btn btn-xs btn-outline {activeTheme === themeOption ? 'btn-active' : ''}">
            {themeOption === 'dark' ? '🌙' : themeOption === 'light' ? 'OS' : '⚙️'}
          </span>
        </label>
      {/each}
    </div>
  
    <!-- Logout Button -->
    <button class="btn btn-error btn-sm w-28" on:click={logout}>
      Logout
    </button>
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

	/* Custom Scrollbar for WebKit Browsers (Chrome, Safari, Edge) */
	/* Initially hide the scrollbar */
	.scrollbar-hidden::-webkit-scrollbar {
		width: 0;
		height: 0;
	}

	/* Show the scrollbar on hover */
	.scrollbar-hidden:hover::-webkit-scrollbar {
		width: 8px; /* Adjust the width as needed */
		height: 8px;
	}

	.scrollbar-hidden:hover::-webkit-scrollbar-thumb {
		background-color: #22c55e; /* Tailwind success color (green) */
		border-radius: 10px;
	}

	.scrollbar-hidden:hover::-webkit-scrollbar-track {
		background-color: #d1d5db; /* Tailwind gray-300 */
		border-radius: 10px;
	}

	/* For Firefox, hide the scrollbar by default */
	.scrollbar-hidden {
		scrollbar-width: none; /* Hide the scrollbar */
	}

	/* Show the scrollbar on hover for Firefox */
	.scrollbar-hidden:hover {
		scrollbar-width: thin; /* Show thin scrollbar on hover */
		scrollbar-color: #22c55e #d1d5db; /* Thumb and track colors */
	}
</style>
