import React from 'react';
import MediaController from '../Buttons/MediaController/MediaController';
import DraggableDialog from './DraggableDialog/DraggableDialog';

export enum NoMediaText {
  NO_MATCH = "Media uploaded by you doesn't match the one uploaded by your partner... Upload new file?",
  NO_FILE = 'No media loaded, load a new file?',
}

export interface NoMediaDialogProps {
  text: NoMediaText;
}

export default function NoMediaDialog(props: NoMediaDialogProps) {
  return <DraggableDialog text={props.text} positiveButton={<MediaController />} />;
}
