import React, { useState, useEffect, Fragment,useRef } from "react";
import tw from "tailwind-styled-components";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, getDocs,onSnapshot ,doc,addDoc, deleteDoc } from "firebase/firestore";

import GeoCoderInput from "./components/GeoCoderInput";
import { useRouter } from "next/router";

const Search = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [savedPlacelist, setSavedPlace] = useState([]);
  const [showPlacesList, setShowPlacesList] = useState(false);
  const [isPickupBlurred,setIsPickupBlurred] = useState(false)
  const [isDropoffBlurred,setIsDropoffBlurred] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "savedplaces"),
      (snapshot) => {
        setSavedPlace(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      }
    );

    // const unsubscribe = db.collection("savedplaces").onSnapshot((snapshot) => {
    //   setSavedPlace(
    //     snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
    //   );
    // });
    return () => {
      unsubscribe();
    };
  }, []);

  const router = useRouter();
  let setSavedPlaceList = [];
  let displaySavedPlacesList = [];
  let tempList = [];

  const { showUserCurrentLocation } = router.query;

  const onClickPickupLocation = (selectedLocation) => {
    setPickup(selectedLocation);
  };

  const onClickDropOffLocation = (selectedDropoffLocation) => {
    setDropoff(selectedDropoffLocation);
  };

  const getUsersCurrentLocation = () => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    var temp = navigator.geolocation.getCurrentPosition(success, error, options);

    function success(pos) {
      var crd = pos.coords;

      //below feth api call is a reverse geocoding[This is REVERSE GEO-CODING]
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${crd.longitude},${crd.latitude}.json?` +
          new URLSearchParams({
            access_token:
              "pk.eyJ1IjoiY29kZXIxOTk0IiwiYSI6ImNrdm12eHhhbzNpODQydm55M3RkYzQ0dnAifQ.4765hgdfnCSdO1LxiOYDdA",
            limit: 1,
          })
      )
        .then((response) => response.json())
        .then((data) => {
          setUserLocation(data.features[0].place_name);
        });
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

  };

  const onAddPickuptoList = () => {
    if (pickup && pickup.trim() !== "") {
      setSavedPlaceList = [...setSavedPlaceList, pickup];
    }
    if (userLocation && userLocation.trim() !== "") {
      setSavedPlaceList = [...setSavedPlaceList, userLocation];
    }
    addToFirebaseDB();
  };

  const onAddDropofftoList = () => {
    if (dropoff && dropoff.trim() !== "") {
      setSavedPlaceList = [...setSavedPlaceList, dropoff];
    }
    addToFirebaseDB();
  };

  const addToFirebaseDB = () => {
    let list = setSavedPlaceList.filter((item, index) => {
      return setSavedPlaceList.indexOf(item) == index;
    });
    addDoc(collection(db, "savedplaces"), {
      placeslist: list,
      userid: getAuth().currentUser.uid,
    });
    // db.collection("savedplaces").add({
    //   placeslist: list,
    //   userid: getAuth().currentUser.uid,
    // });
  };

  const onClickSavedPlaces = () => {
    setShowPlacesList((showPlacesList = !showPlacesList));
  };

  savedPlacelist.map((place) => {
    if (place.post.userid === getAuth().currentUser.uid) {
      tempList = [
        ...tempList,
        {
          id: place.id,
          post: {
            placeslist: [...place.post.placeslist],
            userid: place.post.userid,
          },
        },
      ];

      displaySavedPlacesList = [
        ...new Map(
          tempList.map((item) => [item["post"].placeslist[0], item])
        ).values(),
      ];
    }
  });

  const onDeleteClick = (data) => {
    let idForDeletingPlacesFromDB = [];
    savedPlacelist.map((item) => {
      item.post.placeslist.map((placeName) => {
        data.post.placeslist.map((dataVal) => {
          if (dataVal === placeName) {
            return (idForDeletingPlacesFromDB = [
              ...idForDeletingPlacesFromDB,
              item.id,
            ]);
          }
        });
      });
    });
    idForDeletingPlacesFromDB.map((entryId) => {
     // db.collection("savedplaces").doc(entryId).delete();
     deleteDoc(doc(db, "savedplaces", entryId));
    });
  };

  const onTypePickupLocation = (e) => {
    setUserLocation("");
    setPickup(e.target.value);
  };

  const onClickSavedPlace = (e) => {
    if (isPickupBlurred) {
      setPickup(e.target.innerText);
    } else if (isDropoffBlurred) {
      setDropoff(e.target.innerText);
    }
    else{
      alert("Please select pickup/dropoff")
    }
  };

  function onBlur(val) {
    if (val.target.id === "pickup-box") {
      setIsPickupBlurred(true); // this means pickup is blurred
      setIsDropoffBlurred(false); // and dropoff is focused
    } else if (val.target.id === "dropoff-box") {
      setIsDropoffBlurred(true);
      setIsPickupBlurred(false);
    }
  }

  return (
    <Wrapper>
      {/* button container */}
      <ButtonContainer>
        <Link href="/">
          <BackButton
            src="https://img.icons8.com/ios-filled/50/000000/left.png"
            alt="Back button"
            title="Go to home page"
          />
        </Link>
        {/* get auto location button */}
        {/* <GetUserCurrentLocationContainer> */}
        <GetUserCurrentLocation
          onClick={() => getUsersCurrentLocation()}
          title="Get current location"
        >
          Get Current Location
        </GetUserCurrentLocation>
        {/* </GetUserCurrentLocationContainer> */}
      </ButtonContainer>

      {/* input container */}
      <InputContainer>
        <FromToIcons>
          <Circle
            src="https://img.icons8.com/ios-filled/50/9CA3AF/filled-circle.png"
            alt="Filled circle"
          />
          <Line
            src="https://img.icons8.com/ios/50/9CA3AF/vertical-line.png"
            alt=""
          />
          <Square
            src="https://img.icons8.com/windows/50/000000/square-full.png"
            alt=""
          />
        </FromToIcons>
        <InputBoxes>
          {/* <Input
            type="text"
            placeholder="Enter pickup location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          /> */}
          <GeoCoderInput
            onClick={onClickPickupLocation.bind(this)}
            pickup={pickup || userLocation}
            onChange={(e) => onTypePickupLocation(e)}
            placeholder="Enter pickup location"
            inputValue={"pickup"}
            onBlur={onBlur.bind(this)}
          />
          {/* <Input
            type="text"
            placeholder="Enter drop location"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
          /> */}
          <GeoCoderInput
            onClick={onClickDropOffLocation.bind(this)}
            dropoff={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            placeholder="Enter drop-off location"
            inputValue={"dropoff"}
            onBlur={onBlur.bind(this)}
          />
        </InputBoxes>
      </InputContainer>
      <AddLocationToSavedPlacesContainer>
        <AddPickupLocationToSavedPlacesButton onClick={onAddPickuptoList}>
          Add pickup to list
        </AddPickupLocationToSavedPlacesButton>
        <AddDropoffLocationToSavedPlacesButton onClick={onAddDropofftoList}>
          Add dropoff to list
        </AddDropoffLocationToSavedPlacesButton>
      </AddLocationToSavedPlacesContainer>
      {/* <GeoCoderInput onClick={onClick.bind(this)}/> */}
      {/* <RoutingProfilesInputContainer>
        <TrafficMode onClick={()=>setRouteMode('driving-traffic')}>Traffic</TrafficMode>
        <DrivingMode onClick={()=>setRouteMode('driving')}>Driving</DrivingMode>
        <WalkingMode onClick={()=>setRouteMode('walking')}>Walking</WalkingMode>
        <CyclingMode onClick={()=>setRouteMode('cycling')}>Cycling</CyclingMode>
      </RoutingProfilesInputContainer> */}

      {/* saved places */}
      <SavedPlaces onClick={onClickSavedPlaces}>
        <StarIcon
          src="https://img.icons8.com/ios-filled/50/ffffff/star--v1.png"
          alt="Star icon"
        />{" "}
        Saved Places
      </SavedPlaces>
      {showPlacesList && (
        <SavedPlacesListContainer>
          {displaySavedPlacesList.map((item, index) => {
            return item.post.placeslist.map((placeName, index) => {
              return (
                <Fragment key={index}>
                  <SavedPlacesList key={index}>
                    <SavedPlacesListName onClick={(e) => onClickSavedPlace(e)}>
                      {placeName}
                    </SavedPlacesListName>
                    <SavedPlacesListDeleteIcon>
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: "rgb(79 83 86)", cursor: "pointer" }}
                        onClick={() => onDeleteClick(item)}
                      />
                    </SavedPlacesListDeleteIcon>
                  </SavedPlacesList>
                </Fragment>
              );
            });
          })}
        </SavedPlacesListContainer>
      )}

      {/* confirm location */}
      <Link
        href={{
          pathname: "/confirm",
          query: {
            pickuplocation: pickup,
            dropofflocation: dropoff,
            userLocation: userLocation ? userLocation : "",
          },
        }}
      >
        <ConfirmButtonContainer>
          <ConfirmButton
            className="confirm-pickup"
            disabled={!((!!pickup || !!userLocation) && !!dropoff)}
          >
            Confirm Location
          </ConfirmButton>
        </ConfirmButtonContainer>
      </Link>
    </Wrapper>
  );
};

export default Search;

//px -> it stands for padding on x-axis
//outline-none border-none -> to remove the border for input box
//active:bg-gray-300 --> adds background color to element when clicked over it
const Wrapper = tw.div`bg-gray-200 h-screen`;
const ButtonContainer = tw.div`flex bg-white px-4 items-center`;
const BackButton = tw.img`h-12 cursor-pointer`;
const GetUserCurrentLocationContainer = tw.div`bg-white`;
const GetUserCurrentLocation = tw.button`border-2 mx-1/2 p-1`;
const InputContainer = tw.div`bg-white flex items-center px-4 mb-2`;
const FromToIcons = tw.div`w-10 flex flex-col mr-2 items-center`;
const Circle = tw.img`h-2.5`;
const Line = tw.img`h-10`;
const Square = tw.img`h-3`;
const InputBoxes = tw.div`flex flex-col flex-1`;
const Input = tw.input`h-10 bg-gray-200 my-2 rounded-2 p-2 outline-none 
border-none`;
const PlusIcon = tw.img`w-10 h-10 bg-gray-200 rounded-full ml-3`;
// const RoutingProfilesInputContainer = tw.div`flex bg-white mb-2 rounded-full`;
// const TrafficMode = tw.span`flex-1 active:bg-gray-300 hover:bg-gray-200 rounded-full m-1 text-center cursor-pointer`;
// const DrivingMode = tw.span`flex-1 active:bg-gray-300 hover:bg-gray-200 rounded-full m-1 text-center cursor-pointer`;
// const WalkingMode = tw.span`flex-1 active:bg-gray-300 hover:bg-gray-200 rounded-full m-1 text-center cursor-pointer`;
// const CyclingMode = tw.span`flex-1 active:bg-gray-300 hover:bg-gray-200 rounded-full m-1 text-center cursor-pointer`;
const SavedPlaces = tw.div`flex items-center bg-white px-4 py-2 cursor-pointer`;
const StarIcon = tw.img`bg-gray-400 w-10 h-10 p-2 rounded-full mr-2`;
const ConfirmButtonContainer = tw.div`flex items-center justify-center`;
const ConfirmButton = tw.button`text-white w-100 bg-black text-center mt-2 mx-4 px-4 py-3
text-2xl cursor-pointer`;
const AddLocationToSavedPlacesContainer = tw.div`flex justify-center py-1`;
const AddPickupLocationToSavedPlacesButton = tw.button`p-2 w-30 mb-2 w-50 bg-white mx-2 py-1`;
const AddDropoffLocationToSavedPlacesButton = tw.button`p-2 w-30 mb-2 w-50 bg-white mx-2 py-1`;
const SavedPlacesListContainer = tw.div``;
const SavedPlacesList = tw.div`flex flex-row items-center justify-between bg-white p-2 border-2 border-solid border-gray-200 my-1`;
const SavedPlacesListName = tw.div`flex-1/2 cursor-pointer`
const SavedPlacesListDeleteIcon = tw.div`flex-1/2`
