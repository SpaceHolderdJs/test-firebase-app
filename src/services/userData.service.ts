import { DocumentReference, getDoc } from "firebase/firestore";
import { IUserData } from "../interfaces";
import Service from "./service";

class UserDataService extends Service {
  async add(document: IUserData, id?:string) {
      const addedUserDataRef = await super.add(document, id );
    //   const addedUserData = await getDoc(addedUserDataRef as DocumentReference<IUserData>);

    //   const userInboxService = new Service(`userData/${id}/inbox`)
    //   const userChannelsService = new Service(`userData/${id}/channels`);
  }

  async getFullData (id: string) {
      const user = await super.getOne(id);
      
      const channels = await new Service(`userData/${id}/channels`).getMany();
      const inbox = await new Service(`userData/${id}/inbox`).getMany();

      return {...user, channels, inbox}
  }
}

export default UserDataService;