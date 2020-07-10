<template>
  <i-layout v-if="true">
    <i-layout-content>
      <i-container>
        <i-row center-xs class="_vh-100">
          <i-column class="_margin-auto">
            <div v-if="is_authenticating">
              <i-loader size="sm" />
              <div>認証中</div>
            </div>
            <div v-else-if="is_authentication_failure">
              <p class="_font-weight-bolder">認証失敗</p>
              <p>
                認証処理に不具合が生じました。
                <br />ページをリロードするか再度ログインしてください。
              </p>
              <i-button v-on:click="relogin()">relogin</i-button>
            </div>
            <div v-else-if="!can_read_by_login_user">
              <p class="_font-weight-bolder">権限がありません</p>
              <p>
                本システムの操作に必要な権限が付与されておりません。
                <br />管理者に問い合わせるか、権限を有している別アカウントで再度ログインしてください。
              </p>
              <i-button v-on:click="relogin()">relogin</i-button>
            </div>
          </i-column>
        </i-row>
      </i-container>
    </i-layout-content>
  </i-layout>
</template>

<script>
import { auth } from "./../main.js";

export default {
  name: "AuthProcess",
  props: {
    is_authenticating: Boolean,
    is_authentication_failure: Boolean,
    can_read_by_login_user: Boolean
  },
  methods: {
    relogin: function() {
      auth.signOut().finally(() => {
        self.googleLogin();
      });
    }
  }
};
</script>

<style>
</style>