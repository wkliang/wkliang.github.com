var tvd = require('twitter-video-downloader');
tvd('https://twitter.com/GIPHY/status/836063152542482434')
  .then(function(videoReadableBufferStream) {
    // DO SOMETHING WITH MP4 FORMATTED VIDEO
  }
);

