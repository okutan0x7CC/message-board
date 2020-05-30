<template>
  <div id="room-list">
      <table>
        <th></th>
        <tr v-for="room in rooms" :key="room.id">
          <RoomItem/>
        </tr>
      </table>
  </div>
</template>

<script>
import RoomItem from "./RoomItem.vue"
import firebase from "firebase/app";
import "firebase/database";

const db = firebase.database();

export default {
  name: "RoomList",
  components: {
    RoomItem
  },
  data() {
    return {
      rooms: {}
    }
  },
  firebase: {
    rooms: db.ref("rooms")
  }
}

</script>

<style lang="scss" scoped>

</style>
