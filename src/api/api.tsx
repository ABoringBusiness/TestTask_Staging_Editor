import apiClient from '../services/Client';
import ApiConfig from '../services/ApiConfig';

// Base interface for all room modification arguments
interface BaseRoomArgs {
  'Room Photo': string;
}

// Individual room modification interfaces
export interface RoomRedesignArgs extends BaseRoomArgs {
  Prompt: string;
}

export interface RoomRestyleArgs extends BaseRoomArgs {
  'Space Name': string;
  'Space Style': string;
}

export interface RoomPaintArgs extends BaseRoomArgs {
  Color: string;
  Area: string;
}

export interface FaceSwap {
  input_image: string;
  swap_image: string;
}

export interface ThreeDPhoto {
  Animation_type: string;
  Image: string;
}

export interface VideoEnhancement {
  model: string;
  resolution: string;
  video_path: string;
}

export interface RemoveBackground {
  bg_color: string;
  input_video: string;
}

// Generic payload interface for all deployments
interface DeployPayload<T> {
  name: string;
  model_id: string;
  args: T;
}

// Constants for model IDs and default values
const MODEL_IDS = {
  REDESIGN: '05e491a9-2f93-4991-b141-ecbfc60fe44c',
  RESTYLE: 'a6d1ad03-4486-48c4-930a-93ec3953490b',
  REPAINT: 'c69daddf-97b9-417a-89db-300e0f3eaf7e',
  FACE_SWAP: 'e42a6ed5-215f-4185-b097-1ad38c834628',
  VIDEO_ENHANCEMENT: '45114538-efe7-4ea8-882e-385186ee42cd',
  THREE_D_PHOTO: '192b12f5-cd43-4022-9685-90c60e6117ce',
  REMOVE_BACKGROUND : '66a114c4-1d90-431c-b621-85408a5ef225'
};

const DEFAULT_ROOM_PHOTO =
  'https://cdn.mediamagic.dev/media/e81aa846-797f-11ef-a5ee-30d042e69440.jpg';

async function deployRoom<T>(
  name: string,
  modelId: string,
  args: T,
): Promise<any> {
  const payload: DeployPayload<T> = {name, model_id: modelId, args};

  try {
    const response = await apiClient.post(ApiConfig.ROOM_DEPLOYMENT, payload);
    console.log(`${name} API Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error in ${name}:`, error);
    throw error; // Consistent error handling
  }
}

export const deployRoomRedesign = async (
  prompt?: string,
  roomPhoto?: string,
): Promise<any> => {
  return deployRoom<RoomRedesignArgs>(
    'Room Redesign with Text',
    MODEL_IDS.REDESIGN,
    {
      Prompt: prompt || 'add a fan',
      'Room Photo': roomPhoto || DEFAULT_ROOM_PHOTO,
    },
  );
};

export const deployRoomReStyle = async (
  args?: Partial<RoomRestyleArgs>,
): Promise<any> => {
  return deployRoom<RoomRestyleArgs>('Room Restyle', MODEL_IDS.RESTYLE, {
    'Room Photo': args?.['Room Photo'] ?? DEFAULT_ROOM_PHOTO,
    'Space Name': args?.['Space Name'] ?? 'Bed and Living Room',
    'Space Style': args?.['Space Style'] ?? 'Modern',
  });
};

export const deployRoomRepaint = async (
  args?: Partial<RoomPaintArgs>,
): Promise<any> => {
  return deployRoom<RoomPaintArgs>('Room Repaint', MODEL_IDS.REPAINT, {
    'Room Photo': args?.['Room Photo'] ?? DEFAULT_ROOM_PHOTO,
    Color: args?.Color ?? 'pink',
    Area: args?.Area ?? 'floor',
  });
};

export const faceSwap = async (args?: Partial<FaceSwap>): Promise<any> => {
  return deployRoom<FaceSwap>('Face Swap Premium', MODEL_IDS.FACE_SWAP, {
    input_image: DEFAULT_ROOM_PHOTO,
    swap_image: args?.swap_image || '',
  });
};

export const deployThreeDPhoto = async (
  args?: Partial<ThreeDPhoto>,
): Promise<any> => {
  return deployRoom<ThreeDPhoto>('Styley 3D Photo', MODEL_IDS.THREE_D_PHOTO, {
    Animation_type: 'DOLLY',
    Image: args?.Image || '',
  });
};

export const deployVideoEnhancement = async (
  args?: Partial<VideoEnhancement>,
): Promise<any> => {
  return deployRoom<VideoEnhancement>(
    'Video Enhancement',
    MODEL_IDS.VIDEO_ENHANCEMENT,
    {
      model: 'RealESRGAN_x4plus',
      resolution: 'FHD',
      video_path: args?.video_path || '',
    },
  );
};

export const deployRemoveBackground = async (
  args?: Partial<RemoveBackground>,
): Promise<any> => {
  console.log('args', args);
  console.log('args input_video', args?.input_video);
  return deployRoom<RemoveBackground>(
    'Remove Video Background',
    MODEL_IDS.REMOVE_BACKGROUND,
    {
      bg_color: '#00FF00',
      input_video: args?.input_video || '',
    },
  );
};

