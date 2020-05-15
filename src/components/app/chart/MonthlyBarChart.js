import React from 'react'
import {axisLeft, axisBottom, mouse, scaleTime, scaleLinear, select, extent, selectAll, line, bisector, range, svg} from 'd3';
import {colors} from './Color'


export class MonthlyBarChart extends React.Component {

    componentDidMount() {
        this.create_chart()
        window.addEventListener('resize', this.create_chart)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.create_chart)
    }

    create_chart = () => {
        const raw_data = this.props.data.data

        if(raw_data.length > 1) {
            select('#' + this.props.id).selectAll("*").remove()

            const dateformat = require('dateformat')

            const plotMargins = {
                top: 30,
                bottom: 50,
                left: 30,
                right: 30
            }
            let svg = select('#' + this.props.id)
                .append('svg')
                .attr('width', '100%')
                .attr('height', '100%')
                .style('overflow', 'visible')

            const width = svg.node()?.getBoundingClientRect().width || 0;
            const height = svg.node()?.getBoundingClientRect().height || 0;

            let plotGroup = svg.append('g')
                .classed('plot', true)
                .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);


            let plotWidth = width - plotMargins.left - plotMargins.right;
            let plotHeight = height - plotMargins.top - plotMargins.bottom;


            const tempExtentT = extent(raw_data, d => d.t)

            let xScale = scaleLinear()
                .range([0, plotWidth]);

            let yScale = scaleLinear()
                .range([plotHeight, 0]);


            const beginDate = tempExtentT[0] || new Date(2020, 0, 1)

            const data = raw_data.map(function (d) {
                return {
                    t: d.t.getFullYear() * 12 + d.t.getMonth() - (beginDate.getFullYear() * 12 + beginDate.getMonth()),
                    y: d.y
                }
            }).sort(function (a, b) {
                return a.t - b.t
            })

            const extentT = [
                data[0].t - .5,
                data[data.length - 1].t + .5
            ];

            xScale.domain(extentT).nice();

            const plusMinusWidth = xScale(1) - xScale(.5)

            plotGroup.append('g')
                .attr('transform', 'translate(0, ' + (plotHeight) + ')')
                .call(
                    axisBottom(xScale)
                        .tickValues(range(0, data[data.length - 1].t + 1, 1))
                        .tickFormat(function (d, i) {
                            const date =
                                new Date(Math.floor(d / 12) + beginDate.getFullYear() + Math.floor((d % 12 + beginDate.getMonth()) / 12),
                                    ((d % 12 + beginDate.getMonth())) % 12
                                );
                            return dateformat(date, "mmm 'yy")
                        })
                )
                .selectAll("text")
                .attr('transform', 'rotate(-75) translate(-24, -8)')

            const tempExtentY = extent(data, d => d.y)
            const extentY = [0, tempExtentY[1] || 0];
            yScale.domain(extentY).nice();


            plotGroup.append('g').call(axisLeft(yScale))

            plotGroup.selectAll('.box-points')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'box-points')
                .attr('transform', function (d, i) {
                    return 'translate(' + (xScale(d.t - .5)) + ', ' + (plotHeight - (yScale(0) - yScale(d.y))) + ' )'
                })
                .attr('width', plusMinusWidth * 2)
                .attr('height', function (d, i) {
                    return yScale(0) - yScale(d.y)
                })
                .attr('fill', function (d, i) {
                    return colors[9]
                })
                .style("stroke", 'black')
        }

    }

    getGraphHtml = () => {
        if(this.props.data.data.length > 1) {
            return <div id={this.props.id} className={this.props.className}></div>
        } else {
            return <h3>Chart cannot be produced due to lack of data</h3>
        }

    }


    render() {
        if(this.props.title !== undefined) {
            return <div>
                <h2>{this.props.title}</h2>
                {this.getGraphHtml()}
            </div>
        } else {
            return this.getGraphHtml()
        }
    }
}