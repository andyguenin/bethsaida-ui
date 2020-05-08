import React from 'react'
import * as d3 from 'd3'
import {Selection as D3Selection} from 'd3-selection'
import Series from "../../data/chart/Series";
import DatePoint from "../../data/chart/DatePoint";


interface Props {
    id: string,
    data: Series[]
}

interface State {

}

export default class Chart extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }


    componentDidMount(): void {
        const height = 300
        const plotMargins = {
            top: 30,
            bottom: 30,
            left: 150,
            right: 30
        }
        let svg = d3.select('#' + this.props.id).append('svg').attr('width', '100%').attr('height', 300).style('overflow', 'visible')

        const width = svg.node()?.getBoundingClientRect().width || 0;

        let plotGroup = svg.append('g')
            .classed('plot', true)
            .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);


        let plotWidth = width - plotMargins.left - plotMargins.right;
        let plotHeight = height - plotMargins.top - plotMargins.bottom;


        let xScale = d3.scaleTime()
            .range([0, plotWidth]);
        let xAxis = d3.axisBottom(xScale);
        let xAxisGroup = plotGroup.append('g')
            .classed('x', true)
            .classed('axis', true)
            .attr('transform', `translate(${0},${plotHeight})`)
            .call(xAxis);

        let yScale = d3.scaleLinear()
            .range([plotHeight, 0]);
        let yAxis = d3.axisLeft(yScale);
        let yAxisGroup = plotGroup.append('g')
            .classed('y', true)
            .classed('axis', true)
            .call(yAxis);

        const d1: DatePoint[] = this.props.data[0].data

        const tempExtentT = d3.extent(d1, d => d.t)
        const extentT: Date[] = [tempExtentT[0] || new Date(2020, 1, 1), tempExtentT[1] || new Date(2020, 1, 1)];
        xScale.domain(extentT).nice();

        xAxisGroup.call(xAxis);

        const tempExtentY = d3.extent(d1, d => d.y)
        const extentY: Number[] = [tempExtentY[0] || 0, tempExtentY[1] || 0];
        yScale.domain(extentY).nice();

        yAxisGroup.call(yAxis);


        // enterSelection.merge(dataBound).attr('transform', (d, i) => `translate(${xScale(d.t)},${yScale(d.y)}`)

        // svg.append('path')
        //     .data(d1.map(r => {
        //         return {
        //             t: xScale(r.t),
        //             y: yScale(r.y)
        //         }
        //     }))
        //     .attr('fill', 'none')
        //     .attr('stroke', 'steelblue')
        //     .attr('stroke-width', 1.5)
        //     // .attr('d', d3.line().x(d => d[0]))
        //     // .attr('d', d3.line().x(d => d.t))
    }


    render(): React.ReactNode {
        return <div id={this.props.id}></div>
    }
}