import React, { useState } from "react";
import tw from "tailwind-styled-components";
import Link from "next/link";

import GeoCoderInput from './components/GeoCoderInput'

const Search = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [routemode, setRouteMode] = useState('')

  const onClickPickupLocation =(selectedLocation)=>{
    setPickup(selectedLocation)
  }

  const onClickDropOffLocation =(selectedDropoffLocation)=>{
    setDropoff(selectedDropoffLocation)
  }
  return (
    <Wrapper>
      {/* button container */}
      <ButtonContainer>
        <Link href="/">
          <BackButton
            src="https://img.icons8.com/ios-filled/50/000000/left.png"
            alt="Back button"
          />
        </Link>
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
          pickup={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="Enter pickup location"
          inputValue={'pickup'}
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
          inputValue={'dropoff'}
          />
        </InputBoxes>
        <PlusIcon
          src="https://img.icons8.com/ios/50/000000/plus-math.png"
          alt="Plus icon"
        />
      </InputContainer>
        {/* <GeoCoderInput onClick={onClick.bind(this)}/> */}
      <RoutingProfilesInputContainer>
        <TrafficMode onClick={()=>setRouteMode('driving-traffic')}>Traffic</TrafficMode>
        <DrivingMode onClick={()=>setRouteMode('driving')}>Driving</DrivingMode>
        <WalkingMode onClick={()=>setRouteMode('walking')}>Walking</WalkingMode>
        <CyclingMode onClick={()=>setRouteMode('cycling')}>Cycling</CyclingMode>
      </RoutingProfilesInputContainer>
      {/* saved places */}
      <SavedPlaces>
        <StarIcon
          src="https://img.icons8.com/ios-filled/50/ffffff/star--v1.png"
          alt="Star icon"
        />{" "}
        Saved Places
      </SavedPlaces>
      {/* confirm location */}
      <Link
        href={{
          pathname: "/confirm",
          query: {
            pickuplocation: pickup,
            dropofflocation: dropoff,
            routemode: routemode,
          },
        }}
      >
        <ConfirmButtonContainer>Confirm Location</ConfirmButtonContainer>
      </Link>
    </Wrapper>
  );
};

export default Search;

//px -> it stands for padding on x-axis
//outline-none border-none -> to remove the border for input box
//active:bg-gray-300 --> adds background color to element when clicked over it
const Wrapper = tw.div`bg-gray-200 h-screen`;
const ButtonContainer = tw.div`bg-white px-4`;
const BackButton = tw.img`h-12 cursor-pointer`;
const InputContainer = tw.div`bg-white flex items-center px-4 mb-2`;
const FromToIcons = tw.div`w-10 flex flex-col mr-2 items-center`;
const Circle = tw.img`h-2.5`;
const Line = tw.img`h-10`;
const Square = tw.img`h-3`;
const InputBoxes = tw.div`flex flex-col flex-1`;
const Input = tw.input`h-10 bg-gray-200 my-2 rounded-2 p-2 outline-none 
border-none`;
const PlusIcon = tw.img`w-10 h-10 bg-gray-200 rounded-full ml-3`;
const RoutingProfilesInputContainer = tw.div`flex bg-white mb-2 rounded-full`;
const TrafficMode = tw.span`flex-1 active:bg-gray-300 hover:bg-gray-200 rounded-full m-1 text-center cursor-pointer`;
const DrivingMode = tw.span`flex-1 active:bg-gray-300 hover:bg-gray-200 rounded-full m-1 text-center cursor-pointer`;
const WalkingMode = tw.span`flex-1 active:bg-gray-300 hover:bg-gray-200 rounded-full m-1 text-center cursor-pointer`;
const CyclingMode = tw.span`flex-1 active:bg-gray-300 hover:bg-gray-200 rounded-full m-1 text-center cursor-pointer`;
const SavedPlaces = tw.div`flex items-center bg-white px-4 py-2`;
const StarIcon = tw.img`bg-gray-400 w-10 h-10 p-2 rounded-full mr-2`;
const ConfirmButtonContainer = tw.div`text-white bg-black text-center mt-2 mx-4 px-4 py-3
text-2xl cursor-pointer`;
