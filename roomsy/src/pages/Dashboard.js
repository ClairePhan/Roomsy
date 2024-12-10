import '../styles/Dashboard.css';
import InviteRoommate from '../components/InviteRoommate';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { createHousehold } from '../services/household';


function Dashboard() {
    const [userId, setUserId] = useState(null);
    const [householdId, setHouseholdId] = useState(null);
    const navigate = useNavigate();

    useEffect( () => {
        
        const getUserAndHouseholdId = async() => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const userId = user.uid;
                setUserId(user.uid);
                
                const userRef = doc(db, "users", userId);
                const userDoc = await getDoc(userRef);
                setHouseholdId(userDoc.data().householdId);
                
            } else {
                console.log("No user currently signed in");
                navigate("/");
            }
        }

        getUserAndHouseholdId();

    }, []);
    

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

                <div className="calendar">
                </div>

                {/* Stash for later 
                <div className="dashboard">
                    <button onClick={() => createHousehold(userId)}>Add Roommate</button>
                    <InviteRoommate householdId={householdId} />
                </div> */}

                <div className="invite-section">
                    <button className="feature-1">Invite Roommates</button>
                    <button type="submit" id="feature-2">Add Roommate</button>
                </div>
                </div>

                <div className="breadcrumb-section">
                    <h2 id="clickable-text" className="option-1">🧹Chore Scheduler</h2>
                    <h2 className="option-2">💸Expense Tracker</h2>
                    <h2 className="option-3">📌Pinned Messages</h2>
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
                    {/* This is ignored for now
                    <div className="right-side">
                        <h2>This is a test of the calendar</h2>
                    </div>*/}
                </div>

            </section>
        </>
    )
}

export default Dashboard;