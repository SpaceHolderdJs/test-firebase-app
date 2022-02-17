import { styled } from "@stitches/react";
import React, { useContext } from "react";
import { Channels } from "../channels/Channels";
import { Inbox } from "../Inbox";

import { MainContext } from "./Main";
import { Column } from "./styles";

const StyledAside = styled(Column, {
  justifyContent: "flex-start !important",
  overflow: "auto",
  border: "2px solid black",
});

export const Aside = () => {
  const { setActiveTab } = useContext(MainContext);

  return (
    <StyledAside
      w={20}
      h={100}
      alignItems={"start"}
      className={`hiddenOverflow `}>
      <Column w={100} alignItems={"start"} p={30}>
        <Inbox state={"closed"} onActivate={() => setActiveTab("inbox")} />
        <Channels />
      </Column>
    </StyledAside>
  );
};
