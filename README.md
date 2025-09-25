# Kronaut Timer

A sophisticated Progressive Web App (PWA) timer with voice commands, text-to-speech, and task automation capabilities.

## Features

### 🎨 Beautiful Design
- Navy gradient background with mint green accents
- Responsive design for mobile, tablet, and desktop
- Smooth animations with Framer Motion
- Poppins typography for modern aesthetics

### ⏰ Advanced Timer Functionality
- Preset timers (5, 10, 15, 20, 30 minutes)
- Custom duration input (hours and minutes)
- Visual progress ring with color transitions
- Pause, resume, and stop controls
- **Always-visible adjustment box** to add or remove minutes during countdown

### 🔊 Voice & Speech Features
- **Voice Recognition**: Speak your timer commands and tasks
- **Text-to-Speech**: Audio announcements and reminders
- **Smart Task Parsing**: Understands "Call John", "WhatsApp Sarah", etc.

### 📱 Three Action Types

1. **📢 Announcement**
   - Custom voice reminders
   - Plays TTS reminder, then **auto-returns to home screen after 5 seconds**

2. **⏰ Alarm**
   - Simple alarm sound on completion
   - Loops until stopped via an overlay

3. **✅ Task Automation**
   - **Phone Calls**: `tel:` deep links
   - **WhatsApp**: Direct messaging links
   - **Email**: `mailto:` integration
   - **Websites**: Auto-open URLs
   - **Returns to home screen** after attempting to open the link
   - Fallback options for blocked links

### 🔔 Smart Notifications
- Browser notifications with permission handling
- Service Worker integration for background alerts
- PWA installation support
- Cross-platform notification compatibility

### 🛡️ Comprehensive Error Handling
- Microphone permission validation
- Invalid input detection
- Deep link fallback systems
- TTS failure overlay

## Platform Compatibility

### ✅ Fully Supported
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: All voice, notification, and deep linking features

### ⚠️ Limited Support
- **WebContainer/StackBlitz**: Service Workers disabled (development only)
- **Older Browsers**: Voice recognition may not be available
- **iOS**: Some deep link restrictions apply

### 🔧 Platform-Specific Notes

#### iOS
- **Voice Recognition**: Requires user interaction to start
- **Notifications**: May require app to be added to home screen
- **Deep Links**: Some restrictions on app-to-app communication

#### Android
- **Voice Recognition**: Full support in Chrome
- **Notifications**: Excellent support with service workers
- **Deep Links**: Complete integration with installed apps

#### Desktop
- **Voice Recognition**: Best support in Chrome
- **Notifications**: Full desktop notification support
- **Deep Links**: Opens default applications

## Development Setup

### Prerequisites
- Node.js 18+ 
- Yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Building for Production
```bash
# Build the application
yarn build

# Preview production build
yarn preview
```

## Deployment

### Netlify (Recommended)
1. Connect your repository to Netlify
2. Build command: `yarn build`
3. Publish directory: `dist`
4. The `_redirects` file handles SPA routing

### PWA Installation
1. Deploy to HTTPS (required for PWA features)
2. Add `icon-192.png` and `icon-512.png` to `/public/`
3. Users can "Add to Home Screen" on mobile devices

## Usage Guide

### Basic Timer Setup
1. **Duration**: Choose preset or enter custom time
2. **Action**: Select announcement, alarm, or task
3. **Review**: Confirm settings and start timer

### Voice Commands
- **Announcements**: "Remind me to take a break"
- **Tasks**: 
  - "Call John Smith"
  - "WhatsApp Sarah"
  - "Email alex@company.com"
  - "Open google.com"

### Timer Controls
- **Pause/Resume**: Control timer execution
- **Adjust**: Add or remove minutes via the visible adjustment box
- **Stop**: Emergency stop with confirmation

### Completion Actions
- **Announcements**: TTS playback, then auto-return after 5 seconds
- **Tasks**: Auto-launch apps, then return to the home screen
- **Alarms**: Audio alert with manual stop

## Technical Architecture

### Frontend Stack
- **React 19**: Component framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Lucide React**: Icon library

### PWA Features
- **Manifest**: App installation metadata
- **Service Worker**: Background notifications
- **Offline Support**: Basic caching strategy

### Browser APIs
- **Web Speech API**: Voice recognition and synthesis
- **Notifications API**: Cross-platform alerts
- **MediaDevices**: Microphone access

## Contributing

### Code Style
- ESLint configuration included
- TypeScript strict mode enabled

### Testing
```bash
# Run linting
yarn lint

# Type checking
yarn build
```

## License

© 2025 Joshi Associates. All Rights Reserved.

---

**Note**: Service Worker features are automatically disabled in development environments like StackBlitz but will work correctly when deployed to production hosting platforms.
