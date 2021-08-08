import React, {Fragment} from 'react'
import ReactDOMServer, {renderToStaticMarkup} from 'react-dom/server';
import {
    select,
    event
} from 'd3';

export class Grid extends React.Component {

    b = 8

    tooltip_width = 250
    tooltip_height = 150

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.create_grid()
        // window.addEventListener('resize', this.create_grid)
    }

    //
    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.create_grid)
    // }


    on_mouse_out = (props) => {
        let tooltip = select('#' + props.id + '-tooltip')
        tooltip.style('opacity', '0')
    }

    on_mouse_move = (props, width) => {
        const t = this
        const day_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return function (event) {
            const tooltip_id = '#' + props.id + '-tooltip'
            let bbox = document.getElementById(props.id + '-svg').getBoundingClientRect()

            let x_offset = bbox.x + window.scrollX
            let y_offset = bbox.y + window.scrollY

            let right = bbox.width - (event.pageX - bbox.x)


            let week = Math.floor((event.pageX - 1 - x_offset) / width)
            let day = Math.floor((event.pageY - 1 - y_offset) / width)

            let elem = props.data.find(function (d) {
                    return d.week === week && d.day_of_week === day
                }
            )
            let tooltip = select(tooltip_id)
                .style("position", "absolute")
                .style("z-index", "5")
                .style("background", "#fff")
                .style('border', '1px solid black')
                .style("top", (day * width) + "px")
                .style('width', '250px')
            if (week <= 13) {
                tooltip.style('right', null)
                tooltip.style("left", (week * width + 20) + "px")
            } else {
                tooltip.style('left', null)
                tooltip.style('right', right + 'px')
            }

            if (elem === undefined) {
                tooltip.style('opacity', '0')

            } else {

                let list = (() => {
                    if (elem.service.length > 0) {
                        return <ul>{elem.service.map(function (d) {
                            return <li key={d}>{d}</li>
                        })}</ul>
                    } else {
                        return <i>Client did not check in on this date.</i>
                    }
                })()
                let tooltip_inner = <div>{day_of_week[elem.date.getDay()] + ' ' + elem.date.toLocaleDateString()}<br/>{list}</div>
                tooltip.html(renderToStaticMarkup(tooltip_inner))
                    .style('opacity', '.85')
            }
        }
    }

    create_grid() {
        const size = this.props.size || this.b
        let svg = select('#' + this.props.id)
            .append('svg')
            .attr('width', '432')
            .attr('height', '112')
            .style('overflow', 'visible')
            .style('z-index', '1')
            .attr('id', this.props.id + '-svg')
            .append('g')

        svg.selectAll('*')
            .data(this.props.data)
            .enter()
            .append('circle')
            .attr('id', function(d) {
                return d.week + '-' + d.day_of_week
            })
            .style('fill', function (d) {
                if (d.service.length !== 0) {
                    return '#f15a29'
                } else {
                    return '#ffffff'
                }
            })
            .attr('transform', function (d, i) {
                return "translate(" + (d.week * (2 * size) + size) + ", " + (d.day_of_week * (2 * size) + size) + ")"
            })
            .attr('r', (size - 1))
            .attr('class', 'grid-date')
            .attr('stroke', 'black')
            .attr('stroke-width', '1px')

        let first_days = this.props.data.filter(function(d) {
            return d.date.getDate() === 1
        })
        let month_mapping = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        select('#' + this.props.id + '-header')
            .append('svg')
            .style('height', '20px')
            .style('width', '100%')
            .append('g')
            .selectAll('*')
            .data(first_days)
            .enter()
            .append('text')
            .text(function(d) {
                return month_mapping[d.date.getMonth()]
            })
            .attr('transform', function(d) {
                return 'translate(' + ((d.week * (2 * size)) + 20) + ', 12)'
            })
            .style('z-index', '200')
    }

    getGridHtml = () => {
        const size = this.props.size || this.b
        return <Fragment>
            <div id={this.props.id + '-header'}></div>
            <div id={this.props.id} className={this.props.className + ' grid-master'}>
                <div id={this.props.id + '-capture'} className={'grid-capture'}
                     onMouseOver={this.on_mouse_move(this.props, size * 2)}
                     onMouseMove={this.on_mouse_move(this.props, size * 2)}
                     onMouseOut={this.on_mouse_move(this.props, size * 2)}>
                    <div
                        id={this.props.id + '-tooltip'}
                        className={'grid-tooltip'}
                    >
                    </div>
                </div>
            </div>

        </Fragment>

    }

    render() {
        return this.getGridHtml()
    }
}

