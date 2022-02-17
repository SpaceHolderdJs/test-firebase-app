import { styled } from "@stitches/react";
import React, { FC } from "react";

const StyledDate = styled("span", {
  color: "grey",
});

const stringDateGenerator = (d: number, isShort: boolean) => {
  const date = new Date(d);
  const hrs = dateCorrector(date.getHours());
  const mins = dateCorrector(date.getMinutes());
  const amOrpm = hrs <= 12 ? "am" : "pm";

  const day = dateCorrector(date.getDate());
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const dateStr = isShort
    ? `${hrs}:${mins} ${amOrpm}`
    : `${hrs}:${mins} ${amOrpm} on ${month} ${day}, ${year}`;
  return dateStr;
};

const dateCorrector = (date: string | number) =>
  date.toString().length === 1 ? "0" + date : date;

interface props {
  date: number;
  isShort?: boolean;
}

export const DateSpan: FC<props> = ({ date, isShort = true }) => {
  return <StyledDate>{stringDateGenerator(date, isShort)}</StyledDate>;
};
