import React, { FC } from "react";
import { IComment } from "../../interfaces";
import { UserPresent } from "../UserPresent";

interface props {
  comment: IComment;
}

export const Comment: FC<props> = ({ comment }) => {
  const { text, userName, userPhoto } = comment;

  return (
    <div className="row centered comment">
      <UserPresent
        user={{ name: userName, photoUrl: userPhoto }}
        isSmall={true}
      />
      <p>{text}</p>
    </div>
  );
};
