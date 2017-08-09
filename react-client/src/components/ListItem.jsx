import React from 'react';
// import './ListItem.css';

const ListItem = (props) => (
  <div className="game-container">
    <div><em>{ props.game.name }</em></div>
    <img src = { props.game.imageUrl } ></img>
    <div> Total Hours played: { props.game.totalPlayedHours }</div>
    <br/>
  </div>
)

export default ListItem;