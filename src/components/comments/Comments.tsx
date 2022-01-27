import React, { createContext, useContext, FC, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Context } from "../../App";
import { IComment } from "../../interfaces";
import { CreateComment } from "./CreateComment";
import { Comment } from "./Comment";
import { Data } from "react-firebase-hooks/firestore/dist/firestore/types";

export const CommentsContext = createContext({} as any);

interface props {
  postId: string;
}

export const Comments: FC<props> = (postId) => {
  const { firestore } = useContext(Context);

  const commentsRef = firestore.collection("comments");

  const query = postId
    ? commentsRef.where("postId", "==", postId)
    : commentsRef;

  const [comments] = useCollectionData(query, {
    idField: "id",
  });

  const [toggleCreateComment, setToggleCreateComment] = useState(false);

  console.log("comments", comments);

  return (
    <div className="col centered comments">
      <CommentsContext.Provider value={{ postId }}>
        <button onClick={() => setToggleCreateComment(!toggleCreateComment)}>
          Add comment
        </button>
        {toggleCreateComment && (
          <CreateComment postId={postId as any} commentsRef={commentsRef} />
        )}

        {comments &&
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment as Data<IComment>} />
          ))}
      </CommentsContext.Provider>
    </div>
  );
};
