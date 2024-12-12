import { db } from "./firebase";
import { collection, query, getDocs, where, arrayRemove, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const rejectInvite = async (email) => {
    try {
        //query for pending invites in household
        const q = query(collection(db, "households"), where("pendingInvites", "array-contains", email));
        const querySnapshot = await getDocs(q);   
        const householdDoc = querySnapshot.docs[0]; //const householdId = householdDoc.data().householdId;
        //gets household id from invite
        const householdId = householdDoc.id;

        //gets specific reference of household
        const householdRef = doc(db, "households", householdId);
        //remove user from pending invites array
        await updateDoc(householdRef, {
            pendingInvites: arrayRemove(email),
            });
    } catch (e) {
        console.log(e);
        console.log("Error rejecting invite, removing user from pendingInvites");
    }
}

export const acceptInvite = async (userId, email) => { 

    try {
        //query for pending invites in household
        const q = query(collection(db, "households"), where("pendingInvites", "array-contains", email));
        const querySnapshot = await getDocs(q);   
        const householdDoc = querySnapshot.docs[0]; //const householdId = householdDoc.data().householdId;
        //gets household id from invite
        const householdId = householdDoc.id;

        try {
            // edit householdId in users collection
            //CURRENT ERROR RIGHT HERE BECAUSE cortney does not exist in the users db so it cannot update
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { householdId }); 

            try {
                //gets specific reference of household
                const householdRef = doc(db, "households", householdId);
                //remove user from pending invites array and add them to members of household
                await updateDoc(householdRef, {
                    pendingInvites: arrayRemove(email),
                    members: arrayUnion(userId),
                    });   
                
                return householdId;

            } catch (e) {
                console.log("Error trying to update households collection (pendingInvite, members fields)");
                console.log(e);
            }

        } catch (e) {
            console.log("Error trying to update users collection (householdId field)");
            console.log(e);
        }

    } catch(e) {
        console.log("Error querying for pending invite");
        console.log(e);
    }
    
    
};

export const createHousehold = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists() && userDoc.data().householdId) {
        return userDoc.data().householdId;
    }

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
    await updateDoc(userRef, { householdId });

    return householdId;
};

// Invite a roommate by email
export const inviteRoommate = async (householdId, email) => {
    const householdRef = doc(db, "households", householdId); //error here means passing in null householdId
  
    // Add email to pendingInvites
    try {
        await updateDoc(householdRef, {
            pendingInvites: arrayUnion(email),
        });
    } catch (e) {
        console.log("Error inviting roommate, could not add to pendingInvites");
        console.log(e);
    }
    
};