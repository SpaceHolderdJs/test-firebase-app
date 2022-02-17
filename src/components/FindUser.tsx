import { endAt, orderBy, query, startAt, where } from "firebase/firestore";
import React, { FC, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import idConverter from "../converters/id.converter";
import useService from "../hooks/useService";
import { IUserData } from "../interfaces";
import { Column } from "./layout/styles";
import { UserPresent } from "./UserPresent";

interface props {
  onUserSelect: any;
  checker?: any; // function that will check usersData with additional conditions
}

export const FindUser: FC<props> = ({ onUserSelect, checker = () => true }) => {
  const [inputValue, setInputValue] = useState("");

  const userDataService = useService("userData").default;

  const q = inputValue
    ? query(userDataService.ref).withConverter(idConverter)
    : null;

  const [users] = useCollectionData(q);

  return (
    <Column w={100} positioning="centered">
      <input
        type="text"
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
      />
      <Column w={90} h={100} className="hiddenOverflow">
        {users &&
          users
            .filter(
              (userData: any) =>
                userData.name.includes(inputValue) && checker(userData)
            )
            .map((userData: any) => (
              <UserPresent
                key={"F" + userData.id}
                user={{
                  name: userData.name,
                  photoUrl: userData.avatarUrl,
                  email: userData.email,
                }}
                isSmall={true}
                onClick={() => {
                  onUserSelect(userData);
                  setInputValue("");
                }}
              />
            ))}
      </Column>
    </Column>
  );
};
