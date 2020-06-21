<template>
  <div id="topbar">
    topbar
    {{ login_user }}
    <img :src="login_user.photo_url" />
  </div>
</template>

<script>
export default {
  name: "TheTopbar",
  props: {
    login_user: Object,
  },
};
</script>

<style lang="scss" scoped>
#topbar {
  background-color: gray;
}
img {
  height: 40px;
}
</style>
