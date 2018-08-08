import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';
import Recharts from 'recharts';
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } = Recharts;

const searchCache = {}
const apiKey = '7cef852126179e201f216130ffa7f6ba'

class App extends Component {
  constructor() {
    super();
    this.state = {
      search: location.search.split('=')[1],
      input: null,
      response: null,
      history: [history.state],
    };
  }

  componentDidMount = () => {
    this.handleSearch()
  }
  handleSearch = () => {
    if (searchCache[this.state.search]) {
      console.log('use cache')
      this.handleResponse(searchCache[this.state.search])
    } else {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', `https://api.openweathermap.org/data/2.5/forecast?q=${this.state.search}&APPID=${apiKey}&mode=JSON`, true)
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          this.handleResponse(xhr.response)
        }
      }
      xhr.send();
    }
  }
  handleResponse = response => {
    searchCache[`${this.state.search}`] = response
    this.setState({ response: JSON.parse(response) })
  }
  handleInput = e => {
    this.setState({ input: e.target.value })
  }
  handleClick = e => {
    history.pushState({ ...this.state, search: `?forecast?q=${this.state.input}` }, '', `?forecast?q=${this.state.input}`)
    this.setState({ search: this.state.input, history: [...this.state.history, history.state] })
    this.handleSearch()
  }
  convertToF = temp => 9 * (temp - 273.15) / 5 + 32

  render() {
    return (
      <div>
        <input onChange={this.handleInput}></input>
        <button onClick={this.handleClick}>Search</button>
        
        
        <LineChart width={600} height={300} data={this.state.response && this.state.response.list.map(obj => {
          return { dt_txt: obj.dt_txt, temp_max: this.convertToF(obj.main.temp_max), temp_min: this.convertToF(obj.main.temp_min) }
        })}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="dt_txt" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp_max" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="temp_min" stroke="#82ca9d" />
        </LineChart>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
