const margin = ({top: 20, right: 35, bottom: 20, left: 40})
const width = 800 - margin.left - margin.right
const height = 800 - margin.top - margin.bottom

function position(d) {
    const t = d3.select(this);
    switch (d.side) {
      case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
      case "right":
        t.attr("dx", "0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "start");
        break;
      case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
      case "left":
        t.attr("dx", "-0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "end");
        break;
    }
  }

  function halo(text) {
    text
      .select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
  }

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
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
    //    .call(xAxis)

    svg.append("g")
        .attr("class", "y-axis")
    //    .call(yAxis)

    let yAxisGroup = svg.select(".y-axis").call(yAxis)
    let xAxisGroup = svg.select(".x-axis").call(xAxis)


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
        .selectAll("text")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${xScale(d.miles)},${yScale(d.gas)})`)
        .append("text")
        .text(data => data.year)
        .each(position)
        .call(halo)

        xAxisGroup.select(".domain").remove()
        yAxisGroup.select(".domain").remove()

        yAxisGroup.selectAll(".tick line")
            .clone()
            .attr("x2", width)
            .attr("stroke-opacity", 0.1) // make it transparent 

        xAxisGroup.selectAll(".tick line")
            .clone()
            .attr("y2", -height)
            .attr("stroke-opacity", 0.1) // make it transparent 

        xAxisGroup.call(g=>
            g.append("text")
              .attr("x", width-10)
              .attr("y", -10)
              .text("Cost per gallon")
              .each(position)
              .call(halo) // optional halo effect
        )

    })

