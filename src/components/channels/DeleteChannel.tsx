import React, { FC, useContext } from "react";
import useService from "../../hooks/useService";
import { IChannel } from "../../interfaces";
import { Button } from "../layout/styles";
import { MainContext } from "../layout/Main";

interface props {
  channel: IChannel;
}

export const DeleteChannel: FC<props> = ({ channel }) => {
  const channelsService = useService("channels");

  const { setActiveTab } = useContext(MainContext);

  const onClick = async () => {
    await channelsService.delete(channel);
    setActiveTab("inbox");
  };

  return <Button onClick={onClick}>Delete</Button>;
};
