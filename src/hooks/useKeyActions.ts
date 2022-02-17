import React, {useState, useContext, createElement } from "react";
import { CreateChannel } from "../components/channels/CreateChannel";
import { Context } from "../App";
import { CreatePost } from "../components/posts/CreatePost";
import { auth } from "../firebase";


const useKeyActions = (modalData: any, setModalData: any) => {

    const appActions = [
        {
          id: "channel",
          name: "Create channel",
          shortcut: ["c"],
          keywords: "create channel",
          perform: () => { 
              const childs: JSX.Element[] = [createElement(CreateChannel)];
              setModalData({visible: true, title: "Create Channel", childs});
          },
        },
        {
          id: "post",
          name: "Create post",
          shortcut: ["p"],
          keywords: "create post",
          perform: () => {
            const childs: JSX.Element[] = [createElement(CreatePost)];
            setModalData({visible: true, title: "Create Post", childs});
          }
        },
        {
          id: "logout",
          name: "Logout",
          shortcut: ["l"],
          keywords: "logout",
          perform: () => {
            auth.signOut();
          }
        }
      ];


    const [actions, setActions] = useState(appActions);
    return [actions, setActions];
}

export default useKeyActions;