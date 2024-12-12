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
    

 /*
    const Dashboard = () => {
        return (
            <div>
                <h1>Welcome to my website</h1>
                <WeekCalendar />
            </div>
        );
    }; */

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
>>>>>>> a2e1826df6635f024cb475e8e3e4ef6bb07cdcb1
    return ( 
        <>
            
            <section className="collective">
                <div className="grouping">
                    <div className = "nav-bar">
                        <h1 className="nav-title">
                            <img src="/images/roomsy_icon2.png" alt="Photo of 3D blender bedroom, with a bed and desk"  align="center" width="13%" />
                            <h4>Roomsy</h4>
                        </h1>
                    </div>

                    {showHouseholdInvite && 
                        <div className="acceptRejectinv">
                            <button id="accept" onClick={() => {
                                setShowHouseholdInvite(false);
                                handleInvite();
                                //displayInvite();
                            }}>Accept Invite</button>
                            <button id="reject" onClick={() => {
                                setShowHouseholdInvite(false);
                                rejectInvite(userEmail);
                                setInviteExists(null);
                                //displayInvite();
                            }}>Reject Invite</button>
                        </div>
                    }

                    <button onClick={() => {
                                createHousehold(userId); 
                                displayRoommateInvitation(); 
                            }}>Add Roommate
                    </button>

                    {showInviteRoommate && (<InviteRoommate householdId={householdId}
                                            onClose={() => setShowInviteRoommate(false)} />)}
                                  
                </div>

                <QuoteOfDay></QuoteOfDay>

                <div className="breadcrumb-section">
                    <h2 id="clickable-text" className="option-1">🧹Chore Scheduler</h2>
                    <h2 className="option-2">💸Expense Tracker</h2>
                </div>


         
                <div className="dashboard">                 

                    <div className="todo-section">
                        <h2 className="todo-title">Chore List 📝</h2>

                        <div class="todo-table">
                            <input type="text" id="input-box" placeholder="Add new task"></input>
                            <button type="submit" id ="todo-button" onclick="addTask()">Add</button>
                        </div>
                    
                        <ul id="list-container">
                            <li class="checked">Clean out room</li>
                            <li>Laundry</li>
                            <li>Grocery store run</li>
                        </ul>
                    </div>
                    
                    <div className="right-side">

                    </div>
                </div> 
            </section> 
        </>
    );
}

export default Dashboard;
