<template>
  <div id="room-message-list">
    <div>
      <router-link :to="{ name: 'RoomMessageCreate', params: { room_id: room_id } }">create message</router-link>
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
                :to="{
                  name: 'RoomUserMessageList',
                  params: {
                    room_id: room_id,
                    user_id: messages[index].user_id,
                  },
                }"
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
  props: {
    can_read_by_logged_in_user: Boolean,
    can_write_by_logged_in_user: Boolean,
    room_id: String,
    room: Object,
    message_ids: Array,
    messages: Array,
    hidden_messages: Object,
    muted_users: Object,
    reactions: Object
  },
  methods: {
    toggleHidden: function(index) {
      const next_status =
        this.hidden_messages[this.message_ids[index]] === undefined
          ? true
          : null; // set(null) は remove() と同じ

      db.ref(`hidden_messages/${this.room_id}/${this.message_ids[index]}`)
        .set(next_status)
        .then(() => {
          // TODO: alert
        })
        .catch(() => {
          // TODO: alert
        });
    },
    toggleMuted: function(index) {
      const next_status =
        this.hidden_messages[this.message_ids[index]] === undefined
          ? true
          : null; // set(null) は remove() と同じ
      db.ref(`muted_users/${this.room_id}/${this.messages[index].user_id}`)
        .set(next_status)
        .then(() => {
          // TODO: alert
        })
        .catch(() => {
          // TODO: alert
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
tbody {
  width: 100%;
}
</style>
