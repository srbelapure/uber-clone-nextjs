import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiY29kZXIxOTk0IiwiYSI6ImNrdm12eHhhbzNpODQydm55M3RkYzQ0dnAifQ.4765hgdfnCSdO1LxiOYDdA";

const Map = () => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map_section",
      // style: "mapbox://styles/mapbox/streets-v11", // this was the default style for map
      style: "mapbox://styles/drakosi/ckvcwq3rwdw4314o3i2ho8tph",
      center: [-99.29011, 39.39172], // this is latitude for centre america
      zoom: 3, // this represents the zoom number
    });
  });
  return <Wrapper id="map_section"></Wrapper>;
};

export default Map;


const Wrapper = tw.div`flex-1`;

// rafce rfce ----> ES7 react redux snippets
