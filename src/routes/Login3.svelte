<script>
  let email = '';
  let password = '';

  const handleLogin = () => {
    // Handle login logic
    console.log('Logging in with', { email, password });
  };
</script>

<!-- Vehicle Transport Background -->
<div class="flex items-center justify-center min-h-screen bg-gradient-to-tr from-gray-900 to-teal-700">
  <div class="card w-full max-w-lg shadow-lg bg-white rounded-lg p-8">
    <div class="card-body">
      <!-- Title with Vehicle Icon -->
      <div class="text-center mb-6">
        <img src="/truck-icon.svg" alt="Truck Icon" class="w-12 h-12 mx-auto">
        <h2 class="text-3xl font-bold text-gray-800">Secure Login</h2>
        <p class="text-gray-500">Access your vehicle transport dashboard</p>
      </div>

      <!-- Login Form -->
      <form on:submit|preventDefault={handleLogin} class="form-control">
        <!-- Email Input -->
        <div class="form-control mb-4">
          <label class="label">
            <span class="label-text text-gray-600">Email</span>
          </label>
          <input
            type="email"
            bind:value={email}
            placeholder="Email Address"
            class="input input-bordered w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text text-gray-600">Password</span>
          </label>
          <input
            type="password"
            bind:value={password}
            placeholder="Password"
            class="input input-bordered w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <!-- Submit Button -->
        <div class="form-control">
          <button type="submit" class="btn bg-teal-500 hover:bg-teal-600 text-white w-full transition ease-in-out duration-150">Log In</button>
        </div>
      </form>

      <!-- Forgot Password and Sign-up Options -->
      <div class="flex justify-between items-center mt-6">
        <a href="/forgot-password" class="text-teal-600 hover:underline text-sm">Forgot Password?</a>
        <p class="text-sm text-gray-600">
          New user? <a href="/register" class="text-teal-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</div>
