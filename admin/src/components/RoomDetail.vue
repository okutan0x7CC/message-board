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
    <i-row end-xs class="_padding-1">
      <i-column>
        <i-button
          v-if="can_write_by_logged_in_user"
          variant="primary"
          :to="{ 
              name: 'RoomMessageCreate',
          }"
        >
          <i-icon icon="plus" class="_padding-right-1"></i-icon>Create Message
        </i-button>
        <i-button v-else variant="primary" disabled readonly>
          <i-icon icon="plus" class="_padding-right-1"></i-icon>Create Message
        </i-button>
      </i-column>
    </i-row>
    <i-row start-xs>
      <i-column>
        <i-tabs>
          <i-tab title="Messages" class="_background-transparent">
            <room-message-list />
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
import RoomMessageList from "./RoomMessageList.vue";

export default {
  name: "Room",
  components: {
    RoomMessageList
  },
  props: {
    can_read_by_logged_in_user: Boolean,
    can_write_by_logged_in_user: Boolean,
    room_id: String,
    room: Object,
    message_ids: Array,
    messages: Array,
    hidden_messages: Object,
    muted_users: Object,
    reactions: Object
  }
};
</script>

<style>
</style>