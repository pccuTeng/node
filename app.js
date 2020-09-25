var https = require("https");
var http = require("http");
var path = require("path");
var express = require("express");
var fs = require("fs");
var bodyParser = require('body-parser');
var app = express();
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/" , function(req , res ){
	res.render("index");
});

app.get("/a" , function(req , res ){
	res.render("a",{  
					L : "NULL" , 
					rain : "NULL"  , 
					t : "NULL" , 
					ws : "NULL" ,
					uvi : "NULL" , 
					uvi_s : "NULL",
					wd : "NULL" ,
					time : "NULL",
					dt : "NULL"});
});
app.post("/a", function(req , res ){
	console.log(req.body);
	console.log("get /a res a");
	//res.render("a", { ans: "AAA"  });
	var json = require('jsonfile');
	json.readFile('save.json' , function(err , results){
		if(err){console.log("抓取失敗")}
		else{
			if(req.body.YourLocation!=""){
				for(i=0;i<22;i++){
				if(results.records.locations[0].location[i].locationName == req.body.YourLocation){
					var County = results.records.locations[0].location[i].locationName;
					var rain = results.records.locations[0].location[i].weatherElement[0].time[2].elementValue[0].value;
					var t = results.records.locations[0].location[i].weatherElement[1].time[2].elementValue[0].value;
					var dt = results.records.locations[0].location[i].weatherElement[11].time[2].elementValue[0].value;
					var ws = results.records.locations[0].location[i].weatherElement[4].time[2].elementValue[0].value;
					var uvi = results.records.locations[0].location[i].weatherElement[9].time[2].elementValue[0].value;
					var uvi_s = results.records.locations[0].location[i].weatherElement[9].time[2].elementValue[1].value;
					var wd = results.records.locations[0].location[i].weatherElement[10].time[2].elementValue[0].value;
					var time = results.records.locations[0].location[i].weatherElement[0].time[2].startTime;
					console.log("縣市 : " + County);
					console.log( "12小時降雨機率 : " + rain + " % ");
					console.log("平均溫度 : " + t + " °C ");
					console.log("最大風速 : " + ws + " m/s ");
					console.log("紫外線指數 : " + uvi  ); 
					console.log("紫外線指數 : " + uvi_s ); 
					console.log("天氣概述 : " + wd ); 
					console.log("檢測時間 : " + time );
					console.log("最低體感溫度 : " + dt );
					res.render("a",{  
					L : req.body.YourLocation , 
					rain : rain  , 
					t : t , 
					ws : ws ,
					uvi : uvi , 
					uvi_s : uvi_s,
					wd : wd ,
					time : time ,
					dt : dt});
					}
				}
			}
			if(req.body.YourLocation==""){
				res.render("a",{  
					L : "NULL" , 
					rain : "NULL"  , 
					t : "NULL" , 
					ws : "NULL" ,
					uvi : "NULL" , 
					uvi_s : "NULL",
					wd : "NULL" ,
					time : "NULL",
					dt : "NULL"});
				
			}
		}
	});
});

app.use(function(req , res) {
	res.status(404).render("404");
});
http.createServer(app).listen(3000, function() {
  console.log("Guestbook app started on port 3000.");
});

//抓取json
function get_json(){
url = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=CWB-756C023A-D52D-45B9-9B27-BBA9C01D3115&format=JSON"
https.get(url , function (res) {
	var data = [];
	res.on('data' ,function(chunk){
		data += chunk;
	});
	res.on('end' , function(){
		data = JSON.parse(data);
		fs.writeFile('save.json' , JSON.stringify(data) , function(err,result){
			if(err) console.log("error" ,err);
		});
		fs.writeFile('./public/save.json' , JSON.stringify(data) , function(err,result){
			if(err) console.log("error" ,err);
		});
	});
});
}
//get_json()