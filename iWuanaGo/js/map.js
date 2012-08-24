(function($) {

  var Core = window.Core || Core || {};

  Core.map = {

    init: function() {
      //Core.auth.requireSession();
      Core.map.bindEvents();
      $("#map_canvas").height(Core.body_height - ($("#flipbox").height() + $("#header").height()));
      $('#map_canvas').gmap();
    },

    bindEvents: function() {
      $("#map-pg").bind("pageshow", function() {
        window.plugins.mapKit.showMap();
      });
      $("#map-pg").bind("pagebeforehide", function() {
        window.plugins.mapKit.hideMap();
      });

      $('#locate').live('click', function() {
        //Core.auth.logout();
        Core.map.changeMessage("loadind events...", "#39AB3E");
        return false;
      });
      $('#settings').live('click', function() {
        Core.map.messageBox.changeMessage("Downloading events...", "#0D12A4");
        Core.request_events({
          latitude: -33.498962,
          longitude: -70.616562
        }, 'todos', 'week', 10, {
          onSuccess: Core.map.add_events.onSuccess,
          onError: Core.map.add_events.onError,
          onDenied: Core.map.add_events.onDenied,
          onComplete: Core.map.add_events.onComplete
        });
      console.log("funciona");


      });
    },

    getPosition: function() {
      var dfd = $.Deferred();
      navigator.geolocation.getCurrentPosition(

      function(position) {
        dfd.resolve(position)
      }, function(error) {
        dfd.resolve({
          coords: {
            latitude: -33.498962,
            longitude: -70.616562
          }
        })
      })
      return dfd.promise();
    },

    putMap: function(coords) {
      var options = {
        buttonCallback: "cbMapCallback",
        height: Core.body_height - $("#flipbox").height(),
        offsetTop: $("#header").height() + $("#flipbox").height(),
        diameter: 1000,
        lat: coords.latitude,
        lon: coords.longitude
      };

      // setTimeout(function() {
      //   Core.map.locked = false;
      // }, 1000);
      window.plugins.mapKit.showMap();
      window.plugins.mapKit.setMapData(options);
    },

    add_events: {

      onSuccess: function(data) {
        var newpins = [];
        $.each(data, function(i, evnt) {
          newpins.push({
            lat: evnt.latitude,
            lon: evnt.longitude,
            title: evnt.name,
            pinColor: "purple",
            index: 0,
            selected: false
          })
        });
        if (newpins.length > 0) window.plugins.mapKit.addMapPins(newpins);

        Core.map.messageBox.changeMessage("Ready", "#39AB3E");
      },

      onError: function(data) {
        Core.map.messageBox.changeMessage("Conection error", "#DA0122");
      },

      onDenied: function(data) {},

      onComplete: function(data) {

      }
    },

    putPins: function(pins) {
      app.mapPins = [];
      $.each(pins, function(i, pin) {
        app.mapPins.push({
          lat: pin.latitude,
          lon: pin.longitude,
          title: pin.name,
          pinColor: "purple",
          index: 0,
          selected: false
        })
      })
      if (app.mapPins.length > 0) window.plugins.mapKit.addMapPins(app.mapPins);
    },

    getBBOX: function(location) {
      return [location.lon - (location.deltaX / 2), location.lat - (location.deltaY / 2), location.lon + (location.deltaX / 2), location.lat + (location.deltaY / 2)].join(",");
    },

    onMapMove: function(lat, lon, deltaY, deltaX) {
      // app.lastLocation = {
      //   lat: parseFloat(lat),
      //   lon: parseFloat(lon),
      //   deltaY: parseFloat(deltaY),
      //   deltaX: parseFloat(deltaX)
      // }

      // app.lastLocation.bbox = getBBOX(app.lastLocation);

      // window.plugins.mapKit.clearMapPins();
      // couch.get("http://open211.org/api/services?bbox=" + app.lastLocation.bbox).then(function(results) {
      //   putPins(results.rows.map(function(row) {
      //     return row.value;
      //   }));
      // })
      console.log("movido");

    },
    messageBox: {
      busy: false,
      messages: [],
      changeMessage: function(msg, col) {
        Core.map.messageBox.messages.push({message: msg, color: col});
        if(Core.map.messageBox.busy)
          return;
        Core.map.messageBox.busy = true;
        Core.map.messageBox.displayMessage(Core.map.messageBox.messages.shift()); 
        
      },
      displayMessage: function(data){
        $("#flipbox").flip({
          direction: 'bt',
          color: data.color,
          content: data.message,
          onEnd: Core.map.messageBox.end_of_animation
          }
        );
      },
      end_of_animation: function(){
        if(Core.map.messageBox.messages.length > 0)
              Core.map.messageBox.displayMessage(Core.map.messageBox.messages.shift());
            else
              Core.map.messageBox.busy = false;
      }
    }

  };

  $(Core.map.init);

  window.Core = Core;

})(jQuery);