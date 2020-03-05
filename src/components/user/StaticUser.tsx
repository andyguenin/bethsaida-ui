import React, {Fragment} from 'react';
import User from "../../data/User";
import {Title} from "../app/Title";
import Credentials from "../../data/Credentials";

interface Props {
    user: User
}

export default class StaticUser extends React.Component<Props> {
    render() {
        return (
            <Fragment>
                <Title name={this.props.user.name}>
                    <button type='button' className='btn btn-success' onClick={() => {
                        window.location.href = ('/user/' + this.props.user.id + '/edit')
                    }}>
                        Edit User
                    </button>
                </Title>
                <h2>email - {this.props.user.email}</h2>
            </Fragment>

        )
    }
}