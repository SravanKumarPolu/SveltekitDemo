<script>
  // @ts-nocheck
  import Header from './Header15.svelte';
  import Sidebar from './Sidebar.svelte';
  import Footer from './Footer.svelte';
  import Reports from './Reports.svelte';
  import Report from './Report.svelte';
</script>

<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <Header class="fixed top-0 left-0 right-0 z-50" />

  <!-- Sidebar and Main Content -->
  <div class="flex flex-grow">
    <!-- Sidebar -->
    <Sidebar class="fixed top-16 left-0 z-40 w-64 h-full bg-base-100 shadow-lg" />

    <!-- Main Content -->
    <main class="flex-grow ml-64 mt-20 p-4">
      <slot />
      <Report />
    </main>
  </div>

  <!-- Footer -->
  <Footer class="mt-auto" />
</div>
