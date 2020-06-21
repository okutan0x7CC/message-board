<template>
  <div id="app">
    <div v-if="is_authenticating">
      認証中...
    </div>
    <div v-else-if="is_authentication_failure">
      認証失敗
    </div>
    <div v-else-if="!login_user.can_read">
      権限がありません
    </div>
    <div v-else>
      <the-topbar :login_user="login_user" />
      <router-view />
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
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
firebase.initializeApp(firebaseConfig);

export const db = firebase.database();
export const auth = firebase.auth();

import TheTopbar from "./components/TheTopbar.vue";

export default {
  name: "App",
  components: {
    TheTopbar,
  },
  data: function() {
    return {
      is_authenticating: true,
      is_authentication_failure: true,
      login_user: {
        photo_url: null,
        email: null,
        can_read: false,
        can_write: false,
      },
    };
  },
  created: function() {
    const self = this;
    auth.onAuthStateChanged((user) => {
      const is_logged_in = user !== null;
      if (!is_logged_in) {
        self.googleLogin();
        return;
      }
      self.verifyReadPermission(user);
      self.verifyWritePermission(user);
    });
  },
  methods: {
    googleLogin: function() {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("email");
      let self = this;
      auth.signInWithRedirect(provider).catch((error) => {
        self.is_authentication_failure = true;
        console.log(error);
      });
    },
    verifyReadPermission: function(firebase_user) {
      const self = this;
      db.ref(
        `admin_user_emails/${firebase_user.email.replace(".", "%2E")}/can_read`
      )
        .once("value")
        .then((snapshot) => {
          self.is_authenticating = false;
          self.is_authentication_failure = false;
          self.login_user.email = firebase_user.email;
          self.login_user.photo_url = firebase_user.photoURL;
          self.login_user.can_read = snapshot.val();
        })
        .catch(() => {
          self.is_authentication_failure = true;
          auth.signOut().finally(() => {
            self.googleLogin();
          });
        });
    },
    verifyWritePermission: function(firebase_user) {
      const self = this;
      db.ref(
        `admin_user_emails/${firebase_user.email.replace(".", "%2E")}/can_write`
      )
        .once("value")
        .then((snapshot) => {
          self.login_user.can_write = snapshot.val();
        });
    },
  },
};
</script>
