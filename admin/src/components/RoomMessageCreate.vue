<template>
  <i-container v-if="can_write_by_logged_in_user">
    <i-row>
      <i-column>
        <i-breadcrumb class="_padding-left-2 _padding-top-2">
          <i-breadcrumb-item :to="{ name: 'RoomList' }">Rooms</i-breadcrumb-item>
          <i-breadcrumb-item
            :to="{ 
              name: 'Room',
              params: { 
                room_id: room_id
              }
            }"
          >{{ room.private_title }}</i-breadcrumb-item>
          <i-breadcrumb-item active>Create Message</i-breadcrumb-item>
        </i-breadcrumb>
      </i-column>
    </i-row>
    <div>
      <div>
        <label for="message-nickname">nickname:</label>
        <input v-model="nickname" id="message-nickname" type="text" />
      </div>
      <div>
        <label for="message-text">text:</label>
        <input v-model="text" id="message-text" type="text" />
      </div>
      <div>
        <button v-on:click="create()">create</button>
      </div>
    </div>
  </i-container>
  <i-container v-else>
    <permission-denied />
  </i-container>
</template>

<script>
export default {
  name: "RoomMessageCreate",
  props: {
    can_write_by_logged_in_user: Boolean,
    room_id: String,
    room: Object
  },
  data() {
    return {
      text: "",
      nickname: ""
    };
  }
};
</script>

<style lang="scss" scoped></style>
