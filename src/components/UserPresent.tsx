import React, { useContext, FC } from "react";

interface props {
  user: {
    name: string | null;
    photoUrl: string | null;
  };

  isSmall?: boolean;
}

export const UserPresent: FC<props> = ({ user, isSmall }) => {
  const { name, photoUrl } = user;
  const avatarClasses = `avatar ${isSmall ? "small" : ""}`;
  return (
    <div className="row centeted userPresent">
      <img
        className={avatarClasses}
        src={
          photoUrl || "https://api.adorable.io/avatars/23/abott@adorable.png"
        }
        alt={name as string}
      />
      {!isSmall && <h3>{name}</h3>}
    </div>
  );
};
