<template>
  <i-container>
    <i-row>
      <i-column>
        <i-breadcrumb class="_padding-left-2 _padding-top-2">
          <i-breadcrumb-item :to="{ name: 'RoomList' }">Rooms</i-breadcrumb-item>
          <i-breadcrumb-item active>Create Room</i-breadcrumb-item>
        </i-breadcrumb>
      </i-column>
    </i-row>
    <i-row class="_margin-top-1" center-xs>
      <i-column lg="6" md="9" xs="12">
        <i-row start-xs class="_margin-bottom-2">
          <i-column>
            <i-form-group>
              <i-form-label>public title</i-form-label>
              <i-input v-model="public_title" placeholder="Test Room 07/05" />
            </i-form-group>
          </i-column>
        </i-row>
        <i-row start-xs class="_margin-bottom-2">
          <i-column>
            <i-form-group>
              <i-form-label>private title</i-form-label>
              <i-input v-model="private_title" placeholder="#1 Test Room 2020-07-05" />
            </i-form-group>
          </i-column>
        </i-row>
        <i-row middle-xs class="_margin-bottom-2">
          <i-column>
            <i-form-group>
              <i-checkbox v-model="can_read">can read</i-checkbox>
              <i-checkbox v-model="can_write">can write</i-checkbox>
            </i-form-group>
          </i-column>
        </i-row>
        <i-row end-xs class="_margin-bottom-2">
          <i-column>
            <i-button v-on:click="createRoom()" variant="success">create</i-button>
          </i-column>
        </i-row>
      </i-column>
    </i-row>
  </i-container>
</template>

<script>
import { db } from "./../main.js";

export default {
  name: "RoomCreate",
  data: function() {
    return {
      public_title: "",
      private_title: "",
      can_read: false,
      can_write: false
    };
  },
  methods: {
    createRoom: function() {
      const self = this;
      db.ref("rooms").push(
        {
          public_title: this.public_title,
          private_title: this.private_title,
          can_read: this.can_read,
          can_write: this.can_write
        },
        () => {
          self.$router.back();
        }
      );
    }
  }
};
</script>

<style></style>
