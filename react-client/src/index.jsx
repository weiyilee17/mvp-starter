import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx';
import Search from './components/Search.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      games: []
    }

    this.search = this.search.bind(this);
  }

  // componentDidMount() {
    
  // }

  // the reason for this search is because it wants to setState to re render
  search(user) {

    // console.log(user);

    $.ajax({
      method: 'GET',
      url: '/games',
      data: {username: user},
      dataType: 'json',
      success: (data) => {
        console.log(data);
        this.setState({
          games: data
        })
      },
      error: (err) => {
        console.log('err in App search', err);
      }
    });

  }

  render() {
    return (
      <div>
        <h1>Game List</h1>
        <Search onSearch={this.search}/>
        <List games={this.state.games}/> 
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));