<template>
  <tr>
    <td>
      {{ message.timestamp | formatDatetime }}
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
import moment from "moment-timezone";

export default {
  name: "RoomMessageItem",
  props: {
    message_id: String,
    message: Object,
  },
  filters: {
    formatDatetime: function(timestamp) {
      return moment(timestamp)
        .tz("Asia/Tokyo")
        .format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="scss" scoped></style>
