<template>
  <i-container>
    <i-row>
      <i-column>
        <i-breadcrumb class="_padding-left-2 _padding-top-2">
          <i-breadcrumb-item active>Admin</i-breadcrumb-item>
        </i-breadcrumb>
      </i-column>
    </i-row>
    <i-row class="_margin-top-1">
      <i-column>
        <i-datatable :columns="columns" :rows="rows" />
      </i-column>
    </i-row>
  </i-container>
</template>

<script>
import { db } from "./../main.js";

export default {
  name: "AdminUserList",
  data: function() {
    return {
      admin_users: {},
      columns: [
        { title: "email", path: "email" },
        { title: "can read", path: "can_read" },
        { title: "can write", path: "can_write" }
      ],
      rows: [{ email: "hoge", can_read: false, can_write: true }]
    };
  },
  created: function() {
    const self = this;
    db.ref("admin_users")
      .once("value")
      .then(snapshot => {
        self.admin_users = snapshot.val();
      });
  }
};
</script>

<style lang="scss" scoped>
</style>
