import React,{useState,useEffect} from "react";
import tw from "tailwind-styled-components";

import { carList } from "../data/carList";

const RideSelector = (props) => {
    //number of seconds for ride(from source to destination) * multiplier key based on car type selected
    const [rideduration,setRideDuration] =useState(0)
    const [rideprice, setRidePrice] = useState(0)

    //get the ride duration from mapbox API. To do this it needs a pickup and dropoff coordinates
    // ` is called a template literal. TO concatenate variables with string
    //this API returns all the possible routes between specified points A and B. Here we consoder only [0] 1st route
    useEffect(() => {
        rideduration = fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/
        ${props.pickUpCoordinates[0]},${props.pickUpCoordinates[1]};
        ${props.dropoffCoordinates[0]},${props.dropoffCoordinates[1]}
        ?access_token=pk.eyJ1IjoiY29kZXIxOTk0IiwiYSI6ImNrdm12eHhhbzNpODQydm55M3RkYzQ0dnAifQ.4765hgdfnCSdO1LxiOYDdA`)
        .then(res=> res.json())
        .then(data =>{
            if(data.routes && data.routes[0] && data.routes[0].duration){
                setRideDuration(data.routes[0].duration/100)
            }
            //duration is in seconds
            // divide by 100 is just for representation purpose. Because ex: if we get 24,000 as a value then we can display 240$ instead of 24,000$
        })
        setRidePrice()
    }, [props.pickUpCoordinates,props.dropoffCoordinates]) // call use effect everytime co-ordinates change
  return (
    <Wrapper>
      {/* car list */}
      <Title>Choose a ride or swipe up for more</Title>
      <CarList>
        {carList.map((item,index) => {
          return (
            <Car key={index} onClick={()=>props.onClick(item,rideduration)}>
              <CarImage src={item.imageUrl} alt={item.service}/>
              <CarDetails>
                <Service>{item.service}</Service>
                <Time>{item.minsaway}</Time>
              </CarDetails>
              <CarPrice>{'$' + (rideduration * item.multiplier).toFixed(2)}</CarPrice>
              {/* toFixed(2) ---> 2 decimal places */}
            </Car>
          );
        })}
      </CarList>
    </Wrapper>
  );
};

export default RideSelector;

const Wrapper = tw.div`flex flex-col flex-1 overflow-y-scroll`;
const Title = tw.div`text-gray-500 text-xs text-center py-2 border-b`;
const CarList = tw.div`overflow-y-scroll`;
const Car = tw.div`flex p-4 items-center cursor-pointer hover:bg-gray-200`;
const CarImage = tw.img`h-14 mr-4`;
const CarDetails = tw.div`flex-1`;
const Service = tw.div`font-medium`;
const Time = tw.div`text-xs text-blue-500`;
const CarPrice = tw.div`text-xs`;
