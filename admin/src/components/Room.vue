<template>
  <i-container v-if="can_read_by_logged_in_user">
    <i-row>
      <i-column>
        <i-breadcrumb class="_padding-left-2 _padding-top-2">
          <i-breadcrumb-item :to="{ name: 'RoomList' }">Rooms</i-breadcrumb-item>
          <i-breadcrumb-item active>{{ room.private_title }}</i-breadcrumb-item>
        </i-breadcrumb>
      </i-column>
    </i-row>
    <i-row end-xs class="_padding-1">
      <i-column>
        <i-button
          v-if="can_write_by_logged_in_user"
          variant="primary"
          :to="{ 
              name: 'RoomMessageCreate',
              params: {
                  room_id: roomId
              }
          }"
        >
          <i-icon icon="plus" class="_padding-right-1"></i-icon>Create Message
        </i-button>
        <i-button v-else variant="primary" disabled readonly>
          <i-icon icon="plus" class="_padding-right-1"></i-icon>Create Message
        </i-button>
      </i-column>
    </i-row>
    <i-row start-xs>
      <i-column>
        <i-tabs>
          <i-tab title="Messages" class="_background-transparent">
            <room-message-list />
          </i-tab>
          <i-tab title="Posted Users" class="_background-transparent"></i-tab>
        </i-tabs>
      </i-column>
    </i-row>
  </i-container>
  <i-container v-else>
    <permission-denied />
  </i-container>
</template>

<script>
import { db } from "./../main.js";
import RoomMessageList from "./RoomMessageList.vue";

export default {
  name: "Room",
  props: {
    can_read_by_logged_in_user: Boolean,
    can_write_by_logged_in_user: Boolean
  },
  components: {
    RoomMessageList
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