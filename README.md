# soundcloud-embed

<img align="center" src="http://i.imgur.com/p3MGWOq.png" />

#Demo:
Check out the demo at http://sound.notlikely.me

#Prerequisites
**This plugin has a few dependencies:**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;jQuery - https://jquery.com/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;soundManager2 - http://www.schillmania.com/projects/soundmanager2/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;perfect-scrollbar - https://noraesae.github.io/perfect-scrollbar/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ionicons - http://www.ionicons.com

####Including Prerequisites
All the files needed are included and should be added before scplayer.js within the `<head>` tag

#Usage: 

####scPlayer.init(string url/artist, element, bool autoplay)
`scPlayer.init('http://www.soundcloud.com/trewth1',document.getElementById('soundcloudFrame'),true);`


##Basic example:
```html
<html>
  <head>
    <title> Basic demo </title>
    <link rel="stylesheet" type="text/css" href="style/ionicons.min.css" />
    <link rel="stylesheet" type="text/css" href="style/player.css" />
    <link rel="stylesheet" type="text/css" href="style/perfect-scrollbar.min.css" />
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script type="text/javascript" src="js/soundmanager2.js"></script>
    <script type="text/javascript" src="js/waveform.js"></script>
    <script type="text/javascript" src="js/perfect-scrollbar.jquery.min.js"></script>
    <script type="text/javascript" src="js/scplayer.js"></script>
  </head>
  <body>
    <div id="soundcloudPlayer"></div>
    <script>
      var player = new scPlayer();
      player.init("http://www.soundcloud.com/trewth1",$('#soundcloudPlayer'),false);
    </script>
  </body>
</html>
```
