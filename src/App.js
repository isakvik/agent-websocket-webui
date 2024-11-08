import React, { useState } from "react";
import "./App.css";
import WsSettings from "./WsSettings";
import WebSocketWrapper from "./WebSocketWrapper";
import Messages from "./Messages";
import MessagesList from "./MessagesList";
import { DefaultButton } from "pivotal-ui/react/buttons";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onUrlChange = this.onUrlChange.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.onSocketDisconnect = this.onSocketDisconnect.bind(this);
    this.onMessage = this.onMessage.bind(this);
    var ws = new WebSocketWrapper();
    ws.onDisconnect = this.onSocketDisconnect;
    ws.onMessage = this.onMessage;
    this.state = { settingsVisible: false, ws: ws, messages: new Messages() };
  }
  onMessage(v) {
    console.log("Hey ", v);
    const messages = this.state.messages;
    this.setState({ messages: messages.push(v) });
  }

  onUrlChange(v) {
    const ws = this.state.ws;
    this.setState({ ws: ws.updateUrl(v) });
  }

  onSocketDisconnect() {
    const ws = this.state.ws;
    this.setState({ ws: ws.disconnect() });
  }

  onConnect() {
    const ws = this.state.ws;
    this.setState({ ws: ws.connect() });
  }

  onDisconnect() {
    console.log("Disconnected");
    const ws = this.state.ws;
    this.setState({ ws: ws.disconnect() });
  }

  componentDidMount() {
  	this.onConnect();
  }

  render() {
    const ws = this.state.ws;
    const messages = this.state.messages;
	
	const toggleVisibility = () => this.setState({settingsVisible: !this.state.settingsVisible});

    return (
      <div className="App">
        <div className="App-Container">
          <div className="App-header">
		  	<DefaultButton onClick={toggleVisibility} onDark>
				{this.state.settingsVisible ? 'Hide' : 'Show'} settings
			</DefaultButton>

			{this.state.settingsVisible && (
            <WsSettings
              ws={ws}
              onUrlChange={this.onUrlChange}
              onConnect={this.onConnect}
              onDisconnect={this.onDisconnect}
            />
			)}
          </div>
          <MessagesList data={messages} />
        </div>
      </div>
    );
  }
}

export default App;
