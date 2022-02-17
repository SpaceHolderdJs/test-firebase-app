import React, { useContext } from "react";
import { Context } from "../../App";
import { UserPresent } from "../UserPresent";
import { auth } from "../../firebase";

import { Button, Row } from "./styles";
import { styled } from "@stitches/react";

const StyledHeader = styled(Row, {
  background: "black",
  color: "white !important",
});

export const Header = () => {
  const { user } = useContext(Context);

  return (
    <StyledHeader w={100} h={10} positioning={"centered"}>
      <Row w={90} positioning={"sp-btw"}>
        {user && (
          <UserPresent
            user={{ name: user.displayName, photoUrl: user.photoURL }}
          />
        )}
        {user && <Button onClick={() => auth.signOut()}>Logout</Button>}
      </Row>
    </StyledHeader>
  );
};
