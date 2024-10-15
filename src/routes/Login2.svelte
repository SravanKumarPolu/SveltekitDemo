<script>
  let email = '';
  let password = '';

  const handleLogin = () => {
    // Handle login logic here
    console.log('Logging in with', { email, password });
  };
</script>

<!-- Vehicle Transport Background -->
<div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-600">
  <div class="card w-full max-w-md shadow-lg bg-gray-900 bg-opacity-95 rounded-lg p-6">
    <div class="card-body">
      <!-- Vehicle Icon and Title -->
      <div class="text-center">
        <img src="/vehicle-icon.svg" alt="Vehicle Icon" class="w-16 h-16 mx-auto mb-4">
        <h2 class="text-3xl font-bold text-white">Vehicle Transport Login</h2>
      </div>

      <!-- Login Form -->
      <form on:submit|preventDefault={handleLogin} class="form-control mt-6">
        <!-- Email Input -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-gray-400 font-semibold">Email</span>
          </label>
          <input
            type="email"
            bind:value={email}
            placeholder="Enter your email"
            class="input input-bordered w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="form-control mt-4">
          <label class="label">
            <span class="label-text text-gray-400 font-semibold">Password</span>
          </label>
          <input
            type="password"
            bind:value={password}
            placeholder="Enter your password"
            class="input input-bordered w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Submit Button -->
        <div class="form-control mt-6">
          <button type="submit" class="btn btn-primary bg-orange-500 hover:bg-orange-600 w-full">Log In</button>
        </div>
      </form>

      <!-- Sign-up Option -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-400">
          Don't have an account? <a href="/register" class="text-orange-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</div>
