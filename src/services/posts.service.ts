import { DocumentReference, getDoc } from "firebase/firestore";
import {
  IChannelData,
  IComment,
  IPost,
  IUserData,
  permissions,
} from "../interfaces";
import ChannelsService from "./channels.service";
import CommentsService from "./comments.service";
import Service from "./service";
import UserDataService from "./userData.service";

const userDataService = new UserDataService("userData");

class PostsService extends Service {
  
  async add(post: IPost) {
    const addedPostRef = await super.add(post);
    const addedPost = await getDoc(addedPostRef as DocumentReference<IPost>);
    const { id } = addedPost;

    const channelsUrl = this.instancePath.split("/").slice(0, 3).join("/");
    console.log("URL", channelsUrl);
    const channelsService = new ChannelsService(channelsUrl);

    const channelOfPost: any = await channelsService.getOne(post.channelId);
    console.log(channelOfPost);

    const allUsers = await userDataService.getMany();

    const usersFullData = await Promise.all(
      allUsers.map((userData: any) =>  userDataService.getFullData(userData.id)))
    
     const usersToNotify = usersFullData.filter((fullUserData: any) => {
       const channel = fullUserData.channels?.find((channelData: IChannelData) => channelData.id === post.channelId );
       
        if (!channel) return false;

        if (channel.permission === permissions.allPosts) return true;

        if (
          channel.permission === permissions.onlyWhenMentioned &&
          [...post.mentions, ...post.requests].find((userId: string) => userId === fullUserData.id)
        ) return true;

        return false;
      });

    usersToNotify.forEach((userData: any) => new Service(
      `userData/${userData.id}/inbox`
    ).add(post, addedPost.id));
  }

  async delete(post: IPost) {
    await super.delete(post);
    const {id, replicationId} = post;

    // const comments = await commentService.getMany("postId", "==", id);
    // comments?.forEach((comment: IComment) => commentService.delete(comment));

    const users = await userDataService.getMany();
    
    const usersFullData = await Promise.all(
      users.map((userData: any) =>  userDataService.getFullData(userData.id)))

    const usersWithPostInInbox = usersFullData.filter((userFullData: any) => userFullData?.inbox.find((post: IPost) => post.id === id || post.id === replicationId));

    usersWithPostInInbox.forEach((userData: any) => new Service(
      `userData/${userData.id}/inbox`
    ).delete(post));
  }
}

export default PostsService;
