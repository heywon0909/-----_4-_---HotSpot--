const menu = document.querySelectorAll('.menu >button');


function focusButtonRemove(id) {
    const part2 = document.querySelector(`#part${id}`);
    const button = document.getElementById(id);
    button.classList.remove('selected');
    part2.classList.add('hide');
    part2.classList.remove('show');
}
function init() {
    const part1 = document.querySelector(`#part1`);
    const part2 = document.querySelector(`#part2`);
    const button = document.getElementById(1);
    button.classList.add('selected');
    part1.classList.add('show');
    part2.classList.add('hide');
    part2.classList.remove('show');
}

init();



menu.forEach((button) => {
    button.addEventListener('click', () => {
        const id = button.id;
        button.classList.add('selected')
        const partSection = document.querySelector(`#part${id}`);
        partSection.classList.remove('hide');
        partSection.classList.add('show');
        focusButtonRemove(id==='1'?2:1)

    })
})


var global_name= "합계";//마우스클릭할 때, 변경되는 값 저장

///차트 1: 서울 지도 ///
    var width = 600, height = 450; 

    var svg = d3.select("#map_chart")
    .attr("width",width)
    .attr("height", height);
 
    var map = svg.append("g").attr("id", "map"),
    places = svg.append("g").attr("id", "places");
    
    var projection = d3.geo.mercator()
    .center([126.9895, 37.5651])
    .scale(70000)
    .translate([width/2, height/2]);

    var path = d3.geo.path().projection(projection);
  
   
    d3.json("./data/seoul_municipalities_topo_simple.json", function(error, data) {
  
    var features = topojson.feature(data, data.objects.seoul_municipalities_geo).features;

    map.selectAll("path")
    .data(features)
    .enter().append("path")
    .attr("class", function(d) { console.log(); return "municipality c" + d.properties.code })
    .attr("d", path);

    map.selectAll("text")
      .data(features)
      .enter().append("text")
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .attr("class", "municipality-label")
      .text(function(d) { return d.properties.SIG_KOR_NM; })// 서울 자치구 출력
});

