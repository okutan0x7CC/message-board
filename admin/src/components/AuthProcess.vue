<template>
  <i-layout v-if="true">
    <i-layout-content>
      <i-container>
        <i-row center-xs class="_vh-100">
          <i-column class="_margin-auto">
            <div v-if="shared_state.authentication_status.in_process">
              <i-loader size="sm" />
              <div>認証中</div>
            </div>
            <div v-else-if="shared_state.authentication_status.failure">
              <p class="_font-weight-bolder">認証失敗</p>
              <p>
                認証処理に不具合が生じました。
                <br />ページをリロードするか再度ログインしてください。
              </p>
              <i-button v-on:click="reLogin()">reLogin</i-button>
            </div>
            <div v-else-if="!shared_state.login_user.can_read">
              <p class="_font-weight-bolder">権限がありません</p>
              <p>
                本システムの操作に必要な権限が付与されておりません。
                <br />管理者に問い合わせるか、権限を有している別アカウントで再度ログインしてください。
              </p>
              <i-button v-on:click="reLogin()">reLogin</i-button>
            </div>
          </i-column>
        </i-row>
      </i-container>
    </i-layout-content>
  </i-layout>
</template>

<script>
import { auth } from "./../main.js";
import { store } from "./../store/store.js";

export default {
  name: "AuthProcess",
  data() {
    return {
      shared_state: store.state
    };
  },
  methods: {
    reLogin() {
      auth.signOut().finally(() => {
        self.googleLogin();
      });
    }
  }
};
</script>

<style>
</style>