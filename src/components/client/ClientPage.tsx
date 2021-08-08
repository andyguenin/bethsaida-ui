import Client from "../../data/Client";
import React, {Fragment} from "react";
import AttendanceData from "../../data/AttendanceData";
import DateUtil from "../../util/DateUtil";
import {formatEnum} from "../../util/StringUtil";
import {Race} from "../../data/Race";
import {Gender} from "../../data/Gender";
import {ActivityGrid} from "./ActivityGrid";
import Env from "../../environment/Env";
import unknown from "../../assets/unknown-image.png";
import ClientImage from "./ClientImage";

interface Props {
    client?: Client,
    events?: AttendanceData[]
    gridCircleSize?: number
    id: string
}

export default class ClientPage extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    private displayAttributeRow(key: string, value?: string): any {
        if (value !== undefined && value !== '') {
            return (<tr>
                <td className='w-25'>{key}</td>
                <td className='text-right'>{value}</td>
            </tr>)
        }
    }


    public render() {
        if (this.props.client !== undefined) {
            return (
                <table className='table table-bordered'>
                    <thead className='thead-dark'>
                    <tr>
                        <th></th>
                        <th className='text-right'>Client Information</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.displayAttributeRow('DOB', this.props.client?.dateOfBirth.mmddyyyy)}
                    {this.displayAttributeRow('Age', DateUtil.getAge(this.props.client?.dateOfBirth))}
                    {this.displayAttributeRow('Race', formatEnum(Race[this.props.client?.race].toString()))}
                    {this.displayAttributeRow('Secondary Race', formatEnum(Race[this.props.client?.raceSecondary || Race.NOT_APPLICABLE].toString()))}
                    {this.displayAttributeRow('Hispanic?', this.props.client?.hispanic ? 'Yes' : 'No')}
                    {this.displayAttributeRow('COVID-19 Vaccine?', this.props.client?.covidVaccine ? 'Yes' : 'Unknown')}
                    {this.displayAttributeRow('Veteran?', this.props.client?.veteran ? 'Yes' : 'No')}
                    {this.displayAttributeRow('Gender', formatEnum(Gender[this.props.client?.gender].toString()))}
                    {this.displayAttributeRow('Phone', this.props.client?.getPrettyPhone())}
                    {this.displayAttributeRow('Last 4 SSN', this.props.client?.last4Ssn)}
                    {this.displayAttributeRow('Caseworker Name', this.props.client?.caseworkerName)}
                    {this.displayAttributeRow('Caseworker Phone', this.props.client?.caseworkerPhone)}
                    {this.displayAttributeRow('Intake Date', this.props.client?.intakeDate?.mmddyyyy)}
                    {this.displayAttributeRow('Intake User', this.props.client?.intakeUser?.getFullName())}
                    <tr>
                        <td colSpan={2} className={'grid-to-align'}>
                            {(() => {
                                if (this.props.events) {
                                    return <ActivityGrid data={this.props.events} size={this.props.gridCircleSize} id={'ag-' + this.props.id}/>
                                } else {
                                    return <Fragment/>
                                }
                            })()}

                        </td>
                    </tr>
                    <tr>
                        <td>Photo ID</td>
                        <td>
                            <ClientImage tpe='client photo id' client={this.props.client} />
                        </td>
                    </tr>
                    </tbody>
                </table>
            )
        }
        else {
            return <div />
        }
    }
}
