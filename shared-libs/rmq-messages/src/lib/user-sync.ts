export const USER_SYNC_EXCHANGE = 'user.sync';

export const USER_SYNC_QUEUES = {
  CARD: 'card-user-sync',
  REPORT: 'report-user-sync',
} as const;

export type UserSyncAction = 'upsert' | 'delete';

export interface UserSyncMessage {
  action: UserSyncAction;
  userId: string;
  isActive?: boolean;
}
