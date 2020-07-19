<template>
  <i-container v-if="shared_state.login_user.can_read">
    <i-row>
      <i-column>
        <i-breadcrumb class="_padding-left-2 _padding-top-2">
          <i-breadcrumb-item active>Rooms</i-breadcrumb-item>
        </i-breadcrumb>
      </i-column>
    </i-row>
    <i-row end-xs class="_padding-1">
      <i-column>
        <i-button
          v-if="shared_state.login_user.can_write"
          variant="primary"
          :to="{ name: 'RoomCreate' }"
        >
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
                    },
                  }"
                >{{ shared_state.rooms[index].private_title }}</router-link>
              </th>
              <td>
                <i-toggle
                  v-if="shared_state.login_user.can_write"
                  v-model="shared_state.rooms[index].can_read"
                  v-on:click.native="toggleCanRead(index)"
                ></i-toggle>
                <i-toggle v-else v-model="shared_state.rooms[index].can_read" readonly disabled></i-toggle>
              </td>
              <td>
                <i-toggle
                  v-if="shared_state.login_user.can_write"
                  v-model="shared_state.rooms[index].can_write"
                  v-on:click.native="toggleCanWrite(index)"
                ></i-toggle>
                <i-toggle v-else v-model="shared_state.rooms[index].can_write" readonly disabled></i-toggle>
              </td>
              <td>
                <i-button
                  v-if="shared_state.login_user.can_write"
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
import { store } from "./../store/store.js";
import PermissionDenied from "./errors/PermissionDenied.vue";

export default {
  name: "RoomList",
  components: {
    PermissionDenied
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
      store.deleteRoom(index);
    },
    toggleCanRead: function(index) {
      store.toggleRoomCanRead(index);
    },
    toggleCanWrite: function(index) {
      store.toggleCanWrite(index);
    }
  }
};
</script>

<style lang="scss" scoped>
tbody {
  width: 100%;
}
</style>
