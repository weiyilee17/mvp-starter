import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div>
     These are the  { props.games.length } most played games. 
    <br/>
    <br/>
    { props.games.map(game => <ListItem game={game} key={game._id}/>)}
  </div>
)

export default List;