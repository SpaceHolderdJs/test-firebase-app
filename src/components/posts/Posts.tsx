import React, { useContext, FC, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Data } from "react-firebase-hooks/firestore/dist/firestore/types";
import { Context } from "../../App";
import { IPost } from "../../interfaces";
import { CreatePost } from "./CreatePost";
import { Post } from "./Post";

interface props {
  channelId: string;
}

export const Posts: FC<props> = ({ channelId }) => {
  const { firestore } = useContext(Context);

  const postsRef = firestore.collection("posts");
  const query = channelId
    ? postsRef.where("channelId", "==", channelId)
    : postsRef;

  const [posts] = useCollectionData(query, { idField: "id" });
  const [toggleCreatePost, setToggleCreatePost] = useState(false);

  return (
    <div className="posts col centered">
      <div className="row centered sp-btw">
        <h3>Posts</h3>
        <button onClick={() => setToggleCreatePost(!toggleCreatePost)}>
          Add Post
        </button>
      </div>
      {toggleCreatePost && <CreatePost postsRef={postsRef} />}
      {posts &&
        posts.map((post) => <Post post={post as Data<IPost>} key={post.id} />)}
    </div>
  );
};
