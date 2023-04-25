const width = 800;
const height = 500;
const padding = 25;

fetch('./data.json')
    .then((response) => response.json())
    .then((database) => {
    
        const data = database["data"]

        const date = data.map(function (item) {
            return new Date(item[0]);
        });

        // Scales
        const xScale = d3.scaleTime()
                         .domain([d3.min(date), d3.max(date)])
                         .range([0, width]);

        const yScale = d3.scaleLinear()
                         .domain([0, d3.max(data, (d) => d[1])])
                         .range([height, 0]);

        // Graph
        const svg = d3.select(".container")
                      .append("svg")
                      .attr("width", width + 60)
                      .attr("height", height + 25);

        // Bars
        svg.selectAll("rect")
           .data(data)
           .enter()
           .append("rect")
           .attr("class", "bar")
           .attr("x", (d) => xScale(new Date(d[0])))
           .attr("y", (d) => yScale(d[1]))
           .attr("width", width / 275)
           .attr("height", (d) => d[1])
           .attr("transform", "translate(60,0)")
           .attr("fill", "darkblue");
           
        // Axis
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
           .attr("transform", "translate(60," + height + ")")
           .call(xAxis)    

        svg.append("g")
           .attr("transform", "translate(60," + 0 + ")")
           .call(yAxis) 

    });   