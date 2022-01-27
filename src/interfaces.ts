export interface IPost {
    body: string,
    subject: string,
    userId: string,
    userName: string,
    userPhoto: string,
    channelId: string,
    id: string
}

export interface IComment {
    userId: string,
    message: string,
    date: number
}

export interface IChannel {
    id: string,
    name: string,
}

export interface IComment {
    id: string,
    postId: string,
    text: string,
    userId: string,
    userName: string,
    userPhoto: string
}