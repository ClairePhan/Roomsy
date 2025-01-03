import {  doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const addChoreToHousehold = async (householdId, chore) => {
    const householdRef = doc(db, "households", householdId);

    // Add the chore to the chores array
    await updateDoc(householdRef, {
        chores: arrayUnion(chore),
    });

};

export const getHouseholdChores = async (householdId) => {
    const householdRef = doc(db, "households", householdId);
    const householdDoc = await getDoc(householdRef);

    if (householdDoc.exists()) {
        return householdDoc.data().chores || [];
    }
    return [];
};

export const deleteChoreFromHousehold = async (householdId, chore) => {
    const householdRef = doc(db, "households", householdId);

    await updateDoc(householdRef, {
        chores: arrayRemove(chore),
    });
};