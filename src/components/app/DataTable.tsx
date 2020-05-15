import React from 'react';
import Series from "../../data/chart/Series";
import DateUtil from "../../util/DateUtil";

interface Props {
    data: Series[]
    monthly: boolean
}

interface State {
    headerOrder: string[],
    map: Map<string, Series>,
    dates: Date[]
}

export default class DataTable extends React.Component<Props, State> {

    dateformatstring = 'mmm, yyyy'
    dateformat = require('dateformat')

    constructor(props: Props) {
        super(props);

        let map = new Map<string, Series>()
        this.props.data.forEach(d => {
            map.set(d.name, d)
        })

        if(!this.props.monthly) {
            this.dateformatstring = 'mmm dd, yyyy'
        }
        let dates: Date[] = []
        if(this.props.data.length !== 0) {
            dates = DateUtil.getEqualSpacedSeries(this.props.data.flatMap(r => r.data.map(s => s.t)), this.props.monthly)
        }
        this.state = {
            headerOrder: this.props.data.map(r => r.name),
            map,
            dates
        }
    }

    render(): React.ReactNode {
        return <table className='table table-hover'>
            <thead>
            <tr>
                <td>Date</td>
                {this.state.headerOrder.map(h => <td key={'header-' + h}>{h}</td>)}
            </tr>
            </thead>
            <tbody>

            {this.state.dates.map(date =>
                <tr key={'row-' + date}>
                    <td key={'col-' + date}>{this.dateformat(date, this.dateformatstring)}</td>
                    {this.state.headerOrder.map(h => {
                        return <td key={'col-' + date + '-' + h}>
                            {
                                (
                                    () => {
                                        const res = this.state.map.get(h)
                                        if (res === undefined) {
                                            return '-'
                                        } else {
                                            const value = res.data.find(r => {
                                                return r.t.getDay() === date.getDay() && r.t.getMonth() === date.getMonth() && r.t.getFullYear() === date.getFullYear()
                                            })
                                            if (value === undefined) {
                                                return '-'
                                            } else {
                                                return value.y
                                            }
                                        }
                                    }
                                )()
                            }
                        </td>
                    })}
                </tr>
            )}

            </tbody>
        </table>
    }
}