export interface SpinHistoryEntry {
  id: string;
  timestamp: Date;
  selectedSlice: number;
  sliceLabel: string;
  rotation: number;
  sliceId: string; // Add unique identifier for each slice
}

export type SpinHistory = SpinHistoryEntry[];