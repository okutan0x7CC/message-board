<template>
  <i-navbar collapse="xs">
    <i-navbar-brand :to="{ name: 'RoomList' }">MessageBoard</i-navbar-brand>
    <i-navbar-items>
      <i-nav>
        <i-nav-item :to="{ name: 'AdminUserList' }">AdminAccounts</i-nav-item>
      </i-nav>
      <i-nav>
        <i-dropdown placement="bottom-end">
          <i-button variant="primary" link>
            <img v-if="login_user.photo_url" :src="login_user.photo_url" alt="icon" />
          </i-button>
          <i-dropdown-menu>
            <i-dropdown-item class="_padding-left-1-2 _padding-right-1-2">
              <i-button class="_width-100" v-on:click="toggleDarkMode">
                <i-icon icon="light" />
              </i-button>
            </i-dropdown-item>
            <i-dropdown-item class="_padding-left-1-2 _padding-right-1-2">
              <i-button class="_width-100" v-on:click="logout">logout</i-button>
            </i-dropdown-item>
          </i-dropdown-menu>
        </i-dropdown>
      </i-nav>
    </i-navbar-items>
  </i-navbar>
</template>

<script>
import { auth } from "./../main.js";

export default {
  name: "TheNavigationBar",
  props: {
    login_user: Object
  },
  methods: {
    logout: function() {
      auth.signOut();
    },
    toggleDarkMode() {
      this.$inkline.config.variant =
        this.$inkline.config.variant === "light" ? "dark" : "light";
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  // navbar に z-index を入れない場合、dropdown が下の DOM 要素に隠れてしまう
  z-index: 10;
}
img {
  height: 36px;
  border-radius: 50%;
}
</style>
