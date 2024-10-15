<script>
  let email = '';
  let password = '';

  const handleLogin = () => {
    // Handle login logic here
    console.log('Logging in with', { email, password });
  };
</script>

<!-- Guardian Background -->
<div class="flex items-center justify-center min-h-screen bg-base-200">
  <div class="card w-full max-w-sm shadow-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-opacity-90 rounded-lg p-6">
    <div class="card-body">
      <!-- Title -->
      <h2 class="text-center text-3xl font-extrabold text-white">Login</h2>

      <!-- Login Form -->
      <form on:submit|preventDefault={handleLogin} class="form-control mt-4">
        <!-- Email Input -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-white font-semibold">Email</span>
          </label>
          <input
            type="email"
            bind:value={email}
            placeholder="Enter your email"
            class="input input-bordered w-full bg-white bg-opacity-80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="form-control mt-4">
          <label class="label">
            <span class="label-text text-white font-semibold">Password</span>
          </label>
          <input
            type="password"
            bind:value={password}
            placeholder="Enter your password"
            class="input input-bordered w-full bg-white bg-opacity-80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            required
          />
        </div>

        <!-- Submit Button -->
        <div class="form-control mt-6">
          <button type="submit" class="btn btn-primary w-full">Log In</button>
        </div>
      </form>

      <!-- Sign-up Option -->
      <div class="text-center mt-4">
        <p class="text-sm text-white">
          Don't have an account? <a href="/register" class="text-blue-300 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</div>
