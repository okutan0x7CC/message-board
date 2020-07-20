<template>
  <i-row v-if="shared_state.login_user.can_read">
    <i-column>
      <i-row end-xs class="_padding-1">
        <i-column>
          <i-button
            v-if="shared_state.login_user.can_write"
            variant="primary"
            :to="{ name: 'RoomMessageCreate' }"
          >
            <i-icon></i-icon>Create Message
          </i-button>
          <i-button v-else variant="primary" disabled readonly>
            <i-icon icon="plus" class="_padding-right-1"></i-icon>Create Message
          </i-button>
        </i-column>
      </i-row>
      <i-row class="_padding-1">
        <i-column>
          <i-datatable
            :columns="private_state.columns"
            :rows="private_state.rows"
            :footer="false"
            :responsive="true"
            :hover="true"
            :filtering="private_state.filtering"
          />
        </i-column>
      </i-row>
    </i-column>
  </i-row>
  <i-row v-else>
    <permission-denied />
  </i-row>
</template>

<script>
import moment from "moment-timezone";
import { store } from "./../store/store.js";
import PermissionDenied from "./errors/PermissionDenied.vue";
import RoomMessageRow from "./RoomMessageRow.vue";
import { logger } from "../logger/logger";

export default {
  name: "RoomMessageList",
  components: {
    PermissionDenied
  },
  props: {
    room_id: String
  },
  data() {
    return {
      shared_state: store.state,
      private_state: {
        columns: [
          {
            title: "timestamp",
            path: "timestamp"
          },
          {
            title: "text",
            path: "text"
          },
          {
            title: "nickname",
            path: "nickname"
          },
          {
            title: "user id",
            path: "user_id"
          },
          {
            title: "reactions",
            path: "reactions",
            component: RoomMessageRow
          },
          {
            title: "is hidden",
            path: "is_hidden",
            component: RoomMessageRow
          },
          {
            title: "is user muted",
            path: "is_user_muted",
            component: RoomMessageRow
          }
        ],
        rows: [],
        filtering: {
          fuse: {
            keys: ["text", "nickname", "user_id"]
          }
        }
      }
    };
  },
  watch: {
    "shared_state.room_messages"(new_messages) {
      let rows = [];
      for (const [message_id, message] of Object.entries(new_messages)) {
        console.log(message);

        rows.unshift({
          id: message_id,
          timestamp: this.formatTimestamp(message.timestamp),
          text: message.text,
          nickname: message.nickname,
          user_id: message.user_id,
          reactions: {},
          is_hidden: false,
          is_user_muted: false
        });
      }
      this.private_state.rows = rows;
      logger.info("watch shared_state.room_messages");
    }
  },
  methods: {
    formatTimestamp(timestamp) {
      return moment(timestamp)
        .tz("Asia/Tokyo")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  },
  created() {
    store.listenRoomMessages(this.room_id);
  },
  beforeDestroy() {
    store.detachRoomMessages(this.room_id);
  }
  // methods: {
  //   toggleHidden: function(index) {
  //     const next_status =
  //       this.hidden_messages[this.message_ids[index]] === undefined
  //         ? true
  //         : null; // set(null) は remove() と同じ

  //     db.ref(`hidden_messages/${this.room_id}/${this.message_ids[index]}`)
  //       .set(next_status)
  //       .then(() => {
  //         // TODO: alert
  //       })
  //       .catch(() => {
  //         // TODO: alert
  //       });
  //   },
  //   toggleMuted: function(index) {
  //     const next_status =
  //       this.hidden_messages[this.message_ids[index]] === undefined
  //         ? true
  //         : null; // set(null) は remove() と同じ
  //     db.ref(`muted_users/${this.room_id}/${this.messages[index].user_id}`)
  //       .set(next_status)
  //       .then(() => {
  //         // TODO: alert
  //       })
  //       .catch(() => {
  //         // TODO: alert
  //       });
  //   }
  // },
};
</script>

<style lang="scss" scoped>
tbody {
  width: 100%;
}
</style>
