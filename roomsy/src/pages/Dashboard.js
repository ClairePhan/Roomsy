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
                <div className="calendar">
                
                </div>
                <div className="dashboard">
                    <button onClick={() => createHousehold(userId)}>Add Roommate</button>
                    <InviteRoommate householdId={householdId} />
                </div>
            </section>
        </>
    )
}

export default Dashboard;