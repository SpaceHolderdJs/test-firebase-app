import React, { FC, useContext } from "react";
import {
  useCollectionData,
  useDocument,
  useDocumentData,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import useService from "../hooks/useService";
import { Post } from "./posts/Post";
import { doc, query } from "firebase/firestore";
import { Context } from "../App";

import { Column, Row } from "./layout/styles";
import { IPost, IUserData, permissions } from "../interfaces";
import idConverter from "../converters/id.converter";
import { firestore } from "../firebase";
import { styled } from "@stitches/react";

interface props {
  state: string;
  onActivate?: any;
}

const StyledBadge = styled("span", {
  width: "25px",
  height: "25px",
  borderRadius: "50%",
  background: "#FF0000",
  color: "white",
  textAlign: "center",
});

export const Inbox: FC<props> = ({ state, onActivate }) => {
  const { user } = useContext(Context);

  const userInboxService = useService("userData").inbox(user.uid);
  const userInboxQ = query(userInboxService.ref).withConverter(idConverter);
  const [userInbox] = useCollectionData<any>(userInboxQ);

  console.log("userInbox", userInbox);

  const actualPosts = userInbox?.sort(
    (p1: any, p2: any) =>
      p2.requests?.includes(user.uid) - p1.requests?.includes(user.uid)
  );

  if (state === "closed")
    return (
      <Row w={50} justifyContent={"space-between"} onClick={onActivate}>
        <h3>Inbox - </h3>
        {actualPosts?.length ? (
          <StyledBadge>{actualPosts?.length}</StyledBadge>
        ) : (
          <span>...</span>
        )}
      </Row>
    );

  return (
    <Column w={100} positioning="centered">
      <h3>Inbox</h3>
      {!actualPosts?.length && <h2>Congrats!🎉 You have reached inbox 0!</h2>}
      {actualPosts &&
        actualPosts.map((post: any) => (
          <Post key={post.id} post={post as any} isInbox={true} />
        ))}
    </Column>
  );
};
