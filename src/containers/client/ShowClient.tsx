import React, {Fragment} from 'react';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import {connect, ConnectedProps} from "react-redux";
import {DeleteClient, DeleteClientBan, GetSingleClient, GetSingleClientBan, NewClientBan} from "../../services/Client";
import {RouteChildrenProps, withRouter} from 'react-router-dom'
import FileContainer from "../../components/app/FileContainer";
import Client from "../../data/Client";
import Env from "../../environment/Env";
import DateUtil from "../../util/DateUtil";
import {Race} from "../../data/Race";
import {Gender} from "../../data/Gender";
import {Title} from "../../components/app/Title";
import Credentials from "../../data/Credentials";
import Notes from "../../components/Notes";
import BanModal from "../../components/client/BanModal";
import Ban from "../../data/Ban";
import BanBuilder from "../../data/BanBuilder";
import TextModal from "../../components/app/TextModal";
import {GetNote, SetNote} from "../../services/Note";
import {formatEnum} from "../../util/StringUtil";
import User from "../../data/User";
import {GetAllUsers} from "../../services/User";
import unknown from '../../assets/unknown-image.png';

const mapStateToProps = (state: AppState) => ({
    clientState: state.clientState,
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getSingleClient: (id: string, action: (c: Client) => void, users: User[]) => dispatch(GetSingleClient(id, action, users)),
        getSingleClientBan: (id: string, action: (ban?: Ban) => void) => dispatch(GetSingleClientBan(id, action)),
        newBan: (id: string, ban: Ban, action: (ban: Ban) => void) => dispatch(NewClientBan(id, ban, action)),
        deleteBan: (id: string, action: () => void) => dispatch(DeleteClientBan(id, action)),
        deleteClient: (id: string, action: () => void) => dispatch(DeleteClient(id, action)),
        setNote: (id: string, note: string, action: (text: string) => void) => dispatch(SetNote(id, note, action)),
        getNote: (id: string, action: (text: string) => void) => dispatch(GetNote(id, action)),
        getUsers: (action: (users: User[]) => void) => dispatch(GetAllUsers(action))
    };
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface RouteProps {
    id: string
}

interface IState {
    client?: Client,
    showBanModal: boolean,
    showTextModal: boolean,
    ban?: Ban,
    note?: string,
    users: User[]
}

type Props = PropsFromRedux & RouteChildrenProps<RouteProps>

class ShowClient extends React.Component<Props, IState> {

    constructor(props: Props) {
        super(props);

        this.state = {
            client: undefined,
            showBanModal: false,
            showTextModal: false,
            users: []
        }

    }

    componentDidMount(): void {
        const id = this.props.match?.params.id;
        if (id) {
            this.props.getUsers((users) => {
                this.props.getSingleClient(id, (c: Client) => {
                    this.props.getSingleClientBan(id, (b?: Ban) => {
                        this.props.getNote(id, (note: string) => {
                            this.setState({client: c, ban: b, note: note, users})
                        })
                    })
                }, users)
            })
        }
    }

    private displayAttributeRow(key: string, value?: string): any {
        if (value !== undefined && value !== '') {
            return (<tr>
                <td className='w-25'>{key}</td>
                <td className='text-right'>{value}</td>
            </tr>)
        }
    }

    private displayImage(imageType: string, name: string, imageTag?: string) {
        if (imageTag !== undefined && imageTag !== '') {
            return (<img width='100%'
                         src={Env.get().imageUrl + '/' + imageTag + '_400.png'}
                         alt={imageType.charAt(0).toUpperCase() + imageType.slice(1) + ' of ' + name}/>)
        } else {
            if(imageType === 'photograph') {
                return (<img width='100%' src={unknown} />)
            } else {
                return <b>No photo id found for {name}</b>
            }


        }
    }

    private handleBan = (ban: BanBuilder): void => {
        const action = (b: Ban): void => {
            this.setState(Object.assign({}, this.state, {ban: b, showBanModal: false}))
        }
        const id = this.state.client?.id || '';
        this.props.newBan(id, ban.build(), action);
    }

    private deleteBan = (): void => {
        this.props.deleteBan(this.state.client?.id || '', () => {
            this.setState(Object.assign({}, this.state, {ban: undefined, showBanModal: false}))
        })
    }

    private setBanModal = (showBanModal: boolean) => {
        this.setState(
            Object.assign({}, this.state, {showBanModal})
        )
    }

    private setTextModal = (showTextModal: boolean) => {
        this.setState(
            Object.assign({}, this.state, {showTextModal})
        )
    }

    render() {
        if (this.state.client !== undefined) {
            const client: Client = this.state.client;
            return (
                <FileContainer>
                    <Title name={client.fullName}>
                        <button
                            className='btn-success form-control'
                            type='button'
                            onClick={() => window.location.href = '/client/' + (this.state.client?.id || '') + '/edit'}>
                            Edit
                        </button>
                        <BanModal
                            client={this.state.client}
                            closeModal={() => this.setBanModal(false)}
                            show={this.state.showBanModal}
                            ban={BanBuilder.load(this.state.ban)}
                            update={this.handleBan}
                            delete={this.deleteBan}
                            newBan={this.state.ban !== undefined}
                        />
                        <TextModal title='Ban Notes' text={
                            this.state.ban?.notes
                        } show={this.state.showTextModal} close={() => this.setTextModal(false)}/>
                        <button className='btn btn-warning form-control' type='button'
                                onClick={() => this.setBanModal(true)}>Ban From DDB Services
                        </button>
                        {
                            (
                                () => {
                                    if (new Credentials().getDisplayAdmin()) {
                                        return <button
                                            className='btn btn-danger form-control'
                                            type={'button'}
                                            onClick={() => {
                                                if (this.state.client !== undefined && this.state.client.id !== undefined) {
                                                    const confirm = window.confirm("Are you sure you want to delete the client " + (this.state.client?.fullName || ''))
                                                    if (confirm) {
                                                        this.props.deleteClient(this.state.client.id, () => {
                                                            window.location.href = '/client/'
                                                        })
                                                    }
                                                }
                                            }}
                                        >Delete Client</button>
                                    } else {
                                        return <Fragment/>
                                    }
                                }
                            )()
                        }
                    </Title>
                    <div className={(this.state.ban === undefined ? 'd-none' : '') + ' banned-error'}>
                        {this.state.client?.fullName} is banned from using Downtown Daily Bread
                        services {this.state.ban ? this.state.ban.stringRepresentation : ''}.&nbsp;
                        {
                            (
                                () => {
                                    if (this.state.ban?.notes !== undefined && this.state.ban?.notes !== '') {
                                        return <span className={'details-link'}
                                                     onClick={() => this.setTextModal(true)}>Details</span>
                                    } else {
                                        return <Fragment/>
                                    }
                                }
                            )()
                        }
                    </div>
                    <div className='row profile-body'>
                        <div className='col-lg-3 profile-side'>
                            {this.displayImage('photograph', client.fullName, client.clientPhoto)}
                        </div>
                        <div className='col-lg-5'>
                            <table className='table table-bordered'>
                                <thead className='thead-dark'>
                                <tr>
                                    <th></th>
                                    <th className='text-right'>Client Information</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.displayAttributeRow('DOB', this.state.client?.dateOfBirth.mmddyyyy)}
                                {this.displayAttributeRow('Age', DateUtil.getAge(this.state.client?.dateOfBirth))}
                                {this.displayAttributeRow('Race', formatEnum(Race[this.state.client?.race].toString()))}
                                {this.displayAttributeRow('Secondary Race', formatEnum(Race[this.state.client.raceSecondary || Race.NOT_APPLICABLE].toString()))}
                                {this.displayAttributeRow('Hispanic?', this.state.client?.hispanic ? 'Yes' : 'No')}
                                {this.displayAttributeRow('Veteran?', this.state.client?.veteran ? 'Yes' : 'No')}
                                {this.displayAttributeRow('Gender', formatEnum(Gender[this.state.client?.gender].toString()))}
                                {this.displayAttributeRow('Phone', this.state.client?.getPrettyPhone())}
                                {this.displayAttributeRow('Last 4 SSN', this.state.client.last4Ssn)}
                                {this.displayAttributeRow('Caseworker Name', this.state.client.caseworkerName)}
                                {this.displayAttributeRow('Caseworker Phone', this.state.client.caseworkerPhone)}
                                {this.displayAttributeRow('Intake Date', this.state.client?.intakeDate?.mmddyyyy)}
                                {this.displayAttributeRow('Intake User', this.state.client?.intakeUser?.getFullName())}
                                <tr>
                                    <td>Photo ID</td>
                                    <td>{this.displayImage('photo id scan', client.fullName, client.photoId)}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <Notes
                            onUpdate={
                                (d, e) => this.props.setNote((this.state.client as Client).id || '', d, (note) => {
                                    e(note)
                                })}
                            notes={this.state.note}
                        />
                    </div>
                    {/*<ModifyClient client={this.props.client.workingClient} />*/}
                </FileContainer>
            )
        } else {
            return <FileContainer/>
        }

    }
}

export default withRouter(connector(ShowClient))