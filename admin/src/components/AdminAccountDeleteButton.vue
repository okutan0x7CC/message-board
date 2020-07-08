<template>
  <i-button v-if="isSelfRow" readonly disabled link>
    <i-icon icon="minus" class="_text-danger"></i-icon>
  </i-button>
  <i-button v-else v-on:click="deleteUser()">
    <i-icon icon="minus" class="_text-danger"></i-icon>
  </i-button>
</template>

<script>
import { auth, functions } from "./../main.js";

export default {
  name: "AdminAccountDeleteButton",
  props: ["row", "column", "index"],
  computed: {
    isSelfRow() {
      return auth.currentUser.email === this.row["id"];
    }
  },
  methods: {
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
