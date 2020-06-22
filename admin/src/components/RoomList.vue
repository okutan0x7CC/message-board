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
        <div v-for="room in rooms" :key="room.id">
          <room-item :room="room" />
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
      rooms: {},
    };
  },
  created: function() {
    const self = this;
    db.ref("rooms")
      .once("value")
      .then((snapshot) => {
        self.rooms = snapshot.val();
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
