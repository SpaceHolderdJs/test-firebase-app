export interface IPost {
    body: string,
    subject: string,
    userId: string,
    userName: string,
    userPhoto: string,
    channelId: string,
    id: string,
    requests: string[],
    mentions: string[],
    date: number
    replicationId: string
}

export interface IChannel {
    id: string,
    name: string,
    isPrivate: boolean,
    members: []
}

export interface IComment {
    id: string,
    postId: string,
    text: string,
    userId: string,
    userName: string,
    userPhoto: string,
    date: number,
    requests: string[] | IUserData[],
    mentions: string[] | IUserData[],
    replicationId: string
}

export interface IUserData {
    id: string,
    name: string,
    avatarUrl: string,
    email: string,
}

export interface IInboxPost {
    id: string,
    status: string
}

export interface IChannelData {
    id: string,
    permission: string
}

export enum permissions {
    onlyWhenMentioned = "Only when mentioned",
    allPosts = "All posts",
  }
