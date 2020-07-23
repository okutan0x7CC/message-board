<template>
  <router-view :room_id="roomId" />
</template>

<script>
import { store } from "./../store/store.js";

export default {
  name: "Room",
  computed: {
    roomId() {
      return this.$route.params.room_id;
    },
  },
  created: function () {
    store.fetchRoom(this.roomId);
    store.listenRoom(this.roomId);
  },
  beforeDestroy() {
    store.detachRoom(this.roomId);
  },
};
</script>

<style>
</style>