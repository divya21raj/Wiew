import { YouTube } from '@material-ui/icons';
import FolderIcon from '@material-ui/icons/Folder';
import LocalMediaController from '../../components/Buttons/MediaController/LocalMediaController';
import YouTubeController from '../../components/Buttons/MediaController/YouTubeController';
import { MediaSource } from './MediaSource';

export const MULTI = 'SET_MULTIPLE';

export const SOURCEMAP = {
  YT: new MediaSource('Youtube', YouTube, YouTubeController),
  LOCAL: new MediaSource('Local', FolderIcon, LocalMediaController),
};

export interface Media {
  url: string;
  source: MediaSource;
  fileName: string;
  playing: boolean;
  timestamp: number;
}

export const docToMedia = (doc: any) => {
  console.log(doc);
  const media: Media = {
    url: doc.url,
    source: doc.source.toString(),
    playing: doc.playing,
    timestamp: doc.timestamp,
    fileName: doc.fileName,
  };

  return media;
};

export function instanceOfMedia(object: any): object is Media {
  return 'source' in object;
}
