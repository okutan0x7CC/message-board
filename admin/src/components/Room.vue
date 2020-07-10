<template>
  <router-view
    :can_read_by_logged_in_user="can_read_by_logged_in_user"
    :can_write_by_logged_in_user="can_write_by_logged_in_user"
    :room_id="roomId"
    :room="room"
    :message_ids="message_ids"
    :messages="messages"
    :hidden_messages="hidden_messages"
    :muted_users="muted_users"
    :reactions="reactions"
  />
</template>

<script>
import { db } from "./../main.js";

export default {
  name: "Room",
  props: {
    can_read_by_logged_in_user: Boolean,
    can_write_by_logged_in_user: Boolean
  },
  computed: {
    roomId() {
      return this.$route.params.room_id;
    }
  },
  data() {
    return {
      room: {},
      message_ids: [],
      messages: [],
      hidden_messages: {},
      muted_users: {},
      reactions: {}
    };
  },
  created: function() {
    const self = this;
    db.ref(`rooms/${this.roomId}`)
      .once("value")
      .then(snapshot => {
        self.room = snapshot.val();
      });
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