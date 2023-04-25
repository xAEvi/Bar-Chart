const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const width = 800;
const height = 500;
const padding = 50;

let values = [];
let dates;

let xScale;
let yScale;

let xScaleAxis;
let yScaleAxis;

const svg = d3.select('svg');

const generateCanvas = () => {
    svg.attr("height", height)
    svg.attr("width", width)
};

const generateScales = () => {

    xScale = d3.scaleLinear()
               .domain([0, values.length - 1])
               .range([padding, width - padding]);

    yScale = d3.scaleLinear()
               .domain([0, d3.max(values, (val) => val[1])])
               .range([0, height - (padding * 2)]);
};

const generateAxes = () => {

    const xAxis = d3.axisBottom(xScaleAxis);
    svg.append('g')
       .call(xAxis)
       .attr("id", "x-axis")
       .attr("transform", "translate(0, " + (height - padding) + ")");

    const yAxis = d3.axisLeft(yScaleAxis)
    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + padding + ", 0)")
};

const generateAxisScales = () => {

    dates = values.map((val) => {
        return new Date(val[0]);
    });

    xScaleAxis = d3.scaleTime()
                   .domain([d3.min(dates), d3.max(dates)])
                   .range([padding, width - padding]);

    yScaleAxis = d3.scaleLinear()
                   .domain([0, d3.max(values, (val) => val[1])])
                   .range([height - padding, padding]);
};

const generateBars = () => {

    const tooltip = d3.select(".container")
                      .append("div")
                      .attr("id", "tooltip")
                      .style("visibility", "hidden")
                      .style("width", "auto")
                      .style("height", "auto")

    svg.selectAll("rect")
       .data(values)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("width", (width - (padding * 2)) / values.length)
       .attr("data-date", (val) => val[0])
       .attr("data-gdp", (val) => val[1])
       .attr("height", (val) => yScale(val[1]))
       .attr("x", (val, i) => xScale(i))
       .attr("y", (val) => (height - padding) - yScale(val[1]))
       .on("mouseover", (e, val) => {
            tooltip.transition()
                   .style("visibility", "visible")
                
            tooltip.text(val[0] + " | " + val[1] + " GDP")

            document.querySelector('#tooltip').setAttribute('data-date', val[0]);
       })
       .on("mouseout", (val) => {
            tooltip.transition()
                   .style("visibility", "hidden")
       });
};

fetch(url)
  .then(response => response.json())
  .then(data => {
    values = data.data
    console.log(values)
    generateCanvas();
    generateScales();
    generateAxisScales();
    generateBars();
    generateAxes();
  })
  .catch(error => console.error(error));