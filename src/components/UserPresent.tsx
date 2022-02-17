import { styled } from "@stitches/react";
import React, { useContext, FC } from "react";
import { Column, Row } from "./layout/styles";

interface props {
  user: {
    name: string | null;
    photoUrl: string | null;
    email?: string;
  };
  isSmall?: boolean;
  isMention?: boolean;
  onClick?: any;
}

const StyledUserPresent = styled(Row, {
  width: "auto",
  ".avatar": {
    borderRadius: "50%",
    height: "60px",
    width: "60px",
    marginRight: "10px",
  },

  ".avatar.small": {
    height: "30px",
    width: "30px",
  },
});

const StyledMention = styled(StyledUserPresent, {
  ".avatar": {
    borderRadius: "50%",
    height: "30px",
    width: "30px",
    marginRight: "5px",
  },
});

export const UserPresent: FC<props> = ({
  user,
  isSmall,
  isMention,
  onClick,
}) => {
  const { name, photoUrl, email } = user;
  const avatarClasses = `avatar ${isSmall ? "small" : ""}`;

  if (isMention)
    return (
      <StyledMention positioning={"centered"} className="mention">
        <img
          className={`avatar`}
          src={
            photoUrl || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
          alt={name as string}
        />
        <Column>
          <span>{name}</span>
        </Column>
      </StyledMention>
    );

  return (
    <StyledUserPresent positioning={"centered"} onClick={onClick && onClick}>
      <img
        className={avatarClasses}
        src={
          photoUrl || "https://api.adorable.io/avatars/23/abott@adorable.png"
        }
        alt={name as string}
      />
      <Column>
        {!isSmall ? <h3>{name}</h3> : <span>{name}</span>}
        {email && <span>{email}</span>}
      </Column>
    </StyledUserPresent>
  );
};
