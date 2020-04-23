import React, {Fragment} from 'react';


interface Props {
    errorMessage?: string
    show?: boolean
    className?: string
}

interface State {
    show: boolean
}

export default class ErrorMessage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = this.getState(props);
    }

    private getState(props: Props): State {
        return {
            show: this.props.errorMessage !== undefined && (props.show === undefined || props.show)
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if(this.props.show !== prevProps.show || prevProps.errorMessage !== this.props.errorMessage) {
            this.setState((state, props) => this.getState(props))
        }

    }

    private closeMessage = () => {
        this.setState((state, props) => Object.assign({}, state, {show: false}))
    }

    render(): React.ReactNode {
        if (this.state.show) {
            return <div className={'alert alert-danger row ' + this.props.className}>
                <div className='col-11'>
                    {this.props.errorMessage}
                </div>
                <div className='pointer col-1 text-right' onClick={this.closeMessage}>
                    &times;
                </div>
            </div>
        } else {
            return <Fragment/>
        }
    }
}