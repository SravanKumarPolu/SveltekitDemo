<script>
  let email = '';
  let password = '';

  const handleLogin = () => {
    // Handle login logic
    console.log('Logging in with', { email, password });
  };
</script>

<div class="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
  <!-- Login Form Container -->
  <div class="card w-full max-w-md shadow-2xl rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 p-6">
    <div class="card-body text-white">
      <!-- Title and Icon -->
      <div class="text-center mb-6">
        <img src="/vehicle-icon.svg" alt="Vehicle Icon" class="w-14 h-14 mx-auto animate-pulse">
        <h2 class="text-3xl font-bold mb-2">Welcome Back</h2>
        <p class="text-lg text-gray-200">Login to access your vehicle transport account</p>
      </div>

      <!-- Login Form -->
      <form on:submit|preventDefault={handleLogin} class="form-control space-y-4">
        <!-- Email Input -->
        <div class="form-control">
          <label class="label text-gray-300 font-semibold">Email</label>
          <input
            type="email"
            bind:value={email}
            placeholder="Enter your email"
            class="input input-bordered w-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <!-- Password Input -->
        <div class="form-control">
          <label class="label text-gray-300 font-semibold">Password</label>
          <input
            type="password"
            bind:value={password}
            placeholder="Enter your password"
            class="input input-bordered w-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        <!-- Submit Button -->
        <div class="form-control">
          <button
            type="submit"
            class="btn bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 rounded-md shadow-lg transform hover:scale-105 transition-transform duration-200"
          >
            Log In
          </button>
        </div>
      </form>

      <!-- Sign-up and Forgot Password -->
      <div class="text-center mt-6">
        <a href="/forgot-password" class="text-sm text-gray-300 hover:text-white">Forgot Password?</a>
        <p class="mt-2 text-sm text-gray-300">
          Don't have an account? <a href="/register" class="text-teal-400 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</div>
