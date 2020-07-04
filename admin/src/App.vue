<template>
  <i-layout id="app">
    <i-layout-header>
      <the-navigation-bar :login_user="login_user" />
    </i-layout-header>
    <i-layout-content>
      <i-container>
        <i-row center-xs>
          <i-column xs="12">
            <div v-if="is_authenticating">認証中...</div>
            <div v-else-if="is_authentication_failure">認証失敗</div>
            <div v-else-if="!login_user.can_read">権限がありません</div>
            <div v-else>
              <router-view :navigation_link_titles.sync="navigation_link_titles" />
            </div>
          </i-column>
        </i-row>
      </i-container>
    </i-layout-content>
  </i-layout>
</template>

<script>
import { firebase, db, auth } from "./main.js";
import TheNavigationBar from "./components/TheNavigationBar.vue";

export default {
  name: "App",
  components: {
    TheNavigationBar
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
      },
      navigation_link_titles: {}
    };
  },
  created: function() {
    this.$inkline.config.variant = "dark";

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
