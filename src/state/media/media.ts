export const MULTI = "SET_MULTIPLE";

export enum MediaSource {
    YT = "YouTube",
    LOCAL = "Local"
}
  
export interface Media{
    url: string;
    source: MediaSource;
    fileName: string
    playing: boolean;
    timestamp: number;
}

export const docToRemoteMedia = (doc: any) => {
    console.log(doc)
    const media: Media = {
        url: doc.url,
        source: doc.source,
        playing: doc.playing,
        timestamp: doc.timestamp,
        fileName: doc.fileName
    }

    return media;
}