export interface SpinHistoryEntry {
  id: string;
  timestamp: Date;
  selectedSlice: number;
  sliceLabel: string;
  rotation: number;
  sliceId: string; // Add unique identifier for each slice
  settings?: {
    rotation: number;
    velocity: number;
    duration: number;
  };
}

export type SpinHistory = SpinHistoryEntry[];