import React, { createContext, useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Modal } from "antd";
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarResults,
  KBarSearch,
} from "kbar";
import useKeyActions from "./hooks/useKeyActions";

import { auth, firestore } from "./firebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { Auth } from "./components/Auth";
import { Header } from "./components/layout/Header";
import { Main } from "./components/layout/Main";
import { Column } from "./components/layout/styles";
import { RenderResults } from "./components/kbar/RenderResults";
import { globalCss, styled } from "@stitches/react";
import { Loader } from "./components/layout/Loader";
import { query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import idConverter from "./converters/id.converter";
import useService from "./hooks/useService";
import { IUserData } from "./interfaces";

export const Context = createContext({} as any);

const globalStyles = globalCss({
  "*": {
    ".mention": {
      border: "1px solid black",
      borderRadius: "5px",
      padding: "1px",
    },
    input: {
      width: "auto",
      border: "2px solid white",
      borderRadius: "5px",
      fontSize: "18px",
      margin: "10px",
    },

    textarea: {
      resize: "none",
      outline: "none",
      border: "none",
    },
  },
});

const initialModalData = {
  visible: false,
  childs: [],
  title: "",
  onOk: undefined,
};

const StyledKBarAnimator = styled(KBarAnimator, {
  background: "white ",
  width: "50%",
  height: "auto !important",
  padding: "10px",
  input: {
    width: "100%",
    margin: "5px 5px 0px 0px",
  },
});

function App() {
  const [user, isLoading] = useAuthState(auth as any);
  globalStyles();

  const usersDataService = useService("userData").default;
  const usersDataQ = query(usersDataService.ref).withConverter(idConverter);
  const [usersData] = useCollectionData(usersDataQ);

  const userChannelsDataService = useService("userData").channels(user?.uid);
  const userChannelsDataQ = user
    ? query(userChannelsDataService.ref).withConverter(idConverter)
    : null;
  const [userChannelsData] = useCollectionData(userChannelsDataQ);

  const [fullUsersData, setFullUsersData] = useState([]);
  const initFullUserData = async (usersData: IUserData[]) => {
    const fullUsersData = await Promise.all([
      ...usersData.map((userData: IUserData) =>
        usersDataService.getFullData(userData.id)
      ),
    ]);

    setFullUsersData(fullUsersData as any);
  };

  useEffect(() => {
    usersData && usersData.length > 0 && initFullUserData(usersData as any);
  }, [usersData]);

  const [modalData, setModalData] = useState(initialModalData);

  const [actions, setActions] = useKeyActions(modalData, setModalData);
  const orgTempId = "0qX4sloi5H6sYiBHx7Bt";

  if (isLoading) return <Loader />;

  if (!user) return <Auth />;

  return (
    <Column className="App">
      <Context.Provider
        value={{
          user,
          firestore,
          modalData,
          setModalData,
          orgTempId,
          usersData,
          fullUsersData,
          userChannelsData,
        }}>
        <Modal
          title={modalData.title}
          visible={modalData.visible}
          onOk={modalData?.onOk}
          onCancel={() => setModalData(initialModalData)}
          destroyOnClose={true}
          footer={null}
          children={modalData.childs}></Modal>

        <KBarProvider actions={actions as any}>
          <KBarPortal>
            <KBarPositioner>
              <StyledKBarAnimator className="shadow">
                <KBarSearch />
                <RenderResults />
              </StyledKBarAnimator>
            </KBarPositioner>
          </KBarPortal>

          <Main />
        </KBarProvider>
      </Context.Provider>
    </Column>
  );
}

export default App;
