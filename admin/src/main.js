"use strict";

/**
 * Firebase initialyze
 */
import firebase_app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
};
firebase_app.initializeApp(firebaseConfig);

export const firebase = firebase_app;
export const auth = firebase.auth();
export const functions = firebase.functions();
export const db = firebase.database();

/**
 * Vue initialyze
 */
import Vue from "vue";
import VueRouter from "vue-router";
import { Inkline } from "@inkline/inkline/src";
import * as components from "@inkline/inkline/src/components";
import "@inkline/inkline/src/inkline.scss";
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Inkline, { components });

/**
 * Vue mount
 */
import App from "./App.vue";
import router from "./router/router.js";
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
