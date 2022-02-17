import React, { FC, useState, useContext } from "react";
import { Context } from "../../App";
import { MainContext } from "../layout/Main";
import useService from "../../hooks/useService";
import { IChannel, IUserData } from "../../interfaces";
import { FindUser } from "../FindUser";
import { Button, Column, Row } from "../layout/styles";
import { UserPresent } from "../UserPresent";

interface channelData {
  name: string;
  isPrivate: boolean;
  members: IUserData[];
}

export const CreateChannel: FC = () => {
  const { user, modalData, setModalData, orgTempId } = useContext(Context);
  const { uid, displayName, photoURL, email } = user;

  const currentUserData = {
    id: uid,
    name: displayName,
    avatarUrl: photoURL,
    email: email,
  };

  const [channelData, setChannelData] = useState<channelData>({
    name: "",
    isPrivate: false,
    members: [{ ...currentUserData }],
  });
  const { name, isPrivate, members } = channelData;
  const channelsService = useService("organization").channels(orgTempId);

  const onSubmit = async () => {
    await channelsService.add({
      name,
      members: members.map((member: IUserData) => member.id),
      isPrivate,
    } as Omit<IChannel, "id">);

    setChannelData({ name: "", isPrivate: false, members: [] });
    setModalData({});
  };

  const removeFromMembers = (member: IUserData) =>
    setChannelData({
      ...channelData,
      members: channelData.members.filter((m: IUserData) => member.id !== m.id),
    });

  const checker = (userData: any) =>
    !channelData.members.find((member: IUserData) => member.id === userData.id);

  return (
    <Column w={90}>
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) =>
          setChannelData({ ...channelData, name: e.target.value })
        }
      />
      <Row w={100} positioning={"sp-btw"}>
        <span>Is private ?</span>
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) =>
            setChannelData({
              ...channelData,
              members: [{ ...currentUserData }],
              isPrivate: e.target.checked,
            })
          }
        />
      </Row>
      {isPrivate && (
        <Column w={100}>
          <span>Add users to channel:</span>
          <FindUser
            onUserSelect={(userData: IUserData) =>
              setChannelData({
                ...channelData,
                members: [...channelData.members, userData],
              })
            }
            checker={checker}
          />
          {members && (
            <Column w={100}>
              <span>Added members</span>
              {members.map((member: IUserData) => (
                <Row w={100} positioning={"sp-btw"} key={"A" + member.id}>
                  <UserPresent
                    user={{
                      name: member.name,
                      email: member.email,
                      photoUrl: member.avatarUrl,
                    }}
                    isSmall={true}
                  />
                  {member.id !== user.uid ? (
                    <Button
                      shape={"rounded"}
                      onClick={() => removeFromMembers(member)}>
                      x
                    </Button>
                  ) : (
                    <span>(you)</span>
                  )}
                </Row>
              ))}
            </Column>
          )}
        </Column>
      )}
      {name && <Button onClick={onSubmit}>Submit</Button>}
    </Column>
  );
};
