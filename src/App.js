import React, { Component } from 'react';
import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

class App extends Component {
  state = {
    uri: 'mongodb+srv://<user>:<pass>@cluster0.vlgea.mongodb.net/<dbname>',
    script: '',
    output: '',
  };

  constructor() {
    super();
    this.handleURIChange = this.handleURIChange.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleURIChange(event) {
    const { value: uri } = event.target;
    this.setState(prev => ({ ...prev, uri }));
  }

  handleEditorChange(script) {
    this.setState(prev => ({ ...prev, script }));
  }

  async handleSubmit(event) {
    event.preventDefault();

    const response = await fetch('/api/v1/execute', {
      method: 'POST',
      body: JSON.stringify({
        uri: this.state.uri,
        script: this.state.script,
      }),
    });
    const data = await response.json();
    console.log(data)
    const output = data.message || JSON.stringify(data);
    this.setState(prev => ({
      ...prev, output, fail: (data.statusCode && data.statusCode >= 300)
    }));
  }

  render() {
    return (
      <div className="app" >
        <form onSubmit={this.handleSubmit} >
          <input className="form-control"
            type="text"
            name="uri"
            value={this.state.uri}
            onChange={this.handleURIChange}
          />
          <AceEditor
            mode="javascript"
            theme="terminal"
            name="script"
            style={{width: "100%", height: "50vh"}}
            value={this.state.script}
            onChange={this.handleEditorChange}
          />
          <button className="btn btn-success">Execute</button>
        </form>
        <p className={"output" + (this.state.fail ? " failed":"")}>{this.state.output}</p>
      </div>
    );
  }
}

export default App;
