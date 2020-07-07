<template>
  <i-toggle
    v-if="isSelfCanManageAccount || isSelfCanReadAccount"
    v-model="row[column.path]"
    readonly
    disabled
  ></i-toggle>
  <i-toggle v-else v-model="row[column.path]" v-on:click.native="toggle"></i-toggle>
</template>

<script>
import { auth, db } from "./../main.js";

export default {
  name: "AdminAccountToggle",
  props: ["row", "column", "index"],
  computed: {
    isSelfCanManageAccount() {
      return (
        auth.currentUser.email === this.row["id"] &&
        this.column.path === "can_manage_account"
      );
    },
    isSelfCanReadAccount() {
      return (
        auth.currentUser.email === this.row["id"] &&
        this.column.path === "can_read"
      );
    }
  },
  methods: {
    toggle() {
      if (this.isSelfCanManageAccount || this.isSelfCanReadAccount) {
        return;
      }
      const next_status = !this.row[this.column.path];
      const email_encoded = this.row.id.replace(".", "%2E");
      db.ref(`admin_accounts/${email_encoded}/${this.column.path}`)
        .set(next_status)
        .catch(() => {
          // TODO: alert
        });
    }
  }
};
</script>
