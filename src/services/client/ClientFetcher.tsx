import React from 'react';
import {Dispatch} from 'redux';
import {toggleLoadingStatus} from "../../actions/Base";

export const allClients = () => (dispatch: Dispatch) => {
    dispatch(toggleLoadingStatus(true))

    return fetch('http://localhost:8090/api/v1/client/')
        .then(
            response => response.json(),
            error => console.log(error)
        )
        .then(
            json => {
                dispatch(toggleLoadingStatus(false))
                console.log(json)
            }
        )
}