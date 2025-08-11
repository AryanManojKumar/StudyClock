import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export const useFirebaseData = (user) => {
  const [data, setData] = useState({
    dailyGoal: 4,
    sessions: [],
    totalStudiedToday: 0,
    lastActiveDate: new Date().toDateString(),
    streak: 0
  });

  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      try {
        // Load user settings
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setData(prev => ({
            ...prev,
            dailyGoal: userData.dailyGoal || 4,
            streak: userData.streak || 0
          }));
        } else {
          // Create default user document
          await setDoc(doc(db, 'users', user.uid), {
            dailyGoal: 4,
            streak: 0,
            lastActiveDate: new Date().toDateString()
          });
        }

        // Load today's sessions with real-time updates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const q = query(
          collection(db, 'users', user.uid, 'sessions'),
          where('date', '>=', Timestamp.fromDate(today)),
          where('date', '<', Timestamp.fromDate(tomorrow)),
          orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const sessions = [];
          let totalStudiedToday = 0;

          snapshot.forEach((doc) => {
            const session = doc.data();
            session.id = doc.id;
            session.date = session.date.toDate().toISOString();
            sessions.push(session);
            totalStudiedToday += session.duration;
          });

          setData(prev => ({
            ...prev,
            sessions,
            totalStudiedToday
          }));
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error loading Firebase data:', error);
      }
    };

    loadUserData();
  }, [user]);

  const addSession = async (sessionData) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'sessions'), {
        date: Timestamp.fromDate(sessionData.endTime),
        duration: sessionData.duration,
        notes: sessionData.notes,
        startTime: Timestamp.fromDate(sessionData.startTime)
      });

      // Update user stats
      await setDoc(doc(db, 'users', user.uid), {
        dailyGoal: data.dailyGoal,
        streak: data.streak,
        lastActiveDate: new Date().toDateString()
      }, { merge: true });

    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const updateGoal = async (newGoal) => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        dailyGoal: newGoal,
        streak: data.streak,
        lastActiveDate: new Date().toDateString()
      }, { merge: true });

      setData(prev => ({
        ...prev,
        dailyGoal: newGoal
      }));
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return { data, addSession, updateGoal };
};