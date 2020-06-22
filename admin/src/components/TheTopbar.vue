<template>
  <div id="topbar">
    <div>email: {{ login_user.email }}</div>
    <div>can_read: {{ login_user.can_read }}</div>
    <div>can_write: {{ login_user.can_write }}</div>
    <div>
      <img :src="login_user.photo_url" />
    </div>
    <div>
      <button v-on:click="logout()">log out</button>
    </div>
  </div>
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
#topbar {
  background-color: gray;
}
img {
  height: 40px;
}
</style>
