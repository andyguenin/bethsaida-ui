import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
    header: string
}

interface State {
    show: boolean

}

export default class Expander extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            show: false
        }
    }

    private toggleVisibility = (show: boolean) => {
        this.setState((state, props) => {
            return Object.assign({}, state, {
                show
            })
        })
    }

    private getClass = () => {
        if(this.state.show) {
            return ''
        } else {
            return 'd-none'
        }
    }


    private getIcon = () => {
        if(this.state.show) {
            return <FontAwesomeIcon icon="chevron-up" />
        } else {
            return <FontAwesomeIcon icon="chevron-down" />
        }
    }

    render(): React.ReactNode {
        return <div className={'expander'}>
            <h4 className='expander-header' onClick={() => this.toggleVisibility(!this.state.show)}>{this.props.header} {this.getIcon()}</h4>
            <div className={this.getClass()}>
                {this.props.children}
            </div>
        </div>
    }
}