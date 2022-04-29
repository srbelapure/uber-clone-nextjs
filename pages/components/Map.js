import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import mapboxgl from "mapbox-gl";
import { DotLoader } from "react-spinners";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29kZXIxOTk0IiwiYSI6ImNrdm12eHhhbzNpODQydm55M3RkYzQ0dnAifQ.4765hgdfnCSdO1LxiOYDdA";

const Map = (props) => {
  const [rideRouteMins, setRideRouteMins] = useState(0);
  const [userLocationFromGeolocator, setUserLocationFromGeoLocator] = useState(
    []
  );
  const [startRide, setStartRide] = useState(false);
  const [rideArrivedAtLocation, setRideArrivedAtLocation] = useState(false);
  const [rideArrivedAtDestination, setRideArrivedAtDestination] =
    useState(false);
  const [isLoadingForDropoff, setIsLoadingForDropoff] = useState(false);
  const [isLoadingForPickup, setIsLoadingForPickup] = useState(false);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map_section",
      // style: "mapbox://styles/mapbox/streets-v11", // this was the default style for map
      style: "mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph",
      center: [-99.29011, 39.39172], // this is latitude for centre america
      zoom: 3, // this represents the zoom number
    });

    //to add the pickup point on the map
    if (props.pickUpCoordinates) {
      addToMap(map, props.pickUpCoordinates);
    }
    //to add the drop-off point on the map
    if (props.dropoffCoordinates) {
      addToMap(map, props.dropoffCoordinates);
    }
    //when both pickup and drop-off are available,then add a fit bounds
    if (props.pickUpCoordinates && props.dropoffCoordinates) {
      map.fitBounds([props.pickUpCoordinates, props.dropoffCoordinates], {
        padding: 60, // padding helps to fit the bounds in the view by adding space inside
      });
    }

    // To Add geolocate control to the map.(to get user's current location)
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );

    /**This MapboxGeocoder when called on map, it adds an input box with auto suggestions
 * import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
* do npm install for geocoder

    // const geocoder = new MapboxGeocoder({
    //   // Initialize the geocoder
    //   accessToken: mapboxgl.accessToken, // Set the access token
    //   mapboxgl: mapboxgl, // Set the mapbox-gl instance
    //   marker: false // Do not use the default marker style
    // });
    // // Add the geocoder to the map
    // map.addControl(geocoder);
*/

    //Below is the code used to add a route line between sourec and destination
    // start has pickup coordinates and end has dropoff coordinates

    const start = props.pickUpCoordinates;
    // create a function to make a directions request
    async function getRoute(end) {
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: "GET" }
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;
      const geojson = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      };
      // if the route already exists on the map, we'll reset it using setData
      if (map.getSource("route")) {
        map.getSource("route").setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: geojson,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }

      // //TO show route ride minutes
      if (
        props.pickUpCoordinates &&
        props.pickUpCoordinates[0] !== 0 &&
        props.pickUpCoordinates[1] !== 0 &&
        props.dropoffCoordinates &&
        props.dropoffCoordinates[0] !== 0 &&
        props.dropoffCoordinates[1] !== 0
      ) {
        if (Math.round(data.duration / 60) > 59) {
          setRideRouteMins(secondsToHms(data.duration));
        } else {
          var minsValue = Math.round(data.duration / 60);
          minsValue > 1
            ? setRideRouteMins(minsValue + " " + "mins")
            : setRideRouteMins(minsValue + " " + "min");
        }
      }
    }
    if (
      props.pickUpCoordinates &&
      props.pickUpCoordinates[0] !== 0 &&
      props.pickUpCoordinates[1] !== 0 &&
      rideArrivedAtLocation === false
    ) {
      map.on("load", () => {
        // make an initial directions request that
        // starts and ends at the same location
        getRoute(start);

        // Add starting point to the map
        map.addLayer({
          id: "point",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: start,
                  },
                },
              ],
            },
          },
          paint: {
            "circle-radius": 10,
            "circle-color": "#3887be",
          },
        });
      });
    }

    if (
      props.dropoffCoordinates &&
      props.dropoffCoordinates[0] !== 0 &&
      props.dropoffCoordinates[1] !== 0 &&
      rideArrivedAtDestination === false
    ) {
      map.on("load", () => {
        const coords = props.dropoffCoordinates;
        const end = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: coords,
              },
            },
          ],
        };
        if (map.getLayer("end")) {
          map.getSource("end").setData(end);
        } else {
          map.addLayer({
            id: "end",
            type: "circle",
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "Point",
                      coordinates: coords,
                    },
                  },
                ],
              },
            },
            paint: {
              "circle-radius": 10,
              "circle-color": "#3887be",
            },
          });
        }
        getRoute(coords);
      });
    }

    if (
      props.rideConfirm === true &&
      rideArrivedAtLocation === false &&
      props.startRide === false
    ) {
      let rideReachTime = props.rideMinsAway * 10;
      showTimeLapse(0, rideReachTime);
      setIsLoadingForPickup(true);
    }

    if (rideArrivedAtLocation === true && props.startRide === false) {
      map.on("load", () => {
        // Add starting point to the map
        map.addLayer({
          id: "point",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: props.pickUpCoordinates,
                  },
                },
              ],
            },
          },
          paint: {
            "circle-radius": 20,
            "circle-color": "green",
          },
        });
      });
      props.propFromChild(rideArrivedAtLocation);
      setIsLoadingForPickup(false);
    }

    if (props.startRide === true) {
      const toStartRide = true;
      showTimeLapse(0, 10, map, toStartRide);
      setIsLoadingForDropoff(true);
    }

    if (rideArrivedAtDestination === true) {
      map.on("load", () => {
        const end = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: props.dropoffCoordinates,
              },
            },
          ],
        };
        if (map.getLayer("end")) {
          map.getSource("end").setData(end);
        } else {
          map.addLayer({
            id: "end",
            type: "circle",
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "Point",
                      coordinates: props.dropoffCoordinates,
                    },
                  },
                ],
              },
            },
            paint: {
              "circle-radius": 20,
              "circle-color": "green",
            },
          });
        }
      });
      setIsLoadingForDropoff(false);
    }
  }, [
    props.pickUpCoordinates,
    props.dropoffCoordinates,
    props.rideConfirm,
    rideArrivedAtLocation,
    rideArrivedAtDestination,
    props.startRide,
  ]);

  // useEffect(() => {
  //   /**
  //    * when user selects a ride and clicks confirm, then after a certain time lapse, we tell user that the ride has arrived
  //    */
  //   if(props.rideConfirm){
  //     let rideReachTime=(props.rideMinsAway*10)
  //     console.log("rideReachTime",rideReachTime,props.rideMinsAway)
  //     showTimeLapse(0, rideReachTime);
  //   }
  // }, [props.rideConfirm]);

  const addToMap = (map, coordinate) => {
    // Create a default Marker and add it to the map.
    const marker1 = new mapboxgl.Marker().setLngLat(coordinate).addTo(map);
  };

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  function showTimeLapse(from, to, map, toStartRide) {
    let current = 0;

    let timerId = setInterval(function () {
      console.log(current);
      if (current == to) {
        setRideArrivedAtLocation(true);
        if (toStartRide === true) {
          setRideArrivedAtDestination(true);
        }
        clearInterval(timerId);
        alert("ride is here");
      }
      current++;
    }, 1000);
  }

  return (
    <Wrapper id="map_section">
      {rideRouteMins !== 0 && (
        <RideRouteDuration>
          {rideRouteMins} {<br />}to reach destination
        </RideRouteDuration>
      )}
      {
        <div>
          <DotLoader
            loading={isLoadingForPickup || isLoadingForDropoff}
            size={80}
            sizeUnit={"px"}
            color="pink"
          />
        </div>
      }
    </Wrapper>
  );
};

export default Map;

const Wrapper = tw.div`flex-1`;
const RideRouteDuration = tw.div`flex items-center bg-indigo-300 absolute
z-10 m-20 text-center font-bold align-middle w-20`;

// rafce rfce ----> ES7 react redux snippets
