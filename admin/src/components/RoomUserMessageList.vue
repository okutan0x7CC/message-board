<template>
  <div>
    <div>user_id: {{ userId }}</div>
    <table>
      <thead>
        <tr>
          <th>timestamp</th>
          <th>text</th>
          <th>nickname</th>
          <th>is hidden</th>
        </tr>
      </thead>
      <tbody>
        <div v-for="(message_id, index) in message_ids" :key="message_id">
          <tr>
            <td>{{ messages[index].timestamp | formatDatetime }}</td>
            <td>{{ messages[index].text }}</td>
            <td>{{ messages[index].nickname }}</td>
            <td>
              <span v-if="hidden_messages[message_id] === undefined">shown</span>
              <span v-else>hidden</span>
              <button v-on:click="toggleHidden(index)">toggle</button>
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
  name: "RoomUserMessageList",
  data: function() {
    return {
      message_ids: [],
      messages: [],
      hidden_messages: {}
    };
  },
  computed: {
    roomId: function() {
      return this.$route.params.room_id;
    },
    userId: function() {
      return this.$route.params.user_id;
    }
  },
  created: function() {
    const self = this;
    db.ref(`messages/${this.roomId}`)
      .orderByChild("user_id")
      .equalTo(this.userId)
      .on("child_added", snapshot => {
        self.message_ids.unshift(snapshot.key);
        self.messages.unshift(snapshot.val());
      });
    db.ref(`hidden_messages/${this.roomId}`).on("child_added", snapshot => {
      self.$set(self.hidden_messages, snapshot.key, snapshot.val());
    });
    db.ref(`hidden_messages/${this.roomId}`).on("child_removed", snapshot => {
      self.$delete(self.hidden_messages, snapshot.key);
    });
  },
  filters: {
    formatDatetime: function(timestamp) {
      return moment(timestamp)
        .tz("Asia/Tokyo")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  },
  methods: {
    toggleHidden: function(index) {
      const do_hide =
        this.hidden_messages[this.message_ids[index]] === undefined;
      if (do_hide) {
        db.ref(`hidden_messages/${this.roomId}/${this.message_ids[index]}`)
          .set(true)
          .then(() => {
            // TODO: alert
          })
          .catch(() => {
            // TODO: alert
          });
      } else {
        db.ref(`hidden_messages/${this.roomId}/${this.message_ids[index]}`)
          .remove()
          .then(() => {
            // TODO: alert
          })
          .catch(() => {
            // TODO: alert
          });
      }
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