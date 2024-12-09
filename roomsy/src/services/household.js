import { db } from "./firebase";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const createHousehold = async (userId) => {
    const householdId = uuidv4();
    const householdRef = doc(db, "households", householdId);

    // Create household document
    await setDoc(householdRef, {
        householdId,
        members: [userId],
        pendingInvites: [],
        chores: [],
        expenses: [],
    });

    // Update user's household ID
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { householdId });

    return householdId;
};

// Invite a roommate by email
export const inviteRoommate = async (householdId, email) => {
    const householdRef = doc(db, "households", householdId);
  
    // Add email to pendingInvites
    await updateDoc(householdRef, {
      pendingInvites: arrayUnion(email),
    });
};