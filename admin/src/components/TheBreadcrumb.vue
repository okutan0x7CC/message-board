<template>
  <i-breadcrumb>
    <i-breadcrumb-item>Home</i-breadcrumb-item>
    <i-breadcrumb-item active>Breadcrumbs</i-breadcrumb-item>
  </i-breadcrumb>
</template>

<script>
export default {
  name: "TheBreadcrumb",
  props: {
    items: Array,
  },
};
</script>

<style scoped="scss"></style>
