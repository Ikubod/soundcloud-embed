//Soundcloud API client ID. Super secret. Don't look
var cid = 'bab7d605d475e02c14a7836a1dde121e';

// Set up the manager of sounds on load
soundManager.setup({
	url: 'include/swf',
	flashVersion: 9,
	debugMode: false,
 	onready: function() {
 		
    }
});


//Define module

(function(window, undefined ){
 	function scPlayer(){

 		var smPlayer;
 		

		$( window ).resize(function() {
			$('canvas','.wave').width($('.wave').width()-40); //resize canvas to fit (scales)
		});



		// Adds commas to numbers

 		var parseNum = function(num){
 			return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 		}



 		// Function for quicker item = typeof item !== 'undefined' ? item : def;

 		var checkItem = function(item,def){
 			if (typeof(item) == 'undefined'){
 				return def;
 			}else{
 				return item;
 			}
 		}



 		// generates waveforms from url

 		var updateWaves = function(wave_url){
 			console.log(wave_url);
 			$.getJSON('http://www.waveformjs.org/w?url='+wave_url+'&callback=?', function(data) {
 				if ($.inArray("error", data) == -1){
					waveBack.update({
						data: data
					});
					waveBuffer.update({
						data: data
					});
					waveProgress.update({
						data: data
					});
					waveSeek.update({
						data: data
					});
				}
			});
 		}



 		// retrieves waveform from track

 		var getWave = function(trackID){
 			return($.getJSON('http://api.soundcloud.com/tracks/'+trackID+'.json?client_id=e387d99dcfc5ee8123f7785be4e23577'));
 		}

 		var genWaves = function(){
 			waveBack = new Waveform({
				container: document.getElementById("wave_back"),
				innerColor: 'rgba(255,255,255,0.1)',
				interpolate: true,
				height:50,
				width: $('.scrubber_frame').width()-40
			});
			waveBuffer = new Waveform({
				container: document.getElementById("wave_buffer"),
				innerColor: 'rgba(255,255,255,0.2)',
				interpolate: true,
				height:50,
				width: $('.scrubber_frame').width()-40
			});
			waveProgress = new Waveform({
				container: document.getElementById("wave_progress"),
				innerColor: 'rgba(255,255,255,0.3)',
				interpolate: true,
				height:50,
				width: $('.scrubber_frame').width()-40
			});
			waveSeek = new Waveform({
				container: document.getElementById("wave_seek"),
				innerColor: 'rgba(0,0,0,0.4)',
				interpolate: true,
				height:50,
				width: $('.scrubber_frame').width()-40
			});
 		}


 		
 		// pulls array of tracks once artist is resolved

 		var getTracks = function(artistID,element,autoplay){
 			$.getJSON('http://api.soundcloud.com/users/'+artistID+'/tracks.json?&client_id='+cid+'&limit=25', function(data) { 
 				if ($.inArray("error", data) == -1){
	 				for(i = 0; i < data.length; i++){
	 					
	 					// Append track titles
	 					var append = '';
	 					if (data[i]['title'].length > 70){
	 						append = '...';
	 					}
	 					// Create track list
	 					var html = 	'<div class="track_item" id="'+data[i]['id']+'">';
	 					html +=			'<div class="track_name">'+data[i]['title'].substring(0,70)+append+'</div>'; // Track Name
	 					html +=			'<div class="track_image"><img src="'+data[i]['artwork_url']+'" height="100%"/></div>'; // Track Image
	 					html +=			'<div class="track_info">';
	 					html +=				'<i class="ion-play"></i> '+parseNum(data[i]['playback_count']); // Track Plays
	 					html +=				'<i class="ion-heart"></i> '+parseNum(data[i]['favoritings_count']); // Track Favorites
	 					html +=				'<i class="ion-chatbox-working"></i> '+parseNum(data[i]['comment_count']); // Track Comments
	 					html += 	'</div>';
	 					$('#track_list').append(html);

	 				}

	 				$('.track_item').on('click',function(){
						playTrack($(this).attr('id'),$(this));
					});

					$('.play_pause').click(function(){
						if (typeof smPlayer == "undefined"){ // If nothing's playing, play first song
							var firstSong = $('.track_item').first().addClass('curTrack').attr('id');
							playTrack(firstSong);
						}else{
							if(smPlayer.paused){
								smPlayer.play();
								$(this).addClass('isPlaying');
							}else{
								smPlayer.pause();
								$(this).removeClass('isPlaying');
							}
						}
					});
					if (autoplay){
						var firstSong = $('.track_item').first().addClass('curTrack').attr('id');
						playTrack(firstSong);
					}
	 			}
 			});
 		}


 		// Parse and pass artist ID from url

    	this.init = function(url,element,autoplay){
    		url = checkItem(url,'notlikelysounds');
    		autoplay = checkItem(autoplay,false);

    		if (element.attr('width')){
    			element.width(element.attr('width'));
    		}

    		element.addClass('player_container');

    		if (url.match(/.*soundcloud\.com.+/)){ //Check if url is even a url at all (specifically soundcloud.com)
    			if (!url.match(/https?:\/\//)){ 
    				url = 'http://' + url; //Add http:// if needed. (Soundcloud requires this)
    			}
			}else{ //Assume user just entered the artist name
				url = 'http://www.soundcloud.com/' + url;
			}
			$.getJSON('http://api.soundcloud.com/resolve.json?url='+url+'&client_id='+cid, function(data) { // Resolve Soundcloud artist ID from username (url)
				if ($.inArray("error", data) == -1){
					var img = data['avatar_url'].replace("large.jpg","t500x500.jpg"); // Change resolution of image


					// Create player inside passed element

					var html = 	'<div class="player_info_frame">';
					html += 		'<div class="player_image_back blur" style="background:url(\''+img+'\'); background-size:cover;background-position:center center;"></div><div class="darken"></div>' // Top back image
					html +=			'<div class="artist_image"><div class="play_pause"><img src="'+img+'" width="100%"/></div></div>'; // Artist / Track image
					html +=			'<div class="scrubber_frame">';
					html +=				'<div class="song_frame">';
					html +=					'<div class="song_name">Ryn Weaver - Promises (TWRK Remix)</div>'; // Song name
					html +=					'<div class="song_info">';
					html += 					'<i class="ion-play"></i> <span class="song_plays">99,999</span>' // Song plays
					html += 					'<i class="ion-heart"></i> <span class="song_likes">99,999</span>' // Song Favorites
					html += 					'<i class="ion-chatbox-working"></i> <span class="song_comments">99,999</span>' // Song Comments
					html +=						'<span class="download_button hidden"><a href="#!" target="_blank"><i class="ion-ios-cloud-download"></i> Download</a></span>' // Download button
					html +=					'</div><div class="wave_space"></div><div class="wave" id="wave_back"></div><div class="wave" id="wave_buffer" style="pointer-events:all;"></div><div class="wave" id="wave_progress"></div><div class="wave" id="wave_seek"></div>'; // The waveforms
					html +=			'</div></div>';
					html += 		'<div class="artist_title">'+data['username']+'<span style="display:inline-block;">'; // Artist Name
					html +=				'<i class="ion-music-note"></i> '+parseNum(data['track_count']); // Track Count
					html += 			'<i class="ion-person-stalker"></i> '+parseNum(data['followers_count']); // Followers count
					if (data['website']){html += 			'<a href="'+data['website']+'" target="_blank"><i class="ion-earth"></i> Website </a>';} // Show website if exists
					html += 			'<a href="'+data['permalink_url']+'" target="_blank"><i class="ion-cloud"></i> Soundcloud </a>'; // Soundcloud Link
					html +=			'</span></div>';
					html += 	'</div>';
					html +=		'<div id="track_list"></div>';
					element.append(html);
					$('#track_list').perfectScrollbar();
					getTracks(data['id'],element,autoplay); 

					$('#wave_buffer').mousemove(function(e) { // Move scrubber around
						var temp = (e.pageX - $(this).offset().left);
						$('#wave_seek').css('visibility','visible');
						$('#wave_seek').css('margin-left',temp);
						$('canvas','#wave_seek').css('margin-left',temp*-1);
					});

					$('#wave_buffer').mouseout(function(e) {
						$('#wave_seek').css('visibility','hidden');
					});


					// Seek through song
					$('#wave_buffer').click(function(e){
							if (soundManager.getSoundById('smPlayer') != null){
								var tpos = ((e.pageX - $(this).offset().left)/($('.wave').width()-21));
								if (scPlayer.bytesLoaded != scPlayer.bytesTotal){
									var dur = smPlayer.durationEstimate;
								}else{
									var dur = smPlayer.duration;
								}
								smPlayer.setPosition((tpos*dur));
								if(smPlayer.playState == 0){smPlayer.play()};
							}
					});

					genWaves();
				}
			});
    	}


    	// 

    	var playTrack = function(trackID,clicked){
    		checkItem(clicked,false);

    		// Remove smPlayer, stopping it and opening it to load new song
    		if (soundManager.getSoundById('smPlayer') != null){soundManager.destroySound('smPlayer');}

    		soundManager.useHTML5Audio = true;
			soundManager.preferFlash = false;
			soundManager.flashLoadTimeout = 6000;

			getWave(trackID)
				.success(function(data){
					smPlayer = soundManager.createSound({
						id: 'smPlayer',
						flashVersion:9,
					    volume:50,
					    stream:true,
					    url: 'https://api.soundcloud.com/tracks/'+trackID+'/stream?client_id=e387d99dcfc5ee8123f7785be4e23577'
					 });

					smPlayer.options.whileloading = function() {
						//console.log(this);
						var pcnt = (this.bytesLoaded/this.bytesTotal)*100;
						$('#wave_buffer').stop().animate({'width':$('#wave_back').width()*(pcnt/100)},600);
					}

					smPlayer.options.whileplaying = function() {
						var pcnt = (this.position/this.duration)*100;
						$('#wave_progress').width(($('#wave_back').width()-20)*(pcnt/100));
						
					}

					smPlayer.options.onfinish = function() {
						var next = $('.curTrack').next();
						if (next.length){ // If next element exists
							playTrack(next.attr('id'),next);
						}
					}

					// Update everything!
					var append = '';
					if (clicked){
						$('.curTrack').removeClass('curTrack');
						clicked.addClass('curTrack');
					}
					if (data['title'].length > 50){append = '...';} // If title is longer than 50 characters, cut and append '...'
					$('.song_frame').addClass('visible');
					$('.song_name').html(data['title'].substring(0,50)+append);
					$('.song_plays').html(parseNum(data['playback_count']));
					$('.song_likes').html(parseNum(data['favoritings_count']));
					$('.song_comments').html(parseNum(data['comment_count']));
					$('img','.play_pause').attr('src',data['artwork_url']);
					$('.play_pause').addClass('isPlaying');
					$('.player_image_back').css('background','url(\''+data['artwork_url']+'\')');
					$('#wave_progress').width(0);
					$('#wave_buffer').width(0);
					$('#wave_seek').width(1);

					// If download url exists, set and show download button
					if (data['download_url']) {$('.download_button').removeClass('hidden').find('a').attr('href',data['download_url']+'?client_id=e387d99dcfc5ee8123f7785be4e23577'); }else{ $('.download_button').addClass('hidden');}

					updateWaves(data['waveform_url']);

					smPlayer.play();
				});
			
    	}

    	this.playTrack = function(trackID){
    		playTrack(trackID);
    	}
   
    
	}
	window.scPlayer = scPlayer;
} )( window );


