<template>
  <div id="room-item">
    {{ room }}
  </div>
</template>

<script>
export default {
  name: "RoomItem",
  props: {
    room: Object,
  },
};
</script>

<style lang="scss" scoped></style>
