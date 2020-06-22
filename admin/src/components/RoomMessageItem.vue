<template>
  <tr>
    <td>
      {{ message.timestamp }}
    </td>
    <td>
      {{ message.text }}
    </td>
    <td>
      {{ message.nickname }}
    </td>
  </tr>
</template>

<script>
export default {
  name: "RoomMessageItem",
  props: {
    message_id: String,
    message: Object,
  },
};
</script>

<style lang="scss" scoped></style>
