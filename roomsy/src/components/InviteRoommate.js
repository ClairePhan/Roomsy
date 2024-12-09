import { inviteRoommate } from "../services/household";
import { useState } from "react";

function InviteRoommate({householdId}) {
    const [email, setEmail] = useState('');

    const handleInvite = async () => {
        if (email) {
            await inviteRoommate(householdId, email);
            setEmail("");
        }
    };

    return (
        <>
            <div className="invite-roommate">
                <input 
                type="email"
                placeholder="Enter roommate's email."
                value={email}
                onChange={
                    (e) => setEmail(e.target.value)
                }/>
                <button onClick={handleInvite}>Invite Roommate</button>
            </div>
        </>
    );
}

export default InviteRoommate;