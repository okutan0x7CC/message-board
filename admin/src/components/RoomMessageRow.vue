<template>
  <div v-if="column.path == 'timestamp'">{{ row[column.path] | formatTimestamp }}</div>
</template>

<script>
import moment from "moment-timezone";

export default {
  name: "RoomMessageRow",
  props: ["row", "column", "index"],
  filters: {
    formatTimestamp(timestamp) {
      return moment(timestamp)
        .tz("Asia/Tokyo")
        .format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>
