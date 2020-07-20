<template>
  <div v-if="column.path == ''">{{ row[column.path] }}</div>
</template>

<script>
export default {
  name: "RoomMessageRow",
  props: ["row", "column", "index"]
};
</script>
