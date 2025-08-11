# Productivity Clock 🕐

A comprehensive web-based productivity tracking app with **Firebase integration** to help you monitor your study sessions, track daily goals, and sync data across all your devices.

## 🚀 Live Demo
Deploy this app to Firebase Hosting or GitHub Pages and access it anywhere!

## ✨ Key Benefits
- **Cross-device sync** - Start on phone, continue on laptop
- **Cloud backup** - Never lose your productivity data
- **Offline support** - Works without internet, syncs when back online
- **Google Sign-in** - Secure authentication
- **Guest mode** - Use without signing in (local storage only)

## Features

### 🕐 Live Clock
- Real-time digital clock display
- Current date with day of the week
- Productivity hour indicator (green during productive hours, red during rest hours)
- Customizable productive hours (default: 8 AM - 10 PM)

### ⏱️ Study Timer
- Start, pause, and stop study sessions
- Real-time session timer display
- Minimum 1-minute session requirement
- Session notes capture after each study period

### 🎯 Daily Goal Tracking
- Customizable daily study goal (in hours)
- Visual progress bar showing completion percentage
- Real-time goal status updates
- Goal achievement notifications

### 📊 Statistics Dashboard
- Total time studied today
- Number of completed sessions
- Current study streak (consecutive days)
- Session history with notes

### 📝 Session Management
- Automatic session logging
- Optional notes for each session
- Session history with timestamps
- Data persistence using localStorage

### 🏆 Productivity Insights
- Track when you study most effectively
- Visual indicators for productive vs rest hours
- Streak tracking for motivation
- Historical session data

## How to Use

1. **Set Your Daily Goal**: Adjust the daily goal slider to your target study hours
2. **Start a Session**: Click "Start" to begin timing your study session
3. **Pause/Resume**: Use "Pause" to take breaks without ending the session
4. **End Session**: Click "Stop" to complete your session
5. **Add Notes**: Optionally describe what you studied in the popup modal
6. **Track Progress**: Monitor your daily progress and streak in the dashboard

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+ modules)
- **Backend**: Firebase Firestore (NoSQL database)
- **Authentication**: Firebase Auth with Google Sign-in
- **Hosting**: Firebase Hosting or GitHub Pages
- **Storage**: Cloud Firestore + localStorage fallback
- **Responsive**: Mobile-friendly design
- **Real-time**: Live data sync across devices

## Customization

You can customize several aspects of the app:

- **Productive Hours**: Modify the `productiveHours` object in `script.js`
- **Colors**: Update the CSS color scheme in `styles.css`
- **Goal Limits**: Adjust min/max values in the HTML input element
- **Session History**: Change the number of stored sessions (default: 50)

## 🔧 Setup & Deployment

### Option 1: Firebase Hosting (Recommended)

1. **Create Firebase Project**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize project
   firebase init
   ```

2. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project
   - Enable Firestore Database
   - Enable Authentication (Google provider)
   - Copy config to `firebase-config.js`

3. **Setup Firebase Config (IMPORTANT - Security)**
   ```bash
   # Copy the template file
   cp firebase-config.template.js firebase-config.js
   
   # Edit firebase-config.js with your actual Firebase config
   # DO NOT commit firebase-config.js to git (it's in .gitignore)
   ```
   
   Replace the placeholder values in `firebase-config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

### Option 2: GitHub Pages

1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/yourusername/productivity-clock.git
   cd productivity-clock
   ```

2. **Setup Firebase Config**
   ```bash
   # Copy template and edit with your Firebase config
   cp firebase-config.template.js firebase-config.js
   # Edit firebase-config.js with your actual Firebase project details
   ```

3. **Deploy to GitHub Pages**
   ```bash
   # Add firebase-config.js to .gitignore (already included)
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```
   - Enable GitHub Pages in repository settings
   - Select source branch (main/master)
   
   **⚠️ IMPORTANT**: Never commit `firebase-config.js` to your public repository!

### Option 3: Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/productivity-clock.git
   cd productivity-clock
   ```

2. **Serve Locally**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open Browser**
   - Navigate to `http://localhost:8000`

## 🔐 Security & Privacy

### Firebase Security Rules
The app includes secure Firestore rules:
- Users can only access their own data
- Authentication required for cloud features
- Guest mode uses local storage only

### API Key Protection
**🚨 CRITICAL**: Your Firebase config contains sensitive API keys!

✅ **What's Safe:**
- `firebase-config.template.js` - Template file (safe to commit)
- `.gitignore` - Protects your actual config

❌ **NEVER Commit:**
- `firebase-config.js` - Contains your actual API keys
- `.env` files with credentials
- Any file with real Firebase config

### Best Practices:
1. Always use the template → copy → edit workflow
2. Double-check `.gitignore` includes `firebase-config.js`
3. Use environment variables for production deployments
4. Regularly rotate API keys if compromised

## 📱 Data Storage

**With Firebase (Signed In):**
- Real-time sync across devices
- Cloud backup of all sessions
- Automatic data persistence
- Offline support with sync

**Guest Mode:**
- Local browser storage only
- Data stays on current device
- No account required
- Privacy-focused

## 🌐 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🚀 Getting Started

### Quick Start (Local)
1. Open `index.html` in your browser
2. Choose "Continue as Guest" or sign in with Google
3. Set your daily study goal
4. Start your first study session!

### Production Setup
1. Follow Firebase setup instructions above
2. Deploy to Firebase Hosting or GitHub Pages
3. Share the URL and access from anywhere!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Studying! 📚✨**

*Built with ❤️ for productive learners everywhere*