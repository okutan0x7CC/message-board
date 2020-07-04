<template>
  <i-navbar collapse="xs">
    <i-navbar-brand :to="{ name: 'RoomList' }">MessageBoard</i-navbar-brand>
    <i-navbar-items>
      <i-nav>
        <i-nav-item :to="{ name: 'contact' }">AdminAccounts</i-nav-item>
      </i-nav>
      <i-nav>
        <i-dropdown placement="bottom-end">
          <i-button variant="primary" link>
            <img v-if="login_user.photo_url" :src="login_user.photo_url" alt="icon" />
          </i-button>
          <i-dropdown-menu>
            <i-dropdown-item v-on:click="logout()">logout</i-dropdown-item>
          </i-dropdown-menu>
        </i-dropdown>
      </i-nav>
    </i-navbar-items>
  </i-navbar>
</template>

<script>
import { auth } from "./../main.js";

export default {
  name: "TheTopbar",
  props: {
    login_user: Object
  },
  methods: {
    logout: function() {
      auth.signOut();
    }
  }
};
</script>

<style lang="scss" scoped>
img {
  height: 36px;
  border-radius: 50%;
}
</style>
