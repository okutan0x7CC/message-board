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
          <th>delete message</th>
        </tr>
      </thead>
      <tbody>
        <div v-for="(message_id, index) in message_ids" :key="message_id">
          <tr>
            <td>{{ messages[index].timestamp | formatDatetime }}</td>
            <td>{{ messages[index].text }}</td>
            <td>{{ messages[index].nickname }}</td>
            <td>
              <button v-on:click="deleteMessage(message_id, index)">delete</button>
            </td>
          </tr>
        </div>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from "moment-timezone";
import { db } from "./../main.js";

export default {
  name: "RoomMessageList",
  components: {},
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
  },
  methods: {
    deleteMessage: function(message_id, index) {
      const promise_message = db
        .ref(`messages/${this.roomId}/${message_id}`)
        .remove();
      const self = this;
      Promise.all([promise_message]).then(() => {
        self.message_ids.splice(index, 1);
        self.messages.splice(index, 1);
      });
    }
  },
  filters: {
    formatDatetime: function(timestamp) {
      return moment(timestamp)
        .tz("Asia/Tokyo")
        .format("YYYY-MM-DD HH:mm:ss");
    }
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
