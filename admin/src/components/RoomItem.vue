<template>
  <tr id="room-item">
    <td>{{ room.private_title }}</td>
    <td>{{ room.can_read }}</td>
    <td>{{ room.can_write }}</td>
  </tr>
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
