import { createContext, useContext, useEffect, useState } from "react"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword,  signOut } from "firebase/auth"
import { auth } from "./FirebaseConfig";

const userAuthContext = createContext();
// eslint-disable-next-line react/prop-types
export function UserAuthContextProvider({ children }) {
    const [user, setUser] = useState("");

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }
    function login(email, password, username) {
        console.log("username", username)  
        return signInWithEmailAndPassword(auth, email, password);
    }
    function logOut(){
        return signOut(auth);
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (curentUser)=>{
            setUser(curentUser);
        })
        return ()=>{
            unsubscribe();
        }
    },[])
    return (
        <userAuthContext.Provider value={{user, signup, login, logOut}} >
            {children}
        </userAuthContext.Provider>
    )
}

export function UseUserAuth() {
    return useContext(userAuthContext);
}