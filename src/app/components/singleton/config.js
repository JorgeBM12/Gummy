// src/app/components/singleton/config.js
class Config {
  constructor() {
    if (Config.instance) return Config.instance;
    this.modo = "desarrollo";
    Config.instance = this;
  }

  setModo(modo) {
    this.modo = modo;
  }

  getModo() {
    return this.modo;
  }
}

module.exports = new Config();