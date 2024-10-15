<script>
  let email = '';
  let password = '';

  const handleLogin = () => {
    // Handle login logic
    console.log('Logging in with', { email, password });
  };
</script>

<div class="flex min-h-screen">
  <!-- Left Side: Image or Illustration -->
  <div class="w-1/2 bg-cover bg-center" style="background-image: url('/vehicle-transport-image.jpg');">
    <!-- Optional overlay for a darker effect on the image -->
    <div class="bg-black bg-opacity-50 h-full flex items-center justify-center">
      <div class="text-white p-8">
        <h1 class="text-4xl font-bold">Efficient Vehicle Transport</h1>
        <p class="mt-4 text-lg">We make vehicle transportation smooth and hassle-free.</p>
      </div>
    </div>
  </div>

  <!-- Right Side: Login Form -->
  <div class="w-1/2 flex items-center justify-center bg-gray-900">
    <div class="card w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <div class="card-body">
        <!-- Title -->
        <h2 class="text-center text-3xl font-bold text-gray-800 mb-4">Login</h2>

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
              placeholder="Enter your email"
              class="input input-bordered w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Enter your password"
              class="input input-bordered w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Submit Button -->
          <div class="form-control">
            <button type="submit" class="btn bg-blue-600 hover:bg-blue-700 text-white w-full transition ease-in-out duration-150">Log In</button>
          </div>
        </form>

        <!-- Forgot Password and Sign-up Options -->
        <div class="flex justify-between items-center mt-6">
          <a href="/forgot-password" class="text-blue-600 hover:underline text-sm">Forgot Password?</a>
          <p class="text-sm text-gray-600">
            New here? <a href="/register" class="text-blue-600 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
