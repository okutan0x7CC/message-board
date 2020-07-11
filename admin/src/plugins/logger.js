export default {
  install(Vue) {
    const is_production = process.env.NODE_ENV === "production";
    function log(type, title, text) {
      if (!is_production) {
        console.log(`[${type}]: ${title}\n${text}`);
      }
    }
    Vue.prototype.$log = {
      error(title, text) {
        log("ERROR", title, text);
      },
      warning(title, text) {
        log("WARNING", title, text);
      },
      info(title, text) {
        log("INFO", title, text);
      },
      debug(title, text) {
        log("DEBUG", title, text);
      },
    };
  },
};
