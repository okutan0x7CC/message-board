<template>
  <div id="app">
    <i-layout v-if="is_authenticating" class="_vh-100">
      <div class="_margin-auto _text-center" style="height: 70px; width: 70px">
        <i-loader size="auto" variant="dark" />
        認証中...
      </div>
    </i-layout>
    <i-layout v-else-if="is_authentication_failure" class="_vh-100">
      <div
        class="_margin-auto _text-center"
        style="height: 100px; width: 100px"
      >
        認証失敗
      </div>
    </i-layout>
    <i-layout v-else-if="!login_user.can_read" class="_vh-100">
      <div
        class="_margin-auto _text-center"
        style="height: 100px; width: 100px"
      >
        権限がありません
      </div>
    </i-layout>
    <i-layout v-else>
      <i-layout-header class="_padding-0">
        <the-navigation-bar :login_user="login_user" />
      </i-layout-header>
      <i-layout-content>
        <i-container>
          <i-row center-xs>
            <i-column>
              <router-view
                :can_write_by_logged_in_user="login_user.can_write"
              />
            </i-column>
          </i-row>
        </i-container>
      </i-layout-content>
    </i-layout>
  </div>
</template>

<script>
import { firebase, db, auth } from "./main.js";
import TheNavigationBar from "./components/TheNavigationBar.vue";

export default {
  name: "App",
  components: {
    TheNavigationBar,
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
    this.$inkline.config.variant = "dark";

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
