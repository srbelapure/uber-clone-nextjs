import React, { useEffect } from "react";
import tw from "tailwind-styled-components";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

import { auth, provider } from "../firebase";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("user",user)
      if (user) {
        router.push("/");
      }
    });
  }, []);

  const onClickSignInWithGOogle=()=>{
    signInWithPopup(auth, provider)
    .then(result=>console.log(result))
    .catch(error=>console.log(error))
  }

  return (
    <Wrapper>
      <UberLogo src="https://i.ibb.co/n6LWQM4/Post.png" alt="Uber Logo" />
      <Title>Login to access your account</Title>
      <HeadImage
        src="https://i.ibb.co/CsV9RYZ/login-image.png"
        alt="Head Image for Uber"
      />
      <SignInButton onClick={onClickSignInWithGOogle}>
        Sign In With Google
      </SignInButton>
    </Wrapper>
  );
};

export default Login;

//self start <===> flex start
const Wrapper = tw.div`flex flex-col h-screen w-screen bg-gray-200 p-4 items-center`;
const UberLogo = tw.img`h-20 w-auto object-contain self-start`;
const HeadImage = tw.img`object-contain h-85 w-80`;
const SignInButton = tw.button`bg-black text-white text-center py-4 mt-8 self-center w-full`;
const Title = tw.div`text-5xl pt-4 text-gray-500`;
