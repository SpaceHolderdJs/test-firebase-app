import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

const parentConverter = {
    toFirestore(doc: any): DocumentData {
      return doc;
    },
    
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
      const data = snapshot.data(options);
      console.log("snapData",data);
      return { ...data, id: snapshot.id };
    },
  }

export default parentConverter;