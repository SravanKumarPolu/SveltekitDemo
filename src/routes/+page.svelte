<script>
  import Header from './Header15.svelte';
  import Sidebar from './Sidebar.svelte';
  import Footer from './Footer.svelte';
  import Report from './Reports.svelte';
</script>

<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <Header class="fixed top-0 left-0 right-0 z-50" />

  <!-- Main content with sidebar -->
  <div class="flex flex-grow">
    <!-- Sidebar -->
    <Sidebar class="fixed top-16 left-0 z-40 w-72 h-full bg-base-100 shadow-lg" />

    <!-- Main Content Area -->
    <main class="flex-grow ml-64 mt-16 p-4">
      <Report />
    </main>
  </div>

  <!-- Footer -->
  <Footer class="mt-auto" />
</div>
