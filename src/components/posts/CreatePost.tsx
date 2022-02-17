import React, { useState, FC, useContext, useEffect, useRef } from "react";
import { IChannel, IChannelData, IPost, IUserData } from "../../interfaces";

import { MainContext } from "../layout/Main";
import { MentionsInput, Mention, MentionItem } from "react-mentions";
import { Context } from "../../App";
import useService from "../../hooks/useService";
import { Button, Column, HorizontalStyledSection, Row } from "../layout/styles";
import { styled } from "@stitches/react";
import { UserPresent } from "../UserPresent";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import idConverter from "../../converters/id.converter";
import { doc, query } from "firebase/firestore";
import UserDataService from "../../services/userData.service";
import { Option } from "antd/lib/mentions";
import { Select, Tooltip } from "antd";
import { KBarProvider } from "kbar";
import { Loader } from "../layout/Loader";

const StyledCreatePosts = styled(Column, {
  border: "1px solid black",
  borderRadius: "5px",
  input: {
    width: "100%",
    margin: "0px",
  },

  ".mentionInput": {
    width: "100%",
    height: "100px",
    overflow: "auto",
  },
});

interface postData {
  subject: string;
  body: string;
  requests: IUserData[];
  mentions: IUserData[];
  channelId: string;
}

interface props {
  replitionPost?: IPost;
}

