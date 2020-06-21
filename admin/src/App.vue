<template>
  <div id="app">
    <div v-if="is_authenticating">
      認証中...
    </div>
    <div v-else-if="is_authentication_failure">
      認証失敗
    </div>
    <div v-else>
      <div id="nav">
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default {
  name: "App",
  data: function() {
    return {
      is_authenticating: true,
      is_authentication_failure: true,
    }
  },
  created: function() {
    let self = this;
    firebase.auth().onAuthStateChanged(function(user) {
        self.is_authenticating = false
      if (user) {
        self.is_authentication_failure = false
        console.log("login")
      } else {
        self.is_authentication_failure = true
        self.googleLogin()
      }
    });
  },
  methods: {
    googleLogin: function() {
      let provider = new firebase.auth.GoogleAuthProvider();
      let self = this;
      firebase.auth().signInWithRedirect(provider).then(function(result) {
        self.is_authentication_failure = false
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(token)
        console.log(user)
      }).catch(function(error) {
        self.is_authentication_failure = true
        console.log(error)
      });
    }
  }
}


</script>

