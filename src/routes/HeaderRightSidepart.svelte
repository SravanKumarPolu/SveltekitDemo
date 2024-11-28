<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let tenant;
	let tenantName = tenant?.name;
	let themes = tenant?.themes || ['light', 'dark', 'retro']; // Default themes
	let activeTheme; // Holds the current active theme

	// Helper to create a tenant-specific theme key
	function getThemeStorageKey() {
		return `selectedTheme_${tenantName}`;
	}

	// Set the theme for the current tenant
	function setTheme(theme) {
		activeTheme = theme;
		document.documentElement.setAttribute('data-theme', theme); // Apply the theme
		localStorage.setItem(getThemeStorageKey(), theme); // Save tenant-specific theme
	}

	// Load the saved theme or set the default theme on mount
	onMount(() => {
		const savedTheme = localStorage.getItem(getThemeStorageKey());
		if (savedTheme && themes.includes(savedTheme)) {
			setTheme(savedTheme); // Apply saved theme
		} else {
			setTheme(themes[0]); // Default to the first theme
		}
	});

	let user = 'Subba GV';

	// Logout function
	function logout() {
		const tenantThemeKey = getThemeStorageKey();
		performLogout(tenantName); // Call API logout
		clearStorageExcept([tenantThemeKey]); // Clear everything except the tenant-specific theme
	}

	// Clear all storage except specified keys
	function clearStorageExcept(excludedKeys) {
		const allKeys = Object.keys(localStorage);
		allKeys.forEach((key) => {
			if (!excludedKeys.includes(key)) {
				localStorage.removeItem(key);
			}
		});
	}
</script>

<div class="flex flex-col justify-center items-center gap-1  ">
	<!-- User Name -->
	 <!-- User Name -->
	 <div class="relative group">
    <div
      class="badge badge-outline text-lg px-4 py-2 text-center max-w-[120px] overflow-hidden"
    >
      <span class="truncate" title="{user}">
        {user}
      </span>
         <!-- Tooltip -->
				 <div
         class="absolute left-0 -translate-x-1/2 top-1/2  w-[10rem]   text-sm text-white bg-gray-400 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
       >
         {user}
       </div>
    </div>
 
  </div>

	<!-- Theme Toggle -->
	<div class="flex  items-center gap-2 w-28">
		{#each themes as themeOption}
			<label class="flex cursor-pointer items-center">
				<input
					type="radio"
					name="theme"
					value={themeOption}
					class="hidden "
					bind:group={activeTheme}
					on:change={() => setTheme(themeOption)}
				/>
				<span class="btn btn-xs btn-outline {activeTheme === themeOption ? 'btn-active' : ''}">
					{themeOption === 'dark' ? '🌙' : themeOption === 'light' ? 'OS' : '⚙️'}
				</span>
			</label>
		{/each}
	</div>

	<!-- Logout Button -->
	<button class="btn btn-error btn-sm w-28" on:click={logout}>
		Logout
	</button>
</div>

<style>

</style>
