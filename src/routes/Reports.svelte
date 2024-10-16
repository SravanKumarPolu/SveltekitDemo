<script>
  import { onMount } from 'svelte'; 
  import { writable, derived } from 'svelte/store';

  import rsdata from '$lib/rsdata.json';

  let downloadReportsList = writable([]);
  let currentPage = writable(1);
  let itemsPerPage = writable(6);
  let statusFilter = writable(['All']); // Default to 'All'

  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const filteredReports = derived(
    [downloadReportsList, statusFilter],
    ([$downloadReportsList, $statusFilter]) => {
      if ($statusFilter.length === 0 || $statusFilter.includes('All')) {
        return $downloadReportsList;
      }
      return $downloadReportsList.filter(report => $statusFilter.includes(report.status));
    }
  );

  const totalPages = derived([filteredReports, itemsPerPage], ([$filteredReports, $itemsPerPage]) => {
    return Math.ceil($filteredReports.length / $itemsPerPage);
  });

  onMount(() => {
    fetchReports();
  });

  function fetchReports() {
    try {
      // Use the imported rsdata to populate the list
      downloadReportsList.set(rsdata);
      console.log("Fetched Reports List from lib:", rsdata);
    } catch (error) {
      console.error("There was an error loading the reports:", error.message);
    }
  }

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function downloadFile(filePath) {
    const link = document.createElement('a');
    link.href = `${backendUrl}/download-report/${encodeURIComponent(filePath)}`;
    link.setAttribute('download', filePath.split('/').pop());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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

  function refreshPage() {
    // Reset the filter to 'All' and fetch the reports again
    statusFilter.set(['All']);
    fetchReports();
  }

  function toggleStatusFilter(status) {
    statusFilter.update(filters => {
      if (filters.includes(status)) {
        return filters.filter(filter => filter !== status); // Remove if already selected
      } else {
        return [...filters, status]; // Add to filters
      }
    });
    currentPage.set(1); // Reset to page 1 when filter changes
  }

  
</script>

<div class="container h-[70%] mx-auto px-4 py-8">
  <!-- Header Section with Background -->
  <div class="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold text-gray-800">Reports</h2>
       <!-- Checkboxes for Status Filters -->
    <div class="flex justify-center space-x-4">
      <label class="inline-flex items-center space-x-2">
        <input type="checkbox" class="checkbox checkbox-primary" on:change={() => toggleStatusFilter('All')} checked={$statusFilter.includes('All')} />
        <span>All</span>
      </label>
      <label class="inline-flex items-center space-x-2">
        <input type="checkbox" class="checkbox checkbox-primary" on:change={() => toggleStatusFilter('Completed')} checked={$statusFilter.includes('Completed')} />
        <span>Completed</span>
      </label>
      <label class="inline-flex items-center space-x-2">
        <input type="checkbox" class="checkbox checkbox-primary" on:change={() => toggleStatusFilter('Failed')} checked={$statusFilter.includes('Failed')} />
        <span>Failed</span>
      </label>
      <label class="inline-flex items-center space-x-2">
        <input type="checkbox" class="checkbox checkbox-primary" on:change={() => toggleStatusFilter('Running')} checked={$statusFilter.includes('Running')} />
        <span>Running</span>
      </label>
      <label class="inline-flex items-center space-x-2">
        <input type="checkbox" class="checkbox checkbox-primary" on:change={() => toggleStatusFilter('Scheduled')} checked={$statusFilter.includes('Scheduled')} />
        <span>From Scheduler</span>
      </label>
      <label class="inline-flex items-center space-x-2">
        <input type="checkbox" class="checkbox checkbox-primary" on:change={() => toggleStatusFilter('Demand')} checked={$statusFilter.includes('Demand')} />
        <span>On Demand</span>
      </label>
    </div>
      <button class="btn btn-primary" on:click={refreshPage}>Refresh</button>
    </div>

   
  </div>

  <!-- Cards Container with Scrollbar -->
  <div class="h-[30rem] overflow-y-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each $filteredReports.slice(($currentPage - 1) * $itemsPerPage, $currentPage * $itemsPerPage) as report, index (report.id)}
      <div class="card bg-gradient-to-r from-white via-gray-100 to-gray-50 shadow-lg rounded-xl transition-transform transform hover:scale-105 border border-gray-200 hover:shadow-2xl">
        
        <!-- Card Header -->
       
        <div class="card-header bg-blue-600 text-primary-content p-4 text-left rounded-t-md">
          <p class="fle text-white  text-sm my-2">
   
            <span 
              class="multiline-ellipsis min-h-[3.4rem] tooltip tooltip-top  text-sm text-start font-semibold ml-1"
              title={report.fileName}
              style="line-height: 1.2rem; max-height: 5rem;"
            >
             {report.fileName || 'N/A'} 
            </span>
          </p>
        </div>
  
        <!-- Card Body -->
        <div class="card-body p-6">
          <p class="text-gray-600">Format: <span class="font-semibold">{report.format || 'N/A'}</span></p>
          <p class="text-gray-600">Status: <span class="font-semibold">{report.status || 'N/A'}</span></p>
          <p class="text-gray-600">Completion Date: <span class="font-semibold">{report.completionDate ? formatDate(report.completionDate) : 'N/A'}</span></p>
          <p class="text-gray-600">Expires Date: <span class="font-semibold">{report.expiresDate ? formatDate(report.expiresDate) : 'N/A'}</span></p>
          <p class="text-gray-600">last Updated Date: <span class="font-semibold">{report.lastUpdatedDate ? formatDate(report.lastUpdatedDate ): 'N/A'}</span></p>
          <p class="text-gray-600">Size: <span class="font-semibold">{report.fileSizeInKbs ? `${report.fileSizeInKbs} KB` : 'N/A'}</span></p>
        </div>
  
        <!-- Card Footer -->
        <div class="card-footer p-4 bg-gray-100 flex justify-between items-center rounded-b-xl gap-4">
          
          <!-- Status Button -->
          {#if report.status === 'Failed'}
            <button class="btn btn-error btn-xs flex items-center" title="Error">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" 
                      d="M12 8.25v3m0 4.5h.008v-.008H12v.008zM12 21a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
            </button>
          {:else if report.status === 'Running'}
            <button class="btn btn-primary btn-xs flex items-center" title="Running">
              <span class="loading loading-spinner mr-2"></span>
            </button>
          {:else}
            <button 
              class="btn btn-success btn-xs flex items-center" title="Download"
              on:click={() => downloadFile(report.filePath)}
              disabled={!report.filePath}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                   stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" 
                      d="M3 16.5v3a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-3m-4.5-9L12 15m0 0L8.25 10.5M12 15V3" />
              </svg>
            </button>
          {/if}
  
          <!-- Delete Button -->
          <button class="btn btn-outline btn-error btn-xs flex items-center" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                 stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" 
                    d="M19.5 6.75L4.5 6.75M9.75 6.75V5.25a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v1.5m5.25 0V21a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 21V6.75h15z" />
            </svg>
          </button>
  
          <!-- Upload Button -->
          <button class="btn btn-outline btn-primary btn-xs flex items-center" title="Upload">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                 stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" 
                    d="M8.25 10.5L12 6.75m0 0l3.75 3.75M12 6.75V15" />
            </svg>
          </button>
  
          <!-- Refresh Button -->
          <button class="btn btn-outline btn-secondary btn-xs flex items-center" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" 
                    d="M17.657 6.343a8 8 0 10-11.314 11.314.75.75 0 11-1.06 1.06 9.5 9.5 0 1113.435-13.435l-1.174 1.174a.75.75 0 001.06 1.06l2.5-2.5a.75.75 0 000-1.06l-2.5-2.5a.75.75 0 10-1.06 1.06L17.657 6.343z" 
                    clip-rule="evenodd" />
            </svg>
          </button>
  
          <!-- Database Button -->
          <button class="btn btn-outline btn-info btn-xs flex items-center" title="Database">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
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
