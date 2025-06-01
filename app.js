const clientId = 'YOUR_SPOTIFY_CLIENT_ID'; // Replace this!
const redirectUri = 'https://tetethv.github.io/forLOML/';
const trackUri = 'spotify:track:4ZtFanR9U6ndgddUvNcjcG'; // V - Inner Child

document.getElementById('start').addEventListener('click', () => {
  const scopes = 'streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state';
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token&show_dialog=true`;
  window.location.href = authUrl;
});

window.onload = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const token = params.get('access_token');

  if (token) {
    window.history.replaceState({}, document.title, "/");

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'V Fan Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.8
      });

      player.addListener('ready', ({ device_id }) => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [trackUri] }),
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      });

      player.connect();
    };
  }
};
