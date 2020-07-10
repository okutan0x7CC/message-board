<template>
  <i-container v-if="can_read_by_logged_in_user">
    <i-row>
      <i-column>
        <i-breadcrumb class="_padding-left-2 _padding-top-2">
          <i-breadcrumb-item :to="{ name: 'RoomList' }">Rooms</i-breadcrumb-item>
          <i-breadcrumb-item active>{{ room.private_title }}</i-breadcrumb-item>
        </i-breadcrumb>
      </i-column>
    </i-row>
    <i-tabs>
      <i-tab title="Tab 1">Tab 1 content</i-tab>
      <i-tab title="Tab 2">Tab 2 content</i-tab>
      <i-tab title="Tab 3">Tab 3 content</i-tab>
    </i-tabs>
  </i-container>
  <i-container v-else>
    <permission-denied />
  </i-container>
</template>

<script>
import { db } from "./../main.js";

export default {
  name: "Room",
  props: {
    can_read_by_logged_in_user: Boolean
  },
  computed: {
    roomId: function() {
      return this.$route.params.room_id;
    }
  },
  data() {
    return {
      room: {}
    };
  },
  created() {
    const self = this;

    db.ref(`rooms/${this.roomId}`)
      .once("value")
      .then(snapshot => {
        self.room = snapshot.val();
      });
  }
};
</script>

<style>
</style>