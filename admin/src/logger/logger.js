"use strict";

export const logger = {
  is_production: process.env.NODE_ENV === "production",
  log(type, title, anything = "", background = "black", color = "white") {
    if (!this.is_production) {
      console.log(
        `%c ${type} ` + `%c${title}\n${anything}`,
        `background: ${background}; color: ${color};`
      );
    }
  },
  error(title, anything) {
    this.log("ERROR", title, anything, "red");
  },
  warning(title, anything) {
    this.log("WARNING", title, anything, "yellow", "black");
  },
  succeed(title, anything) {
    this.log("SUCCEED", title, anything, "green");
  },
  info(title, anything) {
    this.log("INFO", title, anything, "cyan", "black");
  },
  debug(title, anything) {
    this.log("DEBUG", title, anything, "blue");
  },
};
