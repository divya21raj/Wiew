import { YouTube } from '@material-ui/icons';
import FolderIcon from '@material-ui/icons/Folder';
import LocalMediaController from '../../components/Buttons/MediaController/LocalMediaController';
import YouTubeController from '../../components/Buttons/MediaController/YouTubeController';
import { Media, MULTI } from './media';
import { MediaSource } from './MediaSource';

export interface MediaAction {
  name: keyof Media | string;
  value: any;
}

export const SOURCEMAP: { [id: string]: MediaSource } = {
  YT: new MediaSource('YT', YouTube, YouTubeController),
  LOCAL: new MediaSource('LOCAL', FolderIcon, LocalMediaController),
};

export const initialLocalMedia: Media = {
  url: 'https://www.youtube.com/watch?v=br0NW9ufUUw',
  source: SOURCEMAP.YT,
  playing: false,
  timestamp: 0,
  fileName: '',
};

export function localMediaReducer(state: Media, action: MediaAction) {
  if (action.name === MULTI) {
    return { ...state, ...action.value };
  }
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}
