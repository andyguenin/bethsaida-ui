import React from 'react'
import {axisLeft, axisBottom, scaleTime, scaleLinear, select, extent, range} from 'd3';
import {colors} from './Color'
import {gcd} from "../../../util/Math";


export class DailyBarChart extends React.Component {

    oneDay = 24 * 60 * 60 * 1000;


    componentDidMount() {
        this.create_chart()
        window.addEventListener('resize', this.create_chart)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.create_chart)
    }

    create_chart = () => {
        select('#' + this.props.id).selectAll("*").remove()
        const raw_data = this.props.data

        const data = [raw_data]

        const plotMargins = {
            top: 30,
            bottom: 30,
            left: 30,
            right: 150
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



        const allPoints = data.flatMap(function (d) {
            return d.data
        })

        const tempExtentT = extent(allPoints, d => d.t)

        const allTs = allPoints.map(d => d.t).sort((a, b) => (b - a))
        let commonGCD = 0;
        for (let i = 0; i < allTs.length - 1; ++i) {
            const diff = allTs[i] - allTs[i + 1];
            if (diff !== 0) {
                if (commonGCD === 0) {
                    commonGCD = diff;
                } else {
                    commonGCD = gcd(commonGCD, diff);
                }
            }
        }


        let xScale = scaleTime()
            .range([0, plotWidth]);

        let yScale = scaleLinear()
            .range([plotHeight, 0]);



        const beginDate = tempExtentT[0] || new Date(2020, 0, 1)
        const endDate = tempExtentT[1] || new Date(2020, 0, 1)

        const axisBegin = new Date( beginDate.getTime() - (commonGCD / 2))
        const axisEnd = new Date( endDate.getTime() + (commonGCD / 2))
        const extentT = [
            axisBegin,
            axisEnd
        ];
        xScale.domain(extentT).nice();

        const plusMinusWidth = (xScale(new Date(allTs[0].getTime() + commonGCD)) - xScale(allTs[0]));

        plotGroup.append('g').attr('transform', 'translate(0, ' + (plotHeight) + ')').call(axisBottom(xScale).tickValues(
            range(beginDate.getTime(), endDate.getTime() + commonGCD, commonGCD).map(function (d) {
                return new Date(d)
            })
        ))

        const tempExtentY = extent(allPoints, d => d.y)
        const extentY = [0, tempExtentY[1] || 0];
        yScale.domain(extentY).nice();


        plotGroup.append('g').call(axisLeft(yScale))

        plotGroup.selectAll('.box-points')
            .data(data[0].data)
            .enter()
            .append('rect')
            .attr('class', 'box-points')
            .attr('transform', function (d, i) {
                return 'translate(' + (xScale(d.t) - plusMinusWidth / 2) + ', ' + (plotHeight - (yScale(0) - yScale(d.y))) + ' )'
            })
            .attr('width', plusMinusWidth)
            .attr('height', function (d, i) {
                return yScale(0) - yScale(d.y)
            })
            .attr('fill', function (d, i) {
                return colors[9]
            })
            .style("stroke", 'black')

        const legendBox = svg.append('g').attr('class', 'legend-box')

        const legend =
            legendBox.selectAll('.legend').data(data).enter().append('g').attr('class', 'legend')
                .attr('transform', 'translate(0, ' + (plotHeight / 2 - data.length / 2 * 20) + ')')

        const id = this.props.id;
        legend
            .append('rect')
            .attr('x', width - plotMargins.right + 20)
            .attr('y', function (d, i) {
                return i * 20
            })
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', function (d, i) {
                return colors[9]
            })

        legend.append('text')
            .attr('x', width - plotMargins.right + 35)
            .attr('y', function (d, i) {
                return (i * 20) + 10
            })
            .text(function (d) {
                return d.name
            })

    }


    render() {
        return <div id={this.props.id} className={this.props.className}></div>
    }
}