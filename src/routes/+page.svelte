<script>
  import { page } from "$app/stores";
  import logo from "$lib/Images/logo.png";
  import {
    selectedCustomersStore,
    selectedCarriersStore,
    selectedShippersStore,
    selectedShipperGroupsStore,
  } from "$lib/headerfiltersStore"; 
  import FilterModal from "$lib/HeaderFilterModal.svelte";

  let selectedCustomers = [];
  let selectedCarriers = [];
  let selectedShipperGroups = [];
  let selectedShippers = [];
  let appliedFilters = {
    customers: "No customers selected",
    shipperGroups: "No shipper groups selected",
    carriers: "No carriers selected",
    shippers: "No shippers selected",
  };

  // Show/Hide Menu for Small Layouts
  let showMenu = false;

  // Subscribe to stores for dynamic updates
  selectedCustomersStore.subscribe((value) => {
    selectedCustomers = value;
    appliedFilters.customers = selectedCustomers.length
      ? selectedCustomers.map((c) => c.name).join(", ")
      : "No customers selected";
  });

  selectedCarriersStore.subscribe((value) => {
    selectedCarriers = value;
    appliedFilters.carriers = selectedCarriers.length
      ? selectedCarriers.map((carrier) => carrier.name).join(", ")
      : "No carriers selected";
  });

  selectedShippersStore.subscribe((value) => {
    selectedShippers = value;
    appliedFilters.shippers = selectedShippers.length
      ? selectedShippers.map((shipper) => shipper.accountNumber).join(", ")
      : "No shippers selected";
  });

  selectedShipperGroupsStore.subscribe((value) => {
    selectedShipperGroups = value;
    appliedFilters.shipperGroups = selectedShipperGroups.length
      ? selectedShipperGroups.map((group) => group.groupName).join(", ")
      : "No shipper groups selected";
  });
</script>

<!-- Navbar Section -->
<div class="navbar fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-lg">
  <div class="flex-1">
    <a href="/" class="flex text-xl items-center">
      <img src={logo} alt="Logo" class="h-8 mr-2" /> KRISHNA
    </a>
     <!-- Desktop Navigation -->
  <nav class="hidden lg:flex">
    <ul class="menu menu-horizontal px-1 ">
      {#each [
        { path: "/admin", label: "Admin" },
        { path: "/", label: "Home" },
        { path: "/dashboard", label: "Dashboard" },
        { path: "/reports", label: "Reports" },
        { path: "/parcel", label: "Parcel" },
      ] as link}
        <li class={$page.url.pathname === link.path ? "active" : ""}>
          <a href={link.path} class="btn btn-ghost">{link.label}</a>
        </li>
      {/each}
    </ul>
  </nav>
  </div>

 

  <!-- Profile and Theme Selector (Desktop Only) -->
  <div class="hidden lg:flex items-center space-x-4">
    <!-- Filter Display -->
    <div class="text-sm space-y-1 hidden lg:block">
      {#each Object.keys(appliedFilters) as filterKey}
        <div class="truncate max-w-xs" title={appliedFilters[filterKey]}>
          <strong>{filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}:</strong> {appliedFilters[filterKey]}
        </div>
      {/each}
    </div>

    <!-- Theme Selector -->
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn m-1">Theme</label>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
        {#each ["default", "retro", "cyberpunk", "valentine", "aqua"] as theme}
          <li><button class="theme-controller" value={theme}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</button></li>
        {/each}
      </ul>
    </div>

    <!-- User Profile Menu -->
    <div class="dropdown dropdown-end">
      
       	<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar border-2 border-gray-400">
			<div class="bg-neutral text-neutral-content w-16 pt-1 rounded-full">
				<span class="text-xl">AI</span>
			</div>
		</div>
      
      <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
        <li><a href="/profile" class="justify-between">Profile <span class="badge">New</span></a></li>
        <li><a>Settings</a></li>
        <li><a href="/logout" class="btn btn-ghost" on:click={() => logout()}>Logout</a></li>
      </ul>
    </div>
  </div>

  <!-- Mobile Navigation (Hamburger Menu) -->
  <div class="lg:hidden flex items-center">
    <button class="btn btn-square btn-ghost" on:click={() => showMenu = !showMenu}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    
    <!-- Avatar Icon -->
    <div class="dropdown dropdown-end ml-2">
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img alt="User Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </label>
      <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
        <li><a href="/profile" class="justify-between">Profile <span class="badge">New</span></a></li>
        <li><a>Settings</a></li>
        <li><a href="/logout" class="btn btn-ghost" on:click={() => logout()}>Logout</a></li>
      </ul>
    </div>
  </div>

  {#if showMenu}
    <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 absolute right-0">
      {#each [
        { path: "/admin", label: "Admin" },
        { path: "/", label: "Home" },
        { path: "/dashboard", label: "Dashboard" },
        { path: "/reports", label: "Reports" },
        { path: "/parcel", label: "Parcel" },
      ] as link}
        <li><a href={link.path}>{link.label}</a></li>
      {/each}
    </ul>
  {/if}
</div>

<!-- Modal for Filter Options -->
<input type="checkbox" id="filter-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box w-11/12 max-w-4xl">
    <FilterModal bind:selectedCustomers bind:selectedShippers bind:selectedCarriers />
  </div>
</div>

<style>
  .navbar {
    height: 6rem; /* Adjust to match the height of the header */
  }

  .menu.menu-horizontal > li > a {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
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
</style>
