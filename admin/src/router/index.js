import Vue from "vue";
import VueRouter from "vue-router";
import Rooms from "./../views/Rooms.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Rooms",
        component: Rooms,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
