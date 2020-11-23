import { MediaSource } from './MediaSource';
import { pickBy } from 'lodash';
import { SOURCEMAP } from './mediaReducers';
import { removeUndefineds } from '../../utils';

export const MULTI = 'SET_MULTIPLE';

export interface Media {
  url: string;
  source: MediaSource;
  fileName: string;
  playing: boolean;
  timestamp: number;
}

export const mediaToDoc = (doc: any) => {
  console.log(doc);
  const media: Media = {
    url: doc.url,
    source: doc.source.toString(),
    playing: doc.playing,
    timestamp: doc.timestamp,
    fileName: doc.fileName,
  };

  return removeUndefineds(media);
};

export const docToMedia = (doc: any) => {
  if ('source' in doc) {
    const source: string = doc.source;
    doc = { ...doc, source: SOURCEMAP[source] };
  }
  return doc;
};

export function instanceOfMedia(object: any): object is Media {
  return 'source' in object;
}
