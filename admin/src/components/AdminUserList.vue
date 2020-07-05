<template>
  <i-content></i-content>
</template>

<script>
import { db } from "./../main.js";

export default {
  name: "AdminUserList",
  data: function() {
    return {
      admin_users: {}
    };
  },
  created: function() {
    db.ref("admin_users")
      .once("value")
      .then(snapshot => {
        snpashot.val();
      });
  }
};
</script>

<style lang="scss" scoped>
</style>
