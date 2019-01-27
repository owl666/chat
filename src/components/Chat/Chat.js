import React, { Component, Fragment } from 'react';
import Message from '../Message';
import Send from '../Send';
import User from '../Users';
import io from 'socket.io-client';
import './Chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.div = React.createRef();
    this.state = {
      currentUser: 'Anonimus',
      messages: [{ user: 'System', text: 'Welcome!' }],
      inputMsg: '',
      isLogin: false,
      users: {},
    };
    this.socket = null;
  }

  setListeners = () => {
    this.socket = io('https://beetchat.herokuapp.com/');
    this.socket.on('connect', () => {
      this.socket.emit('addUser', this.state.currentUser);
    });
    this.socket.on('message', data => {
      if (this.state.isLogin) this.addMessage(data);
    });
    this.socket.on('updateUsers', data => {
      if (this.state.isLogin) this.addUsers(data);
    });
  };

  changeMessage = event => {
    this.setState({
      inputMsg: event.target.value,
    });
  };

  validName = user => {
    return user !== '' && user !== 'Anonimus';
  };

  inputName = () => {
    const user = this.div.current.value;
    if (this.validName(user)) {
      this.setState({
        currentUser: user,
        isLogin: true,
      });
      this.setListeners();
    }
  };

  addMessage = data => {
    this.setState(({ messages }) => ({
      inputMsg: '',
      messages: [{ user: data.name, text: data.message }, ...messages],
    }));
  };

  addUsers = data => {
    this.setState({ users: data });
  };

  sendMessage = event => {
    event.preventDefault();
    const { currentUser, inputMsg } = this.state;
    if (inputMsg.trim().length) {
      this.socket.emit('message', { name: currentUser, message: inputMsg });
      this.setState({ inputMsg: '' });
    }
  };

  render() {
    const { messages, inputMsg, currentUser, isLogin, users } = this.state;
    if (!isLogin) {
      return (
        <div className="login">
          <span>Welcome</span>
          <input ref={this.div} defaultValue={currentUser} />
          <button onClick={this.inputName}>Ok</button>
        </div>
      );
    }
    return (
      <Fragment>
        <div className="chat">
          <div className="message-list">
            <div className="messages">
              {messages.map((item, key) => (
                <Message item={item} key={key} />
              ))}
            </div>
          </div>
          <Send
            value={inputMsg}
            placeholder="write something..."
            onChange={this.changeMessage}
            onSend={this.sendMessage}
          />
        </div>
        <User users={users} />
      </Fragment>
    );
  }
}

export default Chat;
