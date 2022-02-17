import { styled } from "@stitches/react";
import React, { FC, useContext } from "react";
import { IChannel, permissions } from "../../interfaces";
import { Column, Row } from "../layout/styles";
import { Posts } from "../posts/Posts";
import { Context } from "../../App";
import useService from "../../hooks/useService";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import idConverter from "../../converters/id.converter";
import { doc } from "firebase/firestore";
import { Select } from "antd";

interface props {
  channel: IChannel;
}

const StyledChannel = styled(Column, {
  alignItems: "center",

  h1: {
    width: "90%",
  },

  ".option": {
    background: "grey !important",
  },
});

export const Channel: FC<props> = ({ channel }) => {
  const { name, id } = channel;
  const { user } = useContext(Context);

  const userDataService = useService("userData").default;
  const userDataRef = doc(userDataService.ref, user.uid);
  const [userData] = useDocumentData<any>(
    userDataRef.withConverter(idConverter)
  );

  const userDataChannelsService = useService("userData").channels(user.uid);
  const channelDataRef = doc(userDataChannelsService.ref, id);
  const [channelData] = useDocumentData<any>(
    channelDataRef.withConverter(idConverter)
  );

  const channelPermission =
    (channelData && channelData.permission) || permissions.onlyWhenMentioned;

  const onChangePermission = async (value: any) => {
    userDataChannelsService.update({
      ...channelData,
      permission: value,
    });
  };

  if (!channel) return <p>Please select channel</p>;

  return (
    <StyledChannel w={100}>
      <h1>#{channel.name}</h1>
      <Row w={90} positioning={"sp-btw"}>
        <span>Notifications: </span>
        <Select value={channelPermission} onChange={onChangePermission}>
          {Object.values(permissions).map((p: string, indx) => (
            <Select.Option key={p} value={p}>
              {p}
            </Select.Option>
          ))}
        </Select>
      </Row>
      <Posts channelId={channel.id} />
    </StyledChannel>
  );
};
