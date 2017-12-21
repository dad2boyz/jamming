import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.renderAction = this.renderAction.bind(this);
  }

  handleClick() {
    this.props.isRemoval ? this.removeTrack() : this.addTrack();
  }
  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  updatePlaylistName(name) {

  }
  renderAction(){
    if (this.props.isRemoval) {
      return '-';
    } else {
      return '+';
    }
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        <a className="Track-action" onClick={this.handleClick} >{this.renderAction()}</a>
     </div>
    )
  }
};

export default Track;
