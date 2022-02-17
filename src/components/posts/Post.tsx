import React, { FC, useState, useContext, useEffect, useRef } from "react";
import { styled } from "@stitches/react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import useService from "../../hooks/useService";
import { IPost, IUserData } from "../../interfaces";
import { Button, Column, HorizontalStyledSection, Row } from "../layout/styles";
import { UserPresent } from "../UserPresent";
import { DeletePost } from "./DeletePost";
import { Context } from "../../App";
import idConverter from "../../converters/id.converter";
import { doc, query, where } from "firebase/firestore";
import { DateSpan } from "../DateSpan";
import detectMention from "../../mentions/detectMention";
import { Checkbox, Divider } from "antd";
import { CreatePost } from "./CreatePost";

import { UpOutlined, DownOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { KBarProvider } from "kbar";

interface props {
  post: IPost;
  isCollapsed?: boolean;
  isInbox?: boolean;
  setActivePost?: any;
}

const StyledPost = styled(Column, {
  boxSizing: "border-box",
  h3: {
    width: "100%",
  },

  p: {
    width: "100%",
  },

  ".prev": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%",
  },

  ".channelName": {
    color: "grey",
    fontSize: "11px",
  },

  ".divider": {
    borderTop: "2px solid black",
  },
});

export const Post: FC<props> = ({
  post,
  isInbox = false,
  isCollapsed = true,
  setActivePost,
}) => {
  const { orgTempId, userChannelsData, usersData } = useContext(Context);
  const {
    subject,
    body,
    userName,
    userPhoto,
    id,
    requests,
    channelId,
    date,
    replicationId,
  } = post;

  const actions = [
    {
      id: "reply",
      name: "Reply on post",
      shortcut: ["enter"],
      keywords: "reply on post",
      perform: () => {
        setShowReply(true);
      },
    },
  ];

  const channelOfPost = userChannelsData?.find(
    (channel: any) => channel.id === channelId
  );

  const postsService = useService("organization").posts(orgTempId, channelId);

  const q = !replicationId
    ? query(postsService.ref, where("replicationId", "==", id)).withConverter(
        idConverter
      )
    : null;

  const [relatedPosts] = useCollectionData(q);

  const [toggleMore, setToggleMore] = useState<boolean>(false);
  const [showMentions, setShowMentions] = useState<boolean>(false);
  const [showReply, setShowReply] = useState<boolean>(false);

  const { user } = useContext(Context);

  detectMention(body);

  const [requestsData, setRequestsData] = useState<IUserData[]>([]);

  useEffect(() => {
    requests && initRequestsData(requests);
  }, [requests]);

  const initRequestsData = async (requests: string[]) => {
    const requestsData = await Promise.all(
      requests.map((userDataId) => userDataService.getOne(userDataId))
    );

    setRequestsData(requestsData as any);
  };

  const userDataService = useService("userData").default;

  const userDataRef = doc(userDataService.ref, user.uid);

  const [userData] = useDocumentData<any>(
    userDataRef.withConverter(idConverter)
  );

  const userInboxService = useService("userData").inbox(user.uid);

  const onDone = async () => {
    await userInboxService.delete(post);
  };

  const mentionLabel = post?.requests?.includes(user.uid) ? (
    <Row className="mention" w={30} h={90} positioning={"centered"}>
      Response Requested
    </Row>
  ) : (
    ""
  );

  if (replicationId)
    return (
      <StyledPost w={100} p={5}>
        <KBarProvider actions={actions as any}>
          {isInbox && <Checkbox defaultChecked={false} onChange={onDone} />}
          <Row
            p={5}
            w={100}
            positioning={"sp-btw"}
            className="divider"
            onClick={() => setToggleMore(!toggleMore)}>
            <Row alignItems={"center"} w={20} positioning={"sp-btw"}>
              <UserPresent
                user={{ name: userName, photoUrl: userPhoto }}
                isSmall={true}
              />
              <Column
                m={5}
                onClick={() => setShowMentions(!showMentions)}
                flexDirection={showMentions ? "column-reverse" : "column"}>
                <UpOutlined />
                <DownOutlined />
              </Column>
            </Row>

            <span className="prev">{subject}</span>
            {mentionLabel}
            <DateSpan date={date} isShort={false} />
          </Row>

          {showMentions && (
            <Column w={100}>
              <HorizontalStyledSection w={100} alignItems={"center"}>
                Mentions:{" "}
                {post.mentions
                  .map((memberId: string) =>
                    usersData?.find(
                      (userData: IUserData) => userData.id === memberId
                    )
                  )
                  .map((userData: IUserData) => (
                    <UserPresent
                      key={"m" + userData.id}
                      isMention={true}
                      user={{
                        name: userData.name,
                        photoUrl: userData.avatarUrl,
                      }}
                    />
                  ))}
              </HorizontalStyledSection>
              <HorizontalStyledSection w={100} alignItems={"center"}>
                Requests:{" "}
                {post.requests
                  .map((memberId: string) =>
                    usersData?.find(
                      (userData: IUserData) => userData.id === memberId
                    )
                  )
                  .map((userData: IUserData) => (
                    <UserPresent
                      key={"m" + userData.id}
                      isMention={true}
                      user={{
                        name: userData.name,
                        photoUrl: userData.avatarUrl,
                      }}
                    />
                  ))}
              </HorizontalStyledSection>
            </Column>
          )}

          <p dangerouslySetInnerHTML={{ __html: detectMention(body) }}></p>
        </KBarProvider>
      </StyledPost>
    );

  if (isCollapsed)
    return (
      <StyledPost
        w={100}
        p={5}
        positioning={"centered"}
        style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}
        onClick={() => setActivePost(post)}>
        <KBarProvider actions={actions as any}>
          <Row
            w={90}
            positioning={"sp-btw"}
            onClick={() => setToggleMore(!toggleMore)}>
            <Row alignItems={"center"} w={20} positioning={"sp-btw"}>
              {isInbox && <Checkbox defaultChecked={false} onChange={onDone} />}
              <UserPresent
                user={{ name: userName, photoUrl: userPhoto }}
                isSmall={true}
              />
            </Row>
            <Column w={30}>
              <span className="channelName">#{channelOfPost?.name}</span>
              <span className="prev">{subject}</span>
            </Column>
            {mentionLabel}
            <DateSpan date={date} isShort={true} />
          </Row>
        </KBarProvider>
      </StyledPost>
    );

  return (
    <StyledPost w={90} positioning="centered">
      <Row w={100} justifyContent={"start"} onClick={() => setActivePost(null)}>
        <ArrowLeftOutlined />
      </Row>
      <KBarProvider actions={actions as any}>
        <Row
          w={100}
          m={15}
          positioning={"sp-btw"}
          onClick={() => setToggleMore(!toggleMore)}>
          <Row alignItems={"center"} w={20} positioning={"sp-btw"}>
            {isInbox && <Checkbox defaultChecked={false} onChange={onDone} />}
            <UserPresent
              user={{ name: userName, photoUrl: userPhoto }}
              isSmall={true}
            />
          </Row>
          <DateSpan date={date} isShort={false} />
        </Row>

        <h3>{subject}</h3>
        <p dangerouslySetInnerHTML={{ __html: detectMention(body) }}></p>

        {relatedPosts &&
          relatedPosts
            .sort((p1: any, p2: any) => p1.date - p2.date)
            .map((post: any) => <Post post={post} key={post.id} />)}
        {!replicationId && showReply ? (
          <CreatePost replitionPost={post} />
        ) : (
          "Enter to reply"
        )}
      </KBarProvider>
    </StyledPost>
  );
};
