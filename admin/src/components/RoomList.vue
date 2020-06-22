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
            <td>{{ rooms[index].can_read }}</td>
            <td>{{ rooms[index].can_write }}</td>
            <td>
              <button v-on:click="deleteRoom(room_id, index)">delete</button>
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
    deleteRoom: function(room_id, index) {
      const promise_room = db.ref(`rooms/${room_id}`).remove();
      const promise_messages = db.ref(`messages/${room_id}`).remove();

      const self = this;
      Promise.all([promise_room, promise_messages]).then(() => {
        self.room_ids.splice(index, 1);
        self.rooms.splice(index, 1);
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
