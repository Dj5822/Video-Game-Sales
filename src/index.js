const SVG_WIDTH = window.screen.availWidth * 6 / 10;
const SVG_HEIGHT = window.screen.availHeight * 7 / 10;
const LEGEND_WIDTH = window.screen.availWidth * 2 / 10;
const LEGEND_HEIGHT = window.screen.availHeight * 7 / 10;

var tileColors = {};

// Prints title and description to webpage.
function createTitle(data) {
    d3.select("#title-div").append("h1").text("Video Game Sales").attr("id", "title");
    d3.select("#title-div").append("p").text(data.name).attr("id", "description");
}

// Select a color for each tile group.
function selectColors(data) {
    for (let i=0; i<data.children.length; i++) {
        tileColors[data.children[i].name] = "hsl(" + Math.floor((data.children.length-i-1) * 255 / data.children.length) + ",100%,70%)";
    }
}

// Create the tree map.
function createSVG(data) {
    var tooltip = d3.select('body').append('div')
            .attr("id", "tooltip")
            .attr("data-value", "")
            .style("width", "200px")
            .style("height", "150px")
            .style("opacity", 0)
            .style("text-align", "center")
            .style("left", window.screen.availWidth - 400 + "px")
            .style("top", "0px");
    
    var tooltipName = tooltip.append("text");
    var tooltipCategory = tooltip.append("text");
    var tooltipValue = tooltip.append("text");

    const svg = d3.select('#main-content').append('svg')
        .attr("width", SVG_WIDTH).attr("height", SVG_HEIGHT)
        .append("g");

    selectColors(data);

    var root = d3.hierarchy(data).sum(d => {return d.value});

    d3.treemap()
        .size([SVG_WIDTH, SVG_HEIGHT])
        .padding(2)
        (root);

    // Adds rectangles to the treemap.
    svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
            .attr('x', d => {return d.x0})
            .attr('y', d => {return d.y0})
            .attr('width', d => {return d.x1 - d.x0})
            .attr('height', d => {return d.y1 - d.y0})
            .attr("class", "tile")
            .attr("data-name", d => {return d.data.name})
            .attr("data-category", d => {return d.data.category})
            .attr("data-value", d => {return d.data.value})
            .style("fill", d => {return tileColors[d.data.category]})
            .on("mouseover", (d, i) => {
                tooltipName.text(d.data.name);
                tooltipCategory.text("Category: " + d.data.category);
                tooltipValue.text("Value: " + d.data.value);
                tooltip.style("opacity", 1);
            })
            .on("mouseout", (d, i) => {
                tooltip.style("opacity", 0);
            });
            
    onmousemove = function(e){
        tooltip.style("left", e.clientX + 10 + "px");
        tooltip.style("top", e.clientY - 90 + "px");
    };
            
    // Adds text to the treemap.
    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
            .selectAll("tspan")
            .data(d => {
                var tspanElements = [];
                d.data.name.split(" ").forEach(x => {
                    tspanElements.push({
                        text: x, 
                        x: d.x0+5, 
                        y: d.y0+10
                    });
                });
                return tspanElements;
            })
            .enter()
                .append("tspan")
                .text(d => {return d.text})
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("x", d => {return d.x})
                .attr("y", (d, i) => {return d.y + 10*i});
}

function createLegend() {
    var legend = d3.select("#main-content")
        .append('svg')
        .attr("width", LEGEND_WIDTH).attr("height", LEGEND_HEIGHT)
        .append('g')
        .attr('id', 'legend');

    legend
        .selectAll("rect")
        .data(Object.keys(tileColors))
        .enter()
        .append("rect")
        .attr("id", "legend-item")
        .attr("width", LEGEND_HEIGHT/(Object.keys(tileColors).length*2))
        .attr("height", LEGEND_HEIGHT/(Object.keys(tileColors).length*2))
        .attr("x", LEGEND_WIDTH/5)
        .attr("y", (d, i) => {
            return LEGEND_HEIGHT * i / Object.keys(tileColors).length;
        })
        .style("fill", d => tileColors[d])
    
    legend
        .selectAll("text")
        .data(Object.keys(tileColors))
        .enter()
        .append("text")
        .text(d => d)
        .attr("font-size", LEGEND_HEIGHT/(Object.keys(tileColors).length*2) + "px")
        .attr("x", LEGEND_WIDTH/5 + LEGEND_HEIGHT/(Object.keys(tileColors).length*2) * 2)
        .attr("y", (d, i) => {
            return LEGEND_HEIGHT * i / Object.keys(tileColors).length + LEGEND_HEIGHT/(Object.keys(tileColors).length*2);
        });
    

}

fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
    .then(response => response.json())
    .then(data => {
        createTitle(data);
        createSVG(data);
        createLegend();
    });