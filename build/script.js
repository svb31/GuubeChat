"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class EndpointInput extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "myChangeHandler", event => {
      let nam = event.target.name;
      let val = event.target.value;
      this.setState({
        [nam]: val
      });
    });

    _defineProperty(this, "mySubmitHandler", event => {
      event.preventDefault();
      let endpoint = this.state.endpoint;

      if (!endpoint) {
        alert("Please enter something");
      } else {
        this.props.onSubmit(this.state.endpoint);
      }
    });

    this.state = {
      endpoint: ''
    };
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "EndpointInput"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "EndpointHeader"
    }, "Welk endpoint wil je gebruiken?"), /*#__PURE__*/React.createElement("div", {
      className: "EndpointHeader"
    }, /*#__PURE__*/React.createElement("form", {
      onSubmit: this.mySubmitHandler
    }, /*#__PURE__*/React.createElement("input", {
      className: "TextInput",
      type: "text",
      name: "endpoint",
      onChange: this.myChangeHandler
    }), /*#__PURE__*/React.createElement("input", {
      className: "inputbutton",
      type: "submit"
    }))));
  }

}

function Message(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "message"
  }, /*#__PURE__*/React.createElement("h3", null, props.name), /*#__PURE__*/React.createElement("p", null, props.message));
}

class MessageScreen extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "myChangeHandler", event => {
      let nam = event.target.name;
      let val = event.target.value;
      this.setState({
        [nam]: val
      });
    });

    _defineProperty(this, "mySubmitHandler", event => {
      event.preventDefault();
      let inputname = this.state.inputname;
      let inputmessage = this.state.inputmessage;
      let newmessage = {
        id: this.state.messages.length,
        message: inputmessage,
        name: inputname
      };

      if (!inputname) {
        alert("Please enter a name");
      } else if (!inputmessage) {
        alert("Please enter a message");
      } else {
        this.AddMessage(newmessage);
        this.sendMessage(newmessage);
        this.setState({
          inputmessage: ''
        });
      }
    });

    this.state = {
      endpoint: this.props.endpoint,
      inputmessage: '',
      inputname: '',
      messages: []
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.getMessages(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request

    xmlHttp.send(null);
    return xmlHttp.responseText;
  }

  getMessages() {
    const endpoint = this.state.endpoint + '/chatbox/chat/getmsg';
    console.log('Start getting new messages from ' + endpoint); //todo logic to retrieve messages

    var messages = this.httpGet(endpoint); //todo map retrieved messages to store.

    console.log('Finished getting new messages from ' + endpoint);
    console.log(messages);
  }

  sendMessage(message) {
    const endpoint = this.state.endpoint;
    console.log('Send new message to ' + endpoint); //todo logic to send message
  }

  AddMessage(newmessage) {
    const messages = this.state.messages.slice();
    this.setState({
      messages: messages.concat([newmessage])
    });
  }

  render() {
    const messagesrendered = this.state.messages.map(message => {
      return /*#__PURE__*/React.createElement(Message, {
        key: message.id,
        message: message.message,
        name: message.name
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "ChatBot"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ChatBotTopbar"
    }, /*#__PURE__*/React.createElement("p", null, "Endpoint: ", this.state.endpoint), /*#__PURE__*/React.createElement("button", {
      onClick: this.props.resetEndpoint
    }, "Reset")), /*#__PURE__*/React.createElement("div", {
      className: "ChatBotBody"
    }, messagesrendered), /*#__PURE__*/React.createElement("div", {
      className: "ChatBotInput"
    }, /*#__PURE__*/React.createElement("form", {
      className: "ChatBotInputForm",
      onSubmit: this.mySubmitHandler
    }, /*#__PURE__*/React.createElement("input", {
      className: "nameInput",
      type: "text",
      name: "inputname",
      placeholder: "naam",
      value: this.state.inputname,
      onChange: this.myChangeHandler
    }), /*#__PURE__*/React.createElement("input", {
      className: "messageInput",
      type: "text",
      name: "inputmessage",
      placeholder: "typ iets",
      value: this.state.inputmessage,
      onChange: this.myChangeHandler
    }), /*#__PURE__*/React.createElement("input", {
      className: "inputbutton",
      type: "submit"
    }))));
  }

}

class ChatBot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: this.props.endpoint
    };
  }

  handleNewEndpoint(inputendpoint) {
    this.setState({
      endpoint: inputendpoint
    });
  }

  EmptyEndpoint() {
    this.setState({
      endpoint: ''
    });
  }

  render() {
    if (!this.state.endpoint) {
      return /*#__PURE__*/React.createElement(EndpointInput, {
        onSubmit: this.handleNewEndpoint.bind(this)
      });
    } else {
      return /*#__PURE__*/React.createElement(MessageScreen, {
        endpoint: this.state.endpoint,
        resetEndpoint: this.EmptyEndpoint.bind(this)
      });
    }
  }

} // ========================================


ReactDOM.render( /*#__PURE__*/React.createElement(ChatBot, {
  endpoint: "https://sandbox.guube.nl"
}), document.getElementById('root'));