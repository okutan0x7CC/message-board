import Vue from "vue";
import VueRouter from "vue-router";
import RoomList from "./components/RoomList.vue";
import RoomCreate from "./components/RoomCreate.vue";
import Room from "./components/Room.vue";
import RoomDetail from "./components/RoomDetail.vue";
import RoomUserMessageList from "./components/RoomUserMessageList.vue";
import RoomMessageCreate from "./components/RoomMessageCreate.vue";
import AdminAccountList from "./components/AdminAccountList.vue";
import NotFound from "./errors/NotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: RoomList,
    alias: "/rooms",
    props: true,
  },
  {
    path: "/rooms",
    name: "RoomList",
    component: RoomList,
    props: true,
  },
  {
    path: "/rooms/create",
    name: "RoomCreate",
    component: RoomCreate,
  },
  {
    path: "/rooms/:room_id",
    component: Room,
    children: [
      {
        path: "",
        name: "RoomDetail",
        component: RoomDetail,
        props: true,
      },
      {
        path: "create-message",
        name: "RoomMessageCreate",
        component: RoomMessageCreate,
        props: true,
      },
    ],
  },
  {
    path: "/rooms/:room_id/users/:user_id",
    name: "RoomUserMessageList",
    component: RoomUserMessageList,
  },
  {
    path: "/admin_accounts",
    name: "AdminAccountList",
    component: AdminAccountList,
    props: true,
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
