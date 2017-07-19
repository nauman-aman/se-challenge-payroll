var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('../db/util');
var moment = require('moment');
var res_util = require('./res-util');
/**
 * get all reports ID, emp count, total sum etc 
 */

/**
 * gets all reportID.. sums emp count, total sum.. used for charting only
 */
router.get("/",function(req,res){
	
	console.log("\n\n\nMetrics ALL\n");
	
    try {

		//the actual query
        db.get().query
		(
		'SELECT reportID, COUNT(employeeID) as totalEmployees, SUM(amountPaid) AS totalAmountPaid FROM employeepay group by reportID', function(err, results) {
		if (err) 
		{
			res.send(500, {
            flag: false,
			message: err
            });
		}
		console.log("\n\n\nMetrics ALL\nData: "+JSON.stringify(results));
		var allMetrics = {
				amountPaidToDate : 0,
				reports:  []
		};		
		//var rows = new Array();
		
			//rearannging data to be in an expected way so can play with it in the front end
            results.forEach(function (row,index) {
				allMetrics.amountPaidToDate = allMetrics.amountPaidToDate+row.totalAmountPaid;
                allMetrics.reports.push({
                    reportID: "Report ID # "+row.reportID+" - "+row.totalEmployees+" total employees", //user assigned context id
                    totalPaid: row.totalAmountPaid //when created
                });
            });
		
		res.send(200, {
                flag: true,
                metrics: allMetrics
            });
		})
		
		
    } catch (e) {
		console.log("\n\n\nError portion\nData: "+req.body);
        return res_util.fail(res, e);
    }


});

//created it to get 'metrics data' for only one reportID.. but never used it
//not using below function/endpoint... please ignore the below code
//not using below function/endpoint
//not using below function/endpoint
//not using below function/endpoint	
router.get("/:context",function(req,res){
	var reportID = 43;//req.param('context');
	var reportRow;
    
	console.log("\n\n\nMetrics One\n");
	//not using this function/endpoint
	
    try {
		var metrics= {
				totalMonthlyScores : 1,
				quota: { maxScoreRequests : 0 },
				assets:  []
		};
		//not using this function/endpoint
	
        db.get().query
		(
		'SELECT reportID, COUNT(employeeID) as totalEmployees, SUM(amountPaid) AS totalAmountPaid FROM employeepay where reportID=? group by reportID', reportID, function(err, results) {
		if (err) 
		{
			res.send(500, {
            flag: false,
			message: err
            });
		}
		
		//not using this function/endpoint
		//not using this function/endpoint
		//not using this function/endpoint
		//not using this function/endpoint
	
		
		metrics.assets.model_id = results.reportID;
		metrics.assets.nMonthlyScores = results.totalAmountPaid;
		//metrics.totalMonthlyScores = results[i].totalAmountPaid;
		metrics.assets.totalEmployees = results.totalEmployees;
		
		console.log("\n\n\nMetrics One\nData: "+JSON.stringify(results));

		//not using this function/endpoint
		
		res.send(JSON.stringify({flag: true, metrics: metrics}));
		}
		)
		
    } catch (e) {
		console.log("\n\n\nError portion\nData: "+req.body);
        return res_util.fail(res, e);
    }


});


module.exports = router;