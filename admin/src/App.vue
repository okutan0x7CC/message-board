<template>
  <div id="app">
    <div v-if="is_authenticating">認証中...</div>
    <div v-else-if="is_authentication_failure">認証失敗</div>
    <div v-else-if="!login_user.can_read">権限がありません</div>
    <div v-else>
      <the-topbar :login_user="login_user" />
      <router-view />
    </div>
  </div>
</template>

<script>
import { firebase, db, auth } from "./main.js";
import TheTopbar from "./components/TheTopbar.vue";

export default {
  name: "App",
  components: {
    TheTopbar
  },
  data: function() {
    return {
      is_authenticating: true,
      is_authentication_failure: true,
      login_user: {
        photo_url: null,
        email: null,
        can_read: false,
        can_write: false
      }
    };
  },
  created: function() {
    const self = this;
    auth.onAuthStateChanged(user => {
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
      auth.signInWithRedirect(provider).catch(error => {
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
        .then(snapshot => {
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
        .then(snapshot => {
          self.login_user.can_write = snapshot.val();
        });
    }
  }
};
</script>
