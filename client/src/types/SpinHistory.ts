export interface SpinHistoryEntry {
  id: string;
  timestamp: Date;
  selectedSlice: number;
  sliceLabel: string;
  rotation: number;
}

export type SpinHistory = SpinHistoryEntry[];
