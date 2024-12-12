import '../styles/Dashboard.css';
import InviteRoommate from '../components/InviteRoommate';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { db } from '../services/firebase';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { acceptInvite, rejectInvite, createHousehold } from '../services/household';
import QuoteOfDay from '../components/QuoteOfDay';

function Dashboard() {
    const [userId, setUserId] = useState(null);
    const [userEmail, setuserEmail] = useState(null);
    const [householdId, setHouseholdId] = useState(null);
    const [inviteExists, setInviteExists] = useState(null); //do i set to false or null, reps if invite exists
    const [showHouseholdInvite, setShowHouseholdInvite] = useState(false);
    const [showInviteRoommate, setShowInviteRoommate] = useState(false);
    const navigate = useNavigate();

    useEffect( () => {     
        const getUserId = async() => {
            const auth = getAuth();
            const user = auth.currentUser;

            //if user is signed in, set user id and email constants
            if (user) {
                const email = user.email;
                setUserId(user.uid);
                setuserEmail(user.email);
                
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        const householdId = userDoc.data().householdId;
                        console.log("Retrieved householdId: ", householdId);
                        setHouseholdId(householdId);
                    } else {
                        console.log("Current signed in user does not exist in users collection, could not set household id");
                    }
                } catch (e) {
                    console.log("Error while trying to set householdId of current user in useEffect dashboard");
                    console.log(e);
                }

                try {
                    console.log("Enters try for getting pending invites in dashboard");
                    // Check if the current user signing up has a pending invite in households
                    const householdsRef = query(
                        collection(db, "households"),
                        where("pendingInvites", "array-contains", email)
                    );
                    const querySnapshot = await getDocs(householdsRef);

                    if (!querySnapshot.empty) {
                        setInviteExists(true);
                        setShowHouseholdInvite(true);
                        console.log("invite exiists");
                    } else {
                        console.log("No pending invites found for user");
                        setInviteExists(false);
                    }
                } catch (e) { 
                    console.log("Error in dashboard useEffect() checking for pending invites");
                    console.log(e.message);
                }

            } else {
                console.log("No user currently signed in");
                navigate("/");
            }
        }

        

        getUserId();
        displayInvite();
    }, []);

    const displayInvite = () => {
        console.log("Calls dipslayInvite in useEffect");
        console.log(inviteExists);
        
        if (!inviteExists) {
            setShowHouseholdInvite(false);
            //document.getElementById("accept").style.display = "none";
            //document.getElementById("reject").style.display = "none";
        }
    }

    const handleInvite = async () => {
        //called if user clicks on the button to accept the invite
        //change acceptInvite() response to be user
        const householdId = await acceptInvite(userId, userEmail);

        //if household is not null, alert that join was successful
        if (householdId) {
            alert('You have joined a household.');
            console.log(householdId);
            setHouseholdId(householdId);
        } else {
            alert('handleInvite: Could not join household');
        }
        setInviteExists(null);
    }

    const displayRoommateInvitation = () => {
        setShowInviteRoommate(true);
    }
//IF RESIDENT CLICKS DENY, THEY SHOULD ALSO BE REMOVED FROM PENDING INVITES
    return ( 
        <>
            
            <section className="collective">
                <div className="calendar">
                
                </div>
                <div className="dashboard">
                    
                    {showHouseholdInvite && 
                        <div className="acceptRejectinv">
                            <button id="accept" onClick={() => {
                                handleInvite();
                                displayInvite();
                            }}>Accept Invite</button>
                            <button id="reject" onClick={() => {
                                rejectInvite(userEmail);
                                setInviteExists(null);
                                displayInvite();
                            }}>Reject Invite</button>
                        </div>
                    }                   

                    <QuoteOfDay></QuoteOfDay>
                    <button onClick={() => {
                        createHousehold(userId); 
                        displayRoommateInvitation(); 
                    }}>Add Roommate</button>
                    {showInviteRoommate && <InviteRoommate householdId={householdId} />}
                </div>
            </section>
        </>
    )
}

export default Dashboard;