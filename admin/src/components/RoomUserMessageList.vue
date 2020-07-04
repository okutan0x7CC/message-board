<template>
  <div>
    <div>user_id: {{ userId }}</div>
    <div>
      <span v-if="is_muted">muted</span>
      <span v-else>not muted</span>
      <button v-on:click="toggleMuted()">toggle</button>
    </div>
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
      hidden_messages: {},
      is_muted: false,
      room: {}
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

    db.ref(`rooms/${this.roomId}`)
      .once("value")
      .then(snapshot => {
        self.room = snapshot.val();
      });

    db.ref(`messages/${this.roomId}`)
      .orderByChild("user_id")
      .equalTo(this.userId)
      .on("child_added", snapshot => {
        self.message_ids.unshift(snapshot.key);
        self.messages.unshift(snapshot.val());
      });

    db.ref(`muted_users/${this.roomId}/${this.userId}`)
      .once("value")
      .then(snapshot => {
        self.is_muted = snapshot.val();
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
    toggleMuted: function() {
      const do_mute = !this.is_muted;
      const self = this;
      if (do_mute) {
        db.ref(`muted_users/${this.roomId}/${this.userId}`)
          .set(true)
          .then(() => {
            // TODO: alert
            self.is_muted = true;
          })
          .catch(() => {
            // TODO: alert
          });
      } else {
        db.ref(`muted_users/${this.roomId}/${this.userId}`)
          .remove()
          .then(() => {
            // TODO: alert
            self.is_muted = false;
          })
          .catch(() => {
            // TODO: alert
          });
      }
    },
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
