<template>
  <tr>
    <td>
      <router-link :to="{ path: `/rooms/${room_id}` }">
        {{ room.private_title }}
      </router-link>
    </td>
    <td>{{ room.can_read }}</td>
    <td>{{ room.can_write }}</td>
  </tr>
</template>

<script>
export default {
  name: "RoomItem",
  props: {
    room_id: String,
    room: Object,
  },
};
</script>

<style lang="scss" scoped></style>
