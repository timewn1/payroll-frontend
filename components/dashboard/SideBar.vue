<template>
  <ul
    id="accordionSidebar"
    class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
  >
    <!-- Sidebar - Brand -->
    <a
      class="sidebar-brand d-flex align-items-center justify-content-center"
      href="#"
    >
      <div class="sidebar-brand-text mx-3">HP Payroll</div>
    </a>

    <!-- Divider -->
    <hr class="sidebar-divider my-0" />

    <!-- Nav Item - Dashboard -->
    <li class="nav-item active">
      <nuxt-link class="nav-link" to="#">
        <i class="fas fa-fw fa-tachometer-alt"></i>
        <span>Dashboard</span></nuxt-link
      >
    </li>

    <!-- Divider -->
    <hr class="sidebar-divider" />

    <!-- Heading -->
    <div class="sidebar-heading">Interface</div>

    <li class="nav-item">
      <nuxt-link
        :class="$route.name === 'attendance' ? 'nav-link active' : 'nav-link'"
        to="/attendance"
      >
        <i class="fas fa-fw fa-user-clock"></i>
        <span>Attendance</span></nuxt-link
      >
    </li>

    <li class="nav-item">
      <nuxt-link class="nav-link" to="/calendar">
        <i class="fas fa-fw fa-calendar-alt"></i>
        <span>Calendar</span></nuxt-link
      >
    </li>

    <li class="nav-item">
      <a
        :class="
          $route.name === 'employees' || $route.name === 'employees-resigned'
            ? 'nav-link'
            : 'nav-link collapsed'
        "
        aria-controls="employee-collapse"
        aria-expanded="false"
        data-target="#employee-collapse"
        data-toggle="collapse"
        href="#"
      >
        <i class="fas fa-users"></i>
        <span>Employees</span>
      </a>
      <div
        id="employee-collapse"
        :class="
          $route.name === 'employees' || $route.name === 'employees-resigned'
            ? 'collapse show'
            : 'collapse'
        "
        aria-labelledby="headingUtilities"
        data-parent="#accordionSidebar"
      >
        <div class="bg-white py-2 collapse-inner rounded">
          <h6 class="collapse-header">employees:</h6>
          <nuxt-link
            :class="
              $route.name === 'employees'
                ? 'collapse-item active'
                : 'collapse-item'
            "
            to="/employees"
            >Present
          </nuxt-link>
          <nuxt-link
            :class="
              $route.name === 'employees-resigned'
                ? 'collapse-item active'
                : 'collapse-item'
            "
            to="/employees/resigned"
            >Resigned
          </nuxt-link>
        </div>
      </div>
    </li>

    <li class="nav-item">
      <a
        :class="
          $route.name === 'excel-upload' || $route.name === 'excel-download'
            ? 'nav-link'
            : 'nav-link collapsed'
        "
        aria-controls="excel-collapse"
        aria-expanded="false"
        data-target="#excel-collapse"
        data-toggle="collapse"
        href="#"
      >
        <i class="fas fa-table"></i>
        <span>Excel</span>
      </a>
      <div
        id="excel-collapse"
        :class="
          $route.name === 'excel-upload' || $route.name === 'excel-download'
            ? 'collapse show'
            : 'collapse'
        "
        aria-labelledby="headingUtilities"
        data-parent="#accordionSidebar"
      >
        <div class="bg-white py-2 collapse-inner rounded">
          <h6 class="collapse-header">attendance:</h6>
          <nuxt-link
            :class="
              $route.name === 'excel-upload'
                ? 'collapse-item active'
                : 'collapse-item'
            "
            to="/excel/upload"
            >Upload
          </nuxt-link>
          <nuxt-link
            :class="
              $route.name === 'excel-download'
                ? 'collapse-item active'
                : 'collapse-item'
            "
            to="/excel/download"
            >Downloads
          </nuxt-link>
        </div>
      </div>
    </li>

    <li class="nav-item">
      <nuxt-link class="nav-link" to="/employees/salary">
        <i class="fas fa-fw fa-money-bill"></i>
        <span>Salary</span></nuxt-link
      >
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SideBar',
}
</script>

<style scoped></style>
