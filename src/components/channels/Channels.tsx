import React, {
  useContext,
  FC,
  useState,
  useEffect,
  createContext,
} from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Data } from "react-firebase-hooks/firestore/dist/firestore/types";
import { Context } from "../../App";
import { IChannel, IPost } from "../../interfaces";
import { Channel } from "./Channel";
import { CreateChannel } from "./CreateChannel";

export const ChannelContext = createContext({
  selectedChannel: {} as IChannel,
});

export const Channels: FC = () => {
  const { firestore } = useContext(Context);

  const channelsRef = firestore.collection("channels");
  const query = channelsRef;

  const [channels] = useCollectionData(query, {
    idField: "id",
  });

  const [selectedChannel, setSelectedChannel] = useState({} as IChannel);
  const [togleCreateChannel, setToggleCreateChannel] = useState(false);

  return (
    <main className="row centered shadow">
      <ChannelContext.Provider value={{ selectedChannel }}>
        <aside className="hiddenOverflow">
          <div className="row centered sp-btw">
            <h3>Channels</h3>
            <button onClick={() => setToggleCreateChannel(!togleCreateChannel)}>
              +
            </button>
          </div>
          {togleCreateChannel && <CreateChannel channelsRef={channelsRef} />}
          <div className="col">
            {channels &&
              channels.map((channel) => (
                <button
                  onClick={() => setSelectedChannel(channel as Data<IChannel>)}
                  key={channel.id}>
                  {channel.name}
                </button>
              ))}
          </div>
        </aside>
        <section className="hiddenOverflow">
          {selectedChannel.name && <Channel channel={selectedChannel} />}
        </section>
      </ChannelContext.Provider>
    </main>
  );
};
