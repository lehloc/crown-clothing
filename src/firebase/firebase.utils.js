import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD_YZYkYRZ6sMXOzcxsN5jkCc-BwCPzfd4",
    authDomain: "crown-clothing-locdev.firebaseapp.com",
    databaseURL: "https://crown-clothing-locdev.firebaseio.com",
    projectId: "crown-clothing-locdev",
    storageBucket: "crown-clothing-locdev.appspot.com",
    messagingSenderId: "188489957516",
    appId: "1:188489957516:web:b18c01362058b9c8fc3ba9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;
  
    console.log(userAuth);
    const userRef = firestore.doc(`users/${userAuth.uid}`);
    console.log(userRef);
  
    const snapShot = await userRef.get();
    console.log(snapShot);
    if (!snapShot.exists) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();
      try {
        await userRef.set({
          displayName,
          email,
          createdAt,
          ...additionalData
        });
      } catch (error) {
        console.log('error creating user', error.message);
      }
    }
  
    return userRef;
  };

  export const addCollectionAndDocuments = async (
    collectionKey,
    objectsToAdd
  ) => {
    const collectionRef = firestore.collection(collectionKey);
  
    const batch = firestore.batch();
    objectsToAdd.forEach(obj => {
      const newDocRef = collectionRef.doc();
      batch.set(newDocRef, obj);
    });
  
    return await batch.commit();
  };
  
  export const convertCollectionsSnapshotToMap = collections => {
    const transformedCollection = collections.docs.map(doc => {
      const { title, items } = doc.data();
  
      return {
        routeName: encodeURI(title.toLowerCase()),
        id: doc.id,
        title,
        items
      };
    });
  
    return transformedCollection.reduce((accumulator, collection) => {
      accumulator[collection.title.toLowerCase()] = collection;
      return accumulator;
    }, {});
  };
  
  export const auth = firebase.auth();
  export const firestore = firebase.firestore();
  
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  export const signInWithGoogle = () => auth.signInWithPopup(provider);
  
  export default firebase;
