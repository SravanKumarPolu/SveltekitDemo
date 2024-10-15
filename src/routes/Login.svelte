<script>
  let email = '';
  let password = '';

  const handleLogin = () => {
    // Handle login logic
    console.log('Logging in with', { email, password });
  };
</script>

<div class="flex items-center justify-center min-h-screen bg-base-200">
  <div class="card w-full max-w-sm shadow-2xl bg-base-100">
    <div class="card-body">
      <h2 class="text-center text-2xl font-bold">Login</h2>
      <form on:submit|preventDefault={handleLogin} class="form-control">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            type="email"
            bind:value={email}
            placeholder="Enter your email"
            class="input input-bordered"
            required
          />
        </div>
        <div class="form-control mt-4">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            type="password"
            bind:value={password}
            placeholder="Enter your password"
            class="input input-bordered"
            required
          />
        </div>
        <div class="form-control mt-6">
          <button type="submit" class="btn btn-primary">Log In</button>
        </div>
      </form>
      <div class="text-center mt-4">
        <p class="text-sm">
          Don't have an account?
          <a href="/register" class="text-primary">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</div>
