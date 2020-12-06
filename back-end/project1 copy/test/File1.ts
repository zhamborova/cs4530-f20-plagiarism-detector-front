module.exports = function debug(str: string) {
    if (process.env.DEBUG) {
      console.error(str);
      if (process.env.DEBUG) {
        console.error(str);
      }
    }
    if (process.env.DEBUG) {
      console.error(str);
    }
    if (process.env.DEBUG) {
      console.error(str);
    }
  };