export const CreatePost: FC<props> = ({ replitionPost }) => {
  const {
    user,
    modalData,
    setModalData,
    orgTempId,
    usersData,
    fullUsersData,
    userChannelsData,
  } = useContext(Context);

  const actions = [
    {
      id: "show mentions",
      name: "Show mentions",
      shortcut: ["alt", "o"],
      keywords: "show mentions",
      perform: () => {
        setShowMentions(true);
      },
    },
  ];

  const usersDataService = useService("userData").default;

  useEffect(() => {
    fullUsersData.length > 0 &&
      replitionPost &&
      setPostData({
        ...postData,
        requests: replitionPost.requests.map((userId: string) =>
          fullUsersData.find((userData: IUserData) => userData.id === userId)
        ),
        mentions: Array.from(
          new Set([...replitionPost.mentions, replitionPost.userId])
        ).map((userId: string) =>
          fullUsersData.find((userData: IUserData) => userData.id === userId)
        ),
      });
  }, [fullUsersData]);

  const [postData, setPostData] = useState<postData>({
    subject: "",
    body: "",
    requests: [],
    mentions: [],
    channelId: "",
  });

  const [showMentions, setShowMentions] = useState(false);

  const channelsService = useService("organization").channels(orgTempId);
  const channelDataRef = postData.channelId
    ? doc(channelsService.ref, postData.channelId)
    : replitionPost
    ? doc(channelsService.ref, replitionPost.channelId)
    : null;

  const [selectedChannelData] = useDocumentData<any>(
    channelDataRef?.withConverter(idConverter)
  );

  const organisationsServices = useService("organization");

  const onSubmit = async () => {
    const { subject, body, requests, mentions, channelId } = postData;
    const { uid, photoURL, displayName } = user;

    const postsService = organisationsServices.posts(
      orgTempId,
      !replitionPost ? channelId : replitionPost.channelId
    );

    await postsService.add({
      subject,
      body,
      userId: uid,
      userName: displayName,
      userPhoto: photoURL,
      channelId: !replitionPost
        ? selectedChannelData.id
        : replitionPost.channelId,
      done: false,
      requests: requests.map((userData) => userData.id),
      mentions: mentions.map((userData) => userData.id),
      date: Date.now(),
      replicationId: replitionPost ? replitionPost.id : "",
    } as Omit<IPost, "id">);

    setPostData({
      subject: "",
      body: "",
      requests: [],
      mentions: [],
      channelId: "",
    });

    setModalData({});
  };

  const addRequestMember = (userData: IUserData) =>
    setPostData((prevState) => ({
      ...prevState,
      requests: [...postData.requests, userData],
    }));

  const addMentionMember = (userData: IUserData) =>
    setPostData((prevState) => ({
      ...prevState,
      mentions: [...postData.mentions, userData],
    }));

  const removeRequestMember = (id: string) =>
    setPostData({
      ...postData,
      requests: postData.requests.filter(
        (userData: IUserData) => userData.id !== id
      ),
    });

  const removeMentionsMember = (id: string) =>
    setPostData({
      ...postData,
      mentions: postData.mentions.filter(
        (userData: IUserData) => userData.id !== id
      ),
    });

  const checker = (userData: IUserData) =>
    !postData.requests.find((data: IUserData) => data.id === userData.id) &&
    !postData.mentions.find((data: IUserData) => data.id === userData.id);

  const dataForMentions = () => {
    const mentions = selectedChannelData?.isPrivate
      ? fullUsersData.filter((userData: any) =>
          userData.channels.find(
            (channel: any) => channel.id === selectedChannelData.id
          )
        )
      : usersData;

    return mentions?.map((userData: any) => ({
      id: userData.id,
      display: userData.name,
    }));
  };

  const renderSuggestion = (selected: any) => {
    const data = usersData?.filter(
      (userData: any) => userData.id === selected.id && checker(userData)
    );
    if (data?.length)
      return (
        <Column p={5}>
          {
            data.map((userData: any) => (
              <UserPresent
                key={"S" + userData.id}
                user={{
                  name: userData.name,
                  photoUrl: userData.avatarUrl,
                }}
                isSmall={true}
              />
            )) as any
          }
        </Column>
      );
    return null;
  };

  const onAddMention = (memberId: string, display: string) => {
    const member = usersData?.find((userData: any) => userData.id === memberId);
    return member && addMentionMember(member as any);
  };
  const onAddRequest = (memberId: string, display: string) => {
    const member = usersData?.find((userData: any) => userData.id === memberId);
    return member && addRequestMember(member as any);
  };

  const mentions = [
    { trigger: "@", onAdd: onAddMention },
    { trigger: "@@", onAdd: onAddRequest },
  ];

  const onMentionInputChange = (
    e: any,
    textValue: string,
    plainValue: string,
    mentions: MentionItem[]
  ) => {
    const mentionsWithRelations = mentions.map((ment: MentionItem) => {
      const isMention = postData.mentions.find((m) => m.id === ment.id);

      return { ...ment, mentionType: isMention ? "@" : "@@" };
    });

    const notifications = mentionsWithRelations.filter(
      (m: any) => m.mentionType === "@"
    );
    const requests = mentionsWithRelations.filter(
      (m: any) => m.mentionType === "@@"
    );

    if (replitionPost)
      return setPostData((prevState) => ({
        ...prevState,
        mentions: prevState.mentions.filter(
          (item) =>
            notifications.find((userData: any) => userData.id === item.id) ||
            replitionPost.mentions.includes(item.id) ||
            item.id === replitionPost.userId
        ),
        requests: prevState.requests.filter(
          (item) =>
            requests.find((userData: any) => userData.id === item.id) ||
            replitionPost.requests.includes(item.id)
        ),
        body: textValue,
      }));
    else
      return setPostData((prevState) => ({
        ...prevState,
        mentions: prevState.mentions.filter((userData: IUserData) =>
          notifications.find((m: any) => m.id === userData.id)
        ),
        requests: prevState.requests.filter((userData: IUserData) =>
          requests.find((m: any) => m.id === userData.id)
        ),
        body: textValue,
      }));
  };

  return (
    <StyledCreatePosts w={100} p={10} alignItems={"start"}>
      <KBarProvider actions={actions as any}>
        <Column w={100}>
          {replitionPost && !showMentions && (
            <HorizontalStyledSection
              alignItems={"center"}
              onClick={() => setShowMentions(!showMentions)}>
              <Row m={5}>To:</Row>
              {fullUsersData.length > 0 ? (
                [...postData?.requests, ...postData?.mentions].map(
                  (userData: IUserData) => (
                    <UserPresent
                      key={"TO" + userData.id}
                      user={{
                        name: userData.name,
                        photoUrl: userData.avatarUrl,
                      }}
                      isMention={true}
                    />
                  )
                )
              ) : (
                <Loader size={20} />
              )}
            </HorizontalStyledSection>
          )}

          {!replitionPost && (
            <Select
              value={postData.channelId || "Please Select channel"}
              onChange={(value) =>
                setPostData({ ...postData, channelId: value })
              }>
              <Select.Option disabled value={"Please Select channel"}>
                Please Select channel
              </Select.Option>
              {userChannelsData &&
                userChannelsData.map((channel: any) => (
                  <Select.Option key={channel.id} value={channel.id}>
                    {channel.name}
                  </Select.Option>
                ))}
            </Select>
          )}
        </Column>

        {!replitionPost && (
          <input
            type="text"
            placeholder="subject"
            onChange={(e) =>
              setPostData({ ...postData, subject: e.target.value })
            }
            value={postData.subject}
          />
        )}

        {(!replitionPost || (replitionPost && showMentions)) && (
          <Column w={100} h={30}>
            <HorizontalStyledSection w={90} alignItems={"center"}>
              Notify:
              {postData.mentions.map((userData) => (
                <Row key={"N" + userData.id} m={10} positioning={"sp-btw"}>
                  <UserPresent
                    isMention={true}
                    user={{ name: userData.name, photoUrl: userData.avatarUrl }}
                  />
                </Row>
              ))}
            </HorizontalStyledSection>
            <HorizontalStyledSection w={90} alignItems={"center"}>
              Request a response:
              {postData.requests.map((userData) => (
                <Row key={"R" + userData.id} m={10} positioning={"sp-btw"}>
                  <UserPresent
                    isMention={true}
                    user={{ name: userData.name, photoUrl: userData.avatarUrl }}
                  />
                </Row>
              ))}
            </HorizontalStyledSection>
          </Column>
        )}

        <MentionsInput
          className="mentionInput"
          value={postData.body}
          onChange={onMentionInputChange}
          allowSpaceInQuery={true}>
          {mentions.map((mention) => (
            <Mention
              className="mention"
              key={mention.trigger}
              trigger={mention.trigger}
              data={dataForMentions as any}
              renderSuggestion={renderSuggestion}
              onAdd={mention.onAdd as any}
              markup={"@[__display__](__id__)"}
              appendSpaceOnAdd={true}
            />
          ))}
        </MentionsInput>
        {postData.body && <Button onClick={onSubmit}>Submit</Button>}
      </KBarProvider>
    </StyledCreatePosts>
  );
};
