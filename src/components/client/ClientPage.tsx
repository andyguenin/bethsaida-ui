import React, {Fragment} from 'react';
import Client, {testClients} from '../../data/Client';

interface IProps {
    data: Client[]
}

export default class ClientPage extends React.Component<IProps> {
    public static defaultProps = {
        data: testClients
    };

    public render() {
        return (
            <Fragment>
                <h1>Clients</h1>
                <table className="table client-table">
                    <thead>
                    <tr>
                        <th>Picture</th>
                        <th>Name</th>
                    </tr>
                    {this.props.data.map(c => this.singleRow(c))}
                    </thead>
                </table>
            </Fragment>
        );
    }

    private singleRow(client: Client) {
        return (
            <tr>
                <td>{client.imageLoc}</td>
                <td>{client.fullName}</td>
            </tr>
        )
    }
}
