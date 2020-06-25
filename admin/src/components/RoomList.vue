<template>
  <div id="room-list">
    <div>
      <router-link to="/rooms/create">create room</router-link>
    </div>
    <table>
      <thead>
        <tr>
          <th>private title</th>
          <th>can read</th>
          <th>can write</th>
          <th>delete room</th>
        </tr>
      </thead>
      <tbody>
        <div v-for="(room_id, index) in room_ids" :key="room_id">
          <tr>
            <td>
              <router-link :to="{ path: `/rooms/${room_id}` }">{{ rooms[index].private_title }}</router-link>
            </td>
            <td>
              {{ rooms[index].can_read }}
              <button v-on:click="toggleCanRead(index)">toggle</button>
            </td>
            <td>
              {{ rooms[index].can_write }}
              <button v-on:click="toggleCanWrite(index)">toggle</button>
            </td>
            <td>
              <button v-on:click="deleteRoom(index)">delete</button>
            </td>
          </tr>
        </div>
      </tbody>
    </table>
  </div>
</template>

<script>
import { db } from "./../main.js";

export default {
  name: "RoomList",
  components: {},
  data() {
    return {
      room_ids: [],
      rooms: []
    };
  },
  created: function() {
    const self = this;
    db.ref("rooms")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(child => {
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
        promise_muted_users
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
