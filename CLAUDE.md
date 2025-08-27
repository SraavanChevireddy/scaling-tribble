# Hackathon Dashboard Project

**Built with ❤️ for Hackathon by SonaType India**

## 🚀 Project Overview

A professional React dashboard application with draggable, resizable widgets inspired by iPhone dashboard interactions. Features smooth animations, collision detection, and multiple widget types.

## 📁 Project Structure

```
hackathon-app/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Comprehensive styling
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── package.json         # Dependencies
└── CLAUDE.md           # This documentation
```

## 🛠 Tech Stack

- **React 18** with Hooks (useState, useRef, useCallback)
- **Vite** - Fast build tool (switched from create-react-app due to installation issues)
- **Nivo Charts** - Data visualization library
- **CSS3** - Advanced animations with cubic-bezier easing
- **JavaScript ES6+** - Modern JavaScript features

## ✨ Features Implemented

### 🎯 Core Features
- **Draggable Widgets**: All widgets can be moved around the canvas
- **Collision Detection**: AABB algorithm prevents widget overlapping
- **Smooth Animations**: iPhone-like smooth resize and drag animations
- **Scrollable Canvas**: Vertical scrolling with dynamic height calculation
- **Collapsible Sidebar**: Professional sidebar with widget creation tools

### 📊 Widget Types

#### 1. Basic Widgets
- **Sizes**: 1×1, 2×1, 1×2, 2×2, 3×1 (150px grid system)
- **Features**: Fully draggable and resizable
- **Colors**: Random colors assigned on creation
- **Resize Handle**: Curved handle appears on hover (bottom-right)

#### 2. Chart Widgets
- **Type**: Nivo ResponsiveBar charts
- **Size**: Fixed 3×3 (450×450px)
- **Data**: Sample sales/expenses data
- **Behavior**: Draggable only (no resizing)
- **Features**: Professional chart styling with legends and axes

#### 3. Metric Widgets ⭐
- **Sizes**: Restricted to 1×1 and 2×1 only
- **Layouts**:
  - **1×1**: Single column (vertical) - title, subtitle, large number stacked
  - **2×1**: Two columns (horizontal) - left: title/subtitle, right: number
- **Special Features**:
  - Blur effect during resize (2px blur with smooth transitions)
  - Responsive layout switching
  - Sample data: "This Month", "Total Users", "Revenue", etc.
  - Color-coded values

#### 4. Funnel Chart Widgets 🔻
- **Type**: Nivo ResponsiveFunnel charts
- **Size**: Fixed 2×2 (300×300px)
- **Title**: "Expiring Waivers" - Clean overlay title design
- **Data**: Sample conversion funnel data (Website Visitors → Product Views → Add to Cart → Checkout → Purchase)
- **Behavior**: Draggable only (no resizing)
- **Features**: Optimized margins and sizing to fit perfectly in 2×2 widget space

## 🎨 Design Features

### Visual Design
- **Canvas**: White background with subtle dotted grid pattern
- **Widgets**: Rounded corners (12px), soft shadows, hover effects
- **Glassmorphism**: Sidebar, widget cards, and credit badge use blur effects with backdrop filters
- **Professional Typography**: Arial Rounded MT font family applied project-wide
- **Modern Card UI**: Sophisticated widget creation cards with gradient backgrounds and micro-interactions

### Animations
- **Smooth Resize**: Cubic-bezier easing functions
- **Widget Entrance**: Scale and rotate animation for new widgets
- **Scroll Behavior**: Smooth scrolling to new widgets
- **Hover States**: Subtle transform and shadow changes
- **Card Interactions**: Scale, rotation, and color transition effects on widget cards

## 🎛 Enhanced Sidebar Features

### Modern Widget Creation Interface
- **Glassmorphic Cards**: 2×2 grid layout with semi-transparent cards featuring backdrop blur
- **Smart Search**: Capsule-shaped search bar with real-time filtering functionality
- **Icon System**: Custom SVG icons for each widget type with color-coded themes:
  - **Basic Widget**: Blue theme with plus icon
  - **Metric Widget**: Orange theme with analytics icon  
  - **Bar Chart**: Purple theme with chart icon
  - **Expiring Waivers**: Indigo theme with funnel icon
- **Advanced Interactions**: Hover effects with scale, rotation, and gradient transformations

