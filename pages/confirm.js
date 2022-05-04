import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/router";
import Link from "next/link";

import Map from "./components/Map";
import RideSelector from "./components/RideSelector";
import RideSuccessfulModal from "./components/BootstrapModal";

const Confirm = () => {
  const router = useRouter();

  const { pickuplocation, dropofflocation, routemode, userLocation } =
    router.query;

  const [pickUpCoordinates, setPickupCoordinates] = useState([0, 0]);
  const [dropoffCoordinates, setDropoffCoordinates] = useState([0, 0]);
  const [confirmButtonEnabled, setConfirmButtomEnabled] = useState(false);
  const [confirmedridedetails, setConfirmedRideDetails] = useState([
    {
      carname: "",
      minsaway: "",
      ridefare: "",
      time:0
    },
  ]);
  const [rideConfirm, setRideConfirm] = useState(false);
  const [rideAtLocation, setRideAtLocation] = useState(false);
  const [startRide, setStartRide] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rideReachTime, setRideReachTime] = useState(0);
  const [destinationReachTime, setDestinationReachTime] = useState(0);
  const [rideArrivedAtDestination, setRideArrivedAtDestination] =
    useState(false);

  let progressInterval;

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
  }, [pickuplocation, dropofflocation, userLocation]);

  useEffect(() => {
    if (startRide === true) {
      progressInterval = setInterval(() => {
        setProgress((oldProgressValue) => {
          const newProgressValue = oldProgressValue + 10;
          setDestinationReachTime(newProgressValue / 10);
          if (newProgressValue === 100) {
            setRideArrivedAtDestination(true);
            clearInterval(progressInterval);
          }
          return newProgressValue;
        });
      }, 1000);
    } else {
      clearInterval(progressInterval);
    }
  }, [startRide]);

  const getSelectedRideDetails = (ridedetails, rideduration) => {
    if (ridedetails && rideduration) {
      var rideDuration = (rideduration * ridedetails.multiplier).toFixed(2);
      setConfirmedRideDetails({
        carname: ridedetails.service,
        minsaway: ridedetails.minsaway,
        ridefare: "$" + rideDuration,
        time: ridedetails.time,
      });
      setConfirmButtomEnabled(true);
    } else {
      setConfirmedRideDetails({
        carname: "Not_Set",
        minsaway: "Not_Set",
        ridefare: "Not_Set",
      });
      setConfirmButtomEnabled(false);
    }
  };

  const onRideConfirm = () => {
    setRideConfirm(true);
  };

  const handlePropFromChild = (value) => {
    setRideAtLocation(value);
    setRideConfirm(false);
  };

  const onClickStartRide = () => {
    setStartRide(true);
  };

  const rideReachInTime = (value) => {
    setRideReachTime(value);
  };
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
        rideConfirm={rideConfirm}
        rideMinsAway={confirmedridedetails.time}
        propFromChild={handlePropFromChild}
        startRide={startRide}
        rideWillReachInTime={rideReachInTime}
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
          {rideAtLocation ? (
            <ConfirmButton onClick={onClickStartRide}>Start Ride</ConfirmButton>
          ) : (
            <ConfirmButton onClick={onRideConfirm}>Confirm</ConfirmButton>
          )}
        </ConfirmButtonContainer>
      </RidesContainer>
      {rideConfirm && (
      <div className="overlay-for-loading">
          <div className="loader-component">
            <div className="sub-loader-component">
              Your ride is on the way
              <br />
              Will reach in {confirmedridedetails? (((confirmedridedetails.time)*10) - rideReachTime):''} seconds
            </div>
          </div>
        </div>
      )}
      {startRide && rideArrivedAtDestination === false && (
      <div className="overlay-for-loading">
          <div className="destination-progress">
            <progress
              className="ride-reach-destination-progress"
              max={100}
              value={progress}
            />
            <span className="destination-time">
              You will reach the destination in {10 - destinationReachTime}{" "}
              seconds{" "}
            </span>
          </div>
      </div>
      )}
      {rideArrivedAtDestination && (
        <RideSuccessfulModal moveToPageName={"Home"}>
          You have reached your destination{" "}
          {dropofflocation ? dropofflocation : ""}
        </RideSuccessfulModal>
      )}
    </Wrapper>
  );
};

export default Confirm;
// rafce -> React Arrow Function Component

const Wrapper = tw.div`flex flex-col h-screen`; // add display flex, because map uses a  flex-1 value
const RidesContainer = tw.div`flex flex-col flex-1 h-1/2`;
const ConfirmButtonContainer = tw.div`border-t-2`;
const ButtonContainer = tw.div`rounded-full absolute z-10 top-4 left-4 bg-white shadow-md cursor-pointer`;
const BackButton = tw.img`h-full object-contain`;
const ConfirmButton = tw.button`w-1/2 bg-black text-white w-screen my-4 text-center py-4 text-xl disabled:cursor-not-allowed`;
const LoaderContainer = tw.div`bg-green-300 px-6 py-6 position-relative bottom-20`;
const OverLay = tw.div`fixed z-18 w-screen h-screen bg-neutral-600 bg-opacity-60`

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
