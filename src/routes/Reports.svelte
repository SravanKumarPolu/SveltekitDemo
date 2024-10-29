<script lang="ts">
  import { onMount } from "svelte";
  import { writable, derived, get } from "svelte/store";
  import rsdata from "$lib/rsdata.json"; // Imported JSON data

  let downloadReportsList = writable([]);
  let currentPage = writable(1);
  let itemsPerPage = writable(6);

  // Status and schedule filters
  let statusFilter = writable([]); // Track selected statuses
  let scheduleFilter = writable([]); // Track selected schedules
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

  // Filter the reports based on selected status and schedule
  const filteredReports = derived(
    [downloadReportsList, statusFilter, scheduleFilter],
    ([$downloadReportsList, $statusFilter, $scheduleFilter]) => {
      let reports = $downloadReportsList;

      // Apply schedule filter if any schedules are selected
      if ($scheduleFilter.length > 0) {
        reports = reports.filter((report) =>
          $scheduleFilter.includes(
            report.isScheduled ? "Scheduled" : "On Demand",
          ),
        );
      }

      // Apply status filter if any statuses are selected
      if ($statusFilter.length > 0) {
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

  // Handle status filter change
  function handleStatusChange(status) {
    statusFilter.update((filters) => {
      return filters.includes(status)
        ? filters.filter((f) => f !== status) // Remove if unchecked
        : [...filters, status]; // Add if checked
    });
  }

  // Handle schedule filter change
  function handleScheduleChange(schedule) {
    scheduleFilter.update((filters) => {
      return filters.includes(schedule)
        ? filters.filter((f) => f !== schedule) // Remove if unchecked
        : [...filters, schedule]; // Add if checked
    });
  }
</script>

<div class="card  bg-base-100 text-primary-content mt-4 p-2 shadow-xl">
  <!-- Card Header -->

  <!-- Header Section with Background -->
  <div
    class="card-header bg-base-100 p-2 w-full rounded-lg flex flex-col items-between shadow-md"
  >
    <div class="flex justify-between items-center gap-2 mb-4">
      <h2 class="text-2xl font-semibold text-primary-content">Reports</h2>

      <div class="flex flex-wrap gap-2 items-center">
        <!-- Status Filters -->
        {#each ["Completed", "Failed", "Running"] as status}
          <label class="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              class="checkbox checkbox-primary"
              on:change={() => handleStatusChange(status)}
              checked={$statusFilter.includes(status)}
            />
            <span>{status}</span>
          </label>
        {/each}

        <!-- Schedule Filters -->
        <label class="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            value="Scheduled"
            class="checkbox checkbox-primary"
            on:change={() => handleScheduleChange("Scheduled")}
            checked={$scheduleFilter.includes("Scheduled")}
          />
          <span>Scheduled</span>
        </label>
        <label class="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            value="On Demand"
            class="checkbox checkbox-primary"
            on:change={() => handleScheduleChange("On Demand")}
            checked={$scheduleFilter.includes("On Demand")}
          />
          <span>On Demand</span>
        </label>
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
          class="card h-auto bg-base-100 shadow-xl rounded-md transition-transform transform hover:scale-105 duration-500 ease-in-out border border-gray-300 hover:shadow-2xl"
        >
          <!-- Card Header -->
          <div
            class={`card-header h-20 p-2 text-left rounded-t-md text-primary-content
      ${getStatusStyles(report.status)} flex flex-row  gap-1`}
          >
            <div class="flex flex-col">
              <div class="flex">
                {#if report.format === ".xlsx"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
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
                    width="32"
                    height="32"
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
              </div>
            </div>

            <!-- Custom Tooltip with Tailwind Classes -->
            <div class="relative group w-full">
              <div
                class=" break-words tooltip tooltip-bottom max-w-[90%] text-wrap h-auto z-30"
                data-tip={report.fileName}
              >
                <p class="line-clamp-2 text-wrap overflow-hidden text-left">
                  {report.fileName}
                </p>
              </div>
            </div>
          </div>

          <div class="card-body p-2 text-sm text-left leading-tight space-y-1">
            <div class="flex flex-row justify-between h-auto space-x-2">
              <div class="flex flex-col gap-2">
                <p class="text-gray-500 leading-tight">
                  File Size:
                  <span class="font-semibold">
                    {report.fileSizeInKbs
                      ? `${report.fileSizeInKbs} KB`
                      : "N/A"}
                  </span>
                </p>
                <p class="text-gray-500 leading-tight">
                  Status:
                  <span class="font-semibold">{report.status || "N/A"}</span>
                </p>
              </div>

              {#if !report.isScheduled}
                <!-- Button rendered only if isScheduled is false -->
                <button class="btn btn-outline btn-primary btn-sm"
                  >Demand</button
                >
              {/if}
            </div>

            <p class="text-gray-500 leading-tight">
              Completed:
              <span class="font-semibold">
                {report.completionDate
                  ? formatDate(report.completionDate)
                  : "N/A"}
              </span>
            </p>
            <p class="text-gray-500 leading-tight">
              Expires:
              <span class="font-semibold">
                {report.expiresDate ? formatDate(report.expiresDate) : "N/A"}
              </span>
            </p>
            <p class="text-gray-500 leading-tight">
              Time Taken (HH:mm:ss):
              <span class="font-semibold">
                {report.queryRuntimeInMillis
                  ? millisToTime(report.queryRuntimeInMillis)
                  : "N/A"}
              </span>
            </p>
            {#if report.isScheduled}
            <p class="text-gray-500 leading-tight">
              Scheduled: 
              <span class="font-semibold">Yes</span>
            </p>
          {:else}
            <p class="text-gray-500 leading-tight">
              Not Scheduled
            </p>
          {/if}
          </div>

          <!-- Card Footer -->
          <div
            class="card-footer h-auto  p-2 flex flex-wrap justify-between items-center rounded-b-md overflow-hidden"
            style="max-width: 100%;"
          >
            <!-- Status Button -->
            {#if report.status === "Failed"}
              <button class="btn btn-xs flex items-center" title="Error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2 "
                  stroke="currentColor"
                  class="w-6 h-6 text-error"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 8.25v3m0 4.5h.008v-.008H12v.008zM12 21a9 9 0 110-18 9 9 0 010 18z"
                  />
                </svg>
              </button>
            {:else if report.status === "Running"}
              <button class="btn btn-xs flex items-center" title="Running">
                <span class="loading loading-spinner text-primary"></span>
              </button>
            {:else}
              <button
                class="btn btn-xs flex items-center"
                title="Download"
                on:click={() => downloadFile(report.filePath)}
                disabled={!report.filePath}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  stroke-width="0.5 "
                  fill="currentColor"
                  class="bi bi-download w-6 h-6 text-success"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"
                  />
                  <path
                    d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"
                  />
                </svg>
              </button>
            {/if}

            <!-- Delete Button -->
            <button
              class="btn btn-xs flex items-center"
              title="Delete"
              on:click={() => deleteReport(report.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2 "
                stroke="currentColor"
                class="w-6 h-6 text-error"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 6.75L4.5 6.75M9.75 6.75V5.25a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v1.5m5.25 0V21a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 21V6.75h15z"
                />
              </svg>
            </button>

            <!-- Upload Button -->
            <button class="btn btn-xs flex items-center" title="Upload">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                stroke-width="0.5 "
                class="bi bi-upload w-6 h-6 text-primary"
                viewBox="0 0 16 16"
              >
                <path
                  d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"
                />
                <path
                  d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"
                />
              </svg>
            </button>

            <!-- Refresh Button -->
            <button
              class="btn btn-xs flex items-center"
              title="Refresh"
              on:click={() => refreshCard(report.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-arrow-clockwise w-6 h-6 text-secondary"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                />
                <path
                  d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"
                />
              </svg>
            </button>

            <!-- Database Button -->
            <div class="btn btn-xs flex items-center" title="Database">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                stroke-width="1.4 "
                width="17"
                height="16"
                fill="currentColor"
                class="bi bi-database text-info w-6 h-6"
                viewBox="0 0 16 16"
              >
                <path
                  d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313M13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A5 5 0 0 0 13 5.698M14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A5 5 0 0 0 13 8.698m0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525"
                />
              </svg>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Card Footer -->
  <div
    class="card-footer flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 p-4 bg-base-200"
  >
    <!-- Previous Page Button -->
    <button
      class="btn btn-secondary btn-sm"
      on:click={prevPage}
      disabled={$currentPage === 1}
    >
      Previous
    </button>

    <!-- Page Info -->
    <span class="text-sm text-gray-500">
      Page {$currentPage} / {$totalPages}
    </span>

    <!-- Items Per Page Dropdown -->
    <select
      id="itemsPerPage"
      class="select select-bordered btn btn-sm w-40 max-w-xs"
      on:change={changeItemsPerPage}
    >
      <option value="3">3 per page</option>
      <option value="6" selected>6 per page</option>
      <option value="12">12 per page</option>
      <option value="24">24 per page</option>
    </select>

    <!-- Next Page Button -->
    <button
      class="btn btn-secondary btn-sm"
      on:click={nextPage}
      disabled={$currentPage * $itemsPerPage >= $filteredReports.length}
    >
      Next
    </button>
  </div>
</div>
