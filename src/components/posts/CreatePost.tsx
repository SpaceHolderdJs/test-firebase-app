import React, { useState, FC, useContext } from "react";
import { IPost } from "../../interfaces";

import { Context } from "../../App";
import { ChannelContext } from "../channels/Channels";

interface props {
  postsRef: any;
}

export const CreatePost: FC<props> = ({ postsRef }) => {
  const { user } = useContext(Context);
  const { selectedChannel } = useContext(ChannelContext);
  const [postData, setPostData] = useState({ subject: "", body: "" });

  const onSubmit = async () => {
    const { subject, body } = postData;
    const { uid, photoURL, displayName } = user;

    await postsRef.add({
      subject,
      body,
      userId: uid,
      userName: displayName,
      userPhoto: photoURL,
      channelId: selectedChannel.id,
    } as IPost);

    setPostData({ subject: "", body: "" });
  };

  return (
    <div className="col centered">
      <input
        type="text"
        placeholder="subject"
        onChange={(e) => setPostData({ ...postData, subject: e.target.value })}
        value={postData.subject}
      />
      <textarea
        placeholder="body"
        onChange={(e) => setPostData({ ...postData, body: e.target.value })}
        value={postData.body}
      />
      {postData.body && postData.subject && (
        <button onClick={onSubmit}>Submit</button>
      )}
    </div>
  );
};
