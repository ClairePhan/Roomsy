import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebase";
import { collection, doc, setDoc, updateDoc, query, where, getDocs, arrayUnion, arrayRemove } from "firebase/firestore";

const auth = getAuth();

export const signupUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const usersRef = doc(db, "users", user.uid);

    // Check if the current user signing up has a pending invite in households
    // Aka someone else invited them to join the household, we would give them the same
    // id as the invitee so they can access the same dashboard.
    const householdsRef = query(
        collection(db, "households"),
        where("pendingInvites", "array-contains", email)
    );
    const querySnapshot = await getDocs(householdsRef);

    //if curr user signing up did receive an invite
    if (!querySnapshot.empty) {
        const householdDoc = querySnapshot.docs[0];
        const householdId = householdDoc.id;

        // Assign the householdId to the user
        await updateDoc(usersRef, { householdId });

        // Add the new user to the household's members array and remove invite
        await updateDoc(doc(db, "households", householdId), {
        members: arrayUnion(user.uid),
        pendingInvites: arrayRemove(email),
        });
    }
    else { //if did not receive invite, give them null householdId for now
        await setDoc(usersRef, { email, householdId: null });
    }

    return user;
};