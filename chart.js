const margin = {top: 50, right: 50, bottom: 50, left: 50};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;


const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);


const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);


const color = d3.scaleOrdinal(d3.schemeCategory10);


const line = d3.line()
  .x(d => x(d.date))
  .y(d => y(d.value));


    // get the data
d3.csv("owid-covid-data.csv").then( function(data) {
  const parseDate = d3.timeParse("%Y-%m-%d");
  data.forEach(function (d) {
    d.date = parseDate(d.date);
  });

  
  var afghanistanData = data.filter(function(d) {
    return d.location === "China";
  });

  
  var lineData = afghanistanData.map(function(d) {
    return {
      date: d.date,
      newCases: +d.new_cases,
      totalCases: +d.total_cases,
      totalvaccinations: +d.total_vaccinations
    };
  });

  //group line point
 

  var x = d3.scaleTime()
    .domain(d3.extent(lineData, function(d) { return new Date(d.date); }))
    .range([0, width]);

  var y = d3.scaleLinear()
    .domain([0, d3.max(lineData, function(d) { return d3.max([d.newCases, d.totalCases, d.totalvaccinations]); })])
    .range([height, 0]);

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  var svg = d3.select("#chart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var newCasesLine = d3.line()
    .x(function(d) { return x(new Date(d.date)); })
    .y(function(d) { return y(d.newCases); });

  var totalCasesLine = d3.line()
    .x(function(d) { return x(new Date(d.date)); })
    .y(function(d) { return y(d.totalCases); });

  var totalvaccinationsLine = d3.line()
    .x(function(d) { return x(new Date(d.date)); })
    .y(function(d) { return y(d.totalvaccinations); });

  svg.append("path")
      .datum(lineData)
      .attr("class", "line new-cases")
      .attr("d", newCasesLine);

  svg.append("path")
      .datum(lineData)
      .attr("class", "line total-cases")
      .attr("d", totalCasesLine);

  svg.append("path")
      .datum(lineData)
      .attr("class", "line totalvaccinations")
      .attr("d", totalvaccinationsLine);

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);
});