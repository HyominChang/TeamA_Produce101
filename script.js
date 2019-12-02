var selected_name = [];
var nameSelect = [];

var click = 0;

var margin = {top: 40, right: 150, bottom: 40, left: 30};

var outer_width = 900;
var outer_height = 500;
var svg_width = outer_width - margin.left - margin.right;
var svg_height = outer_height - margin.top - margin.bottom;
var playpauseFlag = 0;
var display_ep = 1;

var svg = d3.select("#vis")
  .append("svg")
  .attr("width", svg_width + margin.left + margin.right)
  .attr("height", svg_height + margin.top + margin.bottom)
  .append("g")
  .style("stroke","#fff")
  .style("background-color","#000")
  .attr("transform","translate("+margin.left +","+margin.top +")");

display_ep = 1;

function epFilter(value){
  return(value.ep == display_ep)
  console.log(value.ep)
}

function nameFilter(value){
    return(value.name == name)
}

// Add X axis
var xScale = d3.scaleLinear()
  .domain([0, 5])
  .range([ 1, svg_width ]);

var yScale = d3.scaleLinear()
  .domain([1, 14])
  .range([1,svg_height]);

var rScale = d3.scaleLinear()
  .domain([100, 900])
  .range([1, 5]);

//X
svg.append("g")
  .attr("transform", "translate(0," + svg_height + ")")
  .call(d3.axisBottom(xScale).ticks(5))
  .style("stroke","#fff");

//Y
svg.append("g")
  .call(d3.axisLeft(yScale))
  .style("stroke","#fff");

// // Add X axis label:
// svg.append("text")
//     .attr("text-anchor", "end")
//     .attr("x", width)
//     .attr("y", height+50 )
//     .text("skill");
// d3.select("#epvalue").text(d3.format("ep")(slider.value()));


// // Add Y axis label:
// svg.append("text")
//     .attr("text-anchor", "end")
//     .attr("x", 0)
//     .attr("y", -20 )
//     .text("rank")
//     .attr("text-anchor", "start")

svg.append("text")
  .attr("y", svg_height/1.5)
  .attr("x", svg_width/2)
  .style("text-anchor","middle")
  .attr("id","epid")
  .attr("class","epcls")
  .attr("opacity",0.5)
  .text(display_ep);

var myColor = d3.scaleOrdinal()
  .domain([1, 2, 3, 4, 5])
  .range(["#FF4FA9","#FF8D4F","#FFE74F","#4FFF84","#4FBBFF"]);


