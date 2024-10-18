<script>
  import { onMount } from "svelte";
  import { writable, derived, get } from "svelte/store";
  import rsdata from "$lib/rsdata.json"; // Imported JSON data

  let downloadReportsList = writable([]);
  let currentPage = writable(1);
  let itemsPerPage = writable(6);
  let statusFilter = writable(["All"]); // Default to 'All'
  let isScheduledFilter = writable(false); // Track 'Scheduled' filter

  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  // Current Date for display
  let currentDate = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Converts milliseconds to HH:mm:ss format
  function millisToTime(millis) {
    if (!millis) return "00:00:00";
    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((millis % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  // Get appropriate Tailwind CSS classes for status
  function getStatusStyles(status) {
    switch (status) {
      case "Failed":
        return "text-red-500"; // Slightly stronger red for better visibility
      case "Running":
        return "text-blue-400"; // Using blue to match Tailwind's primary
      case "Completed":
        return "text-green-400"; // Green for success
      case "Scheduled":
        return "text-yellow-400"; // Better yellow contrast
      default:
        return "text-gray-800"; // Default text color
    }
  }

  // Fetch reports data on component mount
  onMount(() => {
    fetchReports();
  });

  function fetchReports() {
    try {
      downloadReportsList.set(rsdata);
      console.log("Fetched Reports List from lib:", rsdata);
    } catch (error) {
      console.error("Error loading the reports:", error.message);
    }
  }

  // Derived store for filtering reports by status and 'Scheduled' state
  const filteredReports = derived(
    [downloadReportsList, statusFilter, isScheduledFilter],
    ([$downloadReportsList, $statusFilter, $isScheduledFilter]) => {
      let reports = $downloadReportsList;

      if ($isScheduledFilter) {
        reports = reports.filter((report) => report.isScheduled);
      }

      if (!$statusFilter.includes("All")) {
        reports = reports.filter((report) =>
          $statusFilter.includes(report.status),
        );
      }

      return reports;
    },
  );

  // Derived store to calculate total pages
  const totalPages = derived(
    [filteredReports, itemsPerPage],
    ([$filteredReports, $itemsPerPage]) => {
      return Math.ceil($filteredReports.length / $itemsPerPage);
    },
  );

  // Pagination controls
  function nextPage() {
    currentPage.update((n) => n + 1);
  }

  function prevPage() {
    currentPage.update((n) => Math.max(n - 1, 1));
  }

  function changeItemsPerPage(event) {
    itemsPerPage.set(parseInt(event.target.value, 10));
    currentPage.set(1);
  }

  // Format date for display
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Download a report file
  function downloadFile(filePath) {
    const link = document.createElement("a");
    link.href = `${backendUrl}/download-report/${encodeURIComponent(filePath)}`;
    link.setAttribute("download", filePath.split("/").pop());
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Refresh a single report card
  function refreshCard(reportId) {
    const updatedReport = rsdata.find((report) => report.id === reportId);
    if (updatedReport) {
      downloadReportsList.update((reports) =>
        reports.map((report) =>
          report.id === reportId ? updatedReport : report,
        ),
      );
    }
  }

  // Delete a report
  function deleteReport(reportId) {
    downloadReportsList.update((reports) =>
      reports.filter((report) => report.id !== reportId),
    );
  }

  // Refresh the entire page
  function refreshPage() {
    const currentFilters = get(statusFilter);
    const currentPageValue = get(currentPage);

    fetchReports();

    currentDate = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    statusFilter.set(currentFilters);
    currentPage.set(currentPageValue);
  }

  // Toggle status filters and manage 'Scheduled' state
  function toggleStatusFilter(status) {
    statusFilter.update((filters) => {
      if (status === "All") {
        isScheduledFilter.set(false);
        return ["All"];
      } else if (status === "Scheduled") {
        isScheduledFilter.update((scheduled) => !scheduled);
        return filters.filter((f) => f !== "All");
      } else {
        const updatedFilters = filters.filter((f) => f !== "All");
        if (updatedFilters.includes(status)) {
          return updatedFilters.filter((f) => f !== status);
        } else {
          return [...updatedFilters, status];
        }
      }
    });
  }
</script>


<div class="card w-full bg-base-100 m-4 ml-0 shadow-xl ">
  <!-- Card Header -->
 
   <!-- Header Section with Background -->
   <div class="card-header bg-base-100 p-2  w-full rounded-lg flex flex-col items-center shadow-md ">
    <div class="flex justify-between items-center gap-2 mb-4">
      <h2 class="text-2xl font-semibold text-gray-800">Reports</h2>

      <!-- Checkboxes for Status Filters -->
      <div class="flex justify-center space-x-4">
        {#each ["All", "Completed", "Failed", "Running", "Scheduler", "On Demand"] as status}
          <label class="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              class="checkbox checkbox-primary"
              on:change={() => toggleStatusFilter(status)}
              checked={$statusFilter.includes(status) ||
                (status === "Scheduled" && $isScheduledFilter)}
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-star-fill"
        viewBox="0 0 16 16"
      >
        <path
          d="M3.612 15.443c-.396.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.33-.314-.16-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.613.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
        />
      </svg>
      <p>
        If you need the newly added data after
        <span class="text-semisolid">{currentDate}</span>, click Refresh.
      </p>
    </div>
  </div>


  <!-- Card Body -->
  <div class="card-body">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each $filteredReports.slice(($currentPage - 1) * $itemsPerPage, $currentPage * $itemsPerPage) as report, index (report.id)}
        <div
          class="card bg-gradient-to-r from-white via-gray-100 to-gray-50 shadow-xl rounded-md transition-transform transform hover:scale-105 duration-500 ease-in-out border border-gray-300 hover:shadow-2xl"
        >
          <!-- Card Header -->
          <div
            class={`card-header p-2 text-left rounded-t-md text-primary-content
      ${getStatusStyles(report.status)} flex flex-row`}
          >
            <div class="flex flex-col p-1 gap-2">
              <p class="flex items-center gap-2">
                {#if report.format === ".xlsx"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-filetype-xlsx"
                    viewBox="0 0 16 16"
                    stroke="currentColor"
                    stroke-width=" 0.5 "
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z"
                    />
                  </svg>
                {:else if report.format === ".pdf"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-filetype-pdf"
                    viewBox="0 0 16 16"
                    stroke="currentColor"
                    stroke-width=" 0.5 "
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803q.43 0 .732-.173.305-.175.463-.474a1.4 1.4 0 0 0 .161-.677q0-.375-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179m.545 1.333a.8.8 0 0 1-.085.38.57.57 0 0 1-.238.241.8.8 0 0 1-.375.082H.788V12.48h.66q.327 0 .512.181.185.183.185.522m1.217-1.333v3.999h1.46q.602 0 .998-.237a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084 0-.63-.196-1.075a1.43 1.43 0 0 0-.589-.68q-.396-.234-1.005-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592 1.1 1.1 0 0 1-.196.422.8.8 0 0 1-.334.252 1.3 1.3 0 0 1-.483.082h-.563zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638z"
                    />
                  </svg>
                {:else}
                  <span>N/A</span>
                {/if}
              </p>
              <p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-info-circle"
                  viewBox="0 0 16 16"
                  stroke="currentColor"
                  stroke-width=".5 "
                >
                  <path
                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
                  />
                  <path
                    d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
                  />
                </svg>
              </p>
            </div>
            <!-- File Name with Truncate and Tooltip (DaisyUI) -->
  
            <div
              class="tooltip tooltip-bottom"
              data-tip={report.fileName || "N/A"}
              style="max-width: 85%;"
            >
              <p class="line-clamp-2 w-full text-left">
                {report.fileName || "N/A"}
              </p>
            </div>
          </div>
  
          <!-- Card Body -->
          <div class="card-body p-1 text-left">
            <div class="flex flex-row justify-between h-auto">
              <div class="flex flex-col">
                <p class="text-gray-600">
                  File Size:
                  <span class="font-semibold"
                    >{report.fileSizeInKbs
                      ? `${report.fileSizeInKbs} KB`
                      : "N/A"}</span
                  >
                </p>
                <p class="text-gray-600">
                  Status:
                  <span class="font-semibold">{report.status || "N/A"}</span>
                </p>
              </div><button class="btn btn-outline btn-primary">Demand</button>

             
            </div>
            <p class="text-gray-600">
              Completed:
              <span class="font-semibold">
                {report.completionDate
                  ? formatDate(report.completionDate)
                  : "N/A"}
              </span>
            </p>
            <p class="text-gray-600">
              Expires:
              <span class="font-semibold">
                {report.expiresDate ? formatDate(report.expiresDate) : "N/A"}
              </span>
            </p>
            <p class="text-gray-600">
              Time Taken (HH:mm:ss):
              <span class="font-semibold">
                {report.queryRuntimeInMillis
                  ? millisToTime(report.queryRuntimeInMillis)
                  : "N/A"}
              </span>
            </p>
            <p class="text-gray-600">
              Scheduled: <span class="font-semibold"
                >{report.isScheduled ? "Yes" : "No"}</span
              >
            </p>
          </div>
  
          <!-- Card Footer -->
          <div
            class="card-footer bg-gray-100 p-2 flex flex-wrap justify-between items-center rounded-b-md overflow-hidden"
            style="max-width: 100%;"
          >
            <!-- Status Button -->
            {#if report.status === "Failed"}
            <button class="btn btn-xs flex items-center" title="Error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="w-7 h-7 text-error"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 8.25v3m0 4.5h.008v-.008H12v.008zM12 21a9 9 0 110-18 9 9 0 010 18z"
                />
              </svg>
            </button>
            
            {:else if report.status === "Running"}
            <button
            class="btn btn-xs  flex items-center gap-2"
            title="Running"
          >
            <span class="loading loading-spinner text-primary"></span>
           
          </button>
          
            {:else}
            <button
            class="btn btn-xs  flex items-center gap-2"
            title="Download"
            on:click={() => downloadFile(report.filePath)}
            disabled={!report.filePath}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="w-7 h-7 text-success"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v3a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-3m-4.5-9L12 15m0 0L8.25 10.5M12 15V3"
              />
            </svg>
           
          </button>
          
            {/if}
  
            <!-- Delete Button -->
            <button
            class="btn  btn-xs  flex items-center gap-2"
            title="Delete"
            on:click={() => deleteReport(report.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="w-7 h-7 text-error"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 6.75L4.5 6.75M9.75 6.75V5.25a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v1.5m5.25 0V21a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 21V6.75h15z"
              />
            </svg>
          
          </button>
          
  
            <!-- Upload Button -->
            <button
            class="btn  btn-xs  flex items-center gap-2"
            title="Upload"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.8"
              stroke="currentColor"
              class="w-7 h-7 text-primary"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 10.5L12 6.75m0 0l3.75 3.75M12 6.75V15"
              />
            </svg>
         
          </button>
          
  
            <!-- Refresh Button -->
            <button
            class="btn btn-xs  flex items-center gap-2"
            title="Refresh"
            on:click={() => refreshCard(report.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke-width="1.4"
              stroke="currentColor"
              class="w-7 h-7 text-secondary"
            >
              <path
                fill-rule="evenodd"
                d="M17.657 6.343a8 8 0 10-11.314 11.314.75.75 0 11-1.06 1.06 9.5 9.5 0 1113.435-13.435l-1.174 1.174a.75.75 0 001.06 1.06l2.5-2.5a.75.75 0 000-1.06l-2.5-2.5a.75.75 0 10-1.06 1.06L17.657 6.343z"
                clip-rule="evenodd"
              />
            </svg>
            
          </button>
          
  
            <!-- Database Button -->
            <div class="btn btn-xs  flex items-center gap-2" title="Database">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke-width="1.4"
                stroke="currentColor"
                class="w-7 h-7 text-info"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 4.477 2 8v8c0 3.523 4.477 6 10 6s10-2.477 10-6V8c0-3.523-4.477-6-10-6zM4 8c0-1.952 3.82-4 8-4s8 2.048 8 4-3.82 4-8 4-8-2.048-8-4zm16 8c0 1.952-3.82 4-8 4s-8-2.048-8-4v-3.167C6.764 14.89 9.243 16 12 16s5.236-1.11 8-3.167V16z"
                  clip-rule="evenodd"
                />
              </svg>
             
            </div>
            
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Card Footer -->
  <div class="card-footer flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 p-4 bg-base-200">
  
    <!-- Previous Page Button -->
    <button
      class="btn btn-secondary btn-md"
      on:click={prevPage}
      disabled={$currentPage === 1}
    >
      Previous
    </button>
  
    <!-- Radio Group for Quick Page Selection -->
    <div class="join">
      <input
        class="join-item btn btn-square"
        type="radio"
        name="options"
        aria-label="1"
        checked={$currentPage === 1}
        on:click={() => setPage(1)}
      />
      <input
        class="join-item btn btn-square"
        type="radio"
        name="options"
        aria-label="2"
        checked={$currentPage === 2}
        on:click={() => setPage(2)}
      />
      <input
        class="join-item btn btn-square"
        type="radio"
        name="options"
        aria-label="3"
        checked={$currentPage === 3}
        on:click={() => setPage(3)}
      />
      <input
        class="join-item btn btn-square"
        type="radio"
        name="options"
        aria-label="4"
        checked={$currentPage === 4}
        on:click={() => setPage(4)}
      />
    </div>
  
    <!-- Page Info -->
    <span class="text-sm text-gray-700">
      Page {$currentPage} / {$totalPages}
    </span>
  
    <!-- Items Per Page Dropdown -->
    <select
      id="itemsPerPage"
      class="select select-bordered w-40 max-w-xs"
      on:change={changeItemsPerPage}
    >
      <option value="3">3 per page</option>
      <option value="6" selected>6 per page</option>
      <option value="12">12 per page</option>
      <option value="24">24 per page</option>
    </select>
  
    <!-- Next Page Button -->
    <button
      class="btn btn-secondary btn-md"
      on:click={nextPage}
      disabled={$currentPage * $itemsPerPage >= $filteredReports.length}
    >
      Next
    </button>
  
  </div>
  
</div>



