import React from 'react'
import {axisLeft, axisBottom, mouse, scaleTime, scaleLinear, select, extent, selectAll, line, bisector} from 'd3';


export class Chart2 extends React.Component {

    oneDay = 24 * 60 * 60 * 1000;

    colors = [
        '#662C91',
        '#17A398',
        '#EE4266',
        '#DAEDBD',
        '#0F4C5C',
        '#E5B181',
        '#F4B9B2',
        '#7DBBC3',
        '#33312E',
        '#ED652E'

    ]

    componentDidMount() {
        const data = this.props.data

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


        let xScale = scaleTime()
            .range([0, plotWidth]);

        let yScale = scaleLinear()
            .range([plotHeight, 0]);


        const allPoints = data.flatMap(function (d) {
            return d.data
        })

        const tempExtentT = extent(allPoints, d => d.t)
        const extentT = [tempExtentT[0] || new Date(2020, 1, 1), tempExtentT[1] || new Date(2020, 1, 1)];
        const numTicks = Math.round(Math.abs((extentT[1] - extentT[0]) / this.oneDay)) + 1
        xScale.domain(extentT).nice();

        plotGroup.append('g').attr('transform', 'translate(0, ' + (plotHeight) + ')').call(axisBottom(xScale).ticks(numTicks))


        const tempExtentY = extent(allPoints, d => d.y)
        const extentY = [0, tempExtentY[1] || 0];
        yScale.domain(extentY).nice();

        plotGroup.append('g').call(axisLeft(yScale))


        for (let i = 0; i < data.length; ++i) {
            const d = data[i].data
            plotGroup.append('path')
                .datum(d)
                .attr('fill', 'none')
                .attr('stroke', this.colors[i])
                .attr('stroke-width', 2.5)
                .attr('d', line()
                    .x(function (d) {
                        return xScale(d.t)
                    })
                    .y(function (d) {
                        return yScale(d.y)
                    })
                )
        }

        const legendBox = svg.append('g').attr('class', 'legend-box')

        const legend =
            legendBox.selectAll('.legend').data(data).enter().append('g').attr('class', 'legend')
                .attr('transform', 'translate(0, ' + (plotHeight / 2 - data.length / 2 * 20) + ')')
        const colors = this.colors
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
                return colors[i]
            })

        legend.append('text')
            .attr('x', width - plotMargins.right + 35)
            .attr('y', function (d, i) {
                return (i * 20) + 10
            })
            .text(function (d) {
                return d.name
            })


        const mouseG = plotGroup.append("g")
            .attr('class', 'mouse-over-effects')
            .attr('id', this.props.id + '-moe')

        mouseG.append('path')
            .attr('class', 'mouse-line')
            .style('stroke', 'black')
            .style('stroke-width', '1px')
            .style('opacity', '0')

        const lines = document.getElementsByClassName('line')

        const mousePerLine = mouseG.selectAll('#' + id + '-moe.mouse-per-line')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'mouse-per-line')



        mousePerLine.append('circle')
            .attr('r', 7)
            .style('stroke', function (d, i) {
                return colors[i];
            })
            .style('fill', 'none')
            .style('stroke-width', '1px')
            .style('opacity', '0')

        mousePerLine.append('rect')
            .style('background-color', 'blue')
            .attr("transform", "translate(10,-10)")
            .style('opacity', '0')
            .style('fill', 'white')

        mousePerLine.append("text")
            .attr("transform", "translate(10,3)")
            .style('background-color', 'blue')



        const getAdjustedT = function (mouseX) {
            const selectedTime = xScale.invert(mouseX)
            const fap = allPoints.filter(function (d) {
                return (d.t <= selectedTime)
            }).sort(function (a, b) {
                return b.t - a.t;
            })
            const pointBefore = fap[0]

            const fap2 = allPoints.filter(function (d) {
                return (d.t >= selectedTime)
            }).sort(function (a, b) {
                return a.t - b.t;
            })
            const pointAfter = fap2[0]

            if (pointBefore === undefined && pointAfter === undefined) {
                return null
            } else if (pointBefore === undefined) {
                return pointAfter.t;
            } else if (pointAfter === undefined) {
                return pointBefore.t;
            } else {
                let loc = pointBefore.t
                if (pointAfter.t - selectedTime < selectedTime - pointBefore.t) {
                    loc = pointAfter.t
                }
                return loc;
            }
        }

        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', plotWidth) // can't catch mouse events on a g element
            .attr('height', plotHeight)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function () { // on mouse out hide line, circles and text
                select('#' + id + '-moe').select(".mouse-line")
                    .style("opacity", "0");
                selectAll('#' + id + '-moe .mouse-per-line circle')
                    .style("opacity", "0");
                selectAll('#' + id + '-moe .mouse-per-line text')
                    .style("opacity", "0")
                selectAll('#' + id + '-moe .mouse-per-line rect')
                    .style("opacity", "0")

            })
            .on('mouseover', function () { // on mouse in show line, circles and text
                select('#' + id + '-moe').select(".mouse-line")
                    .style("opacity", "1");
                selectAll('#' + id + '-moe .mouse-per-line circle')
                    .style("opacity", "1");
                selectAll('#' + id + '-moe .mouse-per-line text')
                    .style("opacity", "1");
                selectAll('#' + id + '-moe .mouse-per-line rect')
                    .style("opacity", ".6")
            })
            .on('mousemove', function () { // mouse moving over canvas
                let lmouse = mouse(this);
                select('#' + id + '-moe').select(".mouse-line")
                    .attr("d", function () {
                        let loc = xScale(getAdjustedT(lmouse[0]))
                        var d = "M" + loc + "," + plotHeight;
                        d += " " + loc + "," + 0;
                        return d;
                    });

                select('#' + id + '-moe').selectAll(".mouse-per-line")
                    .attr('transform', function (d, i) {
                        let date = getAdjustedT(lmouse[0])
                        const series = data[i]
                        const point = series.data.find(function (d) {
                            return d.t === date
                        })
                        const yValue = (point === undefined ? 0 : point.y)
                        const y = yScale(yValue)
                        const x = xScale(date)
                        const text = select(this).select('text').text(yValue.toFixed(2))
                        const width = text.node()?.getBoundingClientRect().width || 0;
                        const height = text.node()?.getBoundingClientRect().width || 0;
                        select(this).select('rect').attr('width', width).attr('height', height / 2);
                        return 'translate(' + x + ', ' + y + ')'
                    })

                // .attr("transform", function(d, i) {
                //     console.log(i)
                //     console.log(width/lmouse[0])
                //
                //
                //
                //     //
                //     // while (true){
                //     //     target = Math.floor((beginning + end) / 2);
                //     //     let pos = lines[i].getPointAtLength(target);
                //     //     if ((target === end || target === beginning) && pos.x !== lmouse[0]) {
                //     //         break;
                //     //     }
                //     //     if (pos.x > lmouse[0])      end = target;
                //     //     else if (pos.x < lmouse[0]) beginning = target;
                //     //     else break; //position found
                //     // }
                //     // select(this).select('text')
                //     //     .text(yScale.invert(pos.y).toFixed(2));
                //     //
                //     // return "translate(" + lmouse[0] + "," + pos.y +")";
                // });
            });
        //
        // const scaleXData = (point) => {
        //     return xScale(point.t)
        // }
        //
        // const scaleYDate = (point) => {
        //     return yScale(point.y)
        // }
        //
        // const lineGenerator = line()
        //     .x(d => xScale(d.t))
        //     .y(d => yScale(d.y))
        //
        // const plot = svg.append('g')
        //     .attr('transform', `translate(${plotMargins.left}, ${plotMargins.top}`)


    }


    render() {
        return <div id={this.props.id} className={this.props.className}></div>
    }
}