import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: 'New Playlist'
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  }

  addTrack(track) {
    if (!(this.state.playlistTracks.some( playlistTrack => { return playlistTrack.id === track.id}))) {
      let newPlaylist = this.state.playlistTracks;
      let newTrack = track;
      newPlaylist.push(newTrack);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  removeTrack(track) {
    let newPlaylist = [];
    this.state.playlistTracks.forEach( playlistTrack => {
      if (playlistTrack.id !== track.id) {
        newPlaylist.push(playlistTrack);
      };
    });
    this.setState({playlistTracks: newPlaylist});

  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    console.log('Called savePlaylist');
    let trackURIs = [];
    this.state.playlistTracks.forEach( track => {
      trackURIs.push(track.uri);
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({playlistName: 'New Playlist',
                   playlistTracks: []});
  }

  search(term) {
    Spotify.search(term)
      .then( newSearchList =>{
        this.setState({searchResults: newSearchList});
      });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults results={this.state.searchResults} onAdd={this.addTrack}/>
            <PlayList playlistName={this.state.playlistName} results={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
