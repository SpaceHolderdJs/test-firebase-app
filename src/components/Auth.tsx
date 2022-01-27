import firebase from "firebase/app";
import React, { FC } from "react";

interface props {
  auth: any;
}

export const Auth: FC<props> = ({ auth }) => {
  const singInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <div className="col centered">
      <h1>Please login</h1>
      <button onClick={singInWithGoogle}>Singn in with Google</button>
    </div>
  );
};
