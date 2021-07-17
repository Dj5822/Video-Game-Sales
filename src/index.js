const SVG_WIDTH = window.screen.availWidth * 9 / 10;
const SVG_HEIGHT = window.screen.availHeight * 7 / 10;

var tileColors = [];

// Prints title and description to webpage.
function createTitle(data) {
    d3.select("body").append("h1").text("Video Game Sales").attr("id", "title");
    d3.select("body").append("p").text(data.name).attr("id", "description");
}

// Add a bunch of colors to tileColors list.
function selectColors(numberOfColors) {
    for (let i=0; i<numberOfColors; i++) {
        tileColors.push("hsl(" + Math.floor(i * 255 / numberOfColors) + ",86%,70%)");
    }
}

// Create the tree map.
function createSVG(data) {
    const svg = d3.select('body').append('svg')
        .attr("width", SVG_WIDTH).attr("height", SVG_HEIGHT)
        .style("background-color", "#DDDDDD");

    selectColors(parseInt(data.children.length));
    
    svg.append("rect")
        .attr("width", 200)
        .attr("height", 200)
        .attr("x", 150)
        .attr("y", 150)
        .style("fill", tileColors[0])
        .attr("class", "tile");
        
}

// For testing purposes.
function showData(data) {
    d3.select("body").append("p").text(JSON.stringify(data.children)).attr("id", "data");
}

fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
    .then(response => response.json())
        .then(data => {
            createTitle(data);
            createSVG(data);
            showData(data);
        });