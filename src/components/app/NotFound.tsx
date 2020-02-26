import React from 'react'
import FileContainer from "./FileContainer";

class NotFound extends React.Component<{}> {

    render() {
        return (
            <FileContainer>
                <h1>Not Found</h1>
                This page is not found.
            </FileContainer>
        )
    }
}

export default NotFound;