//툴팁 정의 (서울지도에서 Hotspot근처 따릉이 타기 좋은 곳 사진으로 보여줌)
var Tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 1)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // 사용자의 마우스 움직임에 따라 tooltip이 달라지도록 정의
    var mouseover = function(d) {
      Tooltip.style("opacity", 1)
    }
    var mousemove = function(d) {
     
      Tooltip
        .html("<b>" + d.name + "</b>" + "<br>" + "<img src=" + d.photo + " width=250 height=160 ></img>")
        .style("left", (d3.mouse(this)[0]+10) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
      
      if(d.size != 4){
        Tooltip.style("opacity", 0)
        
      }
    }
    var mouseleave = function(d) {
      Tooltip.style("opacity", 0)
    }
    
   
  

// 지도에 점 찍기 place1
d3.csv("./data/newplace.csv", function(data) {
  places.selectAll("circle")
      .data(data)
    .enter().append("circle").attr('id', 'map_circle')
      .attr("cx", function(d) { return projection([d.lon, d.lat])[0]; })
      .attr("cy", function(d) { return projection([d.lon, d.lat])[1]; })
      .attr("r", function(d){return d.size;})   // 원 크기를 csv에 지정된 size로 설정
      .style("fill", function(d) {return d.color;}) //관광지 원 색상 정해줌
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
      /*
      .on("click", function(n){
        d3.selectAll("#map_circle").attr('r',function(d){if(d.name == n.name) return d.size+2;});
      })
      .on("mouseout",function(){
        d3.selectAll('#map_circle').attr('r',function(d){return d.size;}) });
        */


  places.selectAll("text")
      .data(data)
    .enter().append("text")
      .attr("x", function(d) { return projection([d.lon, d.lat])[0]; })
      .attr("y", function(d) { return projection([d.lon, d.lat])[1] + 8; })
      .text(function(d) { return d.name2 });
});


///차트2 : 연령대별 이용현황 도넛차트 ///

d3.select("#right_chart").attr("width", 600).attr("height", 500);
      
        //도넛차트를 그려주는 함수 정의
       var pieChart = function(){

       var r = 120; 
       var age_seg=["10대", "20대", "30대", "40대", "50대", "60대 이상"];
       var canvas = d3.select("#right_chart").append("g").attr("id", "pie_chart")
                .attr("transform", "translate(250,150)") ;
               
        var color = d3.scale.ordinal()
                   .range(["#D3F500", "#A1F20C", "#1ADB00", "#0CF259", "#0CE8B4", "#00C5EB"]);
                
       var group = canvas.append("g")
                   .attr("transform", "translate(60, 10)");
       var arc = d3.svg.arc()
                .innerRadius(40) 
                .outerRadius(r);
      
       d3.csv("./data/age_pie.csv",function(data){
        let data2 = data.filter(p => p.name ==global_name);//클릭된 대여소의 정보를 가져올 수 있도록

        var pie = d3.layout.pie()
        .value ( function(d) { return d.value; });

        var arcs = group.selectAll(".arc")
        .data(pie(data2))
        .enter()
        .append("g") 
        .attr("class", "arc");
        
        arcs.append("path")
       .attr("d", arc)
       .attr("fill", function(d) { return color(d.value)});

       arcs.append("text")
       .attr("transform", function(d, i) { 
           if (i<4) 
           {return "translate(" + arc.centroid(d) + ")" ;}
           else 
           {return "translate(" + arc.centroid(d) + ") "+ "rotate("+90+") ";} })
       
       .attr("text-anchor", "middle")
       .attr("font-size", "0.8em")
       .text(function(d, i) { return age_seg[i]; }); //도넛 차트의 조각에 연령대 정보 표시
      

           });


       };  
       pieChart(); //실제 파이차트가 그려지는 실행
        
///차트3 : 시간대별 요일별 이용 현황 히트맵///

        var margin_heatmap = { top: 50, right: 0, bottom: 100, left: 30 },
            width = 560 - margin_heatmap.left - margin_heatmap.right,
            height = 230 - margin_heatmap.top - margin_heatmap.bottom,
            gridSize = Math.floor(width / 24),
            legendElementWidth = gridSize*2,
            buckets = 200,
            
            colors = ["#ffffe5","#ffffe4","#feffe2","#feffe1","#feffdf","#feffde","#fdfedd","#fdfedb","#fdfeda","#fdfed9","#fcfed7","#fcfed6","#fcfed5","#fbfed3","#fbfed2","#fbfdd1","#fbfdcf","#fafdce","#fafdcd","#f9fdcc","#f9fdca","#f9fdc9","#f8fcc8","#f8fcc7","#f7fcc5","#f7fcc4","#f6fcc3","#f6fcc2","#f5fbc1","#f5fbc0","#f4fbbf","#f4fbbe","#f3fabd","#f3fabc","#f2fabb","#f1faba","#f1f9b9","#f0f9b8","#eff9b7","#eff9b6","#eef8b5","#edf8b4","#ecf8b3","#ebf7b2","#ebf7b2","#eaf7b1","#e9f6b0","#e8f6af","#e7f6ae","#e6f5ae","#e5f5ad","#e4f4ac","#e3f4ab","#e2f4ab","#e1f3aa","#e0f3a9","#dff2a8","#def2a8","#ddf2a7","#dcf1a6","#dbf1a6","#daf0a5","#d9f0a4","#d8efa4","#d6efa3","#d5eea2","#d4eea2","#d3eda1","#d2eda0","#d0eca0","#cfec9f","#ceeb9e","#cdeb9e","#cbea9d","#caea9c","#c9e99c","#c7e89b","#c6e89a","#c5e79a","#c3e799","#c2e698","#c1e598","#bfe597","#bee496","#bde496","#bbe395","#bae294","#b8e294","#b7e193","#b5e192","#b4e092","#b2df91","#b1df90","#afde90","#aedd8f","#acdd8e","#abdc8e","#a9db8d","#a8db8c","#a6da8c","#a5d98b","#a3d98a","#a2d88a","#a0d789","#9ed788","#9dd688","#9bd587","#9ad586","#98d486","#96d385","#95d284","#93d284","#92d183","#90d082","#8ed082","#8dcf81","#8bce80","#89cd80","#88cd7f","#86cc7e","#84cb7d","#83ca7d","#81ca7c","#7fc97b","#7ec87a","#7cc77a","#7ac779","#79c678","#77c577","#75c477","#73c376","#72c375","#70c274","#6ec174","#6dc073","#6bbf72","#69be71","#68be70","#66bd6f","#64bc6f","#63bb6e","#61ba6d","#5fb96c","#5eb96b","#5cb86a","#5ab76a","#59b669","#57b568","#56b467","#54b366","#53b265","#51b164","#50b064","#4eaf63","#4dae62","#4bad61","#4aac60","#48ab5f","#47aa5e","#46a95e","#44a85d","#43a75c","#42a65b","#40a55a","#3fa459","#3ea359","#3da258","#3ca157","#3aa056","#399f55","#389d55","#379c54","#369b53","#359a52","#349951","#339851","#329750","#31964f","#30944e","#2f934e","#2e924d","#2d914c","#2c904b","#2a8f4b","#298e4a","#288d49","#278b49","#268a48","#258947","#248847","#238746","#228645","#218545","#208444","#1f8344","#1e8243","#1d8143","#1c8042","#1b7f42","#1a7e41","#197d41","#187c40","#177b40","#167a3f","#15793f","#14783e","#13773e","#12763d","#11753d","#10743c","#10733c","#0f723c","#0e723b","#0d713b","#0c703a","#0b6f3a","#0b6e3a","#0a6d39","#096c39","#086b38","#086a38","#076938","#066837","#066737","#056636","#056536","#046435","#046335","#046235","#036134","#036034","#025f33","#025e33","#025d33","#025c32","#015b32","#015a31","#015931","#015730","#015630","#015530","#00542f","#00532f","#00522e","#00512e","#00502d","#004f2d","#004e2d","#004d2c","#004c2c","#004a2b","#00492b","#00482a","#00472a","#004629","#004529"], // alternatively colorbrewer.YlGnBu[9]
            days = ["월", "화", "수", "목", "금", "토", "일"],
            times = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];
           

        var svg_heatmap = d3.select("#right_chart")
            .append("g")
            .attr('id', 'heatmap')
            .attr("transform", "translate(" + margin_heatmap.left + "," + 300 + ")")
  
        var dayLabels =svg_heatmap.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
              .text(function (d) { return d; })
              .attr("x", 0)
              .attr("y", function (d, i) { return i * gridSize; })
              .style("text-anchor", "end")
              .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
              .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis-noworkweek"); });
  
        var timeLabels = svg_heatmap.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
              .text(function(d) { return d; })
              .attr("x", function(d, i) { return i * gridSize; })
              .attr("y", 0)
              .style("text-anchor", "middle")
              .attr("transform", "translate(" + gridSize / 2 + ", -6)")
              .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis-noworktime"); });
  
        var heatmapChart = function() {
          d3.csv("./data/top10_요일별_시간대별_이용건수_heatmap.csv", function(data) {
            let data2 = data.filter(p => p.place ==global_name); //클릭된 대여소의 정보가 나타나도록 처리
  
          // 툴팁 생성 (히트맵에서 각 네모에 해당하는 요일과 시간, 이용량 정보를 제공)
          var tooltip = d3.select("body")
          .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px");
  
          
        // 사용자의 마우스 동작에 따라 툴팁 실행동작 정의
          var mouseover = function(d) {
          tooltip.style("opacity", 1);       
          }
          var mousemove = function(d) {
          tooltip
          .html(d.요일+" "+d.time+"시<br>이용건수 : " + d.value + "건") //요일, 시간, 이용건수 정보
          .style("left", (600+d3.mouse(this)[0]) + "px")
          .style("top", (350+d3.mouse(this)[1]) + "px")
  }
          var mouseleave = function(d) {
          tooltip.style("opacity", 0);
          }

          // 해당되는 데이터 d 의 x, y 에 대해 stroke 두께를 더 크게 주는 기능.
          var gridOver = function (d, i) {
          d3.selectAll("rect").style("stroke-width", function (p) { return p.x == d.x || p.y == d.y ? "10px" : "2px" }) //기본이 1px
        }
  
        var colorScale = d3.scale.quantile()
                .domain([0 ,d3.max(data2, function (d) { return d.value; })])
                .range(colors);
                
  
        var cards = svg_heatmap.selectAll(".hour")
            .data(data2, function(d) {return d.day+':'+d.time;});
  
            cards.append("title");
  
            cards.enter().append("rect")
                .attr("x", function(d) { return (d.time - 1) * gridSize; })
                .attr("y", function(d) { return (d.day - 1) * gridSize; })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0])
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);
                //.on("mouseover", gridOver); // gridOver 이벤트 추가;
  
            cards.transition().duration(1000)
                .style("fill", function(d) { return colorScale(d.value); }); //데이터의 범위에 맞게 color가 scale되고, 그 값으로 색을 정함
  
            //cards.select("title").text(function(d) { return d.value; }); //툴팁과 동작이 겹치는 부분이 존재하여 주석 처리
            
            cards.exit().remove();
          });  
  
  
        };
        
        // 히트맵이 만들어지는 실행 
        global_name="합계"; // 첫 실행때는 global_name이 합계(default)이므로 
        heatmapChart();
     
   
    ///차트4 : 대여소 Hotspot 순위별로 보여주는 버블차트 ///

        var svg_bubble = d3.select("#bubble_chart")
        .attr("width", 1250)
        .attr("height", 200)
        .append("g")
        .attr("transform",
      "translate(" + 0+ "," + 10 + ")");

        //데이터 읽기
        d3.csv("./data/rank.csv", function(data) {

        // x축 스케일
        var x = d3.scale.linear()
        .domain([0, 10])
        .range([ 0, 1200 ]);


        // y축 스케일
        var y = d3.scale.linear()
        .domain([0, 2])
        .range([140, 0]);

        // 버블 사이즈에 대해 스케일 조정
        var z = d3.scale.linear()
        .domain([0, 2800])
        .range([ 1, 10]);

        var myColor =["#fff","#dde5e1","#97b2a1","#7d9f8a","#5c876d","#336949","#00441b","#003616",'#002b12','#00220e']; // 색상 정의 
        
        // dot 추가
        var b = svg_bubble.append('g')
        .selectAll("dot")
        .data(data)
        .enter();


        var circles = b.append("circle").attr("id", "b_circle")
        .attr("cx", function (d) { 
          if(d.value == 1) {return x(0.6);} else {return x(0.1+ d.rank * 0.9);}
         } )
        .attr("cy", function (d) { return y(1); } )
        .attr("r", function (d) { return z(d.value)*5; } ) // 이용량에 따라 버블의 크기 조정
        .style("fill", function(d,i){return myColor[9-i];}) // 이용량에 따라 버블의 색상 조정
        .style("opacity", "0.8")
        .style("stroke", "darkgreen")
        .style("stroke-width", "1px");

        circles.each(function (d, i) {
            
            if (i === 0) { // 첫 번째 circle에 대해 처리
                expandBubbleDetail(d)
            }
        });
            
        function expandBubbleDetail(n) {
            d3.selectAll('#b_text').text(""); // 이전에 클릭된 대여소의 이름 정보 지움

            circles.attr("r", function(d) { // 클릭된 버블은 사이즈가 조금 커지도록
                if (d.rank === n.rank)
                return z(d.value) * 6;
                else
                return z(d.value) * 5;
            });

            circles.style("stroke-width", function(d) { // 클릭된 버블의 선의 굵기가 좀 굵어지도록
                if (d.rank === n.rank) {
                return 2;
                } else {
                return 1;
                }
            });

            d3.selectAll('#map_circle').attr('r', function(d) { // 버블이 클릭되면, 차트1(서울지도) 위의 해당 대여소의 점의 크기가 커지도록
                if (d.name === n.name)
                return 13;
                else
                return d.size;
            });

            b.append("text").attr('id', 'b_text').attr('text-anchor', "middle")
                .attr("x", function(d) { return x(0.1 + d.rank * 0.9); })
                .attr("y", 150)
                .text(function(d) { if (d.rank === n.rank) return d.name; }); // 버블 선택시, 버블 아래에 대여소 이름 정보 표시

            global_name = n.name; // global_name을 클릭된 버블에 대한 대여소 이름으로 변경
            pieChart(); // 변경된 대여소에 대해 도넛차트 생성
            heatmapChart(); // 변경된 대여소에 대해 히트맵 생성
        }
       
        
        circles.on("mouseover", expandBubbleDetail)

        .on("mouseout",function(){ //버블에서 마우스가 나오는 경우 : 원의 크기, 선의 굵기 제자리 
          //d3.selectAll('#b_text').text("");
          d3.selectAll('#b_circle').attr('r',function(d){return z(d.value)*5;} )
          d3.selectAll('#b_circle').style('stroke-width',1 )
          d3.selectAll('#map_circle').attr('r',function(d){return d.size;} ) // 차트1(서울지도)상의 대여소 점의 크기도 제자리
          

        });

        b.append("text")
            .style("text-anchor", "middle")
            .attr("x",  function(d){return x(0.1+ d.rank * 0.9)})
            .attr("y", 75)
            .attr("fill", "black")
            .text(function(d,i){return d.rank+"위";}) // 버블에 순위 정보 표시
            .style("text-size", "20px");

  });
  ///차트5 : 네트워크 시각화 ///
  // 버블차트와 연동하여 클릭시 해당 대여소가 강조되게 구현하고자 하였으나, d3.v4.js파일을 포함하면서 앞의 스크립트와 합치게 되면//
  //히트맵이 시작화면에서 정상 작동하지 않아 네트워크는 버블차트의 클릭 동작수행에서 제외

    const margin_network={top:0,right:20,bottom:10,left:50};
    var svg_network = d3.select("#network_chart");
    var n_width=1200, n_height=500;
    svg_network.attr("width", n_width).attr("height", n_height);

    
    svg_network.attr("transform","translate("+margin_network.top+","+margin_network.left+")");
    svg_network.append("text").text("Circle에 마우스 커서를 갖다 대면 대여소명이 보여요!") //안내 문장
    .attr("transform","translate("+30+","+margin_network.left+")");
    var color_node = ["lightgray","#31a354","#fdea45"]; // 0번노드, 대여소노드(Hotspot), Hotspot으로/에서 이동하는 대여소의 색상 정보 
    var myColor =["#e8f6f9","#d5efed","#b7e4da","#8fd3c1","#68c2a3","#49b17f","#2f9959","#157f3c","#036429","#00441b"]; //hotspot대여소의 색상 (버블차트의 색과 동일하도록)


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(50).strength(0.6))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2+200, height / 2 + 200) )
    .force("collide", d3.forceCollide(radiusFn))

