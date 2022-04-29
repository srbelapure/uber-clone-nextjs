import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import Link from "next/link";

import Map from "./components/Map";
import RideSelector from "./components/RideSelector";
import Popup from "./components/Modal";

const Confirm = () => {
  const router = useRouter();

  const { pickuplocation, dropofflocation , routemode,userLocation} = router.query;

  const [pickUpCoordinates, setPickupCoordinates] = useState([0, 0]);
  const [dropoffCoordinates, setDropoffCoordinates] = useState([0, 0]);

  const [showModal, setShowModal] = useState(false);
  const [confirmButtonEnabled, setConfirmButtomEnabled] = useState(false)
  const [confirmedridedetails, setConfirmedRideDetails] = useState([{
    carname:'',minsaway:'',ridefare:''
  }])
  const [rideConfirm,setRideConfirm]=useState(false)
  const [rideAtLocation,setRideAtLocation] = useState(false)
  const [startRide,setStartRide]=useState(false)

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
        setDropoffCoordinates(data.features[0].center);
      });
  };

  useEffect(() => {
    getPickupCoordinates(pickuplocation ? pickuplocation : userLocation);
    getDropOffCoordinates(dropofflocation);
  }, [pickuplocation, dropofflocation,userLocation]);

  const getSelectedRideDetails=(ridedetails,rideduration)=>{
    if (ridedetails && rideduration) {
      var rideDuration = (rideduration * ridedetails.multiplier).toFixed(2);
      setConfirmedRideDetails({
        carname: ridedetails.service,
        minsaway: ridedetails.minsaway,
        ridefare: "$" + rideDuration,
        time:ridedetails.time
      });
      setConfirmButtomEnabled(true)
    } else {
      setConfirmedRideDetails({
        carname: "Not_Set",
        minsaway: "Not_Set",
        ridefare: "Not_Set"
      })
      setConfirmButtomEnabled(false)
    }
  }

  const onRideConfirm=()=>{
    setRideConfirm(true)
  }

  const handlePropFromChild=(value)=>{
console.log("valueeeeeeeeeeee_rideArrivedAtLocation",value)
setRideAtLocation(value)
  }

  const onClickStartRide =()=>{
    setStartRide(true)
  }

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
        rideConfirm={rideConfirm}
        rideMinsAway={confirmedridedetails.time}
        propFromChild={handlePropFromChild}
        startRide={startRide}
      />
      {/* ride container */}
      <RidesContainer>
        {/* ride selector */}
        <RideSelector
          pickUpCoordinates={pickUpCoordinates}
          dropoffCoordinates={dropoffCoordinates}
          onClick={getSelectedRideDetails.bind(this)}
        />
        {/* confirm button */}
        <ConfirmButtonContainer>
          {/* <ConfirmButton onClick={() => alert("your ride is "+ confirmedridedetails.minsaway + <br/> + 
          'Car:'+ confirmedridedetails.carname + <br/> +
          'Ride Fare:'+ confirmedridedetails.ridefare)}> */}
          {rideAtLocation ? (
            <ConfirmButton onClick={onClickStartRide}>Start Ride</ConfirmButton>
          ) : (
            <ConfirmButton onClick={onRideConfirm}>Confirm</ConfirmButton>
          )}
          {/* <Popup
            buttonTitle="Confirm"
            confirmButtonEnabled={confirmButtonEnabled}
          >
            <div>{"Your ride is" + " " + confirmedridedetails.minsaway}</div>
            <div>{"Car:" + " " + confirmedridedetails.carname}</div>
            <div>{"Ride Fare:" + " " + confirmedridedetails.ridefare}</div>
          </Popup> */}
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
// const ConfirmButton = tw.div`bg-black text-white my-4 mx-4 text-center py-4 text-xl`;
const ButtonContainer = tw.div`rounded-full absolute z-10 top-4 left-4 bg-white shadow-md cursor-pointer`;
const BackButton = tw.img`h-full object-contain`;
const ConfirmButton = tw.button`bg-black text-white w-screen my-4 mx-4 text-center py-4 text-xl disabled:cursor-not-allowed`;

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
