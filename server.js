// server.js
// where your node app starts

// init project
let express = require('express');
let axios = require('axios');

let app = express();

const client_id = process.env.TWITCH_CLIENT_ID;

app.get('/', (req, res) => {
  res.end(`
APIS:
  https://xev-twitch-api.glitch.me/channel/<username>
  https://xev-twitch-api.glitch.me/status/<channel_id>

CHANNEL USAGE:
  https://xev-twitch-api.glitch.me/channel/xevrem

CHANNEL OUTPUT:
  {"mature":false,"status":"Making a Roguelike","broadcaster_language":"en","display_name":"xevrem","game":"Creative","language":"en","_id":"102074027","name":"xevrem","created_at":"2015-09-13T00:41:22Z","updated_at":"2017-10-14T01:19:39Z","partner":false,"logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/xevrem-profile_image-0b82cccfec969f46-300x300.jpeg","video_banner":"https://static-cdn.jtvnw.net/jtv_user_pictures/xevrem-channel_offline_image-47a983e48b4ca129-1920x1080.jpeg","profile_banner":"https://static-cdn.jtvnw.net/jtv_user_pictures/xevrem-profile_banner-a4c65e67a9aec2c6-480.jpeg","profile_banner_background_color":null,"url":"https://www.twitch.tv/xevrem","views":139,"followers":5,"broadcaster_type":"","description":"Game On!"}

STATUS USAGE:
  https://xev-twitch-api.glitch.me/status/102074027

STATUS OUTPUT IF LIVE:
  {"_total":1,"streams":[{"_id":26541363808,"game":"Darkwood","broadcast_platform":"live","community_id":"848d95be-90b3-44a5-b143-6e373754c382","community_ids":["848d95be-90b3-44a5-b143-6e373754c382","fd0eab99-832a-4d7e-8cc0-04d73deb2e54","ff1e77af-551d-4993-945c-f8ceaa2a2829"],"viewers":13857,"video_height":1080,"average_fps":62.851782364,"delay":0,"created_at":"2017-10-21T23:46:45Z","is_playlist":false,"stream_type":"live","preview":{"small":"https://static-cdn.jtvnw.net/previews-ttv/live_user_dansgaming-80x45.jpg","medium":"https://static-cdn.jtvnw.net/previews-ttv/live_user_dansgaming-320x180.jpg","large":"https://static-cdn.jtvnw.net/previews-ttv/live_user_dansgaming-640x360.jpg","template":"https://static-cdn.jtvnw.net/previews-ttv/live_user_dansgaming-{width}x{height}.jpg"},"channel":{"mature":false,"status":"Dan plays Darkwood (First Time) 7th Annual Halloween Marathon  !store !horror !corsair","broadcaster_language":"en","display_name":"DansGaming","game":"Darkwood","language":"en","_id":7236692,"name":"dansgaming","created_at":"2009-07-15T03:02:41.783214Z","updated_at":"2017-10-23T18:06:23.967304Z","partner":true,"logo":"https://static-cdn.jtvnw.net/jtv_user_pictures/dansgaming-profile_image-76e4a4ab9388bc9c-300x300.png","video_banner":"https://static-cdn.jtvnw.net/jtv_user_pictures/dansgaming-channel_offline_image-f4f6686e32afb2c7-1920x1080.jpeg","profile_banner":"https://static-cdn.jtvnw.net/jtv_user_pictures/dansgaming-profile_banner-4c2b8ece8cd010b4-480.jpeg","profile_banner_background_color":"#f6f6f6","url":"https://www.twitch.tv/dansgaming","views":78966491,"followers":630885,"broadcaster_type":"","description":"Dan is a regular guy with a passion for games! Playing all games new to old. Live everyday at 9am PST // 5pm GMT"}}]}

STATUS OUTPUT IF OFFLINE:
  {"_total":0,"streams":[]}

  `);
})

app.get('/channel/:username', (req, res) => {
  get_stream_info(req.params.username).then( response =>{
    res.set('Access-Control-Allow-Origin','*');
    res.send(response.data);
    res.end();
  }).catch( err =>{
    res.set('Access-Control-Allow-Origin','*');
    res.send(`${err}`);
    res.end();
  });
  
});

app.get('/status/:channel_id', (req, res) => {
  get_status(req.params.channel_id).then( response => {
    res.set('Access-Control-Allow-Origin','*');
    res.send(response.data);
    res.end();
  }).catch( err =>{
    res.set('Access-Control-Allow-Origin','*');
    res.send(`${err}`);
    res.end();
  });
});

// listen for requests :)
let listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


function get_stream_info(stream){
  //return a promise for the API
  return axios({
    url: 'https://api.twitch.tv/kraken/users',
    method: 'GET',
    params: {
      'login': stream,
    },
    headers:{
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': client_id,
    },
    responseType: 'jsonp',
  }).then( response =>{
    var user = response.data.users[0];
    return axios({
      url: 'https://api.twitch.tv/kraken/channels/' + user._id,
      method: 'GET',
      headers:{
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': client_id,
      },
      responseType: 'jsonp',
    });
  });
}

function get_status(channel_id){
  return axios({
    url: 'https://api.twitch.tv/kraken/streams/',
    method: 'GET',
    params:{
      'channel': [channel_id],
    },
    headers:{
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': client_id,
    },
    responseType: 'jsonp',
  });
}