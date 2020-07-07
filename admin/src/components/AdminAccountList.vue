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
        <i-datatable
          :columns="columns"
          :rows="rows"
          :footer="false"
          :responsive="true"
          :striped="true"
          :hover="true"
        />
      </i-column>
    </i-row>
  </i-container>
</template>

<script>
import { db } from "./../main.js";
import AdminAccountToggle from "./AdminAccountToggle.vue";

export default {
  name: "AdminAccountList",
  data: function() {
    return {
      columns: [
        { title: "email", path: "id" },
        {
          title: "read",
          path: "can_read",
          component: AdminAccountToggle
        },
        {
          title: "write",
          path: "can_write",
          component: AdminAccountToggle
        },
        {
          title: "manage account",
          path: "can_manage_account",
          component: AdminAccountToggle
        }
      ],
      rows: []
    };
  },
  created: function() {
    const self = this;
    db.ref("admin_accounts")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(child_snapshot => {
          const email = child_snapshot.key.replace("%2E", ".");
          const authorities = child_snapshot.val();
          self.rows.push({
            id: email,
            can_read: authorities.can_read,
            can_write: authorities.can_write,
            can_manage_account: authorities.can_manage_account
          });
        });
      });
  }
};
</script>

<style lang="scss" scoped>
</style>
