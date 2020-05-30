import Vue from "vue";
import VueRouter from "vue-router";
import RoomList from "./../components/RoomList.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "RoomList",
        component: RoomList,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
