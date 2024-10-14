<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation'; 
  import API from '$lib/api';

  // Importing icons
  import { DashboardIcon, EcommerceIcon, DownloadReportIcon, RunningReportIcon, ReportIcon } from '$lib/icons';
  
  export let activePage = '';
  export let activeMainPage = '';

  let navItems = [];  // Menu items
  let openSubMenus = {}; // Track open/closed state of submenus

  // Map icons to their names
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

      // Filter navItems based on activeMainPage
      const pageSections = ['reports', 'dashboard', 'profile', 'admin', 'parcel'];
      if (pageSections.includes(activeMainPage)) {
        navItems = Array.isArray(data[activeMainPage]) ? data[activeMainPage] : [];
      }

      // Initialize submenus (expanded if subitems exist)
      navItems.forEach(item => {
        openSubMenus[item.name] = item.subitems && item.subitems.length > 0;
      });
    } catch (error) {
      console.error('Failed to load nav items:', error);
      navItems = [];  // Fallback to empty if error occurs
    }
  });

  // Navigation handler for both main and sub-items
  function handleNavigation(item, isSubItem = false) {
    if (item.subitems) {
      toggleSubMenu(item.name);
    } else if (isSubItem && activeMainPage === 'dashboard') {
      // Keep sidebar and submenu open while navigating to the subitem
      activePage = item.name.toLowerCase();
      goto(`/dashboard/${activePage}`);
    } else {
      activePage = item.route;
      goto(item.route);
    }
  }

  // Toggle the visibility of submenus
  function toggleSubMenu(name) {
    openSubMenus = { ...openSubMenus, [name]: !openSubMenus[name] };
  }
</script>

<!-- Sidebar -->
<aside id="sidebar-multi-level-sidebar" class="fixed top-16 left-0 z-40 w-64 h-[calc(100vh-64px)] bg-base-100 shadow-lg" aria-label="Sidebar">
 <div class="h-full px-3 py-4 overflow-y-auto"> 
   <ul class="menu p-4 w-[260px] bg-base-100 text-base-content">
     {#if navItems.length > 0}
       {#each navItems as item}
         <li class="menu-dropdown">
           <a href="#" class="menu-button flex items-center {activePage === item.route ? 'bg-primary text-white' : ''}" on:click|preventDefault={() => handleNavigation(item)}>
             <!-- Main item icon -->
             <div class="icon mr-2">
               {@html iconMap[item.icon] || ''}
             </div>
             <span class="flex-1 ms-2">{item.name}</span>
             
             {#if item.subitems && item.subitems.length > 0}
               <svg class="w-3 h-3 cursor-pointer transform transition-transform duration-200 {openSubMenus[item.name] ? 'rotate-180' : ''}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                 <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
               </svg>
             {/if}
           </a>

           <!-- Submenu Items -->
           {#if item.subitems && item.subitems.length > 0 && openSubMenus[item.name]}
             <ul class="menu-sub pl-4">
               {#each item.subitems as subitem}
                 <li class={activePage === subitem.route ? 'bg-primary text-white' : ''}>
                   <a 
                     href="#" 
                     class="flex items-center {activePage === subitem.route ? 'bg-primary text-white' : ''}" 
                     on:click|preventDefault={() => handleNavigation(subitem, true)}>
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
