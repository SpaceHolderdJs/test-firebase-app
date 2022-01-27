import React, { createContext, useReducer } from "react";
import "./App.scss";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Auth } from "./components/Auth";
import { Posts } from "./components/posts/Posts";
import { Channels } from "./components/channels/Channels";
import { UserPresent } from "./components/UserPresent";

firebase.initializeApp({
  apiKey: "AIzaSyCt-pfmXXqty4q-1YwzNKqZo7Q7kAHqyJA",
  authDomain: "test-firebase-project-c38bd.firebaseapp.com",
  projectId: "test-firebase-project-c38bd",
  storageBucket: "test-firebase-project-c38bd.appspot.com",
  messagingSenderId: "855018799518",
  appId: "1:855018799518:web:360c3948fe05346974168f",
  measurementId: "G-66Q11WF63V",
});

const auth = firebase.auth();

const firestore = firebase.firestore();

export const Context = createContext({} as any);

function App() {
  const [user] = useAuthState(auth as any);
  console.log("user", user);

  if (!user) return <Auth auth={auth} />;

  return (
    <div className="App col centered">
      <Context.Provider value={{ user, firestore }}>
        <header className="row centered shadow sp-btw">
          {user && (
            <UserPresent
              user={{ name: user.displayName, photoUrl: user.photoURL }}
            />
          )}
          {user && <button onClick={() => auth.signOut()}>Logout</button>}
        </header>
        <Channels />
      </Context.Provider>
    </div>
  );
}

export default App;
