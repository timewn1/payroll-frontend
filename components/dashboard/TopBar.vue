<template>
  <nav
    class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow"
  >
    <!-- Sidebar Toggle (Topbar) -->
    <button
      id="sidebarToggleTop"
      class="btn btn-link d-md-none rounded-circle mr-3"
    >
      <i class="fa fa-bars"></i>
    </button>

    <!-- Topbar Search -->

    <!-- Topbar Navbar -->
    <ul class="navbar-nav ml-auto">
      <!-- Nav Item - Search Dropdown (Visible Only XS) -->

      <!-- Nav Item - User Information -->
      <li class="nav-item dropdown no-arrow">
        <nuxt-link to="#" class="btn btn-sm btn-outline-light text-gray-600">
          <i class="fas fa-fw fa-user"></i>
        </nuxt-link>

        <button
          class="btn btn-sm btn-light text-gray-600"
          @click="logout"
          type="button"
        >
          {{ loading ? 'loading...' : 'Logout' }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { useLogin } from '~/composables/login'
export default {
  name: 'Header',
  setup() {
    const { logout, loading } = useLogin()

    return {
      loading,
      logout,
    }
  },
}
</script>

<style scoped></style>
