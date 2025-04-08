// API Model IDs
export const API_MODELS = {
  ROOM_REDESIGN: '05e491a9-2f93-4991-b141-ecbfc60fe44c',
  ROOM_RESTYLE: 'a6d1ad03-4486-48c4-930a-93ec3953490b',
  ROOM_REPAINT: 'c69daddf-97b9-417a-89db-300e0f3eaf7e',
};

// API Deployment Names
export const API_DEPLOYMENT_NAMES = {
  ROOM_REDESIGN: 'Room Redesign with Text',
  ROOM_RESTYLE: 'Room Restyle',
  ROOM_REPAINT: 'Room Repaint',
};

// Default Room Images
export const DEFAULT_ROOM_IMAGES = {
  REDESIGN: 'https://cdn.mediamagic.dev/media/ce0b877c-7a43-11ef-a5ee-30d042e69440.jpg',
  RESTYLE: 'https://cdn.mediamagic.dev/media/e81aa846-797f-11ef-a5ee-30d042e69440.jpg',
  REPAINT: 'https://cdn.mediamagic.dev/media/e81aa846-797f-11ef-a5ee-30d042e69440.jpg',
};

// API Status
export const API_STATUS = {
  PENDING: 'pending',
  COMPLETE: 'complete',
  FAILED: 'failed',
};

// API Polling Configuration
export const API_POLLING = {
  MAX_RETRIES: 10,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
};