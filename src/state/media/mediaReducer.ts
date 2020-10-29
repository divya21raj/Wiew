export enum MediaSource {
    YT = "YouTube",
    LOCAL = "Local"
}

export interface Media {
  url: string;
  source: MediaSource;
  isPaused: boolean;
  timestamp: string;
}

type mediaKeys = keyof Media;

export interface MediaAction {
  name: mediaKeys;
  value: string;
}

export const initialMedia: Media = {
  url: "",
  source: MediaSource.LOCAL,
  isPaused: false,
  timestamp: ""
};

// This inputLabels object is used by ConnectionOptions.tsx. It is used to populate the id, name, and label props
// of the various input elements. Using a typed object like this (instead of strings) eliminates the possibility
// of there being a typo.
export const inputLabels = (() => {
  const target: any = {};
  for (const key in initialMedia) {
    target[key] = key as mediaKeys;
  }
  return target as { [key in mediaKeys]: string };
})();

export function mediaReducer(state: Media, action: MediaAction) {
  return {
    ...state,
    [action.name]: action.value === 'default' ? undefined : action.value,
  };
}
