<script>
	import { page } from "$app/stores";     
 import { CustomersIcon } from "$lib/HeaderIcon.js"
  import { CarrierIcon } from "$lib/HeaderIcon.js"
   import { DateIcon } from "$lib/HeaderIcon.js"
   import { ShipperGroupIcon } from "$lib/HeaderIcon.js"
   import { ShippersIcon} from "$lib/HeaderIcon.js"
   import { CurrencyIcon } from "$lib/HeaderIcon.js"
      import { FilterIcon } from "$lib/HeaderIcon.js"
        import { MenubarIcon } from "$lib/HeaderIcon.js"
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
 let Date="12-09-1025 To 1024-8-19"
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
    <a href="/profile" class="hidden lg:flex items-center text-xl font-bold space-x-1 group">
      <span class="text-primary w-28 truncate">P.V.Sravan Kumar</span>
      <span
        class="absolute left-0 top-full mt-1 hidden bg-gray-800 text-white text-sm px-2 py-1 rounded group-hover:block"
      >
        P.V.Sravan Kumar
      </span>
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
      {@html MenubarIcon}
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
    class="flex flex-col sm:flex-row sm:gap-2 sm:w-auto h-auto mb-2 md:h-[8rem] w-full md:w-[19rem] 
     md:grid md:grid-cols-4 lg:grid-cols-4 font-bold "
  >

    <!-- Item 1 (Customers) -->
    <div class="flex items-center col-span-2 space-x-3 relative group">
      <div class="flex items-center">
        <div class="badge badge-primary">
          <span>{@html CustomersIcon}</span>
        </div>
        <span>&#58;</span>
      </div>
      <span class="truncate w-[160px]">{appliedFilters.customers}</span>
      <!-- Tooltip for hover -->
      <span
        class="absolute left-0 top-full  hidden bg-gray-700 text-white text-sm px-3 py-2 rounded group-hover:block z-30"
      >
        {appliedFilters.customers}
      </span>
    </div>
  
    <!-- Item 2 (Carriers) -->
    <div class="flex items-center col-span-2 space-x-3 relative group">
      <div class="flex items-center">
        <div class="badge badge-secondary">
          <span>{@html CarrierIcon}</span>
        </div>
        <span>&#58;</span>
      </div>
      <span class="truncate w-[160px]">{appliedFilters.carriers}</span>
      <!-- Tooltip for hover -->
      <span
        class="absolute left-0 top-full  hidden bg-gray-700 text-white text-sm px-3 py-2 rounded group-hover:block z-30"
      >
        {appliedFilters.carriers}
      </span>
    </div>
  
    <!-- Item 3 (Date) -->
    <div class="flex items-center col-span-4 space-x-3 relative group">
      <div class="flex items-center">
        <div class="badge badge-accent">
          <span>{@html DateIcon}</span>
        </div>
        <span>&#58;</span>
      </div>
      <span class="truncate w-[320px]">Invoice: {Date}</span>
      <!-- Tooltip for hover -->
      <span
        class="absolute left-0 top-full  hidden bg-gray-700 text-white text-sm px-3 py-2 rounded group-hover:block z-30 max-w-[400px] whitespace-normal"
      >
        Invoice date: {Date}
      </span>
    </div>
  
    <!-- Item 4 (Shipper Groups) -->
    <div class="flex items-center col-span-2 space-x-3 relative group">
      <div class="flex items-center">
        <div class="badge badge-info">
          <span>{@html ShipperGroupIcon}</span>
        </div>
        <span>&#58;</span>
      </div>
      <span class="truncate w-[160px]">{appliedFilters.shipperGroups}</span>
      <!-- Tooltip for hover -->
      <span
        class="absolute left-0 top-full  hidden bg-gray-700 text-white text-sm px-3 py-2 rounded group-hover:block z-30"
      >
        {appliedFilters.shipperGroups}
      </span>
    </div>
  
    <!-- Item 5 (Shippers) -->
    <div class="flex items-center col-span-2 space-x-3 relative group">
      <div class="flex items-center">
        <div class="badge badge-warning">
          <span>{@html ShippersIcon}</span>
        </div>
        <span>&#58;</span>
      </div>
      <span class="truncate w-[160px]">{appliedFilters.shippers}</span>
      <!-- Tooltip for hover -->
      <span
        class="absolute left-0 top-full  hidden bg-gray-700 text-white text-sm px-3 py-2 rounded group-hover:block z-30"
      >
        {appliedFilters.shippers}
      </span>
    </div>
  
    <!-- Item 6 (Currencies) -->
    <div class="flex items-center col-span-3 space-x-3 relative group">
      <div class="flex items-center">
        <div class="badge badge-success">
          <span>{@html CurrencyIcon}</span>
        </div>
        <span>&#58;</span>
      </div>
      <span class="truncate w-[160px]">{appliedFilters.selectedCurrencies}</span>
      <!-- Tooltip for hover -->
      <span
        class="absolute left-0 top-full  hidden bg-gray-700 text-white text-sm px-3 py-2 rounded group-hover:block z-30"
      >
        {appliedFilters.selectedCurrencies}
      </span>
    </div>
  </div>
  

  </div>
  
  


			<!-- Filter Icon (Shown only when activeMainPage is 'reports', 'dashboard', or 'parcel') -->
			<div class="btn btn-square btn-ghost item-center">
        <span>{@html FilterIcon }</span> 
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
      <span class="text-primary w-20 truncate">   {user}</span>
      <span
        class="absolute left-0 top-full w-auto mt-1 hidden bg-primary text-secondary text-sm px-2 py-1 rounded group-hover:block"
      >
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
