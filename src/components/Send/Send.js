import React from 'react';
import './Send.css';

const Send = ({ value, onChange, onSend }) => (
  <form onSubmit={onSend} className="send-block">
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="input-message"
    />
    <button type="submit" className="send">
      Send
    </button>
  </form>
);

export default Send;
