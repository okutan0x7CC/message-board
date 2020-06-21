<template>
  <div id="room-list">
    <table>
      <th></th>
      <tr v-for="room in rooms" :key="room.id">
        <room-item />
      </tr>
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
  firebase: {
    rooms: db.ref("rooms"),
  },
};
</script>

<style lang="scss" scoped></style>
