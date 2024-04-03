import React, {ChangeEvent, FormEvent, Fragment, RefObject} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AppState} from "../../reducers/AppState";
import {AsyncDispatch} from "../../actions/Async";
import FileContainer from "../../components/app/FileContainer";
import {Title} from "../../components/app/Title";
import MealRecord from "../../data/MealRecord";
import {GetMealRecord, PutMealRecord} from "../../services/Meal";
import BDate from "../../data/BDate";
import {Loader} from "../../components/app/loader/Loader";
import {Form} from "react-bootstrap";


const mapStateToProps = (state: AppState) => ({
    base: state.base
})

const mapDispatchToProps = (dispatch: AsyncDispatch) => {
    return {
        getMealRecord: (date: string, action: (m: MealRecord) => void) => dispatch(GetMealRecord(date, action)),
        putMealRecord: (rec: MealRecord, action: () => void) => dispatch(PutMealRecord(rec, action)),

    }
}

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}

interface State {
    loading: boolean
    meal?: MealRecord
    date: string
    tainted: boolean
}

class AllMeal extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: true,
            meal: undefined,
            date: BDate.fromDate(new Date()).jsDate,
            tainted: false
        }
    }

    componentDidMount(): void {
        this.reload()
    }

    public reload = (afterAction: () => void = () => undefined) => {
        this.props.getMealRecord(this.state.date, (meal) => {
            this.setState((state, props) => Object.assign({}, state, {
                meal
            }))
        })
    }


    private updateCount(field: string): (e: ChangeEvent<HTMLInputElement>) => void {
        return (e) => {
            if (this.state.meal !== undefined) {
                const newMeal = new MealRecord(this.state.meal.breakfast, this.state.meal.lunch, this.state.meal.date, this.state.meal.id);
                newMeal.setField(field, e.target.value)
                this.setState(Object.assign({}, this.state, {meal: newMeal, tainted: true}))
            }
        }
    }


    private handleSubmit(): (e: FormEvent<HTMLFormElement>) => void {
        return (e) => {
            e.preventDefault();
            if (this.state.meal !== undefined) {
                this.props.putMealRecord(this.state.meal, () => {
                    this.setState(Object.assign({}, this.state, {tainted: false}))
                })
            }
        }
    }


    render(): React.ReactNode {
        return <FileContainer>
            <Title name={'Meal Count for ' + BDate.fromjsDate(this.state.date).mmddyyyy}>
                <input type='date' className='form-control' id='date'
                       value={this.state.date}
                       onChange={(e) => {
                           const date = e.target.value
                           this.setState((state, props) => Object.assign({}, state, {
                               date
                           }), this.reload)
                       }}
                />
            </Title>
            <Loader loading={this.state.meal === undefined} emptyText={'Loading Meal Count..'}
                    isEmpty={false}>
                <div className='row'>
                    <div className='offset-1 col-10'>
                        <form onSubmit={this.handleSubmit()}>

                            <div className='form-group row'>
                                <label htmlFor='breakfast' className='col-sm-2'>Breakfast Count</label>
                                <input type='text' inputMode='numeric' pattern="[0-9]*"
                                       className='form-control col-sm-10' id='breakfast'
                                       value={this.state.meal?.breakfast || 0}
                                       onChange={this.updateCount("breakfast")}/>
                            </div>
                            <div className='form-group row'>
                                <label htmlFor='lunch' className='col-sm-2'>Lunch Count</label>
                                <input type='text' inputMode='numeric' pattern="[0-9]*"
                                       className='form-control col-sm-10' id='lunch'
                                       value={this.state.meal?.lunch || 0}
                                       onChange={this.updateCount("lunch")}/>
                            </div>
                            <div className="col-sm-3">
                                <button
                                    className="btn btn-primary"
                                    disabled={!this.state.tainted}
                                    type='submit'
                                >Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Loader>
        </FileContainer>
    }
}


export default connector(AllMeal)