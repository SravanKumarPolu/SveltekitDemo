<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation'; 
  import API from '$lib/api';
  import { DashboardIcon, EcommerceIcon, DownloadReportIcon, RunningReportIcon, ReportIcon } from '$lib/icons';

  export let activePage = '';
  export let activeMainPage = '';

  let navItems = [];
  let openSubMenus = {};

  const iconMap = {
    DashboardIcon,
    EcommerceIcon,
    DownloadReportIcon,
    RunningReportIcon,
    ReportIcon
  };

  onMount(async () => {
    try {
      const res = await API.get('/reports-nav-items');
      const data = res.data.navItems || {};
      
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

      navItems.forEach(item => {
        openSubMenus[item.name] = item.subitems && item.subitems.length > 0;
      });
      
    } catch (error) {
      console.error('Failed to load nav items:', error);
      navItems = [];
    }
  });

  function navigateToPage(page) {
    activePage = page;
    goto(page);
  }

  function navigateToDashboardPage(name) {
    if (name) {
      goto(`/dashboard/${name.toLowerCase()}`);
      activePage = `/dashboard/${name.toLowerCase()}`;
    }
  }

  function toggleSubMenu(name) {
    openSubMenus = { ...openSubMenus, [name]: !openSubMenus[name] };
  }
</script>

<!-- Sidebar -->
<aside id="sidebar-multi-level-sidebar" class="fixed top-16 left-0 z-40 w-64 h-[calc(100vh-64px)] transition-transform -translate-x-full sm:translate-x-0 bg-base-100 shadow-lg" aria-label="Sidebar">
  <div class="h-full px-3 py-4 overflow-y-auto"> 
    <ul class="menu p-4 w-[260px] bg-base-100 text-base-content">
      {#if navItems.length > 0}
        {#each navItems as item}
          <li class="menu-dropdown">
            <a href="#" class="menu-button flex items-center {activePage === item.route ? 'bg-primary text-white' : ''}" on:click|preventDefault={() => item.subitems && toggleSubMenu(item.name)}>
              <!-- Main item icon -->
              <div class="icon mr-2">
                {@html iconMap[item.icon] || ''}
              </div>
              <span class="flex-1 ms-2">{item.name}</span>
              {#if item.subitems && item.subitems.length > 0}
                <svg class="w-3 h-3 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" on:click|preventDefault={() => toggleSubMenu(item.name)}>
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                </svg>
              {/if}
            </a>

            {#if item.subitems && item.subitems.length > 0 && openSubMenus[item.name]}
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
                      }}>
                      <!-- Subitem icon -->
                      <div class="icon mr-2">
                        {@html iconMap[subitem.icon] || ''}
                      </div>
                      <span class="truncate w-40 ">
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
