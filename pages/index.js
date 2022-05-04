import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import tw from "tailwind-styled-components";
import Link from "next/link";

import Map from "./components/Map";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "@firebase/auth";
import { useRouter } from "next/router";

export default function Home() {
  const [user, setUser] = useState(null);
  const [showUserCurrentLocation, setShowUserCurrentLocation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          name: user.displayName,
          photourl: user.photoUrl,
        });
      } else {
        setUser(null);
        router.push("/login");
      }
    });
  }, []);

  return (
    <Wrapper>
      <Map />
      <ActionItems>
        {/* header */}
        <Header>
          <UberLogo
            src="https://i.ibb.co/84stgjq/uber-technologies-new-20218114.jpg"
            alt="Uber Logo"
          />
          <Profile>
            <Name>{user && user.name}</Name>
            <UserImage
              src={
                user && user.photoUrl
                  ? user.photoUrl
                  : "data:image/png;base64,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"
              }
              alt="User Image"
              onClick={() => signOut(auth)}
            />
          </Profile>
        </Header>
        {/* action buttons */}
        <ActionButtons>
          <Link href="/search">
            <ActionButton>
              <ActionButtonImage
                src="https://i.ibb.co/cyvcpfF/uberx.png"
                alt="Ride image"
              />
              Ride
            </ActionButton>
          </Link>
          <ActionButton>
            <ActionButtonImage
              src="https://i.ibb.co/n776JLm/bike.png"
              alt="Wheels image"
            />
            Wheels
          </ActionButton>
          <Link href="/reserve">
            <ActionButton>
              <ActionButtonImage
                src="https://i.ibb.co/5RjchBg/uberschedule.png"
                alt="Reserved image"
              />
              Reserved
            </ActionButton>
          </Link>
        </ActionButtons>
        {/* input button */}
        <Link
          // href="/search"
          href={{
            pathname: "/search",
          }}
        >
          <InputButton onClick={() => setShowUserCurrentLocation(true)}>
            Where to?
          </InputButton>
        </Link>
      </ActionItems>
    </Wrapper>
  );
}

// h-screen is equivalent to height = 100vh
const Wrapper = tw.div`flex flex-col h-screen`;
const ActionItems = tw.div`flex-1 p-2`;
const Header = tw.div`flex justify-between items-center`;
const UberLogo = tw.img`h-28`;
const Profile = tw.div`flex items-center`;
const Name = tw.div`mr-4 w-15 text-sm`;
const UserImage = tw.img`h-10 w-10 rounded-full border-gray-200 p-px cursor-pointer`;
const ActionButtons = tw.div`flex`;
const ActionButton = tw.div`bg-gray-200 mx-2.5 h-32 flex flex-col flex-1
items-center justify-center rounded-lg hover:bg-gray-300 text-xl cursor-pointer`;
const ActionButtonImage = tw.img`h-3/5`;
const InputButton = tw.div`h-20 bg-gray-200 text-2xl p-4 flex items-center mt-8`;
