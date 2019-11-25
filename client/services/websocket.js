class Websocket {
  constructor(config, publisher, callback) {
    this.config = config;
    this.publisher = publisher;
    this.callback = callback;
    this.ws = null;
    this.wsTimer = null;
  }

  open() {
    let pubConfig = this.config.publisher || {};

    let protocol =
      pubConfig.wsProtocol && pubConfig.wsProtocol.length > 0
        ? `${pubConfig.wsProtocol}`
        : "wss";
    let domain = pubConfig.wsDomain;
    let port = pubConfig.wsPort ? `:${pubConfig.wsPort}` : "";
    let path = pubConfig.wsPath ? pubConfig.wsPath : "";

    this.ws = new WebSocket(
      `${protocol}://${domain}${port}${path}?token=` + this.publisher.getToken()
    );
    this.bindEvents();
  }

  bindEvents() {
    this.ws.onclose = () => {
      clearInterval(this.wsTimer);
      this.wsTimer = setInterval(
        () => {
          if (this.ws) {
            this.open();
          }
        },
        5000,
        0,
        false
      ); // passed invokeApply = false to prevent triggering digest cycle
    };

    this.ws.onopen = event => {
      clearInterval(this.wsTimer);
    };

    this.ws.onmessage = event => {
      const data = JSON.parse(event.data);
      // hello came
      if (data[0] === 0) {
        // topic subscription
        this.ws.send('[5, "package_created"]');
      }
      // package came
      if (data[0] === 8 && data[2].package) {
        this.callback(data[2].package, data[2].state);
      }
    };
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default Websocket;
