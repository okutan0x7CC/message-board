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

export default {
  name: "AdminAccountList",
  data: function() {
    return {
      columns: [
        { title: "email", path: "id" },
        { title: "read", path: "authorities.can_read" },
        { title: "write", path: "authorities.can_write" },
        { title: "manage account", path: "authorities.can_manage_account" }
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
          const email_encoded = child_snapshot.key;
          self.rows.push({
            id: email_encoded.replace("%2E", "."),
            authorities: child_snapshot.val()
          });
        });
      });
  }
};
</script>

<style lang="scss" scoped>
</style>
