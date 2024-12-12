import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase";
import { collection, doc, setDoc, updateDoc, query, where, getDocs, arrayUnion, arrayRemove } from "firebase/firestore";

const auth = getAuth();

export const signupUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const usersRef = doc(db, "users", user.uid); 
    
    await setDoc(usersRef, { email, householdId: null });
    

    return user;
};