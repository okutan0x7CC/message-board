import Vue from "vue";
import VueRouter from "vue-router";
import RoomList from "./../components/RoomList.vue";
import RoomCreate from "./../components/RoomCreate.vue";
import NotFound from "./../errors/NotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "RoomList",
    component: RoomList,
  },
  {
    path: "/rooms/create",
    name: "RoomCreate",
    component: RoomCreate,
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
