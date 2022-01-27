import React, { FC, useState, useContext } from "react";

import { Context } from "../../App";
import { IComment } from "../../interfaces";

interface props {
  postId: string;
  commentsRef: any;
}

export const CreateComment: FC<props> = ({ postId, commentsRef }) => {
  const [text, setText] = useState("");

  const { user } = useContext(Context);

  const onSubmit = async () => {
    const { uid, photoURL, displayName } = user;

    await commentsRef.add({
      postId,
      text,
      userId: uid,
      userPhoto: photoURL,
      userName: displayName,
    } as Omit<IComment, "id">);

    setText("");
  };

  return (
    <div className="col centered">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}></textarea>
      {text && <button onClick={onSubmit}>Submit</button>}
    </div>
  );
};
