<template>
  <i-container v-if="shared_state.login_user.can_read">
    <i-row>
      <i-column>
        <i-breadcrumb class="_padding-left-2 _padding-top-2">
          <i-breadcrumb-item :to="{ name: 'RoomList' }">Rooms</i-breadcrumb-item>
          <i-breadcrumb-item active>{{ room.private_title }}</i-breadcrumb-item>
        </i-breadcrumb>
      </i-column>
    </i-row>
    <i-row start-xs>
      <i-column>
        <i-tabs>
          <i-tab title="Messages" class="_background-transparent">
            <room-message-list :room_id="room_id" />
          </i-tab>
          <i-tab title="Posted Users" class="_background-transparent"></i-tab>
        </i-tabs>
      </i-column>
    </i-row>
  </i-container>
  <i-container v-else>
    <permission-denied />
  </i-container>
</template>

<script>
import { store } from "./../store/store.js";
import RoomMessageList from "./RoomMessageList.vue";

export default {
  name: "Room",
  components: {
    RoomMessageList
  },
  props: {
    room_id: String
  },
  data() {
    return {
      shared_state: store.state
    };
  },
  computed: {
    room() {
      return this.shared_state.rooms[this.room_id] ?? {};
    }
  }
};
</script>

<style>
</style>