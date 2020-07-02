<template>
  <div>
    <ul>
      <li v-for="(link, index) in links" :key="link.path">
        <div v-if="index < links.length - 1">
          <router-link :to="{ path: link.path }">{{ link.title }}</router-link>
        </div>
        <div v-else>{{ link.title }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "TheNavigationbar",
  props: {
    link_titles: {
      room_title: null,
      nickname: null,
    },
  },
  computed: {
    links: function() {
      let links = [];
      let directories = this.$route.path.split("/");
      directories.splice(0, 1); // delete first empty string
      for (const [i, directory] of directories.entries()) {
        links.push({
          path: i === 0 ? `/${directory}` : `${links[i - 1].path}/${directory}`,
          title: this.linkTitle(i, directories),
        });
      }
      return links;
    },
  },
  methods: {
    linkTitle: function(index, directories) {
      if (index === 0) {
        return "rooms";
      }
      switch (directories[index - 1]) {
        case "rooms":
          return this.link_titles.room_title;
        case "users":
          return this.link_titles.nickname;
        default:
          return directories[index];
      }
    },
  },
};
</script>

<style></style>
