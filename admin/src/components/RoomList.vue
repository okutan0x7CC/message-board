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
        </tr>
      </thead>
      <tbody>
        <div v-for="(room_id, index) in room_ids" :key="room_id">
          <room-item :room_id="room_id" :room="rooms[index]" />
        </div>
      </tbody>
    </table>
  </div>
</template>

<script>
import RoomItem from "./RoomItem.vue";
import { db } from "./../App.vue";

export default {
  name: "RoomList",
  components: {
    RoomItem,
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
