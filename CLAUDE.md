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

## 🎨 Design Features

### Visual Design
- **Canvas**: White background with subtle dotted grid pattern
- **Widgets**: Rounded corners (12px), soft shadows, hover effects
- **Glassmorphism**: Sidebar and credit badge use blur effects
- **Professional Typography**: Consistent font weights and sizes

### Animations
- **Smooth Resize**: Cubic-bezier easing functions
- **Widget Entrance**: Scale and rotate animation for new widgets
- **Scroll Behavior**: Smooth scrolling to new widgets
- **Hover States**: Subtle transform and shadow changes

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

### Key Challenges Solved
- **Collision Flakiness**: Simplified collision detection algorithm
- **Smooth Animations**: Removed jarring mid-drag snapping
- **Layout Responsiveness**: Implemented dynamic canvas height calculation
- **Widget Type Management**: Added type-specific behaviors (resize restrictions)

## 🎯 Current State

### Fully Functional Features
✅ Draggable widgets with collision detection  
✅ Resizable widgets with smooth animations  
✅ Three widget types (basic, chart, metric)  
✅ Collapsible sidebar with creation tools  
✅ Professional styling and animations  
✅ Metric widget blur effects during resize  
✅ Responsive metric layouts (1×1 vs 2×1)  
✅ Scrollable canvas with dynamic sizing  

### Sample Data
- **Metrics**: "This Month", "Total Users", "Revenue", "Conversion", "Sessions"
- **Charts**: Monthly sales vs expenses data
- **Colors**: Professional color palette with proper contrast

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

## 🎨 CSS Architecture

### Key Classes
- `.draggable-rectangle` - Base widget styling
- `.metric-container` - Metric widget container
- `.metric-compact` - 1×1 vertical layout
- `.metric-expanded` - 2×1 horizontal layout
- `.resize-handle` - Resize interaction area
- `.hackathon-credit` - Bottom-right attribution

### Animation System
- Smooth cubic-bezier transitions
- Hover state management
- Blur effects for interactive feedback
- Scale animations for widget creation

---

**Note**: This project demonstrates modern React patterns, smooth animations, and professional UI/UX design suitable for hackathon presentations and portfolio showcases.

**Development Environment**: Built and tested on macOS with Vite development server.