(function($) {

	var Core = window.Core || Core || {};

	Core.map = {

		init : function() {
			//Core.auth.requireSession();
			Core.map.current_location_image = new google.maps.MarkerImage('images/current_location_icon.png');
			Core.map.bindEvents();
			Core.map.putMap();
		},

		bindEvents : function() {

			$('#map-pg').live('pageshow', function() {
			});

			$('#locate').live('click', function() {
				Core.map.current_marker.setMap(null);
				Core.map.go_to_user_location();
				return false;

			});
			$('#settings').live('click', function() {
				Core.map.messageBox.changeMessage("Downloading events...", "#0D12A4");
				Core.request_events({
					latitude : -33.498962,
					longitude : -70.616562
				}, 'todos', 'week', 10, {
					onSuccess : Core.map.add_events.onSuccess,
					onError : Core.map.add_events.onError,
					onDenied : Core.map.add_events.onDenied,
					onComplete : Core.map.add_events.onComplete
				});

			});
		},

		goToPosition : function() {

		},

		putMap : function() {
			$("#map_canvas").height(Core.body_height - ($("#flipbox").height() + $("#header").height()));
			var mapOptions = {
				zoom : 14,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};
			map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

			Core.map.go_to_user_location();
		},
		go_to_user_location : function() {
			if (!navigator.geolocation) {
				alert("Your device does not support geolocation");
				return;
			}
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				map.setCenter(pos);
				
				Core.map.current_marker = new google.maps.Marker({
					position : pos,
					map : map,
					icon : Core.map.current_location_image
				});
				Core.map.current_marker.setAnimation(google.maps.Animation.BOUNCE);
			}, function() {
				map.setCenter(new google.maps.LatLng(60, 105));
				alert("Error in geolocation");
			});

		},
		add_events : {

			onSuccess : function(data) {
				var newpins = [];
				// $.each(data, function(i, evnt) {
				// newpins.push({
				// lat: evnt.latitude,
				// lon: evnt.longitude,
				// title: evnt.name,
				// pinColor: "purple",
				// index: 0,
				// selected: false
				// })
				// });
				// if (newpins.length > 0) window.plugins.mapKit.addMapPins(newpins);

				Core.map.messageBox.changeMessage("Ready", "#39AB3E");
			},

			onError : function(data) {
				Core.map.messageBox.changeMessage("Conection error", "#DA0122");
			},

			onDenied : function(data) {
			},

			onComplete : function(data) {

			}
		},

		putPins : function(pins) {
			app.mapPins = [];
			$.each(pins, function(i, pin) {
				app.mapPins.push({
					lat : pin.latitude,
					lon : pin.longitude,
					title : pin.name,
					pinColor : "purple",
					index : 0,
					selected : false
				})
			})
			if (app.mapPins.length > 0)
				window.plugins.mapKit.addMapPins(app.mapPins);
		},

		onMapMove : function(lat, lon, deltaY, deltaX) {

		},
		messageBox : {
			busy : false,
			messages : [],
			changeMessage : function(msg, col) {
				Core.map.messageBox.messages.push({
					message : msg,
					color : col
				});
				if (Core.map.messageBox.busy)
					return;
				Core.map.messageBox.busy = true;
				Core.map.messageBox.displayMessage(Core.map.messageBox.messages.shift());

			},
			displayMessage : function(data) {
				$("#flipbox").flip({
					direction : 'bt',
					color : data.color,
					content : data.message,
					onEnd : Core.map.messageBox.end_of_animation
				});
			},
			end_of_animation : function() {
				if (Core.map.messageBox.messages.length > 0)
					Core.map.messageBox.displayMessage(Core.map.messageBox.messages.shift());
				else
					Core.map.messageBox.busy = false;
			}
		}

	};

	$(Core.map.init);

	window.Core = Core;

})(jQuery);
