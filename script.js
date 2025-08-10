// Firebase imports
import { db, auth } from './firebase-config.js';
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
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

class ProductivityClock {
    constructor() {
        this.sessionStartTime = null;
        this.sessionPausedTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.sessionInterval = null;
        this.clockInterval = null;
        this.user = null;
        this.isGuest = false;
        
        // Productive hours (can be customized)
        this.productiveHours = { start: 8, end: 22 }; // 8 AM to 10 PM
        
        this.initializeElements();
        this.initializeAuth();
        this.startLiveClock();
    }

    initializeElements() {
        // Auth elements
        this.authSection = document.getElementById('authSection');
        this.mainApp = document.getElementById('mainApp');
        this.googleSignInBtn = document.getElementById('googleSignIn');
        this.guestModeBtn = document.getElementById('guestMode');
        this.userInfo = document.getElementById('userInfo');
        this.userNameEl = document.getElementById('userName');
        this.signOutBtn = document.getElementById('signOut');
        
        // Clock elements
        this.liveTimeEl = document.getElementById('liveTime');
        this.liveDateEl = document.getElementById('liveDate');
        this.productivityIndicatorEl = document.getElementById('productivityIndicator');
        
        // Timer elements
        this.sessionTimerEl = document.getElementById('sessionTimer');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        
        // Goal elements
        this.dailyGoalInput = document.getElementById('dailyGoal');
        this.progressFillEl = document.getElementById('progressFill');
        this.studiedTodayEl = document.getElementById('studiedToday');
        this.goalTextEl = document.getElementById('goalText');
        this.goalStatusEl = document.getElementById('goalStatus');
        
        // Stats elements
        this.totalStudiedEl = document.getElementById('totalStudied');
        this.sessionsCountEl = document.getElementById('sessionsCount');
        this.currentStreakEl = document.getElementById('currentStreak');
        
        // Modal elements
        this.sessionModal = document.getElementById('sessionModal');
        this.sessionDurationEl = document.getElementById('sessionDuration');
        this.sessionNotesEl = document.getElementById('sessionNotes');
        this.saveSessionBtn = document.getElementById('saveSession');
        this.skipNotesBtn = document.getElementById('skipNotes');
        
        // History elements
        this.sessionHistoryEl = document.getElementById('sessionHistory');
    }

