export interface SpinHistoryEntry {
  id: string;
  timestamp: Date;
  selectedSlice: number;
  sliceLabel: string;
  rotation: number;
  sliceId: string;
  sliceNumber: number; // Add slice number for tracking
}

export type SpinHistory = SpinHistoryEntry[];