import { YouTube } from '@material-ui/icons';
import FolderIcon from '@material-ui/icons/Folder';
import LocalMediaController from '../../components/Buttons/MediaController/LocalMediaController';
import YouTubeController from '../../components/Buttons/MediaController/YouTubeController';
import { MediaSource } from './MediaSource';

export const MULTI = 'SET_MULTIPLE';

export const SOURCEMAP: { [id: string]: MediaSource } = {
  YT: new MediaSource('YT', YouTube, YouTubeController),
  LOCAL: new MediaSource('LOCAL', FolderIcon, LocalMediaController),
};

export interface Media {
  url: string;
  source: MediaSource;
  fileName: string;
  playing: boolean;
  timestamp: number;
}

export const docToMedia = (doc: any) => {
  if ('source' in doc) {
    const source: string = doc.source;
    doc = { ...doc, source: SOURCEMAP[source] };
  }
  return doc;
};

export const mediaToDoc = (doc: any) => {
  const media: Media = {
    url: doc.url ? doc.url : '',
    source: doc.source ? doc.source.toString() : SOURCEMAP.LOCAL.toString(),
    playing: doc.playing ? doc.playing : false,
    timestamp: doc.timestamp ? doc.timestamp : 0,
    fileName: doc.fileName ? doc.fileName : '',
  };

  return media;
};

export function instanceOfMedia(object: any): object is Media {
  return 'source' in object;
}
