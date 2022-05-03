import React from "react";
import tw from "tailwind-styled-components";
import Link from "next/link";

const Reserve = () => {
  return (
    <Wrapper>
      <ButtonContainer>
        <Link href="/">
          <BackButton
            src="https://img.icons8.com/ios-filled/50/000000/left.png"
            alt="Back Button"
          />
        </Link>
      </ButtonContainer>
      <TopPart>
        <TopImage
          src="https://static.vecteezy.com/system/resources/thumbnails/003/355/639/small/calendar-and-clock-icon-concept-of-schedule-appointment-free-vector.jpg"
          alt="Uber Reserbed"
        />
      </TopPart>
      <BottomPart>
        <BottomPartLine1>Uber Reserve</BottomPartLine1>
        <BottomPartLine2>
          Choose your exact pickup time upto 30 days in advance{" "}
        </BottomPartLine2>
        <BottomPartLine3>
          Extra wait time included to meet your ride
        </BottomPartLine3>
        <BottomPartLine4>
          Cancle at no charge upto 60mins in advance
        </BottomPartLine4>
      </BottomPart>
    </Wrapper>
  );
};

export default Reserve;

const Wrapper = tw.div`flex flex-col bg-gray-200 h-screen`;
const ButtonContainer = tw.div`rounded-full absolute z-10 top-4 left-4 bg-white shadow-md cursor-pointer`;
const BackButton = tw.img`h-full object-contain`;
const TopPart = tw.div`flex-1 m-auto`;
const TopImage = tw.img`h-80 w-screen object-contain`;
const BottomPart = tw.div`flex-1 leading-loose text-center`;
const BottomPartLine1 = tw.div`font-bold text-xl`;
const BottomPartLine2 = tw.div`m-8`;
const BottomPartLine3 = tw.div`m-8`;
const BottomPartLine4 = tw.div`m-8`;
