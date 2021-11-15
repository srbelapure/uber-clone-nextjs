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
