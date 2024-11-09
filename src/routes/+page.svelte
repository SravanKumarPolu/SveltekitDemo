<script>
  // @ts-nocheck
  import Header from './Header15.svelte';
  import Sidebar from './Sidebar.svelte';
  import Footer from './Footer.svelte';
  import Reports from './Reports.svelte';
  import Report from './Report.svelte';
    import CustomizeReport from './customizeReport.svelte';
    import Cusm from './cusm.svelte';
    import Cusms from './cusms.svelte';
    import Finalcusm from './finalcusm.svelte';
    import Finalcusm2 from './finalcusm2.svelte';
    import Chart from './Chart.svelte';
    import SpendByServiceMultiPies1 from './SpendByServiceMultiPies1.svelte';
    import SpendByServiceTime1 from './SpendByServiceTime1.svelte';
    import FinalCustReport from './FinalCustReport.svelte';
    import Dasborde from './Dashboardes.svelte';
    import Dashboardes from './Dashboardes.svelte';
    import D7 from './d7.svelte';
    import D6 from './d6.svelte';
  
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
      
      <D7 />
      <Dashboardes />
      <FinalCustReport />

    <SpendByServiceTime1 />
      <SpendByServiceMultiPies1 />
   <Chart />
     <Reports />
      <Report />
     <Finalcusm2 />
      <CustomizeReport />
      <Finalcusm />
    <Cusms />
   
      <Cusm />

    </main>
  </div>

  <!-- Footer -->
  <Footer class="mt-auto" />
</div>
