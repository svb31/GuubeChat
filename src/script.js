class EndpointInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: '',
    };
  }

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  }

  mySubmitHandler = (event) => {
    event.preventDefault();
    let endpoint = this.state.endpoint;
    if (!endpoint) {
      alert("Please enter something");
    } else {
      this.props.onSubmit(this.state.endpoint);
    }
  }

  render() {
    return (
      <div className="EndpointInput">
        <h1 className="EndpointHeader">Welk endpoint wil je gebruiken?</h1>
        <div className="EndpointHeader">
          <form onSubmit={this.mySubmitHandler}>
            <input
              className="TextInput"
              type='text'
              name='endpoint'
              onChange={this.myChangeHandler}
            />
            <input
              className="inputbutton"
              type='submit'
            />
          </form>
        </div>
      </div>
    );
  }
}

function Message(props){
    return (
      <div className="message">
        <h3>{props.name}</h3>
        <p>{props.message}</p>
      </div>
    );
}

class MessageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: this.props.endpoint,
      inputmessage: '',
      inputname: '',
      messages: [],
    };
  }
  
  componentDidMount() {
  this.timer = setInterval(()=> this.getMessages(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    this.timer = null;
  }
  httpGet(theUrl) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
      xmlHttp.send( null );
      return xmlHttp.responseText;
  }
  
  getMessages() {
    const endpoint = this.state.endpoint + '/chatbox/chat/getmsg';
    console.log('Start getting new messages from '+ endpoint);
    //todo logic to retrieve messages
    var messages = this.httpGet(endpoint);
    //todo map retrieved messages to store.
    console.log('Finished getting new messages from '+ endpoint);
    console.log(messages);
  }
  
  sendMessage(message){
    const endpoint = this.state.endpoint;
    console.log('Send new message to ' + endpoint );
    //todo logic to send message
  }
  
  AddMessage(newmessage) {
    const messages = this.state.messages.slice();
    this.setState({
      messages: messages.concat([newmessage]),
    });
  }

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  }

  mySubmitHandler = (event) => {
    event.preventDefault();
    let inputname = this.state.inputname;
    let inputmessage = this.state.inputmessage;
    let newmessage = {id:this.state.messages.length, message: inputmessage, name:inputname};
    if (!inputname) {
      alert("Please enter a name");
    } else if (!inputmessage) {
      alert("Please enter a message");
    } else {
      this.AddMessage(newmessage);
      this.sendMessage(newmessage);
      this.setState({ inputmessage: ''});

    }
  }

  render() {
    const messagesrendered = this.state.messages.map((message) => {
        return (
            <Message
              key={message.id}
              message={message.message}
              name={message.name}
            />
        );
    });
    return (
      <div className="ChatBot">
        <div className="ChatBotTopbar">
          <p>Endpoint: {this.state.endpoint}</p>
          <button onClick={this.props.resetEndpoint}>Reset</button>
        </div>
        <div className="ChatBotBody">
          {messagesrendered}
        </div>
        <div className="ChatBotInput">
          <form
            className="ChatBotInputForm"
            onSubmit={this.mySubmitHandler}
          >
            <input
              className="nameInput"
              type='text'
              name='inputname'
              placeholder='naam'
              value={this.state.inputname}
              onChange={this.myChangeHandler}
            />
            <input
              className="messageInput"
              type='text'
              name='inputmessage'
              placeholder='typ iets'
              value={this.state.inputmessage}
              onChange={this.myChangeHandler}
            />
            <input
              className="inputbutton"
              type='submit'
            />
          </form>
        </div>
      </div>
    );
  }
}

class ChatBot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: this.props.endpoint,
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
      return (
        <EndpointInput
          onSubmit={this.handleNewEndpoint.bind(this)}
        />
      );
    } else {
      return (
        <MessageScreen
          endpoint={this.state.endpoint}
          resetEndpoint={this.EmptyEndpoint.bind(this)}
        />
      );
    }
  }
}
// ========================================

ReactDOM.render(
  <ChatBot endpoint='https://sandbox.guube.nl' />,
  document.getElementById('root')
);
