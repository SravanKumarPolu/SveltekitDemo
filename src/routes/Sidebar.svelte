<script>
   import { onMount } from 'svelte';
   import { goto } from '$app/navigation'; 
  
 
   // Importing icons
   import { DashboardIcon, EcommerceIcon,DownloadReportIcon, RunningReportIcon, ReportIcon } from './icons';
   let dashboardConfig = { navItems: [] };  // Initialize dashboard config

   export let activePage = '';
   export let activeMainPage = 'reports';

   let navItems = [];  // Initialize as an empty array
   let openSubMenus = {}; // State to track open submenus
 
   // Create a map to reference icons by name
   const iconMap = {
     DashboardIcon: DashboardIcon,
     EcommerceIcon: EcommerceIcon,
     DownloadReportIcon:DownloadReportIcon,
     RunningReportIcon:RunningReportIcon,
     ReportIcon: ReportIcon
     // Add other icons as needed
   };
 
   onMount(async () => {
     try {
  
  
       const data = [{
    "id": 1,
    "username": "subba",
    "navItems": {
        "admin": [
            {
                "icon": "EcommerceIcon",
                "name": "Admin",
                "route": "/",
                "subitems": [
                    {
                        "icon": "DashboardIcon",
                        "name": "Run Tasks",
                        "route": "/admin/tasks/"
                    },
                    {
                        "icon": "DashboardIcon",
                        "name": "User",
                        "route": "admin/user/"
                    }
                ]
            }
        ],
        "parcel": [
            {
                "name": "Invoice Search",
                "route": "summary"
            }
        ],
        "profile": [
            {
                "icon": "ReportIcon",
                "name": "Profile",
                "route": "/reports",
                "subitems": [
                    {
                        "icon": "DashboardIcon",
                        "name": "Change Password",
                        "route": "/change-password/"
                    }
                ]
            }
        ],
        "reports": [
            {
                "icon": "ReportIcon",
                "name": "Reports",
                "subitems": [
                    {
                        "icon": "DashboardIcon",
                        "name": "Reports Classification",
                        "route": "/reports"
                    }
                ]
            },
            {
                "icon": "EcommerceIcon",
                "name": "Reports Status",
                "subitems": [
                    {
                        "icon": "EcommerceIcon",
                        "name": "Running",
                        "route": "/reports/running-reports"
                    },
                    {
                        "icon": "DashboardIcon",
                        "name": "Completed",
                        "route": "/reports/completed-reports"
                    }
                ]
            }
        ],
        "dashboards": [
            {
                "icon": "DashboardIcon",
                "name": "Dashboards",
                "route": "/reports",
                "subitems": [
                    {
                        "icon": "DashboardIcon",
                        "name": "Spend",
                        "chatIds": [
                            5,
                            6
                        ]
                    },
                    {
                        "icon": "DashboardIcon",
                        "name": "GEOMapsPage",
                        "chatIds": [
                            4
                        ]
                    },
                    {
                        "icon": "DashboardIcon",
                        "name": "AnalyticsPage",
                        "chatIds": [
                            1,
                            2
                        ]
                    },
                    {
                        "icon": "DashboardIcon",
                        "name": "SavingsPage",
                        "chatIds": [
                            4,
                            2
                        ]
                    },
                    {
                        "icon": "DashboardIcon",
                        "name": "OverviewPage",
                        "chatIds": [
                            1,
                            2,
                            3
                        ]
                    }
                ]
            }
        ]
    }
}];  // Fallback to an empty object if data is not found
 
       // Ensure that navItems is an array before using it
       navItems = Array.isArray(data) ? data : Object.values(data);
 console.log(navItems);
     
         navItems = [
            {
                "icon": "ReportIcon",
                "name": "Reports",
                "subitems": [
                    {
                        "icon": "DashboardIcon",
                        "name": "Reports Classification",
                        "route": "/reports"
                    }
                ]
            },
            {
                "icon": "EcommerceIcon",
                "name": "Reports Status",
                "subitems": [
                    {
                        "icon": "EcommerceIcon",
                        "name": "Running",
                        "route": "/reports/running-reports"
                    },
                    {
                        "icon": "DashboardIcon",
                        "name": "Completed",
                        "route": "/reports/completed-reports"
                    }
                ]
            }
        ];
       
 
       // Initialize openSubMenus state and default expand the submenu
       navItems.forEach(item => {
         openSubMenus[item.name] = item.subitems && item.subitems.length > 0; // Expand by default if there are subitems
       });
       
     } catch (error) {
       console.error('Failed to load nav items:', error);
       navItems = [];  // Fallback to an empty array in case of an error
     }
   });
 

  
   function navigateToPage(page) { 
         activePage = page;
         goto(page); 
   }
 
   
  // Function to handle navigation
  function navigateToDashboardPage(name) {
    if (name) {
      goto(`/dashboard/${name.toLowerCase()}`);
    }
  }

   function toggleSubMenu(name) {
     openSubMenus = { ...openSubMenus, [name]: !openSubMenus[name] };
   }



 </script>
<aside id="sidebar-multi-level-sidebar" class="fixed top-16 left-0 mt-4 z-40 w-68 h-[calc(100vh-64px)] transition-transform -translate-x-full sm:translate-x-0 bg-base-100 shadow-lg" aria-label="Sidebar">
  <div class="h-full flex flex-col py-4 overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"> 
    <ul class="menu py-4 w-72 bg-base-100 text-base-content h-full">
      {#each navItems as item}
        <li class="menu-dropdown">
          <a 
            href="#" 
            class="menu-button flex items-center {activePage === item.route ? 'bg-primary text-white' : ''}" 
            on:click|preventDefault={() => toggleSubMenu(item.name)}>
            <div class="icon">
              {@html iconMap[item.icon] || ''}
            </div>
            <span class="flex-1 ms-2">{item.name}</span>

            {#if item.subitems && item.subitems.length > 0}
              <svg class="w-3 h-3 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d={openSubMenus[item.name] ? "m1 5 4-4 4 4" : "m1 1 4 4 4-4"} />
              </svg>
            {/if}
          </a>

        <ul class={`menu-sub ml-6 transition-transform duration-500 ease-in-out ${openSubMenus[item.name] ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'} overflow-hidden`}>
  {#if openSubMenus[item.name]}
    {#each item.subitems as subitem}
      <li class={`mb-2 py-1 ${activePage === subitem.route ? 'bg-primary text-white' : ''}`}>
        <a 
          href="#" 
          class="flex items-center {activePage === subitem.route ? 'bg-primary text-white' : ''}" 
          on:click|preventDefault={() => navigateToPage(subitem.route)}>
          <div class="icon mr-2">
            {@html iconMap[subitem.icon] || ''}
          </div>
          <span class="truncate w-[7.6rem]">{subitem.name}</span>
        </a>
      </li>
    {/each}
  {/if}
</ul>

        </li>
      {/each}
    </ul>
  </div>
</aside>


