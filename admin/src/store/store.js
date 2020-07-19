"use strict";

import { db } from "./../main.js";
import { logger } from "./../logger/logger.js";

export const store = {
  state: {
    authentication_status: {
      in_process: true,
      failure: true,
    },
    login_user: {
      photo_url: null,
      email: null,
      can_read: false,
      can_write: false,
      can_manage_account: false,
    },
    rooms: [],
    room_ids: [],
  },

  /**
   * 権限を取得しログインユーザーとして設定する
   * @param string email
   * @param string photo_url
   */
  setLoginUser(email, photo_url) {
    const self = this;
    db.ref(`admin_accounts/${email.replace(/\./g, "%2E")}`)
      .once("value")
      .then((snapshot) => {
        const authorities = snapshot.val();
        self.state.login_user = {
          photo_url: photo_url,
          email: email,
          can_read: authorities.can_read,
          can_write: authorities.can_write,
          can_manage_account: authorities.can_manage_account,
        };
        self.state.authentication_status.in_process = false;
        self.state.authentication_status.failure = false;
        logger.succeed(self.setLoginUser.name);
      })
      .catch((reason) => {
        self.state.authentication_status.in_process = false;
        self.state.authentication_status.failure = true;
        logger.error(self.setLoginUser.name, reason);
      });
  },

  /**
   * 全てのルームを取得する
   */
  fetchRooms() {
    const self = this;
    db.ref("rooms")
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((child) => {
          self.state.room_ids.unshift(child.key);
          self.state.rooms.unshift(child.val());
          logger.succeed(self.fetchRooms.name);
        });
      })
      .catch((reason) => {
        logger.error(self.fetchRooms.name, reason);
      });
  },

  /**
   * state.rooms の index 要素を DB から削除する
   * @param int index
   */
  deleteRooms(index) {
    const promise_room = db.ref(`rooms/${this.state.room_ids[index]}`).remove();
    const promise_messages = db
      .ref(`messages/${this.state.room_ids[index]}`)
      .remove();
    const promise_hidden_messages = db
      .ref(`hidden_messages/${this.state.room_ids[index]}`)
      .remove();
    const promise_muted_users = db
      .ref(`muted_users/${this.state.room_ids[index]}`)
      .remove();

    const self = this;
    Promise.all([
      promise_room,
      promise_messages,
      promise_hidden_messages,
      promise_muted_users,
    ])
      .then(() => {
        self.state.room_ids.splice(index, 1);
        self.state.rooms.splice(index, 1);
        logger.succeed(self.deleteRooms.name);
      })
      .catch((reason) => {
        logger.error(self.deleteRooms.name, reason);
        return;
      });
  },
};
