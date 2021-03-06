"use strict";

import { logger } from "./../logger/logger.js";
import { database } from "firebase/app";
import { db } from "./../main.js";
import moment from "moment-timezone";

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
    rtdb: {
      rooms: {},
      room: {
        messages: {},
        hidden_messages: {},
        muted_users: {},
        reactions: {},
      },
    },
    components: {
      room_message_list: {
        rows: [],
      },
    },
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
        logger.succeed("store." + self.setLoginUser.name);
      })
      .catch((reason) => {
        self.state.authentication_status.in_process = false;
        self.state.authentication_status.failure = true;
        logger.error("store." + self.setLoginUser.name, reason);
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
        self.state.rtdb.rooms = Object.assign({}, snapshot.val());
        logger.succeed("store." + self.fetchRooms.name);
      })
      .catch((reason) => {
        logger.error("store." + self.fetchRooms.name, reason);
      });
  },

  /**
   * 特定のルームを取得する
   * @param string room_id
   */
  fetchRoom(room_id) {
    const self = this;
    db.ref(`rooms/${room_id}`)
      .once("value")
      .then((snapshot) => {
        let new_rooms = this.state.rtdb.rooms;
        new_rooms[room_id] = snapshot.val();
        self.state.rtdb.rooms = Object.assign({}, new_rooms);
        logger.succeed("store." + self.fetchRoom.name);
      })
      .catch((reason) => {
        logger.error("store." + self.fetchRoom.name, reason);
      });
  },

  /**
   * 特定ルームを削除する
   * @param int room_id
   */
  deleteRoom(room_id) {
    const promise_room = db.ref(`rooms/${room_id}`).remove();
    const promise_messages = db.ref(`messages/${room_id}`).remove();
    const promise_hidden_messages = db
      .ref(`hidden_messages/${room_id}`)
      .remove();
    const promise_muted_users = db.ref(`muted_users/${room_id}`).remove();

    const self = this;
    Promise.all([
      promise_room,
      promise_messages,
      promise_hidden_messages,
      promise_muted_users,
    ])
      .then(() => {
        let deleted_rooms = self.state.rooms;
        delete deleted_rooms[room_id];
        self.state.rooms = Object.assign({}, deleted_rooms);
        logger.succeed("store." + self.deleteRoom.name);
      })
      .catch((reason) => {
        logger.error("store." + self.deleteRoom.name, reason);
        return;
      });
  },

  /**
   * 特定ルームの 読み取り許可 を反転させる
   * @param int index
   */
  toggleRoomCanRead(room_id) {
    const next_status = !this.state.rooms[room_id].can_read;
    const self = this;
    db.ref(`rooms/${room_id}/can_read`)
      .set(next_status)
      .then(() => {
        self.state.rooms[room_id].can_read = next_status;
        logger.succeed("store." + self.toggleRoomCanRead.name);
      })
      .catch((reason) => {
        logger.error("store." + self.toggleRoomCanRead.name, reason);
      });
  },

  /**
   * 特定ルームの 書き込み許可 を反転させる
   * @param int index
   */
  toggleCanWrite(room_id) {
    const next_status = !this.state.rooms[room_id].can_write;
    const self = this;
    db.ref(`rooms/${room_id}/can_write`)
      .set(next_status)
      .then(() => {
        self.state.rooms[room_id].can_write = next_status;
        logger.succeed("store." + self.toggleCanWrite.name);
      })
      .catch((reason) => {
        logger.error("store." + self.toggleCanWrite.name, reason);
      });
  },

  /**
   * ルームを作成する
   * @param string public_title
   * @param string private_title
   * @param boolean can_read
   * @param boolean can_write
   */
  createRoom(public_title, private_title, can_read, can_write) {
    db.ref("rooms").push(
      {
        public_title: public_title,
        private_title: private_title,
        can_read: can_read,
        can_write: can_write,
      },
      (error) => {
        if (error === null) {
          logger.succeed("store." + this.createRoom.name);
        } else {
          logger.error("store." + this.createRoom.name, error);
        }
      }
    );
  },

  /**
   * 管理者のメッセージを作成する
   * @param string room_id
   * @param string user_id
   * @param string text
   * @param string nickname
   */
  createAdminMessage(room_id, user_id, text, nickname) {
    db.ref(`messages/${room_id}`).push(
      {
        user_id: user_id,
        text: text,
        timestamp: database.ServerValue.TIMESTAMP,
        nickname: nickname,
      },
      (error) => {
        if (error === null) {
          logger.succeed("store." + this.createAdminMessage.name);
        } else {
          logger.error("store." + this.createAdminMessage.name, error);
        }
      }
    );
  },

  /**
   * 特定ルームの状態を監視する
   * @param string room_id
   */
  listenRoom(room_id) {
    this.state.rtdb.room = {
      messages: {},
      hidden_messages: {},
      muted_users: {},
      reactions: {},
    };
    this.state.components.room_message_list.rows = [];
    const self = this;
    db.ref(`messages/${room_id}`).on("child_added", (snapshot) => {
      self.state.rtdb.room.messages[snapshot.key] = snapshot.val();
      self._appendRoomMessageListRow(snapshot.key, snapshot.val());
      logger.info("store.listeRoom", "child_added");
    });
    db.ref(`hidden_messages/${room_id}`).on("child_added", (snapshot) => {
      self.state.rtdb.room.hidden_messages[snapshot.key] = snapshot.val();
    });
    db.ref(`hidden_messages/${room_id}`).on("child_removed", (snapshot) => {
      delete self.state.rtdb.room.hidden_messages[snapshot.key];
    });
    db.ref(`muted_users/${room_id}`).on("child_added", (snapshot) => {
      self.state.rtdb.room.muted_users[snapshot.key] = snapshot.val();
    });
    db.ref(`muted_users/${room_id}`).on("child_removed", (snapshot) => {
      delete self.state.rtdb.room.muted_users[snapshot.key];
    });
    db.ref(`reactions/${room_id}`).on("child_added", (snapshot) => {
      self.state.rtdb.room.reactions[snapshot.key] = snapshot.val();
    });
    db.ref(`reactions/${room_id}`).on("child_removed", (snapshot) => {
      delete self.state.rtdb.room.reactions[snapshot.key];
    });
  },

  /**
   * 特定ルームの状態監視を解除する
   * @param stirng room_id
   */
  detachRoom(room_id) {
    db.ref(`messages/${room_id}`).off();
    db.ref(`hidden_messages/${room_id}`).off();
    db.ref(`muted_users/${room_id}`).off();
    db.ref(`reactions/${room_id}`).off;
    logger.info("store.detachRoom");
  },

  _appendRoomMessageListRow(message_id, message) {
    this.state.components.room_message_list.rows.unshift({
      id: message_id,
      timestamp: this._formatTimestamp(message.timestamp),
      text: message.text,
      nickname: message.nickname,
      user_id: message.user_id,
      reactions: 0,
      is_hidden: false,
      is_user_muted: false,
    });
  },

  _formatTimestamp(timestamp) {
    return moment(timestamp)
      .tz("Asia/Tokyo")
      .format("YYYY-MM-DD HH:mm:ss");
  },
};
