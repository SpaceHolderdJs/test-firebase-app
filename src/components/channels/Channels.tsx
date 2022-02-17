import React, { FC, useState, useContext, useEffect } from "react";
import { MainContext } from "../layout/Main";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { IChannel, IPost } from "../../interfaces";
import { Channel } from "./Channel";
import { CreateChannel } from "./CreateChannel";
import { DeleteChannel } from "./DeleteChannel";
import useService from "../../hooks/useService";
import { query } from "firebase/firestore";
import idConverter from "../../converters/id.converter";

import { Button, Column, Row } from "../layout/styles";
import { Context } from "../../App";
import { styled } from "@stitches/react";

const StyledChannels = styled(Column, {
  ".activeChannel": {
    fontWeight: "700",
  },

  span: {
    cursor: "pointer",
  },

  h3: {
    fontWeight: "700",
  },
});

export const Channels: FC = () => {
  const { user } = useContext(Context);
  const userChannelsService = useService("userData").channels(user.uid);
  const q = query(userChannelsService.ref).withConverter(idConverter);

  const [channels] = useCollectionData(q);

  const { activeTab, setActiveTab } = useContext(MainContext);

  return (
    <StyledChannels w={100} className={`hiddenOverflow `}>
      <Row w={90} positioning="sp-btw">
        <h3>Channels</h3>
      </Row>
      <Column w={90} positioning="centered">
        {channels &&
          channels?.map((channel: any) => (
            <Row
              w={100}
              m={5}
              positioning={"sp-btw"}
              key={channel.id}
              className={channel.id === activeTab?.id ? "activeChannel" : ""}>
              <span onClick={() => setActiveTab(channel as IChannel)}>
                # {channel.name}
              </span>
              {/* <DeleteChannel channel={channel as IChannel} /> */}
            </Row>
          ))}
      </Column>
    </StyledChannels>
  );
};
