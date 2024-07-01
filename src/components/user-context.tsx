// src/contexts/UserContext.tsx
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// 사용자 타입 정의
interface UserType {
  uid: string;
  displayName: string;
  email: string;
}

interface UserContextType {
  user: UserType | null;
  nickname: string;
  userProfile:string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [nickname, setNickname] = useState("");
  const [userProfile,setUserProfile] = useState("")

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'user', user.uid));
        if (userDoc.exists()) {
          setNickname(userDoc.data().닉네임);
          setUserProfile(userDoc.data().프로필사진);
        }
        setUser(user as UserType);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, nickname, userProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
