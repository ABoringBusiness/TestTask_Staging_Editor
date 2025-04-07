import apiClient from '../services/Client';
import ApiConfig from '../services/ApiConfig';

interface RoomRedesignArgs {
  Prompt: string;
  'Room Photo': string;
}

interface RoomRestyleArgs {
  'Room Photo': string;
  'Space Name': string;
  'Space Style': string;
}

export interface RoomPaintArgs {
  Color: string;
}

export interface DeployRoomRePaintPayload {
  name: string;
  model_id: string;
  args: {
    'Room Photo': string;
    Color: string;
    Area: string;
  };
}

interface DeployRoomReStylePayload {
  name: string;
  model_id: string;
  args: RoomRestyleArgs;
}

interface DeployPayload<T> {
  name: string;
  model_id: string;
  args: T;
}

export const deployRoomRedesign = async (prompt: any) => {
  const payload: DeployPayload<RoomRedesignArgs> = {
    name: 'Room Redesign with Text',
    model_id: '05e491a9-2f93-4991-b141-ecbfc60fe44c',
    args: {
      Prompt: prompt || 'add a fan',
      'Room Photo':
        'https://cdn.mediamagic.dev/media/ce0b877c-7a43-11ef-a5ee-30d042e69440.jpg',
    },
  };

  try {
    const response = await apiClient.post(ApiConfig.ROOM_DEPLOYMENT, payload);
    console.log('Room Redesign API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in deployRoomRedesign:', error);
    return null;
  }
};

export const deployRoomReStyle = async (prompt?: Partial<RoomRestyleArgs>) => {
  console.log(prompt);
  const payload: DeployRoomReStylePayload = {
    name: 'Room Restyle',
    model_id: 'a6d1ad03-4486-48c4-930a-93ec3953490b',
    args: {
      'Room Photo':
        prompt?.['Room Photo'] ??
        'https://cdn.mediamagic.dev/media/e81aa846-797f-11ef-a5ee-30d042e69440.jpg',
      'Space Name': prompt?.['Space Name'] ?? 'Bed and Living Room',
      'Space Style': prompt?.['Space Style'] ?? 'Modern',
    },
  };

  try {
    const response = await apiClient.post(ApiConfig.ROOM_DEPLOYMENT, payload);
    console.log('Room Restyle API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deploying room restyle:', error);
    throw error;
  }
};

export const deployRoomRepaint = async (colorArgs?: Partial<RoomPaintArgs>) => {
  console.log(colorArgs);
  const payload: DeployRoomRePaintPayload = {
    name: 'Room Repaint',
    model_id: 'c69daddf-97b9-417a-89db-300e0f3eaf7e',
    args: {
      'Room Photo':
        'https://cdn.mediamagic.dev/media/e81aa846-797f-11ef-a5ee-30d042e69440.jpg',
      Color: colorArgs?.Color || 'pink',
      Area: 'floor',
    },
  };

  try {
    const response = await apiClient.post(ApiConfig.ROOM_DEPLOYMENT, payload);
    console.log('Room Restyle API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deploying room restyle:', error);
    throw error;
  }
};
