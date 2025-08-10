# Productivity Clock 🕐

A comprehensive web-based productivity tracking app to help you monitor your study sessions, track daily goals, and identify your most productive hours.

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

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Browser localStorage for data persistence
- **Responsive**: Mobile-friendly design
- **No Dependencies**: Pure vanilla JavaScript implementation

## Customization

You can customize several aspects of the app:

- **Productive Hours**: Modify the `productiveHours` object in `script.js`
- **Colors**: Update the CSS color scheme in `styles.css`
- **Goal Limits**: Adjust min/max values in the HTML input element
- **Session History**: Change the number of stored sessions (default: 50)

## Data Storage

All data is stored locally in your browser using localStorage:
- Daily goals and preferences
- Session history with timestamps and notes
- Study streaks and statistics
- Total time studied per day

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Getting Started

1. Open `index.html` in your web browser
2. Set your daily study goal
3. Start your first study session
4. Begin tracking your productivity journey!

---

**Happy Studying! 📚✨**