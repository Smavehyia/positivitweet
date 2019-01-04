import React, { Component } from 'react';
import io from 'socket.io-client';
import {
    BrowserRouter as Router,
    Route,
    Link,
  } from 'react-router-dom'
import './App.css';
import Home from './Home/home'

const API_URL = 'http://localhost:3000';
const socket = io(API_URL);

class App extends Component {
    constructor() {
        super()
        this.state = {
            user: {},
            disabled: '',
        }
        this.popup = null;
    }
  componentDidMount() {
    socket.on('user', user => {
        this.popup.close()
        this.setState({user})
    })
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  checkPopup = () => {
      const check = setInterval(() => {
          const { popup } = this;
          if (!popup || popup.closed || popup.closed === undefined ) {
              clearInterval(check)
              this.setState({ disabled: ''})
          }
      }, 1000)
  }
  openPopup = () => {
    const width = 600, height = 600
    const left = (window.innerWidth / 2) - (width / 2)
    const top = (window.innerHeight / 2) - (height / 2)
    
    const url = `${API_URL}/twitter?socketId=${socket.id}`

    return window.open(url, '',       
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
    )
  }
  startAuth = () => {
    if (!this.state.disabled) {  
      this.popup = this.openPopup()  
      this.checkPopup()
      this.setState({disabled: 'disabled'})
    }
  }
  closeCard = () => {
    this.setState({user: {}})
  }


  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };
render() {
    const { name, photo} = this.state.user
    const { disabled } = this.state

    const Home = () => (
        <div>
            <h1>Positivitweet</h1>
            <p>Find out the level of positivity demonstrated through your tweets by a click of a button. Begin the button whenever you're ready</p>
            <button onClick={this.startAuth}>Let's go!</button>
        </div>
    )
    return (
     <Router>
      <div className="App">
      <h1>{name}</h1>
      {this.state.disabled? <button onClick={this.closeCard}>Close</button> : null}
      <Route path="/" exact component={Home}/>
      </div>
      </Router> 
    );
  }
}
export default App;