<template>
  <i-container>
    <i-row end-xs class="_padding-1">
      <i-column xs="3">
        <i-button
          class="_padding-left-1-2"
          variant="primary"
          :to="{ name: 'RoomCreate' }"
        >
          <img class="_margin-right-1-2" src="svg/add-24px.svg" />
          create room
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
            <tr v-for="(room_id, index) in room_ids" :key="room_id">
              <th scope="row">
                <router-link
                  :to="{
                    name: 'RoomMessageList',
                    params: { room_id: room_id },
                  }"
                  >{{ rooms[index].private_title }}</router-link
                >
              </th>
              <td>
                <i-toggle
                  v-if="can_write_by_logged_in_user"
                  v-model="rooms[index].can_read"
                  v-on:click.native="toggleCanRead(index)"
                >
                </i-toggle>
                <i-toggle
                  v-else
                  v-model="rooms[index].can_read"
                  readonly
                  disabled
                >
                </i-toggle>
              </td>
              <td>
                <i-toggle
                  v-if="can_write_by_logged_in_user"
                  v-model="rooms[index].can_write"
                  v-on:click.native="toggleCanWrite(index)"
                >
                </i-toggle>
                <i-toggle
                  v-else
                  v-model="rooms[index].can_write"
                  readonly
                  disabled
                >
                </i-toggle>
              </td>
              <td>
                <i-button
                  v-on:click="deleteRoom(index)"
                  class="_padding-0"
                  link
                >
                  <img src="svg/delete_forever-danger-18dp.svg" height="20" />
                </i-button>
              </td>
            </tr>
          </tbody>
        </i-table>
      </i-column>
    </i-row>
  </i-container>
</template>

<script>
import { db } from "./../main.js";

export default {
  name: "RoomList",
  components: {},
  props: {
    can_write_by_logged_in_user: Boolean,
  },
  data() {
    return {
      room_ids: [],
      rooms: [],
    };
  },
  created: function() {
    const self = this;
    db.ref("rooms")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          self.room_ids.unshift(child.key);
          self.rooms.unshift(child.val());
        });
      });
  },
  methods: {
    deleteRoom: function(index) {
      const promise_room = db.ref(`rooms/${this.room_ids[index]}`).remove();
      const promise_messages = db
        .ref(`messages/${this.room_ids[index]}`)
        .remove();
      const promise_hidden_messages = db
        .ref(`hidden_messages/${this.room_ids[index]}`)
        .remove();
      const promise_muted_users = db
        .ref(`muted_users/${this.room_ids[index]}`)
        .remove();

      const self = this;
      Promise.all([
        promise_room,
        promise_messages,
        promise_hidden_messages,
        promise_muted_users,
      ])
        .then(() => {
          self.room_ids.splice(index, 1);
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
      db.ref(`rooms/${this.room_ids[index]}/can_read`)
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
      db.ref(`rooms/${this.room_ids[index]}/can_write`)
        .set(next_status)
        .then(() => {
          self.rooms[index].can_write = next_status;
        })
        .catch(() => {
          // TODO: alert
        });
    },
  },
};
</script>

<style lang="scss" scoped>
tbody {
  width: 100%;
}
</style>
