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
};