    initializeAuth() {
        // Auth event listeners
        this.googleSignInBtn.addEventListener('click', () => this.signInWithGoogle());
        this.guestModeBtn.addEventListener('click', () => this.continueAsGuest());
        this.signOutBtn.addEventListener('click', () => this.signOutUser());
        
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.isGuest = false;
                this.showMainApp();
                this.loadFirebaseData();
            } else if (this.isGuest) {
                this.showMainApp();
                this.loadLocalData();
            } else {
                this.showAuthSection();
            }
        });
    }

    async signInWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            console.log('Signed in successfully:', result.user.displayName);
        } catch (error) {
            console.error('Sign in error:', error);
            alert('Sign in failed. Please try again.');
        }
    }

    continueAsGuest() {
        this.isGuest = true;
        this.user = null;
        this.showMainApp();
        this.loadLocalData();
    }

    async signOutUser() {
        try {
            await signOut(auth);
            this.user = null;
            this.isGuest = false;
            this.showAuthSection();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    showAuthSection() {
        this.authSection.style.display = 'flex';
        this.mainApp.style.display = 'none';
    }

    showMainApp() {
        this.authSection.style.display = 'none';
        this.mainApp.style.display = 'block';
        
        // Update user info
        if (this.user) {
            this.userNameEl.textContent = this.user.displayName || this.user.email;
        } else {
            this.userNameEl.textContent = 'Guest User';
        }
        
        this.bindEvents();
        this.updateUI();
    }

    async loadFirebaseData() {
        if (!this.user) return;
        
        try {
            // Load user settings
            const userDoc = await getDoc(doc(db, 'users', this.user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                this.data = {
                    dailyGoal: userData.dailyGoal || 4,
                    sessions: [],
                    totalStudiedToday: 0,
                    lastActiveDate: new Date().toDateString(),
                    streak: userData.streak || 0
                };
                this.dailyGoalInput.value = this.data.dailyGoal;
            } else {
                // Create default user document
                this.data = {
                    dailyGoal: 4,
                    sessions: [],
                    totalStudiedToday: 0,
                    lastActiveDate: new Date().toDateString(),
                    streak: 0
                };
                await this.saveUserSettings();
            }
            
            // Load today's sessions
            await this.loadTodaySessions();
            
        } catch (error) {
            console.error('Error loading Firebase data:', error);
            this.loadLocalData(); // Fallback to local storage
        }
    }

    async loadTodaySessions() {
        if (!this.user) return;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        try {
            const q = query(
                collection(db, 'users', this.user.uid, 'sessions'),
                where('date', '>=', Timestamp.fromDate(today)),
                where('date', '<', Timestamp.fromDate(tomorrow)),
                orderBy('date', 'desc')
            );
            
            onSnapshot(q, (snapshot) => {
                this.data.sessions = [];
                this.data.totalStudiedToday = 0;
                
                snapshot.forEach((doc) => {
                    const session = doc.data();
                    session.id = doc.id;
                    session.date = session.date.toDate().toISOString();
                    this.data.sessions.push(session);
                    this.data.totalStudiedToday += session.duration;
                });
                
                this.updateUI();
            });
        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    }

    loadLocalData() {
        // Load from localStorage (guest mode or fallback)
        this.data = JSON.parse(localStorage.getItem('productivityData')) || {
            dailyGoal: 4,
            sessions: [],
            totalStudiedToday: 0,
            lastActiveDate: new Date().toDateString(),
            streak: 0
        };
        
        // Reset if new day
        const today = new Date().toDateString();
        if (this.data.lastActiveDate !== today) {
            this.data.totalStudiedToday = 0;
            this.data.lastActiveDate = today;
        }
        
        this.dailyGoalInput.value = this.data.dailyGoal;
    }

    async saveUserSettings() {
        if (!this.user) {
            // Guest mode - save to localStorage
            localStorage.setItem('productivityData', JSON.stringify(this.data));
            return;
        }
        
        try {
            await setDoc(doc(db, 'users', this.user.uid), {
                dailyGoal: this.data.dailyGoal,
                streak: this.data.streak,
                lastActiveDate: this.data.lastActiveDate
            }, { merge: true });
        } catch (error) {
            console.error('Error saving user settings:', error);
            // Fallback to localStorage
            localStorage.setItem('productivityData', JSON.stringify(this.data));
        }
    }

    async saveSessionToFirebase(session) {
        if (!this.user) {
            // Guest mode - save to localStorage
            this.data.sessions.unshift(session);
            this.data.totalStudiedToday += session.duration;
            localStorage.setItem('productivityData', JSON.stringify(this.data));
            return;
        }
        
        try {
            await addDoc(collection(db, 'users', this.user.uid, 'sessions'), {
                date: Timestamp.fromDate(new Date(session.date)),
                duration: session.duration,
                notes: session.notes,
                startTime: Timestamp.fromDate(new Date(session.startTime))
            });
            
            // Update user stats
            await this.saveUserSettings();
        } catch (error) {
            console.error('Error saving session:', error);
            // Fallback to localStorage
            this.data.sessions.unshift(session);
            this.data.totalStudiedToday += session.duration;
            localStorage.setItem('productivityData', JSON.stringify(this.data));
        }
    }

    startLiveClock() {
        this.updateLiveClock();
        this.clockInterval = setInterval(() => this.updateLiveClock(), 1000);
    }

    updateLiveClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        const dateString = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        this.liveTimeEl.textContent = timeString;
        this.liveDateEl.textContent = dateString;
        
        // Update productivity indicator
        const hour = now.getHours();
        const isProductive = hour >= this.productiveHours.start && hour <= this.productiveHours.end;
        const indicatorDot = this.productivityIndicatorEl.querySelector('.indicator-dot');
        const indicatorText = this.productivityIndicatorEl.querySelector('.indicator-text');
        
        if (isProductive) {
            indicatorDot.classList.remove('non-productive');
            indicatorText.textContent = 'Productive Hours';
        } else {
            indicatorDot.classList.add('non-productive');
            indicatorText.textContent = 'Rest Hours';
        }
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startSession());
        this.pauseBtn.addEventListener('click', () => this.pauseSession());
        this.stopBtn.addEventListener('click', () => this.stopSession());
        
        this.dailyGoalInput.addEventListener('change', () => {
            this.data.dailyGoal = parseFloat(this.dailyGoalInput.value);
            this.saveUserSettings();
            this.updateUI();
        });
        
        this.saveSessionBtn.addEventListener('click', () => this.saveSession());
        this.skipNotesBtn.addEventListener('click', () => this.skipSession());
        
        // Close modal when clicking outside
        this.sessionModal.addEventListener('click', (e) => {
            if (e.target === this.sessionModal) {
                this.skipSession();
            }
        });
    }

    startSession() {
        if (this.isPaused) {
            // Resume from pause
            this.isPaused = false;
        } else {
            // Start new session
            this.sessionStartTime = new Date();
            this.sessionPausedTime = 0;
        }
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.stopBtn.disabled = false;
        
        this.sessionInterval = setInterval(() => this.updateSessionTimer(), 1000);
    }

    pauseSession() {
        this.isPaused = true;
        this.isRunning = false;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        clearInterval(this.sessionInterval);
    }

    stopSession() {
        if (!this.sessionStartTime) return;
        
        const endTime = new Date();
        const totalTime = endTime - this.sessionStartTime - this.sessionPausedTime;
        const minutes = Math.floor(totalTime / 60000);
        
        if (minutes < 1) {
            alert('Session too short! Minimum 1 minute required.');
            this.resetTimer();
            return;
        }
        
        this.currentSessionDuration = totalTime;
        this.showSessionModal(minutes);
        this.resetTimer();
    }

    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        this.sessionStartTime = null;
        this.sessionPausedTime = 0;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.stopBtn.disabled = true;
        
        this.sessionTimerEl.textContent = '00:00:00';
        clearInterval(this.sessionInterval);
    }

    updateSessionTimer() {
        if (!this.sessionStartTime || !this.isRunning) return;
        
        const now = new Date();
        const elapsed = now - this.sessionStartTime - this.sessionPausedTime;
        const timeString = this.formatTime(elapsed);
        
        this.sessionTimerEl.textContent = timeString;
    }

    showSessionModal(minutes) {
        const timeString = this.formatDuration(this.currentSessionDuration);
        this.sessionDurationEl.textContent = timeString;
        this.sessionNotesEl.value = '';
        this.sessionModal.style.display = 'block';
    }

    saveSession() {
        const notes = this.sessionNotesEl.value.trim();
        const session = {
            date: new Date().toISOString(),
            duration: this.currentSessionDuration,
            notes: notes || 'No notes added',
            startTime: this.sessionStartTime.toISOString()
        };
        
        this.data.sessions.unshift(session);
        this.data.totalStudiedToday += this.currentSessionDuration;
        
        // Keep only last 50 sessions
        if (this.data.sessions.length > 50) {
            this.data.sessions = this.data.sessions.slice(0, 50);
        }
        
        this.saveData();
        this.updateUI();
        this.sessionModal.style.display = 'none';
    }

    skipSession() {
        const session = {
            date: new Date().toISOString(),
            duration: this.currentSessionDuration,
            notes: 'No notes added',
            startTime: this.sessionStartTime.toISOString()
        };
        
        this.data.sessions.unshift(session);
        this.data.totalStudiedToday += this.currentSessionDuration;
        
        this.saveData();
        this.updateUI();
        this.sessionModal.style.display = 'none';
    }

    updateUI() {
        this.updateGoalProgress();
        this.updateStats();
        this.updateHistory();
    }

    updateGoalProgress() {
        const goalMs = this.data.dailyGoal * 60 * 60 * 1000;
        const studiedMs = this.data.totalStudiedToday;
        const progress = Math.min((studiedMs / goalMs) * 100, 100);
        
        this.progressFillEl.style.width = `${progress}%`;
        this.studiedTodayEl.textContent = this.formatDuration(studiedMs);
        this.goalTextEl.textContent = this.formatDuration(goalMs);
        
        if (progress >= 100) {
            this.goalStatusEl.textContent = 'Goal Reached! ✅';
            this.goalStatusEl.classList.add('completed');
        } else {
            const remaining = goalMs - studiedMs;
            this.goalStatusEl.textContent = `${this.formatDuration(remaining)} to go! 💪`;
            this.goalStatusEl.classList.remove('completed');
        }
    }

    updateStats() {
        const todaySessions = this.getTodaySessions();
        
        this.totalStudiedEl.textContent = this.formatDuration(this.data.totalStudiedToday);
        this.sessionsCountEl.textContent = todaySessions.length;
        this.currentStreakEl.textContent = this.calculateStreak();
    }

    updateHistory() {
        const recentSessions = this.data.sessions.slice(0, 10);
        
        if (recentSessions.length === 0) {
            this.sessionHistoryEl.innerHTML = '<p class="no-sessions">No sessions yet. Start your first study session!</p>';
            return;
        }
        
        const historyHTML = recentSessions.map(session => {
            const date = new Date(session.date);
            const timeStr = date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            const dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
            
            return `
                <div class="session-item">
                    <div class="session-header">
                        <span class="session-time">${dateStr} at ${timeStr}</span>
                        <span class="session-duration">${this.formatDuration(session.duration)}</span>
                    </div>
                    <div class="session-notes">${session.notes}</div>
                </div>
            `;
        }).join('');
        
        this.sessionHistoryEl.innerHTML = historyHTML;
    }

    getTodaySessions() {
        const today = new Date().toDateString();
        return this.data.sessions.filter(session => {
            const sessionDate = new Date(session.date).toDateString();
            return sessionDate === today;
        });
    }

    calculateStreak() {
        // Simple streak calculation - days with at least 1 session
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 30; i++) { // Check last 30 days
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateStr = checkDate.toDateString();
            
            const hasSessions = this.data.sessions.some(session => {
                return new Date(session.date).toDateString() === dateStr;
            });
            
            if (hasSessions) {
                streak++;
            } else if (i > 0) { // Don't break on today if no sessions yet
                break;
            }
        }
        
        return streak;
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    formatDuration(ms) {
        const totalMinutes = Math.floor(ms / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductivityClock();
});