<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // Importing icons
  import { DashboardIcon, EcommerceIcon, DownloadReportIcon, RunningReportIcon, ReportIcon } from './icons';

  export let activePage = ''; // Current active subitem route
  export let activeMainPage = 'reports'; // Set main page context

  let navItems = []; // Initialize as an empty array
  let openSubMenus = {}; // State to track open submenus

  // Create a map to reference icons by name
  const iconMap = {
    DashboardIcon,
    EcommerceIcon,
    DownloadReportIcon,
    RunningReportIcon,
    ReportIcon
  };

  onMount(() => {
    try {
      const data = [
        {
          id: 1,
          username: "subba",
          navItems: {
            admin: [
              {
                icon: "EcommerceIcon",
                name: "Admins",
                route: "/", // Unique route
                subitems: [
                  {
                    icon: "DashboardIcon",
                    name: "Run Tasks",
                    route: "/admin/tasks/" // Unique route
                  },
                  {
                    icon: "DashboardIcon",
                    name: "User",
                    route: "/admin/user/" // Unique route
                  }
                ]
              },
              {
                icon: "EcommerceIcon",
                name: "Admins reports adiminfghjk",
                route: "/admin/reports", // Unique route
                subitems: [
                  {
                    icon: "DashboardIcon",
                    name: "Run Tasks",
                    route: "/admin/reports/tasks/" // Unique route
                  },
                  {
                    icon: "DashboardIcon",
                    name: "User",
                    route: "/admin/reports/user/" // Unique route
                  }
                ]
              }
            ],
            profile: [
              {
                icon: "ReportIcon",
                name: "Profiles",
                route: "/", // Unique route
                subitems: [
                  {
                    icon: "DashboardIcon",
                    name: "Change Password",
                    route: "/profile/change-password/" // Unique route
                  }
                ]
              }
            ],
            reports: [
              {
                icon: "ReportIcon",
                name: "Reports",
                route: "/reports", // Unique route
                subitems: [
                  {
                    icon: "DashboardIcon",
                    name: "Reports Classification",
                    route: "/reports/classification/" // Unique route
                  }
                ]
              },
              {
                icon: "EcommerceIcon",
                name: "Reports Status",
                route: "/", // Unique route
                subitems: [
                  {
                    icon: "EcommerceIcon",
                    name: "Running",
                    route: "/reports/status/running/" // Unique route
                  },
                  {
                    icon: "DashboardIcon",
                    name: "Completed",
                    route: "/reports/status/completed/" // Unique route
                  }
                ]
              }
            ]
          }
        }
      ];

      // Set navItems based on the data structure
      if (Array.isArray(data) && data.length > 0) {
        navItems = Object.entries(data[0].navItems).map(([key, value]) => ({
          name: key,
          subitems: value,
        }));

        // Open all items by default
        navItems.forEach(item => {
          openSubMenus[item.name] = true;
        });
      }

    } catch (error) {
      console.error('Failed to load nav items:', error);
      navItems = [];
    }
  });

  // Function to handle page navigation
  function navigateToPage(page) {
    activePage = page;  // Update the active page to the clicked subitem's route
    goto(page); // Navigate to the subitem's page
  }


  // Function to toggle submenu visibility (on click)
  function toggleSubMenu(name) {
    openSubMenus[name] = !openSubMenus[name]; // Toggle the submenu
  }
</script>

<!-- Sidebar -->
<aside id="sidebar-multi-level-sidebar" class="fixed top-16 left-0 z-40 w-64 h-[calc(100vh-64px)] transition-transform -translate-x-full sm:translate-x-0 bg-base-100 shadow-lg" aria-label="Sidebar">
  <div class="h-full mt-4 py-4 overflow-y-auto"> 
    <ul class="menu w-[240px] bg-base-100 text-base-content">
      {#if navItems.length > 0}
        {#each navItems as item}
          <li class="menu-dropdown">
            <a href="#" class="menu-button flex items-center" on:click|preventDefault={() => item.subitems && toggleSubMenu(item.name)}>
              <!-- Main item icon -->
              <div class="icon mr-2">
                {@html iconMap[item.icon] || ''}
              </div>
              <span class="flex-1 ms-2">{item.name}</span>
              
              {#if item.subitems && item.subitems.length > 0}
                <svg class="w-3 h-3 cursor-pointer transition-transform duration-300 {openSubMenus[item.name] ? 'rotate-180' : 'rotate-0'}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
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
                    on:click|preventDefault={() => navigateToPage(subitem.route)}>
                    
                 <div class="flex justify-start">
                     <!-- Subitem icon -->
                     <div class="icon mr-2">
                      {@html iconMap[subitem.icon] || ''}
                    </div>
                  
                    <!-- Tooltip container -->
                    <div class="relative">
                      <!-- The visible truncated text -->
                      <span class="truncate max-w-32 tooltip text-left" title={subitem.name}>
                        {subitem.name}
                      </span>
                    </div>
                 </div>
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

