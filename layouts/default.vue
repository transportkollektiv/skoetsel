<template>
  <div id="app" class="d-flex flex-column">
    <b-navbar type="dark" variant="dark" class="app-navbar">
      <b-button variant="link" v-b-toggle.sidebar-collapse class="sidebar-toggle">
        <span class="navbar-toggler-icon"></span>
      </b-button>
      <b-navbar-brand>skoetsel</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <em>{{ user }}</em>
            </template>
            <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="wrapper flex-fill d-flex align-items-stretch">
      <!-- FIXME: replace transition by replacing b-collapse with something VBToggle compatible -->
      <b-collapse id="sidebar-collapse" v-model="sidebarVisible">
        <b-nav id="sidebar" class="flex-fill" vertical>
          <b-nav-item to="/"><b-icon icon="house"/></b-nav-item>
        </b-nav>
      </b-collapse>
      <div class="flex-fill">
        <nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    const isDesktopMQ = window.matchMedia('(min-width: 768px)');
    return {
      sidebarVisible: isDesktopMQ.matches
    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      this.$router.push('/');
    }
  }
}
</script>

<style>
#app {
  height: 100vh;
}
.app-navbar {
  padding-left: 0;
}
.sidebar-toggle {
  margin-right: 0.5rem;
}
#sidebar-collapse {
  display: flex;
}
#sidebar {
  background: var(--light);
  box-shadow: inset -1px 0 5px rgba(0, 0, 0, 10%);
}
#sidebar .nav-link {
  padding: 1.25rem 1rem;
  color: var(--gray);
}
#sidebar .nav-link.nuxt-link-exact-active {
  color: var(--gray-dark);
}
</style>
