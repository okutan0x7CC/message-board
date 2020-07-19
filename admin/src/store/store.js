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
    rooms: {},
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
   * ルーム一覧を取得する
   */
  fetchRooms() {
    const self = this;
    db.ref("rooms")
      .once("value")
      .then((snapshot) => {
        let rooms = [];
        let room_ids = [];
        snapshot.forEach((child) => {
          room_ids.unshift(child.key);
          rooms.unshift(child.val());
        });
        self.state.rooms = rooms;
        self.state.room_ids = room_ids;
        logger.succeed(self.fetchRooms.name);
      })
      .catch((reason) => {
        logger.error(self.fetchRooms.name, reason);
      });
  },

  /**
   * ルーム一覧の index 要素を DB から削除する
   * @param int index
   */
  deleteRoom(index) {
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

  /**
   * ルーム一覧の index 要素における 読み取り許可 を反転させる
   * @param int index
   */
  toggleRoomCanRead(index) {
    const next_status = !this.state.rooms[index].can_read;
    const self = this;
    db.ref(`rooms/${this.state.room_ids[index]}/can_read`)
      .set(next_status)
      .then(() => {
        self.state.rooms[index].can_read = next_status;
        logger.succeed(self.toggleRoomCanRead.name);
      })
      .catch((reason) => {
        logger.error(self.toggleRoomCanRead.name, reason);
      });
  },

  /**
   * ルーム一覧の index 要素における 書き込み許可 を反転させる
   * @param int index
   */
  toggleCanWrite: function(index) {
    const next_status = !this.state.rooms[index].can_write;
    const self = this;
    db.ref(`rooms/${this.state.room_ids[index]}/can_write`)
      .set(next_status)
      .then(() => {
        self.state.rooms[index].can_write = next_status;
        logger.succeed(self.toggleCanWrite.name);
      })
      .catch((reason) => {
        logger.error(self.toggleCanWrite.name, reason);
      });
  },
};
