import React, { FC } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import useService from "../../hooks/useService";
import { IPost } from "../../interfaces";
import { query, where } from "firebase/firestore";
import idConverter from "../../converters/id.converter";
import { Button } from "../layout/styles";

interface props {
  post: IPost;
}

export const DeletePost: FC<props> = ({ post }) => {
  const postsService = useService("posts");

  const onClick = async () => {
    await postsService.delete(post);
  };

  return <Button onClick={onClick}>Delete</Button>;
};
