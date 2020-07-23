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
            <i-icon icon="plus" class="_padding-right-1"></i-icon>Message
          </i-button>
          <i-button v-else variant="primary" disabled readonly>
            <i-icon icon="plus" class="_padding-right-1"></i-icon>Message
          </i-button>
        </i-column>
      </i-row>
      <i-row class="_padding-1">
        <i-column>
          <i-datatable
            :columns="private_state.columns"
            :rows="shared_state.rows"
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
import { store } from "./../store/store.js";
import PermissionDenied from "./errors/PermissionDenied.vue";
import RoomMessageRow from "./RoomMessageRow.vue";

export default {
  name: "RoomMessageList",
  components: {
    PermissionDenied,
  },
  props: {
    room_id: String,
  },
  data() {
    return {
      shared_state: {
        login_user: store.state.login_user,
        rows: store.state.components.room_message_list.rows,
      },
      private_state: {
        columns: [
          {
            title: "timestamp",
            path: "timestamp",
          },
          {
            title: "text",
            path: "text",
          },
          {
            title: "nickname",
            path: "nickname",
          },
          {
            title: "user id",
            path: "user_id",
          },
          {
            title: "reactions",
            path: "reactions",
            component: RoomMessageRow,
          },
          {
            title: "is hidden",
            path: "is_hidden",
            component: RoomMessageRow,
          },
          {
            title: "is user muted",
            path: "is_user_muted",
            component: RoomMessageRow,
          },
        ],
        filtering: {
          fuse: {
            keys: ["text", "nickname", "user_id"],
          },
        },
      },
    };
  },
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
