import { IComment } from "../interfaces";
import Service from "./service";

class CommentsService extends Service {
  async delete(comment: IComment) {
    await super.delete(comment);

    if (comment.replicationId === "") {
      const relatedComments = await super.getMany(
        "replicationId",
        "==",
        comment.id
      )

      relatedComments.forEach((cmt: IComment) => super.delete(cmt));
    }
  }
}

export default CommentsService;
