import { ReactNode, useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
}
  
type AuthContextType = {
    user: User | undefined;
    signInWIthGoogle:() => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider (props: AuthContextProviderProps){
    const [user, setUser] = useState<User>();


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL, uid } = user

                if (!displayName || !photoURL) {
                    throw new Error('Missiing information from Google Account.');
                }
        
                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }

        })
    

        return () => {
            unsubscribe();
        }
    }, [])

    async function signInWIthGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();

        const result = await auth.signInWithPopup(provider);

    
        if (result.user) {
            const { displayName, photoURL, uid } = result.user
        
            if (!displayName || !photoURL) {
             throw new Error('Missiing information from Google Account.');
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    
    }

    return (
        <AuthContext.Provider value={{ user, signInWIthGoogle }} >
            {props.children}
        </ AuthContext.Provider>
    );
}
