<template>
  <div v-if="column.path != 'delete'">
    <i-toggle v-if="isSelfRow" v-model="row[column.path]" readonly disabled></i-toggle>
    <i-toggle v-else v-model="row[column.path]" v-on:click.native="toggle"></i-toggle>
  </div>
  <div v-else>
    <i-button v-if="isSelfRow" readonly disabled link>
      <i-icon icon="minus" class="_text-danger"></i-icon>
    </i-button>
    <i-button v-else v-on:click="deleteUser()">
      <i-icon icon="minus" class="_text-danger"></i-icon>
    </i-button>
  </div>
</template>

<script>
1;
import { auth, db, functions } from "./../main.js";

export default {
  name: "AdminAccountRow",
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
    },
    deleteUser() {
      if (this.isSelfRow) {
        return;
      }
      const delete_user_email = this.row.id;
      const delete_request = functions.httpsCallable("deleteAdminAccount", {});
      delete_request({ delete_user_email: delete_user_email }).then(result => {
        if (result.ok) {
          // TODO: emit deletd
        } else {
          // TODO: alert
        }
      });
    }
  }
};
</script>
