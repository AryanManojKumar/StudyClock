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

const calculateStreak = (sessions) => {
  if (!sessions || sessions.length === 0) return 0;

  // Group sessions by date
  const sessionsByDate = {};
  sessions.forEach(session => {
    const dateStr = new Date(session.date).toDateString();
    if (!sessionsByDate[dateStr]) {
      sessionsByDate[dateStr] = [];
    }
    sessionsByDate[dateStr].push(session);
  });

  // Get unique dates and sort them in descending order
  const uniqueDates = Object.keys(sessionsByDate).sort((a, b) => new Date(b) - new Date(a));
  
  if (uniqueDates.length === 0) return 0;

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  // Check if there's activity today or yesterday to start counting
  if (uniqueDates[0] === today || uniqueDates[0] === yesterdayStr) {
    let currentDate = new Date();
    
    // If no activity today, start from yesterday
    if (uniqueDates[0] !== today) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Count consecutive days with sessions
    while (true) {
      const dateStr = currentDate.toDateString();
      if (sessionsByDate[dateStr]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return streak;
};

export const useFirebaseData = (user) => {
  const [data, setData] = useState({
    dailyGoal: 4,
    sessions: [], // All sessions for history
    todaySessions: [], // Only today's sessions for daily goal
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

        // Load all sessions with real-time updates (limited to recent 50)
        const q = query(
          collection(db, 'users', user.uid, 'sessions'),
          orderBy('date', 'desc'),
          limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const sessions = [];
          const todaySessions = [];
          let totalStudiedToday = 0;
          const today = new Date().toDateString();

          snapshot.forEach((doc) => {
            const session = doc.data();
            session.id = doc.id;
            session.date = session.date.toDate().toISOString();
            sessions.push(session);
            
            // Separate today's sessions
            const sessionDate = new Date(session.date).toDateString();
            if (sessionDate === today) {
              todaySessions.push(session);
              totalStudiedToday += session.duration;
            }
          });

          // Calculate streak
          const streak = calculateStreak(sessions);

          setData(prev => ({
            ...prev,
            sessions, // All sessions for history
            todaySessions, // Only today's sessions
            totalStudiedToday,
            streak
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

      // The streak will be automatically recalculated by the onSnapshot listener
      // when the new session is added, so we don't need to manually update it here

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