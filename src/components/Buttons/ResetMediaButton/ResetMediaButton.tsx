import React from "react";

import { Button, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useAppState, useDbState } from "../../../state";
import { MULTI } from '../../../state/media/media';
import { initialLocalMedia, initialRemoteMedia } from "../../../state/media/mediaReducers";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";

export default function ResetMediaButton() {

    const { dispatchLocalMedia, dispatchRemoteMedia } = useAppState();
    const { db, setInDb } = useDbState();
    const { room } = useVideoContext();

    const handleClick = (e: any) => {
        dispatchLocalMedia({ name: MULTI, value: {...initialLocalMedia}});
        dispatchRemoteMedia({ name: MULTI, value: {...initialRemoteMedia} });
        setInDb(db, room.name, initialRemoteMedia);
    }

    return(
        <IconButton color="secondary" aria-label="add an alarm" onClick={handleClick}>
            <DeleteIcon />
        </IconButton>
    )
}