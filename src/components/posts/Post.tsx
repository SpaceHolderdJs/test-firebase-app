import React, { FC, useState } from "react";
import { IPost } from "../../interfaces";
import { Comments } from "../comments/Comments";
import { UserPresent } from "../UserPresent";

interface props {
  post: IPost;
}

export const Post: FC<props> = ({ post }) => {
  const { subject, body, userName, userPhoto, id } = post;
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="post column">
      <UserPresent user={{ name: userName, photoUrl: userPhoto }} />

      <h3>{subject}</h3>
      <p>{body}</p>

      <button onClick={() => setShowComments(!showComments)}>
        Show comments
      </button>

      {showComments && <Comments postId={id} />}
    </div>
  );
};
