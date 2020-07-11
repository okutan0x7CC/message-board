export default {
  install(Vue) {
    const is_production = process.env.NODE_ENV === "production";
    function log(type, title, text, background, color = "white") {
      if (!is_production) {
        console.log(
          `%c ${type} ` + `%c${title}\n${text}`,
          `background: ${background}; color: ${color};`
        );
      }
    }
    Vue.prototype.$log = {
      error(title, text) {
        log("ERROR", title, text, "red");
      },
      warning(title, text) {
        log("WARNING", title, text, "yellow", "black");
      },
      succeed(title, text) {
        log("SUCCEED", title, text, "green");
      },
      info(title, text) {
        log("INFO", title, text, "cyan", "black");
      },
      debug(title, text) {
        log("DEBUG", title, text, "blue");
      },
    };
  },
};
