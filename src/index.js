const SVG_WIDTH = window.screen.availWidth * 6 / 10;
const SVG_HEIGHT = window.screen.availHeight * 7 / 10;

var tileColors = {};

// Prints title and description to webpage.
function createTitle(data) {
    d3.select("body").append("h1").text("Video Game Sales").attr("id", "title");
    d3.select("body").append("p").text(data.name).attr("id", "description");
}

// Select a color for each tile group.
function selectColors(data) {
    for (let i=0; i<data.children.length; i++) {
        tileColors[data.children[i].name] = "hsl(" + Math.floor((data.children.length-i-1) * 255 / data.children.length) + ",100%,70%)";
    }
}

// Create the tree map.
function createSVG(data) {
    const svg = d3.select('body').append('svg')
        .attr("width", SVG_WIDTH).attr("height", SVG_HEIGHT)
        .style("background-color", "#DDDDDD")
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
            .style("fill", d => {
                return tileColors[d.data.category];
            });    
            
    // Adds text to the treemap.
    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr('x', d => {return d.x0+5})
        .attr('y', d => {return d.y0+10})
        .text(d => { return d.data.name })
        .attr("font-size", "10px")
        .attr("fill", "black");
}

// For testing purposes.
function showData(data) {
    d3.select("body").append("p").text(JSON.stringify(data.children[1])).attr("id", "data");
}

fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
    .then(response => response.json())
    .then(data => {
        createTitle(data);
        createSVG(data);
        showData(data);
    });