import React from "react";

import { KBarResults, useMatches } from "kbar";

export const RenderResults = () => {
  const { results } = useMatches();

  const onRender = ({ item, active }: any) =>
    typeof item === "string" ? (
      <div>{item}</div>
    ) : (
      <div
        style={{
          background: active ? "#eee" : "transparent",
        }}>
        {item.name}
      </div>
    );

  return <KBarResults items={results} onRender={onRender as any} />;
};
