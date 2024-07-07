import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import LoadingScreen from './loading-screen';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(auth.currentUser);
  const [isLoading, setLoading] = useState(true);
  const [isUserSetUp, setUserSetUp] = useState(false);

  useEffect(() => {
    const checkUserDocument = async (authUser: any) => {
      try {
        const userQuery = query(
          collection(db, 'user'),
          where('유저아이디', '==', authUser.uid)
        );
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          setUserSetUp(true);
        } else {
          setUserSetUp(false);
        }
      } catch (error) {
        console.error('Error checking user document:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      if (authUser) {
        setUser(authUser);
        await checkUserDocument(authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div><LoadingScreen /></div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isUserSetUp) {
    return <Navigate to="/naming" />;
  }

  return children;
}