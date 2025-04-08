import {BASE_URL} from '@env';

export const IDLE = 'idle';
export const PENDING = 'pending';
export const RESOLVED = 'resolved';
export const REJECTED = 'rejected';

const ApiConfig = {
  BASE_URL: BASE_URL,
  ROOM_DEPLOYMENT: 'deployments',
};

export default ApiConfig;
