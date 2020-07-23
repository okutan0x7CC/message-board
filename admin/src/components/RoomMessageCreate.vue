<template>
  <i-container v-if="shared_state.login_user.can_write">
    <i-row>
      <i-column>
        <i-breadcrumb class="_padding-left-2 _padding-top-2">
          <i-breadcrumb-item :to="{ name: 'RoomList' }">Rooms</i-breadcrumb-item>
          <i-breadcrumb-item
            :to="{ 
              name: 'RoomDetail',
              params: { 
                room_id: room_id
              }
            }"
          >{{ room.private_title }}</i-breadcrumb-item>
          <i-breadcrumb-item active>Create Message</i-breadcrumb-item>
        </i-breadcrumb>
      </i-column>
    </i-row>
    <i-row class="_margin-top-1" center-xs>
      <i-column lg="6" md="9" xs="12">
        <i-row start-xs class="_margin-bottom-2">
          <i-column>
            <i-form-group>
              <i-form-label>nickname</i-form-label>
              <i-input v-model="nickname" placeholder="ex. admin" />
            </i-form-group>
          </i-column>
        </i-row>
        <i-row start-xs class="_margin-bottom-2">
          <i-column>
            <i-form-group>
              <i-form-label>text</i-form-label>
              <i-input v-model="text" placeholder="hello world" />
            </i-form-group>
          </i-column>
        </i-row>
        <i-row end-xs class="_margin-bottom-2">
          <i-column>
            <i-button v-on:click="create()" variant="success">create</i-button>
          </i-column>
        </i-row>
      </i-column>
    </i-row>
  </i-container>
  <i-container v-else>
    <permission-denied />
  </i-container>
</template>

<script>
import { store } from "./../store/store.js";

const ADMIN_USER_ID = "admin";
const DEFAULT_ADMIN_USER_NICKNAME = "Admin";

export default {
  name: "RoomMessageCreate",
  props: {
    room_id: String,
  },
  data() {
    return {
      shared_state: store.state,
      text: "",
      nickname: DEFAULT_ADMIN_USER_NICKNAME,
    };
  },
  computed: {
    room() {
      return this.shared_state.rtdb.rooms[this.room_id] ?? {};
    },
  },
  methods: {
    create() {
      store.createAdminMessage(
        this.room_id,
        ADMIN_USER_ID,
        this.text,
        this.nickname
      );
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped></style>
