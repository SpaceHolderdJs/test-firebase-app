import React, { useContext } from "react";
import { Channel } from "../channels/Channel";
import { Inbox } from "../Inbox";
import { MainContext } from "./Main";
import { IChannel } from "../../interfaces";

import { Column } from "./styles";
import { styled } from "@stitches/react";

const StyledSection = styled(Column, {
  overflow: "auto",
});

export const Section = () => {
  const { activeTab } = useContext(MainContext);

  return (
    <StyledSection w={80} className="hiddenOverflow">
      {typeof activeTab !== "string" ? (
        <Channel channel={activeTab} />
      ) : (
        <Inbox state="opened" />
      )}
    </StyledSection>
  );
};
