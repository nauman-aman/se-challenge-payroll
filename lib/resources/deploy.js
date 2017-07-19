var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('../db/util');
var moment = require('moment');
var res_util = require('./res-util');
/**
 * upload report information to db
 */

router.post("",function(req,res){
    var reportID = req.query.reportID;
	var reportRow;
	
	console.log("\n\n\nInside NodeJS\n"); //angular.toJson(data.req)
    
    try {
		
		console.log("\n\n\nSuccess\nData: "+JSON.stringify(req.body));
		
		//gets the row where the actual reportID is.. but i think it's redundant now because later in my code started sending it from the front-end
		if (req.body.errors[0] != undefined)
			reportRow = req.body.errors[0].row -1; //extra blank rows in case
		else
			reportRow = req.body.data.length -1; // no extra blank rows.. then the last row contains reportRow
		
		console.log("\nReport ID: "+JSON.stringify(req.body.data[reportRow]['hours worked'])  );
		//console.log("\nReport ID: "+JSON.stringify(req.body.data[32]['hours worked']))
		
		//console.log("\n\n\nLoop length: "+JSON.stringify(req.body.data.length));// req.body.data[i].date
		var values = [];
		var newDateFormat;
		for (var i = 0; i < req.body.data.length && req.body.data[i].date != 'report id'; i++) {
			
			//console.log("\nOrg: "+JSON.stringify(req.body.data[i].date));
			//console.log("\nNew: "+JSON.stringify(moment(req.body.data[i].date, 'DD/MM/YYYY').format('YYYY-MM-DD')));
			
			values[i]=[moment(req.body.data[i].date, 'DD/MM/YYYY').format('YYYY-MM-DD'), req.body.data[i]['hours worked'], req.body.data[i]['employee id'], req.body.data[i]['job group'], req.body.data[reportRow]['hours worked'], req.body.data[i]['job group']=='A'?20:30];
		}
		
		//the actual query
        db.get().query
		(
		'INSERT INTO employeepay (date, hoursWorked, employeeID, jobGroup, reportID, payRate) VALUES ?', [values], function(err, result) {
		if (err) //incase or a problem
		{
			res.send(500, {
            flag: false,
			message: err
            });
		}
		
		res.send(200, {//when successful
                flag: true,
                message: result
            });
		})
		
    } catch (e) {
		console.log("\n\n\nError portion\nData: "+req.body);
        return res_util.fail(res, e);
    }


});


module.exports = router;