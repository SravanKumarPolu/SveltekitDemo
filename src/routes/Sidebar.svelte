<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // Importing icons
  import { DashboardIcon, EcommerceIcon, DownloadReportIcon, RunningReportIcon, ReportIcon } from './icons';

  export let activePage = '';
  export let activeMainPage = 'reports';

  let navItems = []; // Initialize as an empty array
  let openSubMenus = {}; // State to track open submenus

  // Create a map to reference icons by name
  const iconMap = {
    DashboardIcon: DashboardIcon,
    EcommerceIcon: EcommerceIcon,
    DownloadReportIcon: DownloadReportIcon,
    RunningReportIcon: RunningReportIcon,
    ReportIcon: ReportIcon
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
                name: "Admin",
                route: "/",
                subitems: [
                  {
                    icon: "DashboardIcon",
                    name: "Run Tasks",
                    route: "/admin/tasks/"
                  },
                  {
                    icon: "DashboardIcon",
                    name: "User",
                    route: "admin/user/"
                  }
                ]
              }
            ],
            profile: [
              {
                icon: "ReportIcon",
                name: "Profile",
                route: "/reports",
                subitems: [
                  {
                    icon: "DashboardIcon",
                    name: "Change Password",
                    route: "/change-password/"
                  }
                ]
              }
            ],
            reports: [
              {
                icon: "ReportIcon",
                name: "Reports",
                subitems: [
                  {
                    icon: "DashboardIcon",
                    name: "Reports Classification",
                    route: "/reports"
                  }
                ]
              },
              {
                icon: "EcommerceIcon",
                name: "Reports Status",
                subitems: [
                  {
                    icon: "EcommerceIcon",
                    name: "Running",
                    route: "/reports/running-reports"
                  },
                  {
                    icon: "DashboardIcon",
                    name: "Completed",
                    route: "/reports/completed-reports"
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

        // Open the first item by default if it has subitems
        if (navItems.length > 0) {
          openSubMenus[navItems[0].name] = true;
        }
      }

      console.log('navItems:', navItems);
      console.log('openSubMenus:', openSubMenus);
    } catch (error) {
      console.error('Failed to load nav items:', error);
      navItems = [];
    }
  });

  // Function to handle page navigation
  function navigateToPage(page) {
    activePage = page;
    goto(page);
  }

  // Function to handle dashboard navigation
  function navigateToDashboardPage(name) {
    if (name) {
      goto(`/dashboard/${name.toLowerCase()}`);
    }
  }

  // Function to toggle submenu visibility, ensuring only one item is open at a time
  function toggleSubMenu(name) {
    openSubMenus = {
      // Set the clicked item to be open
      [name]: !openSubMenus[name],
    };
  }
</script>

<!-- Sidebar -->
<aside id="sidebar-multi-level-sidebar" class="fixed pt-4 top-16 left-0 z-40 w-64 h-[calc(100vh-64px)] transition-transform sm:translate-x-0 bg-base-100 shadow-lg" aria-label="Sidebar">
  <div class="h-full py-4 overflow-y-auto"> 
    <ul class="menu w-[260px] bg-base-100 text-base-content">
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
                <svg 
                  class="w-3 h-3 cursor-pointer transition-transform duration-300 {openSubMenus[item.name] ? 'rotate-180' : 'rotate-0'}" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 10 6"
                >
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
                        toggleSubMenu(item.name); // Close the submenu when a subitem is clicked
                      }}>
                      <!-- Subitem icon -->
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

