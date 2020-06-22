<template>
  <div>
    <div>
      <label for="public-title">public title:</label>
      <input v-model="public_title" type="text" id="public-title" />
    </div>
    <div>
      <label for="private-title">private title:</label>
      <input v-model="private_title" type="text" id="private-title" />
    </div>
    <div>
      <label for="can-read">can read:</label>
      <input v-model="can_read" type="checkbox" id="can-read" />
    </div>
    <div>
      <label for="can-write">can write:</label>
      <input v-model="can_write" type="checkbox" id="can-write" />
    </div>
    <div>
      <button v-on:click="createRoom()">crete</button>
    </div>
  </div>
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
