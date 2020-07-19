<template>
  <router-view :room_id="roomId" />
</template>

<script>
import { store } from "./../store/store.js";
import { db } from "./../main.js";

export default {
  name: "Room",
  computed: {
    roomId() {
      return this.$route.params.room_id;
    }
  },
  data() {
    return {
      message_ids: [],
      messages: [],
      hidden_messages: {},
      muted_users: {},
      reactions: {}
    };
  },
  created: function() {
    store.fetchRooms();
    const self = this;
    db.ref(`messages/${this.roomId}`).on("child_added", snapshot => {
      self.message_ids.unshift(snapshot.key);
      self.messages.unshift(snapshot.val());
    });
    db.ref(`hidden_messages/${this.roomId}`).on("child_added", snapshot => {
      self.$set(self.hidden_messages, snapshot.key, snapshot.val());
    });
    db.ref(`hidden_messages/${this.roomId}`).on("child_removed", snapshot => {
      self.$delete(self.hidden_messages, snapshot.key);
    });
    db.ref(`muted_users/${this.roomId}`).on("child_added", snapshot => {
      self.$set(self.muted_users, snapshot.key, snapshot.val());
    });
    db.ref(`muted_users/${this.roomId}`).on("child_removed", snapshot => {
      self.$delete(self.muted_users, snapshot.key);
    });
    db.ref(`reactions/${this.roomId}`).on("child_added", snapshot => {
      const reaction = snapshot.val();
      self.$set(self.reactions, reaction.message_id, reaction.user_id);
    });
    db.ref(`reactions/${this.roomId}`).on("child_removed", snapshot => {
      const reaction = snapshot.val();
      self.$delete(self.reactions, reaction.message_id);
    });
  }
};
</script>

<style>
</style>