import React, { FC } from "react";
import { IChannel } from "../../interfaces";
import { Posts } from "../posts/Posts";

interface props {
  channel: IChannel;
}

export const Channel: FC<props> = ({ channel }) => {
  if (!channel) return <p>Please select channel</p>;

  return (
    <div className="col centered">
      <h3>{channel.name}</h3>
      <Posts channelId={channel.id} />
    </div>
  );
};
