// Grid and widget configuration constants
export const GRID_SIZE = 150
export const TITLE_AREA_HEIGHT = 80 // Reserved height for title areas at the top

export const WIDGET_SIZES = {
  '1x1': { cols: 1, rows: 1, width: GRID_SIZE, height: GRID_SIZE },
  '2x1': { cols: 2, rows: 1, width: GRID_SIZE * 2, height: GRID_SIZE },
  '2x2': { cols: 2, rows: 2, width: GRID_SIZE * 2, height: GRID_SIZE * 2 },
  '3x1': { cols: 3, rows: 1, width: GRID_SIZE * 3, height: GRID_SIZE },
  '1x2': { cols: 1, rows: 2, width: GRID_SIZE, height: GRID_SIZE * 2 },
  '3x3': { cols: 3, rows: 3, width: GRID_SIZE * 3, height: GRID_SIZE * 3 }
}

// Sample data for different widget types
export const SAMPLE_CHART_DATA = [
  { month: 'Jan', sales: 120, expenses: 80 },
  { month: 'Feb', sales: 190, expenses: 130 },
  { month: 'Mar', sales: 300, expenses: 200 },
  { month: 'Apr', sales: 280, expenses: 180 },
  { month: 'May', sales: 420, expenses: 280 },
  { month: 'Jun', sales: 380, expenses: 220 }
]

export const SAMPLE_FUNNEL_DATA = [
  { id: 'step_1', value: 1000, label: 'Website Visitors' },
  { id: 'step_2', value: 800, label: 'Product Views' },
  { id: 'step_3', value: 600, label: 'Add to Cart' },
  { id: 'step_4', value: 400, label: 'Checkout' },
  { id: 'step_5', value: 200, label: 'Purchase' }
]

export const SAMPLE_METRICS = [
  { title: 'This Month', subtitle: '1 Jul - 30 Jul', value: '99', color: '#ef4444' },
  { title: 'Total Users', subtitle: 'Active this week', value: '1.2K', color: '#3b82f6' },
  { title: 'Revenue', subtitle: 'Current month', value: '$45K', color: '#10b981' },
  { title: 'Conversion', subtitle: 'Last 30 days', value: '3.2%', color: '#f59e0b' },
  { title: 'Sessions', subtitle: 'Today', value: '847', color: '#8b5cf6' }
]