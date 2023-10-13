fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((raw) => raw.json())
  .then((data) => {
    const [w, h, p] = [800, 500, 80];
    const svg = d3
      .select("body")
      .append("svg")
      .attr("id", "graph")
      .attr("width", w)
      .attr("height", h);
    const titles = svg.append("g");
    titles
      .append("text")
      .attr("id", "title")
      .attr("x", w * 0.23)
      .attr("y", p / 2)
      .attr("font-size", "30px")
      .text("Doping in Professional Bicycle Racing");
    titles
      .append("text")
      .attr("x", w * 0.35)
      .attr("y", p * 0.8)
      .attr("font-size", "25px")
      .text("35 Fastest times up Alpe d'Huez");
    titles
      .append("text")
      .attr("x", w * 0.03)
      .attr("y", 3 * p)
      .attr("font-size", "21px")
      .text("Time in Minutes")
      .attr("transform-origin", `${w * 0.03} ${3 * p}`)
      .attr("transform", "rotate(-90)");
    let capt = titles.append("g").attr("id", "legend");
    let rects = capt.append("g");
    rects
      .append("rect")
      .attr("x", w * 0.9)
      .attr("y", h * 0.5)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "rgb(243, 157, 94)");
    rects
      .append("rect")
      .attr("x", w * 0.9)
      .attr("y", h * 0.55)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "rgb(64, 124, 178)");
    capt
      .append("text")
      .text("No doping allegations")
      .attr("x", w * 0.78)
      .attr("y", h * 0.52)
      .attr("font-size", "10px");
    capt
      .append("text")
      .text("Riders with doping allegations")
      .attr("x", w * 0.74)
      .attr("y", h * 0.57)
      .attr("font-size", "10px");
    xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => parseInt(d.Year)) - 1,
        d3.max(data, (d) => parseInt(d.Year)) + 1,
      ])
      .range([p, w - p]);
    xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const parse = d3.timeParse("%M:%S");
    const format = d3.timeFormat("%M:%S");
    const yScale = d3
      .scaleTime()
      .domain([d3.min(data, (d) => parse(d.Time)), d3.max(data, (d) => parse(d.Time))])
      .range([p, h - p]);
    let tickCount = (d3.max(data, (d) => d.Seconds) - d3.min(data, (d) => d.Seconds)) / 15;
    let tickVal = [Math.round(d3.min(data, (d) => d.Seconds) / 60) * 60];
    for (let i = 1; i < tickCount; i++) {
      tickVal.push(tickVal[i - 1] + 15);
    }
    tickVal = tickVal.map((d) =>
      parse(
        `${Math.floor(d / 60)}:${
          d % 60 == 0 ? "00" : (d / 60 - Math.floor(d / 60)) * 60
        }`
      )
    );
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat(format)
      .ticks(tickCount)
      .tickValues(tickVal);
    let newD = [];
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => parse(d.Time))
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(parse(d.Time)))
      .attr("r", 5)
      .attr("fill", (d) =>
        d.Doping ? "rgb(64, 124, 178)" : "rgb(243, 157, 94)"
      )
      .on("mouseover", (e, d) => {
        newD = [
          `${d.Name}: ${d.Nationality}`,
          `Year: ${d.Year}, Time: ${d.Time}`,
          `${d.Doping ? "qwe" : ""}`,
          `${d.Doping}`,
        ];
        tip
          .style("visibility", "visible")
          .style("opacity", "0.8")
          .attr("data-year", d.Year)
          .style("position", "absolute")
          .style("top", `${e.clientY}px`)
          .style("left", `${e.clientX}px`)
          .selectAll("h1")
          .data(newD)
          .join("h1")
          .style("font-size", "20px")
          .text((data) => data)
          .style("visibility", (data) =>
            data === "qwe" ? "hidden" : "visible"
          );
      })
      .on("mouseout", (e, d) => {
        tip.style("visibility", "hidden").style("opacity", "0");
      })
      .style("stroke", "black")
      .style("stroke-width", "1");
    svg
      .append("g")
      .attr("transform", `translate(0, ${h - p})`)
      .attr("id", "x-axis")
      .call(xAxis);
    svg
      .append("g")
      .attr("transform", `translate(${p}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis);
    const tip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background-color", "rgb(171, 190, 217)")
      .style("border-radius", "5px")
      .style("visibility", "hidden")
      .style("opacity", "0");
  });