function generateViz(){
  var filtered_dataset = dataset.filter(epFilter);

  var trace = svg.selectAll("circle").data(filtered_dataset);

  //Perform data join
  var circles = svg.selectAll(".data_circles")
    .data(filtered_dataset, function key(d){
      nameSelect.push(d.name);
      return d.name;
    });

  if(click ==1){
    trace.remove();
    click=0;
  }

  //Update Selection
  circles.transition()
    .duration(1000)
    // .ease("linear")
    .attr("cx",function(d){
      return xScale(+d.skill);
    })
    .attr("cy",function(d){
      return yScale(+d.rank);
    })
    .attr("r",function(d){
      return rScale(d.expos);
    })
    .style("stroke", function(d) { return myColor(d.skill);})
    .style("stroke-width", 1)
    .attr("opacity", 0.9);

  svg.select("#epsld")
    .attr("x",svg_width/2)
    .attr("y",svg_height/1.5)
    .style("text-anchor","middle")
    .attr("class","epsldcls")
    .text(display_ep);
/////////
  circles.enter()
    .append("circle")
    .attr("class","data_circles")
    .attr("id",function(d){
      return d.name;
    })
    .attr("cx",function(d){
      return xScale(+d.skill);
    })
    .attr("cy",function(d){
      return yScale(+d.rank);
    })
    .attr("r",function(d){
      return rScale(d.expos);
    })
    .attr("opacity",0.9)
    .style("stroke", function(d) { return myColor(d.skill);});
//////////
    var mouseHoverOn = function(){
    // 배경 투명도조
      circles.style("opacity",0.2);
      var circles = d3.select(this);


    //하이라이트하
      circle.transition()
        .duration(10)
        .style("opacity", 0.9)

      circle.append("title")
        .text(function(d){
          return d.ep + ", 순위: " + d.rank + ", 등급: " + d.skill +", 개인분량: " + d.expos
        })

      svg.append("g")
        .attr("class","detailInfo")
        .append("line")
          .attr("x1",circle.attr("cx")-40)
          .attr("x2",circle.attr("cx")-40)
          .attr("y1",circle.attr("cy")-20)
          .attr("y2",svg_height-20)
          .attr("transform","translate(40,20)")
          .style("stroke","black")
          .transition()
            .delay(200)
            .duration(450)
            .styleTween("opacity", function(){
              return d3.interpolate(1,0.5);
            })
    svg.append("g")
      .attr("class","detailInfo")
      .append("line")
      .attr("y1",circle.attr("cy")-40)
      .attr("y2",circle.attr("cy")-40)
      .attr("x1",circle.attr("cx")-45)
      .attr("x2",0 - margin.left + 20)
      .attr("transform", "translate(40,40)")
      .style("stroke","black")
      .transition()
        .delay(200)
        .duration(450)
        .styleTween("opacity", function(){
          return d3.interpolate(1,0.5);
        })
    };

    var mouseHoverOff = function(){
      circles.style("opacity",0.9)
      var circle = d3.select(this);
      d3.selectAll(".detailInfo")
        .transition()
          .duration(10)
          .styleTween("opacity", function(){
            return d3.interpolate(0.5,1);
          })
          remove();
    };

    var mouseclick = function(d){
      name = d.name
      click = 1
      var name_data = dataset.filter(nameFilter);

      circles.remove();

      var trace = svg.selectAll("circle")
        .data(name_data)
        trace.attr("cx",function(d){
          return xScale(d.skill);
        })
        .attr("cy",function(d){
          return yScale(d.rank);
        })
        .attr("r",function(d){
          return rScale(d.expos);
        })
        .style("stroke", function(d) { return myColor(d.skill);})
        .style("stroke-width",1)
        .style("stroke-opacity",0.5);

      trace.enter()
        .append("circle")
        .attr("cx",function(d){
          return xScale(d.skill);
        })
        .attr("cy",function(d){
          return yScale(d.rank);
        })
        .attr("r",function(d){
          return rScale(d.expos);
        })
        .style("stroke", function(d) { return myColor(d.skill);})
        .style("stroke-width",1)
        .style("stroke-opacity",0.5);
    };

  circles.on("mouseover", mouseHoverOn);
  circles.on("mouseout", mouseHoverOff);
  circles.on("click", mouseclick);
  circles.exit()
    .remove();
};
//json가능할까?

//csv
d3.csv("rank.csv", function(error,data){
  if(error){
    console.log("Something went wrong");
  } else {
    console.log("Data has been loaded");
    dataset = data;
    generateViz();
  }
});

d3.select(".playpauseBtn")
  .on("click",function(){
    if(playpauseFlag == 0){
      playpauseFlag = 1
      var buttonPause = document.getElementById("playpauseBtn");
      buttonPause.innerHTML = "<img src='btnPause.png' style='height: 35px; width:35px' alt='Submit'/>";
      playInterval = setInterval(function(){
        display_ep++;
        if(display_ep>3){
          display_ep = 1;
        }
        document.getElementById("epsld").value = display_ep;
        generateViz();
      }, 1000);
    }else{
      playpauseFlag = 0
      var buttonPause = document.getElementById("playpauseBtn");
      buttonPause.innerHTML = "<img src='btnPlay.png' style='height:35px; width: 35px' alt='Submit'/>";
      clearInterval(playInterval)
      generateViz()
    }
  });

function sliderValue(value){
  display_ep=value;
  playpauseFlag = 0
  var buttonPause = document.getElementById("playpauseBtn");
  buttonPause.innerHTML = "<img src='btnPlay.png' style='height:35px;width:35px' alt='Submit'/>";
  clearInterval(playInterval)
  var sliderCreated = document.getElementById("epsld")
    generateViz();
    clearInterval(playInterval);
}

var sliderCreated = document.getElementById("epsld")
