// Define the dimensions of the chart
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Define the SVG container for the chart
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load the data from the CSV file
d3.csv("owid-covid-data.csv").then(function (data) {
  // Format the date values
  const parseDate = d3.timeParse("%Y-%m-%d");
  data.forEach(function (d) {
    d.date = parseDate(d.date);
  });

  // Define the x and y scales
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.total_cases_per_million)])
    .range([height, 0]);

  // Define the line generator
  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.total_cases_per_million));

  // Create the line chart
  svg
    .append("path")
    .datum(data.filter((d) => d.location === "World"))
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Add the x-axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Add the y-axis
  svg.append("g").call(d3.axisLeft(yScale));

  // Add the chart title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .text("COVID-19 Cases per Million People Worldwide");

  // Define a tooltip for displaying data points
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  
  // // Define a function for showing the tooltip
  const showTooltip = (event, d) => {
    tooltip
      .html(
        `<div>Country: ${d.location}</div><div>Date: ${d.date.toLocaleDateString()}</div><div>Total Cases per Million: ${d.total_cases_per_million}</div>`
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + 10 + "px")
      .transition()
      .duration(200)
      .style("opacity", 0.9);
      
    // Add country name to tooltip
    tooltip
      .append("div")
      .style("font-size", "12px")
      .style("margin-top", "5px")
      .text("Country: " + d.location);
  };

  // Define a function for hiding the tooltip
  const hideTooltip = () => {
    tooltip.transition().duration(200).style("opacity", 0);
  };

  // Add the data points as circles with tooltips
  svg
    .selectAll("circle")
    .data(data.filter((d) => d.location === "World"))
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.total_cases_per_million))
    .attr("r", 3)
    .attr("fill", "steelblue")
    .on("mouseover", (event, d) => {
      showTooltip(event, d, "World");
    })
    .on("mouseout", hideTooltip);
 

});