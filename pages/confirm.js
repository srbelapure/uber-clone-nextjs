import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import Link from "next/link";

import Map from "./components/Map";
import RideSelector from "./components/RideSelector";

const Confirm = () => {
  const router = useRouter();

  const { pickuplocation, dropofflocation , routemode} = router.query;

  console.log("pickuplocation**********", pickuplocation);
  console.log("dropofflocation**************", dropofflocation);
  console.log("routemoderoutemoderoutemoderoutemoderoutemode",routemode)

  const [pickUpCoordinates, setPickupCoordinates] = useState([0, 0]);
  const [dropoffCoordinates, setDropoffCoordinates] = useState([0, 0]);

  const getPickupCoordinates = (pickupLocationValue) => {
    const pickup = pickupLocationValue;
    //use fetch API to call external server
    // ? is used for querry parameter
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${pickup}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoiY29kZXIxOTk0IiwiYSI6ImNrdm12eHhhbzNpODQydm55M3RkYzQ0dnAifQ.4765hgdfnCSdO1LxiOYDdA",
          limit: 1,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("pickup", data.features[0].center);
        setPickupCoordinates(data.features[0].center);
      });
  };

  const getDropOffCoordinates = (dropoffLocationValue) => {
    const dropoff = dropoffLocationValue;
    //use fetch API to call external server
    // ? is used for querry parameter
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${dropoff}.json?` +
        new URLSearchParams({
          access_token:
            "pk.eyJ1IjoiY29kZXIxOTk0IiwiYSI6ImNrdm12eHhhbzNpODQydm55M3RkYzQ0dnAifQ.4765hgdfnCSdO1LxiOYDdA",
          limit: 1,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("dropoff", data.features[0].center);
        setDropoffCoordinates(data.features[0].center);
      });
  };

  /*trial snippet for adding route lines between pickup and dropoff locations*/
  // const getRouteDirections = (pickUpCoordinates, dropoffCoordinates) => {
  //   console.log("pick-up", pickUpCoordinates[0], pickUpCoordinates[1]);
  //   console.log("drop-off", dropoffCoordinates[0], dropoffCoordinates[1]);

  //   const query = await fetch(
  //     `https://api.mapbox.com/directions/v5/mapbox/cycling/${pickUpCoordinates[0]},${pickUpCoordinates[1]};
  //     ${dropoffCoordinates[0]},${dropoffCoordinates[1]}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoiY29kZXIxOTk0IiwiYSI6ImNrdm12eHhhbzNpODQydm55M3RkYzQ0dnAifQ.4765hgdfnCSdO1LxiOYDdA`,
  //     { method: 'GET' }
  //   );

  //   const json = await query.json();
  // const data = json.routes[0];
  // const route = data.geometry.coordinates;
  // const geojson = {
  //   type: 'Feature',
  //   properties: {},
  //   geometry: {
  //     type: 'LineString',
  //     coordinates: route
  //   }
  // };
  // // if the route already exists on the map, we'll reset it using setData
  // if (map.getSource('route')) {
  //   map.getSource('route').setData(geojson);
  // }
  // // otherwise, we'll make a new request
  // else {
  //   map.addLayer({
  //     id: 'route',
  //     type: 'line',
  //     source: {
  //       type: 'geojson',
  //       data: geojson
  //     },
  //     layout: {
  //       'line-join': 'round',
  //       'line-cap': 'round'
  //     },
  //     paint: {
  //       'line-color': '#3887be',
  //       'line-width': 5,
  //       'line-opacity': 0.75
  //     }
  //   });
  // }

  // };
  /*trial snippet for adding route lines between pickup and dropoff locations*/

  useEffect(() => {
    getPickupCoordinates(pickuplocation);
    getDropOffCoordinates(dropofflocation);
    //getRouteDirections(pickUpCoordinates, dropoffCoordinates);
  }, [pickuplocation, dropofflocation]);
  return (
    <Wrapper>
      <ButtonContainer>
        <Link href="/search">
          <BackButton
            src="https://img.icons8.com/ios-filled/50/000000/left.png"
            alt="Back Button"
          />
        </Link>
      </ButtonContainer>
      {/* map component */}
      <Map
        pickUpCoordinates={pickUpCoordinates}
        dropoffCoordinates={dropoffCoordinates}
        routemode={routemode}
      />
      {/* ride container */}
      <RidesContainer>
        {/* ride selector */}
        <RideSelector
          pickUpCoordinates={pickUpCoordinates}
          dropoffCoordinates={dropoffCoordinates}
        />
        {/* confirm button */}
        <ConfirmButtonContainer>
          <ConfirmButton>Confirm</ConfirmButton>
        </ConfirmButtonContainer>
      </RidesContainer>
    </Wrapper>
  );
};

export default Confirm;
// rafce -> React Arrow Function Component

const Wrapper = tw.div`flex flex-col h-screen`; // add display flex, because map uses a  flex-1 value
const RidesContainer = tw.div`flex flex-col flex-1 h-1/2`;
const ConfirmButtonContainer = tw.div`border-t-2`;
const ConfirmButton = tw.div`bg-black text-white my-4 mx-4 text-center py-4 text-xl`;
const ButtonContainer = tw.div`rounded-full absolute z-10 top-4 left-4 bg-white shadow-md cursor-pointer`;
const BackButton = tw.img`h-full object-contain`;

// TO add pointers over map, search add markers to map in mapbox -> https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/  ---> refer addToMap() in Map.js

// 1] get co-ordinates from a location, to add marker over map ->first step
// refer this link https://docs.mapbox.com/api/search/geocoding/  ---> "Forward geocoding" --->
// refer getPickupCoordinates() and getDropoffCoordinates()

// 2] Add Pickup and Dropoff as markers on map  --> useState()

//  3] Add auto zoom to be able to zoom into the markers --> refer this linkhttps://docs.mapbox.com/mapbox-gl-js/example/fitbounds/
// map.fitBounds([]) function -->

// 4] pass the locations data from input boxes on search page to next page
// use <Link> tag and pass parameters inside it

// 5] pass the location data to confirm page

// 6] Use the passed in data to locate the markers over the map
