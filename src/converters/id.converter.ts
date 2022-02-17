import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

const idConverter = {
    toFirestore(doc: any): DocumentData {
      return doc;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
      const data = snapshot.data(options);
      return { ...data, id: snapshot.id };
    },
  }

export default idConverter;