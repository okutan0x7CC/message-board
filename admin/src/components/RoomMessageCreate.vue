<template>
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
</template>

<script>
import { firebase, db } from "./../main.js";

export default {
  name: "RoomMessageCreate",
  data: function() {
    return {
      text: "",
      nickname: ""
    };
  },
  computed: {
    roomId: function() {
      return this.$route.params.room_id;
    }
  },
  methods: {
    create: function() {
      const self = this;
      db.ref(`messages/${this.roomId}`).push(
        {
          user_id: "admin",
          text: this.text,
          nickname: this.nickname,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        },
        () => {
          self.$router.back();
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped></style>
