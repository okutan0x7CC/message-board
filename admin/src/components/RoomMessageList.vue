<template>
  <div id="room-message-list">
    <div>
      <router-link :to="{ path: `/rooms/${roomId}/messages/create` }">create message</router-link>
    </div>
    <table>
      <thead>
        <tr>
          <th>timestamp</th>
          <th>text</th>
          <th>nickname</th>
        </tr>
      </thead>
      <tbody>
        <div v-for="(message_id, index) in message_ids" :key="message_id">
          <RoomMessageItem :message_id="message_id" :message="messages[index]" />
        </div>
      </tbody>
    </table>
  </div>
</template>

<script>
import RoomMessageItem from "./RoomMessageItem.vue";
import { db } from "./../main.js";

export default {
  name: "RoomMessageList",
  components: {
    RoomMessageItem
  },
  data: function() {
    return {
      message_ids: [],
      messages: []
    };
  },
  computed: {
    roomId: function() {
      return this.$route.params.room_id;
    }
  },
  created: function() {
    const self = this;
    db.ref(`messages/${this.roomId}`).on("child_added", snapshot => {
      self.message_ids.unshift(snapshot.key);
      self.messages.unshift(snapshot.val());
    });
  }
};
</script>

<style lang="scss" scoped>
table {
  tbody {
    display: block;
    overflow: auto;
  }
  thead,
  tbody tr {
    width: 100%;
    display: table;
    table-layout: fixed;
  }
  td {
    word-break: break-all;
  }
}
</style>
