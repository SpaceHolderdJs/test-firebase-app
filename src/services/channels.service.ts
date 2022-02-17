import { IChannel, IPost, IUserData, permissions } from "../interfaces";
import Service from "./service";
import PostsService from "./posts.service";
import UserDataService from "./userData.service";
import { DocumentReference, getDoc } from "firebase/firestore";

const postsService = new PostsService("posts");
const userDataService = new UserDataService("userData");

class ChannelsService extends Service {
  async add(channel: IChannel) {
    const{ members, ...defaultChannel } = channel;
    const addedChannelRef = await super.add(defaultChannel);

    const addedChannel = await getDoc(addedChannelRef as DocumentReference<IChannel>);
    const {id} = addedChannel;

    const channelInstance = {
      permission: permissions.onlyWhenMentioned,
      name: channel.name
    };

    console.log("members",members);

    const users = channel.isPrivate ? await Promise.all([...members.map((memberId: string) => userDataService.getOne(memberId))]) : await userDataService.getMany();
    users.forEach((userData: any) => new Service(`userData/${userData.id}/channels`).add(channelInstance, id));
  }

  async delete(channel: IChannel) {
    await super.delete(channel);

    const { members, id } = channel;

    const posts = await postsService.getMany("channelId", "==", channel.id);
    posts?.forEach((post: IPost) => postsService.delete(post));

    const allUsers = await userDataService.getMany();

    const users = channel.isPrivate ? await Promise.all(allUsers.filter(async(userData: any) => {
      const memberChannelData: any = await new Service(
        `userData/${userData.id}/channels`
      ).getOne(id);
      return memberChannelData ? true : false;
    })) : allUsers;

    users.forEach((userData: any) => new Service(`userData/${userData.id}/channels`).delete({id}));
  }
}

export default ChannelsService;
