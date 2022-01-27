import React, { FC, useState } from "react";
import { IChannel } from "../../interfaces";

interface props {
  channelsRef: any;
}

export const CreateChannel: FC<props> = ({ channelsRef }) => {
  const [name, setName] = useState("");

  const onSubmit = async () => {
    await channelsRef.add({
      name: name,
    } as Omit<IChannel, "id">);

    setName("");
  };

  return (
    <div className="col">
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {name && <button onClick={onSubmit}>Submit</button>}
    </div>
  );
};
