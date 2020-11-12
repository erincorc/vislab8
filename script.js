const margin = ({top: 20, right: 35, bottom: 20, left: 40})
const width = 800 - margin.left - margin.right
const height = 800 - margin.top - margin.bottom

d3.csv('driving.csv', d3.autoType).then(data => {

    console.log(data)
    let miles = data.map(d => d.miles)
    console.log(miles)
    let prices = data.map(d => d.gas)
    console.log(prices)
    
    const svg = d3.select('.chart').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // CREATE SCALES
    const xScale = d3.scaleLinear()
        .domain(d3.extent(miles)).nice()
        .range([0, width])

    const yScale = d3.scaleLinear()
        .domain(d3.extent(prices)).nice()
        .range([height, 0])

    // CREATE AXES
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(7)

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(13)
        .tickFormat(d3.format("$.2f"))

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)

    svg.append("g")
        .call(yAxis)

    // CREATE CIRCLES
    let circs = svg.append("g")
        .selectAll("circle")
        .data(data)
        .join('circle')
        .attr('cx', d => xScale(d.miles))
        .attr('cy', d => yScale(d.gas))
        .attr('r', 3)
    
    const label = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${xScale(d.miles)},${yScale(d.gas)})`)
        .attr("opacity", 0)

    label.append("text")
        .text(d => d.year)
    })

