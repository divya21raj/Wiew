import { Media, MULTI, MediaSource } from "./media";

export interface MediaAction {
  name: (keyof Media) | string;
  value: any;
}

export const initialRemoteMedia: Media = {
  url: "",
  source: MediaSource.LOCAL,
  playing: false,
  timestamp: 0,
  fileName: ""
};

export const initialLocalMedia: Media = {
  url: "",
  source: MediaSource.LOCAL,
  playing: false,
  timestamp: 0,
  fileName: ""
};

export function remoteMediaReducer(state: Media, action: MediaAction) {
  if(action.name===MULTI) {
    return {...state, ...action.value }
  }
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}

export function localMediaReducer(state: Media, action: MediaAction) {
  if(action.name===MULTI) {
    return {...state, ...action.value }
  }
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}
