export interface HistoryItem {
  _id: string;
  ascentType?: string;
  comment?: string;
  completedAt: string;
  user?: {
    username?: string;
    email?: string;
  };
}

export interface HistoryRecord {
  _id: string;
  ascentType?: string;
  attempts?: number;
  comment?: string;
  completedAt?: string;
  boulder: {
    name: string;
    grade: string;
  } | null;
}
