import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import React, { FC } from "react";
import { Button, Column } from "./layout/styles";
import { IUserData } from "../interfaces";
import useService from "../hooks/useService";

export const Auth: FC = () => {
  const userDataService = useService("userData").default;

  const singInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    const { user } = res;

    if (user) {
      const userData: any = await userDataService.getOne(user.uid);

      const { displayName, photoURL, email } = user;

      console.log(user);

      !userData &&
        (await userDataService.add(
          {
            name: displayName,
            avatarUrl: photoURL,
            email,
          } as Omit<IUserData, "id">,
          user.uid
        ));
    }
  };

  return (
    <Column positioning={"centered"}>
      <h1>Please login</h1>
      <Button onClick={singInWithGoogle}>Singn in with Google</Button>
    </Column>
  );
};
