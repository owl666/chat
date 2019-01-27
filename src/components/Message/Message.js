import React from 'react';
import './Message.css';

const Message = ({ item }) => (
  <div className="message-container">
    <span className="message">{item.user}</span>
    <span className="message end">{item.text}</span>
  </div>
);

export default Message;
