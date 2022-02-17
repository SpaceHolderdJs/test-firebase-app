import { query, where } from "firebase/firestore";
import { KBarProvider } from "kbar";
import React, { useContext, FC, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Context } from "../../App";
import idConverter from "../../converters/id.converter";
import useService from "../../hooks/useService";
import { IPost } from "../../interfaces";
import { Loader } from "../layout/Loader";
import { MainContext } from "../layout/Main";
import { Column } from "../layout/styles";
import { Post } from "./Post";

interface props {
  channelId?: string;
  postsToShow?: IPost[];
}

export const Posts: FC<props> = ({ channelId, postsToShow }) => {
  const { orgTempId } = useContext(Context);
  const postsService = useService("organization").posts(orgTempId, channelId);

  const actions = [
    {
      id: "close",
      name: "Close post",
      shortcut: ["alt", "b"],
      keywords: "close post",
      perform: () => {
        setActivePost(null);
      },
    },
  ];

  const [activePost, setActivePost] = useState<IPost | null>();

  const q = query(
    postsService.ref,
    where("replicationId", "==", "")
  ).withConverter(idConverter);

  const [posts, postsLoading] = useCollectionData(q);

  if (!postsToShow && postsLoading) return <Loader size={50} />;

  if (activePost) {
    return (
      <Column w={100} h={100} positioning={"centered"}>
        <KBarProvider actions={actions as any}>
          <Post
            post={activePost as IPost}
            setActivePost={setActivePost}
            isCollapsed={false}
          />
        </KBarProvider>
      </Column>
    );
  }

  return (
    <Column w={100} h={100} positioning={"centered"}>
      <KBarProvider actions={actions as any}>
        {!postsToShow
          ? posts?.map((post) => (
              <Post
                post={post as IPost}
                setActivePost={setActivePost}
                key={post.id}
              />
            ))
          : postsToShow.map((post) => (
              <Post
                post={post as IPost}
                setActivePost={setActivePost}
                key={post.id}
              />
            ))}
      </KBarProvider>
    </Column>
  );
};
