<script>
  import Header from './Header15.svelte';
  import Sidebar from './Sidebar.svelte';
  import Footer from './Footer.svelte';

</script>

<div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header  class="fixed top-0 left-0 right-0 z-50" />
  
    <!-- Sidebar and Main Content -->
    <div class="flex flex-grow">
      <!-- Sidebar -->
      <Sidebar  class="fixed top-18 left-0 z-40 w-68 h-full bg-base-100 shadow-lg" /> 
  
      <!-- Main Content -->
      <main class="flex-grow ml-64 mt-16 p-4">
        <slot /> <!-- This is where the page-specific content will be injected -->
      </main>
    </div>
  
    <!-- Footer -->
    <Footer class="mt-auto" />
  </div>
