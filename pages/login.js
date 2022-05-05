import React, { useEffect,useState } from "react";
import tw from "tailwind-styled-components";
import { useRouter } from "next/dist/client/router";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form'

import { auth, provider, authWithEmail} from "../firebase";
import {signInWithPopup , createUserWithEmailAndPassword, signInWithEmailAndPassword,updateProfile ,onAuthStateChanged } from "firebase/auth";

const Login = () => {
  const [openLogin, setOpenLogin] = useState(false); // to open and close Sign in modal
  const [openSignUp, setOpenSignUp] = useState(false); // to open and close Sign in modal
  const [username, setUsername] = useState(""); // state for username field while logging in
  const [password, setPassword] = useState(""); // state for password field while logging in
  const [email, setEmail] = useState(""); // state for email field while logging in
  const [user, setUser] = useState(null); // To keep track of user we use this state (logged-in user)
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
  }, []);

  useEffect(() => {
    // const unsubscribe = authWithEmail.onAuthStateChanged((authUser) => {
    //   if (authUser) {
    //     //if user has logged inn
    //     setUser(authUser);
    //   } else {
    //     // if user has loggedd out
    //     setUser(null); // if user logs out set user to null
    //   }
    // });
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        //if user has logged inn
        setUser(authUser);
      } else {
        // if user has loggedd out
        setUser(null); // if user logs out set user to null
      }
    });
    return () => {
      // whenever changes occue this hook is refired, but before that clean-up the existing case and then re-trigger
      unsubscribe();
    };
  }, [user, username]); // user,username => because everytime values change we need to trigger the useEffect hook


  const onClickSignInWithGOogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };

  const onLoginWithEmail = () => {
    setOpenLogin(true);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const onSignUpWithEmail = () => {
    setOpenSignUp(true);
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const onSignIn = (e) => {
    e.preventDefault();
    // authWithEmail
    //   .signInWithEmailAndPassword(email, password)
    //   .catch((error) => alert(error.message));
    signInWithEmailAndPassword(auth,email,password)
    .catch((error) => alert(error.message));
    setOpenLogin(false);
  };

  const onSignUp = (e) => {
    e.preventDefault();
    // authWithEmail
    //   .createUserWithEmailAndPassword(email, password) // email,password -> these are values from state
    //   .then((authUser) => {
    //     return authUser.user.updateProfile({
    //       displayName: username, //when user is created then add the username value to displayName attribute
    //     });
    //   })
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        return updateProfile(auth.currentUser, {
          displayName: username, //when user is created then add the username value to displayName attribute
        });
      })
      // .then(() => {
      //   router.push("/");
      // })
      .catch((error) => alert(error.message));
    setOpenSignUp(false);
  };

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
      <WithEmailContainer>
        <LoginWithEmail onClick={onLoginWithEmail}>
          Login With Email
        </LoginWithEmail>
        <SignUpWithEmail onClick={onSignUpWithEmail}>
          Sign Up With Email
        </SignUpWithEmail>
      </WithEmailContainer>

      <Modal show={openLogin} onHide={() => setOpenLogin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="with-email-form" onSubmit={onSignIn}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="secondary" style={{width:'30%',margin:'0px auto'}}>
              Login
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal show={openSignUp} onHide={() => setOpenSignUp(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="with-email-form" onSubmit={onSignUp}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>User name</Form.Label>
              <Form.Control
                type="username"
                placeholder="Enter user-name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="secondary" style={{width:'30%',margin:'0px auto'}}>
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
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
const WithEmailContainer = tw.div`flex w-full`
const LoginWithEmail = tw.button`flex-1 bg-black text-white text-center pt-4 pb-4 mt-8 mb-8 mr-8`;
const SignUpWithEmail = tw.button`flex-1 bg-black text-white text-center pt-4 pb-4 mt-8 mb-8`;
