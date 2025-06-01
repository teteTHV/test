const clientId = '1d07a5a57ba24054a391b57efed55ca5'; // Replace this!
const redirectUri = 'https://tetethv.github.io/test/';
const trackUri = 'https://open.spotify.com/track/7G7mSV4BebkoHWwKTDvXu9?si=14c8518c8b8f414e // V - Winter Ahead

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
