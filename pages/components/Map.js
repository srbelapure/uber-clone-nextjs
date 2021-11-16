import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29kZXIxOTk0IiwiYSI6ImNrdm12eHhhbzNpODQydm55M3RkYzQ0dnAifQ.4765hgdfnCSdO1LxiOYDdA";

const Map = (props) => {
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

    //Below is the code used to add a route line between sourec and destination
    // start has pickup coordinates and end has dropoff coordinates

    const start = props.pickUpCoordinates;
    // create a function to make a directions request
    async function getRoute(end) {
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
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
    }
    if (
      props.pickUpCoordinates &&
      props.pickUpCoordinates[0] !== 0 &&
      props.pickUpCoordinates[1] !== 0
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
            "circle-color": "purple", //#3887be
          },
        });
      });
    }

    if (
      props.dropoffCoordinates &&
      props.dropoffCoordinates[0] !== 0 &&
      props.dropoffCoordinates[1] !== 0
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
              "circle-color": "green", //#f30
            },
          });
        }
        getRoute(coords);
      });
    }
  }, [props.pickUpCoordinates, props.dropoffCoordinates]);

  const addToMap = (map, coordinate) => {
    // Create a default Marker and add it to the map.
    const marker1 = new mapboxgl.Marker()
      .setLngLat(coordinate)
      .addTo(map);
  };

  return <Wrapper id="map_section"></Wrapper>;
};

export default Map;

const Wrapper = tw.div`flex-1`;

// rafce rfce ----> ES7 react redux snippets
