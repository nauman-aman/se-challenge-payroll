var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('../db/util');
var moment = require('moment');
var res_util = require('./res-util');
/**
 * get one report under the specified reportID or get MetaData for all reports
 */

/**
 * create/generate payroll info for one reportID
 */
router.get("/",function(req,res){
    //var reportID = req.param('reportID');
    var reportID = req.query.reportID;
	
	console.log("\n\n\nInside General Generate\n"); //angular.toJson(data.req)
    
    try {
		console.log("\n\n\nReportID: \n"+reportID);		

		//the actual query
        db.get().query
		(
		'SELECT employeeID, payPeriodStart, payPeriodEnd, SUM(amountPaid) AS amountPaid, reportID FROM employeepay where reportID=? group by employeeID, payPeriodStart, payPeriodEnd, reportID', reportID, function(err, results) {
		if (err) 
		{
			res.send(500, {//incase of a problem
            flag: false,
			message: err
            });
		}
		
		//when success
		
		//rearannging data to be in an expected way so can play with it in the front end
		for (var i = 0; i < results.length; i++) 
		{
			console.log("\nEmployee ID: "+results[i].employeeID+" Amount Paid: "+results[i].amountPaid+" Report ID: "+results[i].reportID+" Pay Period: "+results[i].payPeriodStart+" - "+results[i].payPeriodEnd)
		}
		
		res.send(200, {//send data to front end
                flag: true,
                sql: results
            });
		})
		
    } catch (e) {
		console.log("\n\n\nError portion\nData: "+req.body);
        return res_util.fail(res, e);
    }


});


//get metaData related to all reports... used for table, and then to relate 'view report' that's under 'actions'
router.get("/:metaData",function(req,res){
    //var reportID = req.param('reportID');
    
	console.log("\n\n\nInside Generate(Meta Data)\n"); //angular.toJson(data.req)
    
    try {

		//the actual query
        db.get().query
		(
		'SELECT reportID, COUNT(employeeID) as totalEmployees, SUM(amountPaid) AS totalAmountPaid, processedOn FROM employeepay group by reportID', function(err, results) {
		if (err) 
		{
			res.send(500, {
            flag: false,
			message: err
            });
		}
		
		for (var i = 0; i < results.length; i++) 
		{
			console.log("\nReport ID: "+results[i].reportID+" Amount Paid: "+results[i].totalAmountPaid+" Total Employees: "+results[i].totalEmployees)
		}
		
		//rearannging data to be in an expected way so can play with it in the front end
		var rows = new Array();
            results.forEach(function (row,index) {
                rows.push({
                    reportID: row.reportID, //user assigned context id
                    processedOn: moment(row.processedOn, 'YYYY/MM/DD').format('YYYY-MM-DD'), //db id
                    totalEmployees: row.totalEmployees, //original stream file name
                    totalPaid: row.totalAmountPaid, //when created
                });
            });
		
		res.send(200, {
                flag: true,
                reports: rows
            });
		})
		
    } catch (e) {
		console.log("\n\n\nError portion\nData: "+req.body);
        return res_util.fail(res, e);
    }


});



module.exports = router;