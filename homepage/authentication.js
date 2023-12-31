async function authforhomepage() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  if(code == null) {
  const clientID = "e9fec6e1cb5241e0a41ab98db146bc3c";
  const redirectURI = "https://ottenthetruth.github.io/truthmusic/homepage/homepage.html";
  const callbackURL = "https://ottenthetruth.github.io/truthmusic/homepage/homepage.html";
  const spotifyAuthURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectURI}&scope=user-library-read%20user-modify-playback-state%20user-top-read%20user-read-playback-state%20user-read-currently-playing&state=${callbackURL}`;
  window.location.href = spotifyAuthURL;
  }
}

async function getAccessToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
        if (code) {
            const tokenEndpoint = "https://accounts.spotify.com/api/token";
            const client_secret = "2d5a82decbc240e4adadcbd86f342321";
            const redirect_uri = "https://ottenthetruth.github.io/truthmusic/homepage/homepage.html";
            const basicAuthHeader = btoa(`e9fec6e1cb5241e0a41ab98db146bc3c:${client_secret}`);
            const data = {
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirect_uri,
            };
            const response = await fetch(tokenEndpoint, {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${basicAuthHeader}`,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body: new URLSearchParams(data),
            });
            if (response.status === 200) {
                const tokenData = await response.json();
                const accessToken = tokenData.access_token;
                const refreshToken = tokenData.refresh_token;
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", refreshToken);
                console.log("Successfully obtained access token!");
                return accessToken;
            }
        }/* end if(code) */
} /* end getAccessToken */

async function getRefreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
    const client_secret = "2d5a82decbc240e4adadcbd86f342321";
    const basicAuthHeader = btoa(`e9fec6e1cb5241e0a41ab98db146bc3c:${client_secret}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuthHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': refreshToken,
      }),
    });
    if(response.status === 200) {
      const data = await response.json();
      const accessToken = data.access_token;
      localStorage.setItem("access_token", accessToken);
      console.log("Updated Access Token!");
    }
}
