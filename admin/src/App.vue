<template>
  <div id="app">
    <i-layout v-if="shouldDisplayAuth">
      <auth-process
        :is_authenticating="is_authenticating"
        :is_authentication_failure="is_authentication_failure"
        :can_read_by_login_user="login_user.can_read"
      />
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
                :can_read_by_logged_in_user="login_user.can_read"
                :can_write_by_logged_in_user="login_user.can_write"
                :can_manage_account_by_login_user="
                  login_user.can_manage_account
                "
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
import AuthProcess from "./components/AuthProcess.vue";

export default {
  name: "App",
  components: {
    TheNavigationBar,
    AuthProcess
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
        can_manage_account: false
      }
    };
  },
  computed: {
    shouldDisplayAuth() {
      return (
        this.is_authenticating ||
        this.is_authentication_failure ||
        !this.login_user.can_read
      );
    }
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
      self.login_user.email = user.email;
      self.login_user.photo_url = user.photoURL;
      self.verifyAuthorities(user.email);
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
    verifyAuthorities(email) {
      const self = this;
      db.ref(`admin_accounts/${email.replace(/\./g, "%2E")}`)
        .once("value")
        .then(snapshot => {
          self.is_authenticating = false;
          self.is_authentication_failure = false;
          const authorities = snapshot.val();
          self.login_user.can_read = authorities.can_read;
          self.login_user.can_write = authorities.can_write;
          self.login_user.can_manage_account = authorities.can_manage_account;
        })
        .catch(() => {
          self.is_authentication_failure = true;
          self.relogin();
        });
    },
    relogin: function() {
      auth.signOut().finally(() => {
        self.googleLogin();
      });
    }
  }
};
</script>