function radiusFn(d) {
  var r = (d.UnKnown/d.Known)*6;
  if(isNaN(r)) {
    return 0;
  } else {
    return r;
  }
}

//데이터 읽기
d3.json("./data/miserables.json", function(error, graph) {
  if (error) throw error;

  var link =svg_network.append("g")
    .attr("class", "links")
    .attr("transform","translate("+margin_network.top  +","+margin_network.left+")")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });


  var node = svg_network.append("g")
      .attr("class", "nodes")
      .attr("transform","translate("+margin_network.top+","+margin_network.left+")")
      .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")
    .on("mouseover",function(d){ //마우스 오버시 노드의 크기가 커지도록
      d3.select(this).select("circle").transition()
    .duration(300)
    .attr("r",18)
      
     

    })
    .on("mouseout",function(d){ //마우스 아웃시 노드의 크기 기존 크기로 변경
      d3.select(this).select("circle").transition()
    .duration(150)
    .attr("r",function(d){if(d.group == 0){return "12"} else if(d.group ==1){return "15"} else{return "8"}})
    
    });

    

    node.append("title")
      .text(function(d) { return d.id; }); //노드에 마우스를 2~3초 오버하면 대여소 이름이 나오도록 title에 넣어줌

  var circles = node.append("circle")
      .attr("r",function(d){if(d.group == 0){return "12"} else if(d.group ==1){return "15"} else{return "8"}})
      .style("stroke",function(d){
          if(d.group==1){//Hotspot 노드의 선색 지정
              return "darkgreen";
          }
          else if(d.group==0){ 
              return "lightgray";
          }
      })
      .style("stroke-width",function(d){
        if(d.group==1){
            return 0.5;
        }
    })
      .style("fill", function(d) { //노드의 색상 지정
          if(d.group == 1) {return myColor[10-d.rank];} else {return color_node[d.group];} })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
          )

        // 각 노드별 텍스트를 추가하면, 너무 복잡해져서 마우스오버시 나타나도록 구현

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked)


  simulation.force("link")
      .links(graph.links);


  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}


// 각 노드에 대한 설명을 위해 범례 작성 
let legend_data = ['Hotspot', 'Hotspot Top10 대여소','Hotspot <-> 대여소'];

var legend = svg_network.append("g").attr("id", "legend").attr("text-anchor", "end").selectAll("g.legend")
.data(legend_data)
.enter().append("g").attr("id", function(d,i){return "legend"+i;}).attr("transform", function(d, i){return "translate(800, "+(i*20+margin_network.top+30)+")";});


legend.append("circle").attr("x", width-20).attr("r", 8)
.style("fill", function(d,i){return color_node[i]});

legend.append("text").attr("text-anchor", "start")
.text(function(d,i){
  return d;});


  