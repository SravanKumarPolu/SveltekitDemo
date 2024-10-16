<script>
  import { onMount } from 'svelte'; 
  import { writable, derived } from 'svelte/store';

  import rsdata from '$lib/rsdata.json';

  
  let downloadReportsList = writable([]);
  let currentPage = writable(1);
  let itemsPerPage = writable(8);
  let statusFilter = writable('All'); // Filter state for the status

  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const filteredReports = derived(
    [downloadReportsList, statusFilter],
    ([$downloadReportsList, $statusFilter]) => {
      if ($statusFilter === 'All') {
        return $downloadReportsList;
      }
      return $downloadReportsList.filter(report => report.status === $statusFilter);
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
    // Reset the filter to "All" and fetch the reports again
    statusFilter.set('All');
    fetchReports();
  }

  function setStatusFilter(status) {
    statusFilter.set(status);
    currentPage.set(1); // Reset to page 1 when filter changes
  }
</script>

<div class="container h-[70%] mx-auto px-4 py-8">
  <!-- Header Section with Background -->
  <div class="bg-gray-100  p-4 rounded-lg shadow-md mb-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold text-gray-800">Reports</h2>
      <button class="btn btn-primary" on:click={refreshPage}>Refresh</button>
    </div>

    <!-- Second Row for Status Filters -->
    <div class="flex justify-center space-x-4">
      <button class="btn btn-sm btn-outline" on:click={() => setStatusFilter('All')}>All</button>
      <button class="btn btn-sm btn-outline" on:click={() => setStatusFilter('Completed')}>Completed</button>
      <button class="btn btn-sm btn-outline" on:click={() => setStatusFilter('Failed')}>Failed</button>
      <button class="btn btn-sm btn-outline" on:click={() => setStatusFilter('Running')}>Running</button>
      <button class="btn btn-sm btn-outline" on:click={() => setStatusFilter('Scheduled')}>Scheduled</button>
    </div>
  </div>

  <!-- Cards Container with Scrollbar -->
  <div class="h-[30rem] overflow-y-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  h-auto">
      {#each $filteredReports.slice(($currentPage - 1) * $itemsPerPage, $currentPage * $itemsPerPage) as report, index (report.id)}
      <div class="card bg-base-100 shadow-xl border border-gray-200">
        <!-- Card Header -->
        <div class="card-header bg-primary text-primary-content p-4 text-center">
          <p class="text-sm font-semibold">{report.fileName || 'N/A'}</p>
        </div>
      
        <!-- Card Body -->
        <div class="card-body p-6">
          <p class="text-gray-600 my-2">Status: <span class="text-black font-semibold">{report.status || 'N/A'}</span></p>
          <p class="text-gray-600 my-2">Completion Date: <span class=" text-black font-semibold">{report.completionDate ? formatDate(report.completionDate) : 'N/A'}</span></p>
          <p class="text-gray-600 my-2">Expires Date: <span class="text-black font-semibold">{report.expiresDate ? formatDate(report.expiresDate) : 'N/A'}</span></p>
          <p class="text-gray-600 my-2">Size: <span class="text-black font-semibold">{report.fileSizeInKbs ? `${report.fileSizeInKbs} KB` : 'N/A'}</span></p>
        </div>
      
        <!-- Card Footer -->
        <div class="card-footer p-4 text-center">
          {#if report.status === 'Failed'}
            <!-- Failed button with DaisyUI's btn-error class -->
            <button class="btn btn-error w-full" disabled>Failed</button>
          {:else if report.status === 'Running'}
            <!-- Running button with DaisyUI's btn-primary and loading spinner -->
            <button class="btn btn-primary w-full" disabled>
              <span class="loading loading-spinner mr-2"></span>
              Running
            </button>
          {:else}
            <!-- Download button with DaisyUI's btn-success class -->
            <button
              class="btn btn-success w-full"
              on:click={() => downloadFile(report.filePath)}
              disabled={!report.filePath}
            >
              Download
            </button>
          {/if}
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
      <option value="4">4 per page</option>
      <option value="8" selected>8 per page</option>
      <option value="16">16 per page</option>
      <option value="32">32 per page</option>
    </select>
    <button class="btn btn-secondary" on:click={nextPage} disabled={$currentPage * $itemsPerPage >= $filteredReports.length}>Next</button>
  </div>
</div>