### Search Functionality
- **Real-time Filtering**: Instant widget card filtering as you type
- **Comprehensive Keywords**: Searches across titles, subtitles, and keyword arrays
- **Smart Matching**: Supports terms like "kpi", "analytics", "waiver", "chart", "funnel"
- **No Results State**: Helpful suggestions when no widgets match search criteria
- **Capsule Design**: Beautiful rounded search input with glassmorphism effects

## 🔧 Key Implementation Details

### Collision Detection
```javascript
const checkCollision = (rect1, rect2) => {
  return !(rect1.x + rect1.width <= rect2.x || 
           rect2.x + rect2.width <= rect1.x || 
           rect1.y + rect1.height <= rect2.y || 
           rect2.y + rect2.height <= rect1.y)
}
```

### Grid System
```javascript
const GRID_SIZE = 150
const WIDGET_SIZES = {
  '1x1': { cols: 1, rows: 1, width: 150, height: 150 },
  '2x1': { cols: 2, rows: 1, width: 300, height: 150 },
  // ... more sizes
}
```

### Metric Widget Layouts
- **1×1**: `flex-direction: column` - vertical stacking
- **2×1**: `flex-direction: row` - horizontal layout with left/right sections

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation & Development
```bash
# Navigate to project
cd /Users/chevireddysraavan.kumarreddy/Desktop/hackathon-app/

# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Dependencies
```json
{
  "@nivo/bar": "^0.87.0",
  "@nivo/funnel": "^0.87.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

## 📝 Development Journey

### Initial Setup
1. Started with create-react-app (failed due to npm issues)
2. Switched to Vite for faster development
3. Created basic white canvas with dotted background

### Widget Evolution
1. **Basic Rectangles**: Blue (300×100) and orange (100×100) draggable shapes
2. **Collision Detection**: Implemented sophisticated AABB collision prevention
3. **Grid System**: Added iPhone-like widget sizing with smooth snap-to-grid
4. **Resizing**: Added resize handles with smooth animations
5. **Multiple Types**: Extended to support charts and metrics
6. **Funnel Charts**: Added Nivo ResponsiveFunnel widgets with "Expiring Waivers" functionality
7. **UI Modernization**: Complete redesign of sidebar with glassmorphic cards and search functionality

### Key Challenges Solved
- **Collision Flakiness**: Simplified collision detection algorithm
- **Smooth Animations**: Removed jarring mid-drag snapping
- **Layout Responsiveness**: Implemented dynamic canvas height calculation
- **Widget Type Management**: Added type-specific behaviors (resize restrictions)
- **Funnel Chart Formatting**: Fixed ResponsiveFunnel sizing issues with persistent CSS styling
- **Search Performance**: Implemented real-time filtering without performance degradation
- **Component Order Issues**: Resolved function reference errors in widget definitions

### Recent Session Improvements (Latest Update)
1. **Funnel Chart Integration**: Added complete Nivo ResponsiveFunnel support with custom "Expiring Waivers" branding
2. **Typography Overhaul**: Implemented Arial Rounded MT font across entire application for consistent professional appearance
3. **Sidebar Modernization**: 
   - Removed outdated "Widget Tools" section for cleaner interface
   - Redesigned "Add Widget" section with sophisticated glassmorphic cards
   - Added 2×2 grid layout with color-coded themes for each widget type
4. **Advanced Search System**:
   - Capsule-shaped search input with glassmorphism effects
   - Real-time filtering across widget titles, subtitles, and keywords
   - Smart keyword matching (e.g., "kpi" finds "Metric Widget")
   - Helpful no-results state with search suggestions
5. **Enhanced Interactions**:
   - Sophisticated hover animations with scale, rotation, and color transitions
   - Gradient backgrounds and backdrop blur effects throughout UI
   - Improved micro-interactions for professional user experience

## 🎯 Current State

### Fully Functional Features
✅ Draggable widgets with collision detection  
✅ Resizable widgets with smooth animations  
✅ Four widget types (basic, chart, metric, funnel)  
✅ Collapsible sidebar with glassmorphic creation tools  
✅ Professional styling and animations with Arial Rounded MT typography
✅ Metric widget blur effects during resize  
✅ Responsive metric layouts (1×1 vs 2×1)  
✅ Scrollable canvas with dynamic sizing  
✅ **NEW**: Funnel chart widgets with "Expiring Waivers" functionality
✅ **NEW**: Advanced search system with real-time filtering
✅ **NEW**: Modern glassmorphic card-based widget creation interface
✅ **NEW**: Sophisticated hover animations and micro-interactions
✅ **NEW**: Comprehensive keyword-based search functionality

### Sample Data
- **Metrics**: "This Month", "Total Users", "Revenue", "Conversion", "Sessions"
- **Charts**: Monthly sales vs expenses data
- **Funnels**: Website conversion flow (Visitors → Product Views → Cart → Checkout → Purchase)
- **Colors**: Professional color palette with proper contrast and gradient themes

## 🔮 Future Enhancement Ideas

- **Widget Templates**: Pre-designed widget configurations
- **Data Integration**: Connect to real APIs/databases  
- **Export/Import**: Save and load dashboard configurations
- **Widget Library**: More chart types and metric displays
- **Themes**: Dark mode and color theme options
- **Grid Snap**: Optional grid alignment guides
- **Undo/Redo**: Action history management
- **Multi-Dashboard**: Support for multiple dashboard pages

## 💡 Architecture Notes

### State Management
- Single `rectangles` state array manages all widgets
- Each widget has: id, position, size, type, data, and UI states
- Drag and resize states tracked separately for smooth interactions

### Performance Optimizations
- `useCallback` hooks prevent unnecessary re-renders
- Collision detection only runs during drag operations
- CSS transitions handle animations (hardware accelerated)

### Responsive Design
- Dynamic canvas sizing based on content
- Sidebar collapse for smaller screens
- Widget layouts adapt to size constraints

## 📊 Widget Data Structures

### Basic Widget
```javascript
{
  id: 1,
  x: 50, y: 50,
  width: 300, height: 150,
  size: '2x1',
  type: 'widget',
  color: '#3b82f6',
  isDragging: false,
  isResizing: false
}
```

### Metric Widget
```javascript
{
  id: 3,
  x: 200, y: 200,
  width: 150, height: 150,
  size: '1x1',
  type: 'metric',
  metricData: {
    title: 'This Month',
    subtitle: '1 Jul - 30 Jul',
    value: '99',
    color: '#ef4444'
  }
}
```

### Funnel Chart Widget
```javascript
{
  id: 4,
  x: 350, y: 90,
  width: 300, height: 300,
  size: '2x2',
  type: 'funnel',
  funnelData: [
    { id: 'step_1', value: 1000, label: 'Website Visitors' },
    { id: 'step_2', value: 800, label: 'Product Views' },
    { id: 'step_3', value: 600, label: 'Add to Cart' },
    { id: 'step_4', value: 400, label: 'Checkout' },
    { id: 'step_5', value: 200, label: 'Purchase' }
  ],
  isDragging: false,
  isResizing: false
}
```

## 🎨 CSS Architecture

### Key Classes
- `.draggable-rectangle` - Base widget styling
- `.metric-container` - Metric widget container
- `.metric-compact` - 1×1 vertical layout
- `.metric-expanded` - 2×1 horizontal layout
- `.resize-handle` - Resize interaction area
- `.hackathon-credit` - Bottom-right attribution
- **NEW**: `.widget-cards-grid` - 2×2 grid layout for widget creation cards
- **NEW**: `.widget-card` - Individual glassmorphic widget selection cards
- **NEW**: `.widget-card-icon` - Themed icon containers with hover animations
- **NEW**: `.search-input` - Capsule-shaped search bar with blur effects
- **NEW**: `.funnel-content` - Responsive funnel chart container
- **NEW**: `.funnel-title` - Clean overlay title for funnel widgets

### Animation System
- Smooth cubic-bezier transitions
- Hover state management
- Blur effects for interactive feedback
- Scale animations for widget creation
- **NEW**: Glassmorphism effects with backdrop filters
- **NEW**: Card hover animations (scale, rotation, color transitions)
- **NEW**: Search input focus animations with translateY effects
- **NEW**: Gradient background transitions on widget cards
- **NEW**: Sophisticated micro-interactions throughout the interface

---

**Note**: This project demonstrates modern React patterns, smooth animations, and professional UI/UX design suitable for hackathon presentations and portfolio showcases.

**Development Environment**: Built and tested on macOS with Vite development server.