import React, {FormEvent, Fragment} from 'react';


interface IProps {
    action: (link: string) => void
}

class FormUpload extends React.Component<IProps> {

    private onSubmit(a: FormEvent<HTMLInputElement>) {
        a.preventDefault();
        new FormData()
        // a.target

    }

    render() {
        return (
            <Fragment>
                {/*<form action='http://localhost:8090/api/v1/client/imageupload' method='post'*/}
                {/*         encType='multipart/form-data'>*/}
                <input type='file' name='fileUpload'/>
                <input type='submit' onSubmit={this.onSubmit}/>
                {/*</form>*/}
            </Fragment>
        )
    }
}

export default FormUpload