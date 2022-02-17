import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
  getDocs,
  CollectionReference,
  setDoc,
  getDoc,
} from "firebase/firestore";
import idConverter from "../converters/id.converter";
import { firestore } from "../firebase";

class Service {
  public ref: CollectionReference<any>;
  public instancePath:string;
  public user: any;

  constructor(instancePath: string, user?:any) {
    this.ref = collection(firestore, instancePath);
    this.instancePath = instancePath;
    this.user = user;
  }

  async getMany(...filters: any) {
    const q = filters.length
      ? query(this.ref, where.apply(null, filters)).withConverter(idConverter)
      : query(this.ref).withConverter(idConverter);

    const snapshots = await getDocs(q);
    return snapshots.docs.map((doc: any) => ({...doc.data(), id: doc.id}));
  }

  async getOne(id: string) {
    const docSnapshot = await getDoc(doc(this.ref, id).withConverter(idConverter));
    return docSnapshot.data() ? {...docSnapshot.data(), id: docSnapshot.id,} : undefined;
  }

  async add(data: any, id?: string,  ...args: any) {
    if(id) return setDoc(doc(this.ref, id), data);
    return addDoc(this.ref, data);
  }

  async delete(document: any) {
    deleteDoc(doc(this.ref, document.id));
  }

  async deleteAll () {
    const data = await this.getMany();
    data.forEach((data: any) => this.delete(data));
  }

  async update(documnet: any) {
    setDoc(doc(this.ref, documnet.id), Object.assign({}, documnet), {merge: true});
  }
}

export default Service;
