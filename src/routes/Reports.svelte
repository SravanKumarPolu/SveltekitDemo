
<script>
  import { onMount } from 'svelte'; 
  import { writable, derived,get } from 'svelte/store';

  import rsdata from '$lib/rsdata.json'; // Imported JSON data

  let downloadReportsList = writable([]);
  let currentPage = writable(1);
  let itemsPerPage = writable(6);
  let statusFilter = writable(['All']); // Default to 'All'

  const backendUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Current Date for display
  let currentDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Converts milliseconds to HH:mm:ss format
  function millisToTime(millis) {
    if (!millis) return '00:00:00'; // Default for invalid or null values

    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((millis % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

 // Utility function to return appropriate Tailwind CSS classes
function getStatusStyles(status) {
  switch (status) {
    case 'Failed':
      return 'bg-red-500'; // Tailwind's error color
    case 'Running':
      return 'bg-primary '; // Tailwind's primary color or a different one
    case 'Completed':
      return 'bg-green-500'; // Success state
    case 'Scheduled':
      return 'bg-yellow-500'; // Scheduled state color
    default:
      return 'bg-gray-300'; // Default state
  }
}


  // Derived store for filtered reports based on selected filters
  const filteredReports = derived(
    [downloadReportsList, statusFilter],
    ([$downloadReportsList, $statusFilter]) => {
      if ($statusFilter.length === 0 || $statusFilter.includes('All')) {
        return $downloadReportsList;
      }
      return $downloadReportsList.filter(report => $statusFilter.includes(report.status));
    }
  );

  // Derived store for total pages based on filtered reports
  const totalPages = derived([filteredReports, itemsPerPage], ([$filteredReports, $itemsPerPage]) => {
    return Math.ceil($filteredReports.length / $itemsPerPage);
  });

  // Fetch reports on mount
  onMount(() => {
    fetchReports();
  });

  // Function to fetch reports (simulating reloading data)
  function fetchReports() {
    try {
      downloadReportsList.set(rsdata); // Load data from JSON
      console.log("Fetched Reports List from lib:", rsdata);
    } catch (error) {
      console.error("There was an error loading the reports:", error.message);
    }
  }

  // Format date into readable format
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Download a file
  function downloadFile(filePath) {
    const link = document.createElement('a');
    link.href = `${backendUrl}/download-report/${encodeURIComponent(filePath)}`;
    link.setAttribute('download', filePath.split('/').pop());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

    //  Refresh card
  function refreshCard(reportId) {
    const updatedReport = rsdata.find(report => report.id === reportId);
    if (updatedReport) {
      downloadReportsList.update(reports => {
        return reports.map(report => (report.id === reportId ? updatedReport : report));
      });
    }
  }
  
  function deleteReport(reportId) {
    downloadReportsList.update(reports => reports.filter(report => report.id !== reportId));
  }
  // Pagination controls
  function nextPage() {
    currentPage.update(n => n + 1);
  }

  function prevPage() {
    currentPage.update(n => n > 1 ? n - 1 : n);
  }

  function changeItemsPerPage(event) {
    itemsPerPage.set(parseInt(event.target.value, 10));
    currentPage.set(1); 
  }

  // Enhanced Refresh Function
function refreshPage() {
  const currentFilters = get(statusFilter); // Preserve the current status filters
  const currentPageValue = get(currentPage); // Preserve the current page

  fetchReports(); // Reload the data

  // Update the displayed date
  currentDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Reapply the preserved filters and page after data reload
  statusFilter.set(currentFilters);
  currentPage.set(currentPageValue);
}
  // Toggle status filters for checkboxes
  function toggleStatusFilter(status) {
    statusFilter.update(filters => {
      if (status === 'All') {
        return ['All']; // Reset to 'All' if 'All' is clicked
      } else {
        // Remove 'All' if a specific status is clicked
        const updatedFilters = filters.filter(f => f !== 'All');

        if (updatedFilters.includes(status)) {
          return updatedFilters.filter(filter => filter !== status); // Deselect status
        } else {
          return [...updatedFilters, status]; // Select new status
        }
      }
    });

    currentPage.set(1); // Reset to first page
  }

  
</script>


<div class="container h-[70%] mx-auto px-4 py-8">
  <!-- Header Section with Background -->
  <!-- Header Section with Background -->
<div class="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-semibold text-gray-800">Reports</h2>

    <!-- Checkboxes for Status Filters -->
    <div class="flex justify-center space-x-4">
      {#each ['All', 'Completed', 'Failed', 'Running', 'Scheduled', 'Demand'] as status}
        <label class="inline-flex items-center space-x-2">
          <input 
            type="checkbox" 
            class="checkbox checkbox-primary" 
            on:change={() => toggleStatusFilter(status)} 
            checked={$statusFilter.includes(status)} 
          />
          <span>{status}</span>
        </label>
      {/each}
    </div>

    <!-- Refresh Button -->
    <button class="btn btn-primary" on:click={refreshPage}>Refresh</button>
  </div>

  <!-- Refresh Status Section -->
  <div class="flex justify-start items-center gap-1">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
      class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.396.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.33-.314-.16-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.613.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
    <p>
      If you need the newly added data after 
      <span class="text-semisolid">{currentDate}</span>, click Refresh.
    </p>
  </div>
</div>


  <!-- Cards Container with Scrollbar -->
  <div class="h-[30rem] overflow-y-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each $filteredReports.slice(($currentPage - 1) * $itemsPerPage, $currentPage * $itemsPerPage) as report, index (report.id)}
      <div class="card bg-gradient-to-r from-white via-gray-100 to-gray-50 shadow-lg rounded-xl transition-transform transform hover:scale-110 duration-500 ease-in-out border border-gray-500 hover:shadow-2xl">
        
      
<!-- Card Header -->
<div 
  class={`card-header p-4 text-left rounded-t-md text-primary-content
    ${getStatusStyles(report.status)}`}
>
  <p class="text-white text-sm my-2">
    <span 
      class="multiline-ellipsis min-h-[3.4rem] tooltip tooltip-top text-sm text-start font-semibold ml-1"
      title={report.fileName || 'N/A'}
      style="line-height: 1.2rem; max-height: 5rem;"
    >
      {report.fileName || 'N/A'}
    </span>
  </p>
</div>

  
        <!-- Card Body -->
        <div class="card-body p-6 text-left">
          <p class="text-gray-600">
            Format: <span class="font-semibold">{report.format || 'N/A'}</span>
          </p>
          <p class="text-gray-600">
            File Size: <span class="font-semibold">{report.fileSizeInKbs ? `${report.fileSizeInKbs} KB` : 'N/A'}</span>
          </p>
          <p class="text-gray-600">Status: <span class="font-semibold">{report.status || 'N/A'}</span></p>
          <p class="text-gray-600">
            Completed: <span class="font-semibold">
              {report.completionDate ? formatDate(report.completionDate) : 'N/A'}
            </span>
          </p>
          <p class="text-gray-600">
            Expires: <span class="font-semibold">
              {report.expiresDate ? formatDate(report.expiresDate) : 'N/A'}
            </span>
          </p>
          <p class="text-gray-600">
            Time Taken (HH:mm:ss): <span class="font-semibold">
              {report.queryRuntimeInMillis ? millisToTime(report.queryRuntimeInMillis) : 'N/A'}
            </span>
          </p>
          <p class="text-gray-600">
            Last Updated Date: <span class="font-semibold">
              {report.lastUpdatedDate ? formatDate(report.lastUpdatedDate) : 'N/A'}
            </span>
          </p>
        
        </div>
  
        <!-- Card Footer -->
        <div class="card-footer p-4 bg-gray-100 flex justify-between items-center rounded-b-xl gap-1">
          
          <!-- Status Button -->
          {#if report.status === 'Failed'}
            <button class="btn btn-error btn-sm flex items-center" title="Error">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
              stroke-width="1.8" stroke="currentColor" class="w-7 h-7">
                <path stroke-linecap="round" stroke-linejoin="round" 
                      d="M12 8.25v3m0 4.5h.008v-.008H12v.008zM12 21a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
            </button>
          {:else if report.status === 'Running'}
            <button class="btn btn-primary btn-sm flex items-center" title="Running">
              <span class="loading loading-spinner mr-2"></span>
            </button>
          {:else}
            <button 
              class="btn btn-success btn-sm flex items-center" title="Download"
              on:click={() => downloadFile(report.filePath)}
              disabled={!report.filePath}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
              stroke-width="1.8" stroke="currentColor" class="w-7 h-7">
                <path stroke-linecap="round" stroke-linejoin="round" 
                      d="M3 16.5v3a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-3m-4.5-9L12 15m0 0L8.25 10.5M12 15V3" />
              </svg>
            </button>
          {/if}
  
          <!-- Delete Button -->
          <button class="btn btn-outline btn-error btn-sm flex items-center" title="Delete" on:click={() => deleteReport(report.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                 stroke-width="1.8" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" 
                    d="M19.5 6.75L4.5 6.75M9.75 6.75V5.25a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v1.5m5.25 0V21a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 21V6.75h15z" />
            </svg>
          </button>
  
          <!-- Upload Button -->
          <button class="btn btn-outline btn-primary btn-sm flex items-center" title="Upload">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
            stroke-width="1.8" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" 
                    d="M8.25 10.5L12 6.75m0 0l3.75 3.75M12 6.75V15" />
            </svg>
          </button>
  
          <!-- Refresh Button -->
          <button 
          class="btn btn-outline btn-secondary btn-sm flex items-center" 
          title="Refresh" 
          on:click={() => refreshCard(report.id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"  stroke-width="1.8" stroke="currentColor" class="w-7 h-7">
            <path fill-rule="evenodd" 
                  d="M17.657 6.343a8 8 0 10-11.314 11.314.75.75 0 11-1.06 1.06 9.5 9.5 0 1113.435-13.435l-1.174 1.174a.75.75 0 001.06 1.06l2.5-2.5a.75.75 0 000-1.06l-2.5-2.5a.75.75 0 10-1.06 1.06L17.657 6.343z" 
                  clip-rule="evenodd"/>
          </svg>
        </button>
  
          <!-- Database Button -->
          <button class="btn btn-outline btn-info btn-sm flex items-center" title="Database">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"  stroke-width="1.8" stroke="currentColor" class="w-7 h-7">
              <path fill-rule="evenodd" 
                    d="M12 2C6.477 2 2 4.477 2 8v8c0 3.523 4.477 6 10 6s10-2.477 10-6V8c0-3.523-4.477-6-10-6zM4 8c0-1.952 3.82-4 8-4s8 2.048 8 4-3.82 4-8 4-8-2.048-8-4zm16 8c0 1.952-3.82 4-8 4s-8-2.048-8-4v-3.167C6.764 14.89 9.243 16 12 16s5.236-1.11 8-3.167V16z" 
                    clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
      {/each}
    </div>
  </div>
  
  <!-- Pagination Controls -->
  <div class="flex justify-between items-center mt-6">
    <button class="btn btn-secondary" on:click={prevPage} disabled={$currentPage === 1}>Previous</button>
    <span class="text-gray-700">Page {$currentPage} / {$totalPages}</span>
    <select id="itemsPerPage" class="select select-bordered w-40" on:change={changeItemsPerPage}>
      <option value="3">3 per page</option>
      <option value="6" selected>6 per page</option>
      <option value="12">12 per page</option>
      <option value="24">24 per page</option>
    </select>
    <button class="btn btn-secondary" on:click={nextPage} disabled={$currentPage * $itemsPerPage >= $filteredReports.length}>Next</button>
  </div>
</div>
