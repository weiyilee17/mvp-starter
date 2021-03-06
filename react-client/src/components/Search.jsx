import React from 'react';
import ReactDOM from 'react-dom';

class Search extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         text: ''
      }

      this.search = this.search.bind(this);
      this.textChange = this.textChange.bind(this);
   }

   // when we type, the value changes, so we set state and re render
   textChange(e) {
      this.setState({
         text : e.target.value
      });
   }

   // this search is to correctly bind this?
   search() {
      var currentTextboxText = this.state.text;

      // debugger;
      // why it doesn't clean the text box?
      this.setState({
         text: ''
      });

      this.props.onSearch(currentTextboxText);

   }

   render() {
      return (
         <div>
            <input value={this.state.text} onChange={this.textChange}/>
            <button onClick={this.search}>Search for his/her games!</button>
         </div>
      );
   }

}


export default Search;