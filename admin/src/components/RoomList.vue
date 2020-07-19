<template>
  <i-container v-if="can_read_by_logged_in_user">
    <i-row>
      <i-column>
        <i-breadcrumb class="_padding-left-2 _padding-top-2">
          <i-breadcrumb-item active>Rooms</i-breadcrumb-item>
        </i-breadcrumb>
      </i-column>
    </i-row>
    <i-row end-xs class="_padding-1">
      <i-column>
        <i-button v-if="can_write_by_logged_in_user" variant="primary" :to="{ name: 'RoomCreate' }">
          <i-icon icon="plus" class="_padding-right-1"></i-icon>Create Room
        </i-button>
        <i-button v-else variant="primary" disabled readonly>
          <i-icon icon="plus" class="_padding-right-1"></i-icon>Create Room
        </i-button>
      </i-column>
    </i-row>
    <i-row>
      <i-column xs="12">
        <i-table bordered hover striped responsive>
          <thead>
            <tr>
              <th scope="row">private title</th>
              <th scope="row">can read</th>
              <th scope="row">can write</th>
              <th scope="row">delete room</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(room_id, index) in shared_state.room_ids" :key="room_id">
              <th scope="row">
                <router-link
                  :to="{
                    name: 'RoomDetail',
                    params: { 
                      room_id: room_id,
                      can_read_by_logged_in_user: can_read_by_logged_in_user,
                      can_write_by_logged_in_user: can_write_by_logged_in_user
                    },
                  }"
                >{{ shared_state.rooms[index].private_title }}</router-link>
              </th>
              <td>
                <i-toggle
                  v-if="can_write_by_logged_in_user"
                  v-model="shared_state.rooms[index].can_read"
                  v-on:click.native="toggleCanRead(index)"
                ></i-toggle>
                <i-toggle v-else v-model="shared_state.rooms[index].can_read" readonly disabled></i-toggle>
              </td>
              <td>
                <i-toggle
                  v-if="can_write_by_logged_in_user"
                  v-model="shared_state.rooms[index].can_write"
                  v-on:click.native="toggleCanWrite(index)"
                ></i-toggle>
                <i-toggle v-else v-model="shared_state.rooms[index].can_write" readonly disabled></i-toggle>
              </td>
              <td>
                <i-button
                  v-if="can_write_by_logged_in_user"
                  v-on:click="deleteRoom(index)"
                  class="_padding-0"
                  link
                >
                  <i-icon icon="minus" class="_text-danger"></i-icon>
                </i-button>
                <i-button v-else class="_padding-0" link readonly disabled>
                  <i-icon icon="minus" class="_text-danger"></i-icon>
                </i-button>
              </td>
            </tr>
          </tbody>
        </i-table>
      </i-column>
    </i-row>
  </i-container>
  <i-container v-else>
    <permission-denied />
  </i-container>
</template>

<script>
import { db } from "./../main.js";
import { store } from "./../store/store.js";
import PermissionDenied from "./errors/PermissionDenied.vue";

export default {
  name: "RoomList",
  components: {
    PermissionDenied
  },
  props: {
    can_read_by_logged_in_user: Boolean,
    can_write_by_logged_in_user: Boolean
  },
  data() {
    return {
      shared_state: store.state
    };
  },
  created: function() {
    store.fetchRooms();
  },
  methods: {
    deleteRoom: function(index) {
      const promise_room = db
        .ref(`rooms/${this.shared_state.room_ids[index]}`)
        .remove();
      const promise_messages = db
        .ref(`messages/${this.shared_state.room_ids[index]}`)
        .remove();
      const promise_hidden_messages = db
        .ref(`hidden_messages/${this.shared_state.room_ids[index]}`)
        .remove();
      const promise_muted_users = db
        .ref(`muted_users/${this.shared_state.room_ids[index]}`)
        .remove();

      const self = this;
      Promise.all([
        promise_room,
        promise_messages,
        promise_hidden_messages,
        promise_muted_users
      ])
        .then(() => {
          self.shared_state.room_ids.splice(index, 1);
          self.rooms.splice(index, 1);
        })
        .catch(() => {
          // TODO: alert
          return;
        });
    },
    toggleCanRead: function(index) {
      const next_status = !this.rooms[index].can_read;
      const self = this;
      db.ref(`rooms/${this.shared_state.room_ids[index]}/can_read`)
        .set(next_status)
        .then(() => {
          self.rooms[index].can_read = next_status;
        })
        .catch(() => {
          // TODO: alert
        });
    },
    toggleCanWrite: function(index) {
      const next_status = !this.rooms[index].can_write;
      const self = this;
      db.ref(`rooms/${this.shared_state.room_ids[index]}/can_write`)
        .set(next_status)
        .then(() => {
          self.rooms[index].can_write = next_status;
        })
        .catch(() => {
          // TODO: alert
        });
    }
  }
};
</script>

<style lang="scss" scoped>
tbody {
  width: 100%;
}
</style>
