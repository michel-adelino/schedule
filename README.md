# 🎭 Dance Rehearsal Scheduler

A comprehensive drag-and-drop calendar application for managing dance rehearsal schedules with multi-room studio support, conflict detection, and dancer management.

## ✨ Features

### 🎯 Core Functionality
- **Drag & Drop Scheduling**: Intuitively drag routines from the sidebar to calendar slots
- **Multi-Room Studios**: Support for 1-8 customizable studio rooms
- **Conflict Detection**: Automatic detection of dancer double-bookings with detailed warnings
- **Real-time Hour Tracking**: Each routine displays total scheduled hours
- **Week Navigation**: Navigate between weeks with easy controls

### 🔍 Search & Discovery
- **Routine Search**: Search by song title, genre, teacher, or dancer names
- **Dancer Search**: Dedicated modal to find dancers and view their schedules
- **Visual Highlighting**: Search results highlight relevant dancers in the calendar

### 📧 Communication
- **Email Schedules**: Generate and preview personalized schedules for each dancer
- **Schedule Finalization**: Lock schedules to prevent accidental changes
- **Conflict Resolution**: Detailed conflict modal with resolution options

### 🎨 User Experience
- **Responsive Design**: Works on desktop and tablet devices
- **Smooth Animations**: Framer Motion powered transitions
- **Intuitive Interface**: Clean, modern UI with Tailwind CSS
- **Real-time Feedback**: Toast notifications for all actions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scedule
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎮 How to Use

### Basic Workflow

1. **View Routines**: Browse the left sidebar to see all available routines
2. **Schedule Rehearsals**: Drag routines from the sidebar to calendar time slots
3. **Manage Studios**: Use the studio selector (1-8 studios) in the header
4. **Handle Conflicts**: When conflicts occur, review the detailed conflict modal
5. **Search Dancers**: Use "Find Dancers" to search and view individual schedules
6. **Email Schedules**: Generate and preview personalized schedules
7. **Finalize**: Lock the schedule when ready

### Key Interactions

- **Click routines** → View detailed information (dancers, teacher, notes)
- **Drag routines** → Schedule rehearsals on the calendar
- **Drag scheduled items** → Move existing rehearsals to different times/studios
- **Search** → Find specific routines or dancers quickly
- **Studio selector** → Customize number of available studios (1-8)

### Conflict Resolution

When scheduling creates conflicts:
1. Review the conflict details in the modal
2. See which dancers are double-booked
3. Choose to "Schedule Anyway" or "Cancel"
4. System tracks all conflicts for transparency

## 🏗️ Technical Architecture

### Tech Stack
- **React 18** with TypeScript
- **React DnD** for drag-and-drop functionality
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **React Hot Toast** for notifications
- **Vite** for build tooling

### Key Components

- **App.tsx**: Main application logic and state management
- **CalendarGrid.tsx**: Calendar display with drag-drop zones
- **RoutineListPanel.tsx**: Sidebar with routine list and search
- **RoutineDrawer.tsx**: Detailed routine information modal
- **ConflictModal.tsx**: Conflict resolution interface
- **DancerSearchModal.tsx**: Dancer search and schedule viewer
- **CalendarHeader.tsx**: Navigation and controls

### Data Structure

```typescript
interface Routine {
  id: string;
  songTitle: string;
  genre: string;
  teacher: string;
  dancers: Dancer[];
  notes: string;
  totalHours: number;
}

interface ScheduledItem {
  id: string;
  routineId: string;
  routine: Routine;
  day: number;        // 0-6 (Monday-Sunday)
  startTime: number;  // Time slot index
  duration: number;   // Hours
  studio: number;     // Studio index (0-based)
}
```

## 🎯 Demo Features

The application includes demo data to showcase all features:

- **10 Sample Routines**: Various dance genres (Ballet, Hip Hop, Contemporary, etc.)
- **10 Sample Dancers**: With realistic names and initials
- **Pre-scheduled Rehearsals**: Some routines already scheduled for demonstration
- **Conflict Scenarios**: Try scheduling overlapping rehearsals to see conflict detection

## 🔧 Customization

### Adding New Routines
Edit `src/data/mockData.ts` to add new routines:

```typescript
{
  id: 'unique-id',
  songTitle: 'Your Song Title',
  genre: 'Dance Genre',
  teacher: 'Teacher Name',
  dancers: [/* array of dancer objects */],
  notes: 'Special notes or requirements',
  totalHours: 0,
}
```

### Modifying Time Slots
Update the `timeSlots` array in `mockData.ts` to change available time slots.

### Styling
The application uses Tailwind CSS. Modify component classes or extend the Tailwind config for custom styling.

## 📱 Responsive Design

- **Desktop**: Full feature set with optimal layout
- **Tablet**: Responsive grid with touch-friendly interactions
- **Mobile**: Optimized for smaller screens (basic functionality)

## 🚀 Future Enhancements

- **Backend Integration**: Connect to a real database
- **User Authentication**: Multi-user support with roles
- **Advanced Scheduling**: Recurring rehearsals, availability tracking
- **Mobile App**: React Native version
- **Analytics**: Usage statistics and reporting
- **Export Features**: PDF schedules, calendar integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for dance studios and choreographers**
