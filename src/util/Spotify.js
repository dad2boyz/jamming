let accessToken = '';
const Spotify = {};
const clientId = 'b1f2942bdaad47588b877fbc2ecdba51'
const redirectURI = 'http://jammming-bob.surge.sh';
let playlistID = '';

Spotify.getAccessToken = function() {
  if (accessToken) {
    return accessToken;
  } else if (window.location.href.includes('access_token')) {
    accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
    let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
    window.setTimeout( () => accessToken = '', expiresIn * 1000);
    window.history.pushState('Access Token', null, '/');
    return accessToken;
  } else {
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&show_dialog=true&scope=playlist-modify-public&redirect_uri=${redirectURI}`

  }
}

Spotify.search = function(term) {
  this.getAccessToken()
  return (
    fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {headers: {Authorization: `Bearer ${accessToken}`}})
    .then( response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Search failed!');
    }, networkError => console.log(networkError.message))
    .then( searchList => {
      if (!searchList.tracks.items.length) {
        return ([]);
      } else {
        let returnList = [];
        searchList.tracks.items.forEach( track => {
          let newTrack = {};
          newTrack.id = track.id;
          newTrack.name = track.name;
          newTrack.artist = track.artists[0].name;
          newTrack.album = track.album.name;
          newTrack.uri = track.uri;
          returnList.push(newTrack);
        });
        return (returnList);
      }
    })
  )
}

Spotify.savePlaylist = function(playlistName, tracks) {

  if(!playlistName || !tracks) {
    return;
  };
  const token = accessToken;
  const header = {Authorization: 'Bearer ' + token,
                  "Content-type": 'application/json'};
  let userId = '';

fetch('https://api.spotify.com/v1/me',{headers: header}
).then( response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Fetch User Info Failed!');
   }, networkError => console.log(networkError.message)
  ).then( userInfo => {
    userId = userInfo.id;
    return userId;
   }

 ).then( () => {
     let body = { description: 'Jammming Playlist',
                  name: playlistName
                };
     fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
        { method: 'POST',
          headers: header,
          body: JSON.stringify(body)
        }
      ).then( response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Create Playlist Failed!');
      }, networkError => console.log(networkError.message)
      ).then( newPlayId => {
        playlistID = newPlayId.id;
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
          {method: 'POST',
          headers: header,
          body: JSON.stringify({uris: tracks})}
          ).then( response => {
            if (response.ok) {
              return response.json()
            }
            throw new Error('Add Tracks Failed!');
          }, networkError => console.log(networkError.message)
        ).then( response => {
          playlistID = response;
          return;
        });
      });
  });
}


export default Spotify;
