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
          <th>user_id</th>
          <th>reactions</th>
          <th>is hidden</th>
          <th>is user muted</th>
        </tr>
      </thead>
      <tbody>
        <div v-for="(message_id, index) in message_ids" :key="message_id">
          <tr>
            <td>{{ messages[index].timestamp | formatDatetime }}</td>
            <td>{{ messages[index].text }}</td>
            <td>{{ messages[index].nickname }}</td>
            <td>
              <router-link
                :to="{ path: `/rooms/${roomId}/users/${messages[index].user_id}/messages` }"
              >{{ messages[index].user_id }}</router-link>
            </td>
            <td>{{ numberOfReactions(message_id) }}</td>
            <td>
              <span v-if="hidden_messages[message_id] === undefined">not hidden</span>
              <span v-else>hidden</span>
              <button v-on:click="toggleHidden(index)">toggle</button>
            </td>
            <td>
              <span v-if="muted_users[messages[index].user_id] === undefined">not muted</span>
              <span v-else>muted</span>
              <button v-on:click="toggleMuted(index)">toggle</button>
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
      messages: [],
      hidden_messages: {},
      muted_users: {},
      reactions: {}
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
  },
  methods: {
    numberOfReactions: function(message_id) {
      if (this.reactions[message_id] === undefined) {
        return 0;
      }
      return Object.keys(this.reactions[message_id]).length;
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
    },
    toggleMuted: function(index) {
      const do_mute =
        this.muted_users[this.messages[index].user_id] === undefined;
      if (do_mute) {
        db.ref(`muted_users/${this.roomId}/${this.messages[index].user_id}`)
          .set(true)
          .then(() => {
            // TODO: alert
          })
          .catch(() => {
            // TODO: alert
          });
      } else {
        db.ref(`muted_users/${this.roomId}/${this.messages[index].user_id}`)
          .remove()
          .then(() => {
            // TODO: alert
          })
          .catch(() => {
            // TODO: alert
          });
      }
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
