<template>
  <div id="app">
    <i-layout v-if="shouldDisplayAuthProcess">
      <auth-process />
    </i-layout>
    <i-layout v-else>
      <i-layout-header class="_padding-0">
        <the-navigation-bar :login_user="shared_state.login_user" />
      </i-layout-header>
      <i-layout-content>
        <i-container>
          <i-row center-xs>
            <i-column>
              <router-view />
            </i-column>
          </i-row>
        </i-container>
      </i-layout-content>
    </i-layout>
  </div>
</template>

<script>
import { firebase, auth } from "./main.js";
import { store } from "./store/store.js";
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
      shared_state: store.state
    };
  },
  computed: {
    shouldDisplayAuthProcess() {
      return (
        this.shared_state.authentication_status.in_process ||
        this.shared_state.authentication_status.failure ||
        !this.shared_state.login_user.can_read
      );
    }
  },
  created: function() {
    const self = this;
    auth.onAuthStateChanged(user => {
      const is_logged_in = user !== null;
      if (!is_logged_in) {
        self.googleLogin();
        return;
      }
      store.setLoginUser(user.email, user.photoURL);
    });
  },
  methods: {
    googleLogin: function() {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("email");
      auth.signInWithRedirect(provider).catch(error => {
        console.log(error);
      });
    },
    reLogin: function() {
      auth.signOut().finally(() => {
        self.googleLogin();
      });
    }
  }
};
</script>
