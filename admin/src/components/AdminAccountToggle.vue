<template>
  <i-toggle v-if="isSelfRow" v-model="row[column.path]" readonly disabled></i-toggle>
  <i-toggle v-else v-model="row[column.path]" v-on:click.native="toggle"></i-toggle>
</template>

<script>
import { auth, db } from "./../main.js";

export default {
  name: "AdminAccountToggle",
  props: ["row", "column", "index"],
  computed: {
    isSelfRow() {
      return auth.currentUser.email === this.row["id"];
    }
  },
  methods: {
    toggle() {
      if (this.isSelfRow) {
        return;
      }
      const next_status = !this.row[this.column.path];
      const email_encoded = this.row.id.replace(/\./g, "%2E");
      db.ref(`admin_accounts/${email_encoded}/${this.column.path}`)
        .set(next_status)
        .catch(() => {
          // TODO: alert
        });
    }
  }
};
</script>
