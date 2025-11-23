import React, { createContext, useContext, useState, useEffect } from 'react';

import { onAuthStateChanged, signInWithPhoneNumber, signOut } from "firebase/auth"; // For authentication
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from './configs/firebaseConfig'; // Your Firebase configuration

const AuthContext = createContext();

function setLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
  }
}
function getLocalStorage(key, initialValue) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : initialValue;
  } catch (e) {
    return initialValue;
  }
}


export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(getLocalStorage("currentUserProfile", null));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(userProfile == null){
      localStorage.removeItem('currentUserProfile');
    } else {
      setLocalStorage('currentUserProfile', userProfile);
    }
  }, [userProfile]);

  // Function to get the Firestore document
  const fetchUserProfile = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          console.log("No user profile found in db! set default");
          setUserProfile({"name": "no name", "profilePictureUrl": "./img/default-user-avatar.jpeg"}); // Or default profile data
        }
    } catch (error) {
      console.error("Error fetching Firestore user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      console.log(user);
      setCurrentUser(user);
      if (user) {
        if(!userProfile){
          await fetchUserProfile(user.uid);
        }
        // User is logged in, fetch their Firestore data
      } else {
        // User logged out
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // Add your Phone Auth functions here, e.g., phoneSignIn
  const phoneSignIn = (phoneNumber, appVerifier) => {
      // Logic for signInWithPhoneNumber and confirmation result
      // This is a complex function involving the reCAPTCHA verifier and SMS code
      // For simplicity, it's represented as a placeholder:
      return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  }

  const logout = () => signOut(auth);

  const value = {
    currentUser,
    userProfile,
    phoneSignIn, // Include your phone auth function
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}