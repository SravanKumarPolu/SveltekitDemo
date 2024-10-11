<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation'; 
  import API from '$lib/api';

  // Importing icons
  import { DashboardIcon, EcommerceIcon, DownloadReportIcon, RunningReportIcon, ReportIcon } from '$lib/icons';
  let dashboardConfig = { navItems: [] };  // Initialize dashboard config

  export let activePage = '';
  export let activeMainPage = '';

  let navItems = [];  // Initialize as an empty array
  let openSubMenu = ''; // State to track the open submenu
  let isSidebarOpen = false; // State to control sidebar visibility for mobile

  // Create a map to reference icons by name
  const iconMap = {
    DashboardIcon: DashboardIcon,
    EcommerceIcon: EcommerceIcon,
    DownloadReportIcon: DownloadReportIcon,
    RunningReportIcon: RunningReportIcon,
    ReportIcon: ReportIcon
  };

  onMount(async () => {
    try {
      const res = await API.get('/reports-nav-items');
      const data = res.data.navItems || {};  // Fallback to an empty object if data is not found

      // Ensure that navItems is an array before using it
      navItems = Array.isArray(data) ? data : Object.values(data);

      if (activeMainPage === 'reports') {
        navItems = Array.isArray(data.reports) ? data.reports : [];
      } else if (activeMainPage === 'dashboard') {
        navItems = Array.isArray(data.dashboards) ? data.dashboards : [];
      } else if (activeMainPage === 'profile') {
        navItems = Array.isArray(data.profile) ? data.profile : [];
      } else if (activeMainPage === 'admin') {
        navItems = Array.isArray(data.admin) ? data.admin : [];      
      } else if (activeMainPage === 'parcel') {
        navItems = Array.isArray(data.parcel) ? data.parcel : [];
      }

      // Open the first submenu by default if there are items
      if (navItems.length > 0) {
        openSubMenu = navItems[0].name;
      }
      
    } catch (error) {
      console.error('Failed to load nav items:', error);
      navItems = [];  // Fallback to an empty array in case of an error
    }
  });

  function navigateToPage(page) { 
    activePage = page;
    goto(page); 
  }

  function navigateToDashboardPage(name) {
    if (name) {
      goto(`/dashboard/${name.toLowerCase()}`);
    }
  }

  function toggleSubMenu(name) {
    openSubMenu = openSubMenu === name ? '' : name;
  }

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
</script>

<!-- Mobile Menu Button -->
<button class="sm:hidden p-2 bg-primary text-white fixed top-4 left-4 z-50" on:click={toggleSidebar} aria-label="Toggle sidebar">
  <!-- SVG for Menu Icon -->
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

<!-- Sidebar -->
<aside 
  id="sidebar-multi-level-sidebar" 
  class="fixed pt-4 top-16 left-0 z-40 w-64 h-[calc(100vh-64px)] bg-base-100 shadow-lg transition-transform duration-300 transform sm:translate-x-0"
  class:translate-x-0={isSidebarOpen} 
  class:-translate-x-full={!isSidebarOpen}
  aria-label="Sidebar"
>
  <div class="h-full py-4 overflow-y-auto"> 
    <ul class="menu w-[260px] bg-base-100 text-base-content">
      {#if navItems.length > 0}
        {#each navItems as item}
          <li class="menu-dropdown">
            <a href="#" class="menu-button flex items-center {activePage === item.route ? 'bg-primary text-white' : ''}" on:click|preventDefault={() => item.subitems && toggleSubMenu(item.name)}>
              <div class="icon mr-2">
                {@html iconMap[item.icon] || ''}
              </div>
              <span class="flex-1 ms-2">{item.name}</span>
              {#if item.subitems && item.subitems.length > 0}
                <svg 
                  class="w-3 h-3 cursor-pointer transition-transform duration-300 {openSubMenu === item.name ? 'rotate-180' : 'rotate-0'}" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 10 6"
                >
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
              {/if}
            </a>

            {#if item.subitems && item.subitems.length > 0 && openSubMenu === item.name}
              <ul class="menu-sub pl-4">
                {#each item.subitems as subitem}
                  <li class={activePage === subitem.route ? 'bg-primary text-white' : ''}>
                    <a 
                      href="#" 
                      class="flex items-center {activePage === subitem.route ? 'bg-primary text-white' : ''}" 
                      on:click|preventDefault={() => {
                        if (activeMainPage === 'dashboard') {
                          navigateToDashboardPage(subitem.name);
                        } else {
                          navigateToPage(subitem.route);
                        }
                        toggleSubMenu(item.name);
                        toggleSidebar(); // Close sidebar on mobile when a subitem is clicked
                      }}>
                      <div class="icon mr-2">
                        {@html iconMap[subitem.icon] || ''}
                      </div>
                      <span class="truncate w-[7.6rem]" title={subitem.name}>
                        {subitem.name}
                      </span>
                    </a>
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      {/if}
    </ul> 
  </div>
</aside>
