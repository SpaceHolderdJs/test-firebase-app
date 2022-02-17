import { useContext, useState } from "react";
import ChannelsService from "../services/channels.service";
import CommentsService from "../services/comments.service";
import PostsService from "../services/posts.service";
import Service from "../services/service";
import UserDataService from "../services/userData.service";
import { Context } from "../App";
import OrganizationService from "../services/organization.service";

interface IServices {
  organization: any;
  userData: any;
}

const useService = (serviceName: string) => {
  const { user } = useContext(Context);
  const [services, setServices] = useState<IServices>({
    organization: {
      default: new OrganizationService("organizations", user),
      members: (orgId: string) => new Service(`organizations/${orgId}/members`),
      channels: (orgId: string) =>
        new ChannelsService(`organizations/${orgId}/channels`, user),
      posts: (orgId: string, channelId: string) =>
        new PostsService(
          `organizations/${orgId}/channels/${channelId}/posts`,
          user
        ),
      comments: (orgId: string, channelId: string, postId: string) =>
        new CommentsService(
          `organizations/${orgId}/channels/${channelId}/posts/${postId}/comments`
        ),
    },
    userData: {
      default: new UserDataService("userData", user),
      channels: (userDataId: string) =>
        new Service(`userData/${userDataId}/channels`, user),
      inbox: (userDataId: string) =>
        new Service(`userData/${userDataId}/inbox`, user),
    },
  });

  return services[serviceName as keyof typeof services];
};

export default useService;
