import { styled } from "@stitches/react";
import { Option } from "antd/lib/mentions";

const Sizing = styled("div", {
    variants: {
        w: {
            "100": {
                width: "100%"
            },

            "90": {
                width: "90%"
            },

            "80": {
                width: "80%"
            },

            "75": {
                width: "75%"
            },

            "50": {
                width: "50%"
            },

            "30": {
                width: "30%"
            },

            "25": {
                width: "25%"
            },

            "20": {
                width: "20%"
            }
        },
        h: {
            "100" : {
                height: "100%"
            },

            "30" : {
                height: "30%"
            },

            "10": {
                height: "10%"
            }
        },

        m: {
            "5": {margin: "5px"},
            "10": {margin: "10px"}, 
            "15": {margin: "15px"},
            "20": {margin: "20px"},
            "30": {margin: "30px"}
        },

        p: {
            "5": {padding: "5px"},
            "10": {padding: "10px"},
            "15": {padding: "15px"},
            "20": {padding: "20px"},
            "30": {padding: "30px"}
        }
    }
});

export const Button = styled("button", {
  backgroundColor: "black",
  borderRadius: "20px",
  fontSize: "13px",
  color: "white",
  padding: "5px",
  cursor: "pointer",
  margin: "5px",

  variants: {
    shape: {
      rounded: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
      },
    },
  },
});

export const Input = styled("input", {
  width: "auto",
  border: "2px solid white",
  outline: "none",
  borderRadius: "20px",
  fontSize: "18px",
  margin: "10px",
});

const Flex = styled(Sizing, {
    display: "flex",

    variants: {
        justifyContent: {
            "center": {
                justifyContent: "center"
            },
            "space-between": {
                justifyContent: "space-between"
            },
            "start": {
                justifyContent: "flex-start"
            },
            "end": {
                justifyContent: "flex-end"
            }
        },

        alignItems: {
            "center": {
                alignItems: "center"
            },
            "start": {
                alignItems: "flex-start"
            },
            "end": {
                alignItems: "flex-end"
            }
        },

        flexDirection: {
            "column": {
                flexDirection: "column",
            },
            "column-reverse": {
                flexDirection: "column-reverse"
            }
        },

        positioning: {
            "centered": {
                alignItems: "center",
                justifyContent: "center"
            },

            "sp-btw": {
                alignItems: "center",
                justifyContent: "space-between !important"
            }
        }
    }
});

export const Row = styled(Flex, {
  display: "flex",
});

export const Column = styled(Flex, {
  display: "flex",
  flexDirection: "column",
});

export const HorizontalStyledSection = styled(Row, {
    overflow: "hidden",
    overflowX: "auto",
  
    ".mention": {
      margin: "2px",
    },
});

