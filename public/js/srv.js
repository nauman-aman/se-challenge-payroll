
var	dashboardSrv = angular.module("dashboardSrv",	[]);
//constructor/factory service for how to report data structure should be.. does initize, getReportID, prepare data structure before uploading file etc
dashboardSrv.factory('dataStructureServices', function() {

	var reports = [];
	
	this.numDeployed = function() {
		return reports.length;
	}
	
	this.setReports = function(list) {
		reports = list;
	}
	
	this.getReport = function(idx) {
		var report = this.initReport();
		if (idx >= 0 && idx < reports.length) {
			report = reports[idx];
		}
		
		return report;
	}
	
	this.getReportID = function(idx) {
		return this.getReport(idx).reportID;
	}
	
	this.initReport = function() {
		return {reportID:"", processedOn:"", totalEmployees:"", totalPaid:"", name:"", uploadFile:""};
	}
	
	this.dropInitReport = function(file) {
		var report = this.initReport();
		if (file != null) {
			report.name = file.name;
			report.uploadFile = file;
		}
		return report;
	}

	//--- new factory instance ---
	return this;
});


//constructor/factory service for sending data like post/get/ etc (send/rcv data to API endpoints).. etc

dashboardSrv.factory("dataServices", ['$http', '$log',
function($http, $log)	{

  var baseURL = ''; // never change except for private unit tests
    
	//not using this below for report structure
  this.buildURL = function(topic, instance_id, accessKey, context) {
		return baseURL + '/' + topic +  
			'/' + instance_id +
			((context != '') ? '/' + context : '') +
			'?accessKey="' + accessKey + '"';
	}
	
	this.newBuildURL = function(topic, reportID) {
		return baseURL + '/' + topic +  
			((reportID != '') ? '?reportID=' + reportID : '');
	}
		
	this.getMetrics	=	function() {
		/* call	service	to retrieve	metrics summary	*/
		return $http.get(
			this.newBuildURL('metrics'))
			.success(function(data, status, headers, config) {
				return data;
			})
			.error(function(data, status, headers, config) {
				return status;
			});
	}
	
	//gets one particular payroll/reportID data
	this.generateReport	=	function(reportID) {
		/* call	service	to retrieve	particular report	*/
		return $http.get('/generate?reportID='+reportID)
			.success(function(data, status, headers, config) {
				$log.debug('status: '+status);
				$log.debug('Generated SQL Return: '+angular.toJson(data, true));
				return data;
			})
			.error(function(data, status, headers, config) {
				return status;
			});
	}
	
	//gets reportMetaData for all reports
	this.getReportMetaData	=	function(reportID) {
		/* call	service	to retrieve	metrics meta data summary	*/
		return $http.get('/generate/metaData')
			.success(function(data, status, headers, config) {
				$log.debug('status: '+status);
				$log.debug('Generated SQL Return: '+angular.toJson(data, true));
				return data;
			})
			.error(function(data, status, headers, config) {
				return status;
			});
	}
		
	//when sending csv data to db/backend	
	this.deployReport = function(report, dataJSON)	{
		/* call	service	to deploy	new	report	*/
		//var fd = new FormData(this.dataJSON);
		//fd.append('data',JSON.stringify(dataJSON));
		//var fileName = { 'fileName': report.name}
		//dataJSON.fileName.push({'fileName': report.name});
		return $http.post(
			this.newBuildURL('deploy', report.reportID),
				JSON.stringify(dataJSON),//fd, 
				{
					transformRequest: angular.identity,
					dataType: 'json',
					headers: {
						'Content-Type': 'application/json'
						//'Content-Type': 'application/form-data'
					}
			})
		/*	return $http({
			url: '/deploy/43',
			method: 'Post',
			dataType: 'json',
			data: JSON.stringify(dataJSON),
			headers: { 'Content-Type': 'application/json'},
			transformRequest: angular.identity
			}) */
			.success(function(data, status, headers, config) {
				return data;
			})
			.error(function(data, status, headers, config) {
				return status;
			});

		
	}	
	
		
	/*this.retrieveAsset = function(report)	{
		return this.buildURL('download', reportID);
	}*/
		
/*	this.deleteReport = function(reportID)	{
		/* call	service	to deploy	new	asset	*/
/*		return $http.delete(
			this.buildURL('assets', instance_id, accessKey, asset.context))
			.success(function(data, status, headers, config) {
				return status;
			})
			.error(function(data, status, headers, config) {
				return status;
			});
	}*/

	return this;
}]);

//dialouge services for modal.. tells which controller and html to use for particular case.. like deploy file or view report etc

dashboardSrv.factory("dialogServices",	['$modal', '$log',
function($modal, $log) {

	//csv / file-data upload to db
	this.deployDlg = function(report)	{
		return	$modal.open({
			templateUrl: 'partials/deploy.html',
			controller:	'DeployCtrl',
			size:	'sm',
			resolve: {
				report: function	() {					
					return report;	
				}
			}
		});		
	}

	//to view reportID's data.. the actual payroll data for one reportID
	this.viewReportDlg	=	function (report) {		
		$log.debug("\n\nviewReportDlg :outside");
		$log.debug("\n\nreport data : "+angular.toJson(report, true));
		return $modal.open({
			templateUrl: 'partials/reportView.html',
			controller:	'ReportViewCtrl',
			size:	'sm',
			resolve: {
				//$log.debug("\n\nviewReportDlg :inside");
		
				report: function	() {					
					return report;	
				}
			}
		});		
	}

	
	/*this.refreshDlg	=	function (report) {
		return $modal.open({
			templateUrl: 'partials/refresh.html',
			controller:	'RefreshCtrl',
			size:	'sm',
			resolve: {
				report: function	() {
					return report;	
				}
			}
		});		
	}

	this.deleteDlg = function (report) {
		return $modal.open({
			templateUrl: 'partials/delete.html',
			controller:	'DeleteCtrl',
			size:	'sm',//lg sm etc
			resolve: {
				report: function	() {
					return report;
				}
			}
		});		
	}*/
	
	//not using the below one
	this.validateDlg = function(msgTitle,	msgText) {
		return	$modal.open({
			templateUrl: 'partials/user_validation.html',
			controller:	'ValidationCtrl',
			size:	'sm',
			resolve: {
				msgTitle:	function ()	{
					return msgTitle;
				},
				message: function	() {
					return msgText;
				}
			}
		});		
	}
	
	//modal that pops up when rcv/snding data and error occurs
	this.errorDlg = function(msgTitle,	msgText) {
		return	$modal.open({
			templateUrl: 'partials/error.html',
			controller:	'ErrorCtrl',
			size:	'sm',
			resolve: {
				msgTitle:	function ()	{
					return msgTitle;
				},
				message: function	() {
					return msgText;
				}
			}
		});		
	}

	return this;
}]);
