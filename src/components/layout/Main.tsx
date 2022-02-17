import { styled } from "@stitches/react";
import React, { createContext, useState } from "react";
import useService from "../../hooks/useService";
import { IChannel } from "../../interfaces";
import { Aside } from "./Aside";
import { Section } from "./Section";
import { Row } from "./styles";

export const MainContext = createContext({} as any);

const StyledMain = styled(Row, {
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
});

export const Main = () => {
  const [activeTab, setActiveTab] = useState<string | IChannel>("inbox");

  return (
    <StyledMain>
      <MainContext.Provider value={{ activeTab, setActiveTab }}>
        <Aside />
        <Section />
      </MainContext.Provider>
    </StyledMain>
  );
};
