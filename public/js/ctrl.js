
var	dashboardCtrl	=	angular.module("dashboardCtrl",	['ngRoute', 'ngCookies', 'dashboardSrv', 'nvd3']);

//main app controller
var	AppCtrl	=	['$rootScope', '$scope', '$location',	'$routeParams', '$cookies', '$modal',	'dialogServices', 'dataServices',	'dataStructureServices', '$window', '$log','$timeout',
function AppCtrl($rootScope, $scope, $location,	$routeParams, $cookies, $modal,	dialogServices, dataServices, dataStructureServices, $window, $log, $timeout)	{
	
	
	$scope.metrics = null;
	$scope.authorized = false;
	
	//the first time metrics are fetched plus authorization is set to true
	dataServices.getMetrics().then(
		function(rtn) {
			if (rtn.data.flag == true) {
				// success
				$scope.metrics = rtn.data.metrics;
				$scope.authorized = ($scope.metrics != null);
				$log.debug('Returned Metrics: '+angular.toJson(rtn.data.metrics, true));
			}
			//sends broadcast... which updates chart
			$rootScope.$broadcast('metrics-complete');
		},
		function(reason) {
			// service failure
			$rootScope.$broadcast('metrics-complete');
		}
	);
	
	$scope.scoringChartOpts = null;
	$scope.scoringChartData = null;
	
	//function that sets chart data for chart
	var chartMetrics = function () {
		
		var scoresChartTitle = "";
//		$scope.loadingScreen(true); //loads the 'Launching Image
//		$scope.loadingScreen(false); // after loading (hardly noticable to user)... closes the image

		var maxScores = 0;

		scoresChartTitle = "Total Amount Paid To Date: $" + $scope.metrics.amountPaidToDate;
		
		$scope.metrics.chartTitle = scoresChartTitle;
		
		var noChartData = 'No Chart Data for Payment Reports';
	
		$scope.scoringChartOpts = {
			chart: {
				type: 'pieChart',
				donut: true,
				donutRatio: 0.4,
				height: 445,
				margin: {top:20, right: 20, bottom: 160, left: 20},
				x: function(d){return d.reportName;},
				y: function(d){return d.totalPaid;},
				showLabels: false,
				noData: noChartData,
				labelType: 'value',
				pieLabelsOutside: true,
				showLegend: true,
				legendPosition: 'right',
				valueFormat: function (n){return n},
				legend: {
					margin: {top: 20, right: 20, left: 20, bottom: 20},
					updateState: true,					 
				},
				transitionDuration: 500
			},
			title: {   
				enable: false,
				text: scoresChartTitle,
				class: 'foo',
				css: {
					textAlign: 'right'
				}
			}
		};
		
		if ($scope.metrics.amountPaidToDate > 0) {
			$scope.scoringChartData = [];
			for ( i = 0; i < $scope.metrics.reports.length; i++ ) {
				var report = $scope.metrics.reports[i];
				$scope.scoringChartData.push({"reportName": report.reportID, "totalPaid": report.totalPaid});
			}
		}	else {
			// nothing of value to display in the report summary, hide the chart
			$scope.scoringChartData = null;
		}		
	}
	
	//broadcast msg comes here
	$scope.$on('metrics-complete', function(event , args) {	
		if ($scope.authorized == true) {
			$location.path('/manage');
			chartMetrics();
		} else {
			$location.path('/unauthorized');
		}
	});
	
	//fetches meta data all reports in the db and afterwards updates the chart
	var updateReports = function () {
		dataServices.getReportMetaData().then(
			function(rtn) {
				if (rtn.data.flag == true){
					// success
					dataServices.getMetrics().then(
						function(rtn) {
							if (rtn.data.flag == true) {
							// success
							$scope.metrics = rtn.data.metrics;
							$scope.authorized = ($scope.metrics != null);
							$log.debug('Returned Metrics: '+angular.toJson(rtn.data.metrics, true));
							}
			
						$rootScope.$broadcast('metrics-complete');
						},
						function(reason) {
							// service failure
							$rootScope.$broadcast('metrics-complete');
						}
					);
	
		$scope.reports = rtn.data.reports;
					if ($scope.reports.length == 0) {
						$scope.showFirstUseView();
					
					} else {
						$scope.hideFirstUseView();
					}
					
				} else {
					// failure
					$scope.showError(rtn.data.message);
				}
				
			},
			function(reason) {
				$scope.showError(reason);
			}
		);
	}
	
	
	//some variables for using ng-show.. depending on 'first time' view or not
	$scope.showFirstUseView = function() {
		
		// show welcome box
		$scope.showWelcome = true;
		// hide reports section
		$scope.showReportsTable = false;
		// hide reports chart section
		$scope.showReportUsage = false;
		$scope.showReportUsageFirstTime = true;
		
		$scope.dropBox = "first-time-drop-box";
	}
		
	//some variables for using ng-show.. depending on 'first time' view or not
	$scope.hideFirstUseView = function() {
		
		// show welcome box
		$scope.showWelcome = false;
		// hide reports section
		$scope.showReportsTable = true;
		// hide reports chart section
		$scope.showReportUsage = true;
		$scope.showReportUsageFirstTime = false;
		
		$scope.dropBox = "drop-box";
	}
	
	$scope.reports = [];
	updateReports();
	
	//initializes the structure for report
	$scope.report = dataStructureServices.initReport();
	//$scope.modelFile = ""; // no initialization, anchor tag HREF set in onClick on report in table
	
	//future use.. for multiple pages
	/*$scope.tabs	=	[
			{	title: '', route:	'/manage', active: '1'	},
			{	title: '',	 route:	'/about',	} 
		];
	$scope.onClickTab	=	function (tab) {
		if ($scope.authorized) {
			$location.path(tab.route);
		}
	}
	
	$scope.detailsPanel = [];
	$scope.onClickInfo = function(idx) {
			$scope.detailsPanel[idx] = !$scope.detailsPanel[idx];
	}
		

	$scope.onClickFileDownload = function(idx) {
		// set the data model value used by download anchor tag HREF in UI for this report
		$scope.modelFile = 
			dataServices.retrieveReport($scope.reports[idx]);
	}
	*/
	
	
	//used in uploading and parsing csv files.. and then deploying file upload modal and if successful then update chartData
	$scope.dropDeploy = function(files, event)	{
		if (files.length == 0) {
			return;
		}
		dataStructureServices.setReports($scope.reports);
		$scope.report = dataStructureServices.dropInitReport(files[0]);
		read = new FileReader();
		var csvFileContent;
		var dataJSON;
		read.readAsBinaryString($scope.report.uploadFile);
		read.onloadend = function(callback)
		{
			csvFileContent = read.result;
			dataJSON = Papa.parse(csvFileContent, {header: true, dynamicTyping: true});
			
			$log.debug(angular.toJson(Papa.parse(csvFileContent, {header: true, dynamicTyping: true}), true));
			if (dataJSON.errors[0] != undefined)
				reportRow = dataJSON.errors[0].row -1; //extra blank rows in case
			else
				reportRow = dataJSON.data.length -1; // no extra blank rows.. then the last row contains reportRow
			
			$scope.report.reportID = dataJSON.data[reportRow]['hours worked'];
			
			$scope.$apply();//forgot why i put it here? is it to wait for the file-load-end? so it displays report-id in the 'deploy file' modal.. maybe it's safe to remove
		
					
		}
		dialogServices.deployDlg($scope.report).result.then(
			function (report) {
				dataServices.deployReport(report, dataJSON).then(
					function(rtn) {
						if (rtn.data.flag == true){
							// success
							$log.debug("\n\nresultID : "+angular.toJson(rtn.data, true));
							updateReports();
							//$window.location.reload();
							//$rootScope.$broadcast('metrics-complete');
							//dataServices.generateReport(43);
							
						} else {
							//failure
							$scope.showError(rtn.data.message);
						}
					},
					function(reason) {
						$scope.showError(reason);
					}
				);
			}, 
			function ()	{
				// deploy cancelled
			}
		);
	}
	
	
	//when 'view report' is clicked under 'actions'
	$scope.onClickGenerate	=	function(idx)	{
		
		dataServices.generateReport($scope.reports[idx].reportID).then(
			function(rtn) {
				if (rtn.data.flag == true){
					// success
					//$log.debug("\n\nresultID : "+angular.toJson(rtn.data, true));
					$log.debug("\n\nonClickGenerate: data recived from nodejs");
							
					dialogServices.viewReportDlg(rtn.data.sql).result.then(
						function () {
							$log.debug("\n\nonClickGenerate: viewReport success/first");
					
						}, 
						function ()	{	
							// operation cancelled
						}
					);
				
				} else {
					//failure
					$scope.showError(rtn.data.message);
				}
			},
			function(reason) {
				$scope.showError(reason);
			}
		);
			
	}
	
	
	//incase of an error throw up error dialouge
	$scope.showError = function(msgText) {
		dialogServices.errorDlg("Error", msgText).result.then();
	}
	
	//tab toggle between 'samples' and 'about' in the 'welcome' screen
	$scope.toggleTabVisibility = function(obj) {
		var elems = document.getElementsByClassName("information-box-tab-heading");
		for (var i = 0; i < elems.length; i++) {
			var elem = elems[i];
			elem.className = "information-box-tab-heading"; 
		}
		obj.target.className = "information-box-tab-heading selected";
	}
	
}]

//modal controller for uploading the file.. decides the resolve.. example what to do on cancel/confirm etc
var	DeployCtrl = ['$scope',	'$modalInstance','dialogServices', 'dataStructureServices', 'report',
function DeployCtrl($scope,	$modalInstance, dialogServices, dataStructureServices, report)	{
	
	$scope.report = report;
	$scope.disableUpload = false;
	$scope.uploadFilename = report.name;
	
	//to disable the upload or not.. but not using it, so not relevant
	$scope.checkUpload = function() {
		$scope.disableUpload = ($scope.report.uploadFile == null);
	}
	
	$scope.cancel	=	function() {
		$modalInstance.dismiss();
	}
		
	//on confirm.. deploy the file / send data to db	
	$scope.deploy	=	function() {
		var startUpload = true;
		for ( i = 0; i < dataStructureServices.numDeployed(); i++ ) {
			if (dataStructureServices.getReportID(i) == $scope.report.reportID ) {
				startUpload = false;
				break;
			}
		}
		if (startUpload) {
			//$scope.report.createdOn = new Date();
			$modalInstance.close($scope.report);
		} else {
			dialogServices.errorDlg("Error", "Report I.D. must be unique.").result.then($scope.cancel());
		}
	}
}]

// modal controller for viewing generated reports.. gets shown when clicked on 'view report' under 'actions'
var	ReportViewCtrl	=	['$scope', '$modalInstance', '$document', 'dialogServices', 'report',
function ReportViewCtrl($scope, $modalInstance, $document, dialogServices, report)	{
	
	$scope.report = report;
	//$scope.report.uploadFile = null;
	//$scope.disableUpload = true;
	//$scope.uploadFilename = "";
	

	$scope.close	=	function() {
		$modalInstance.dismiss();
	}
}]

/*var	DeleteCtrl = ['$scope',	'$modalInstance',	'report',
function DeleteCtrl($scope,	$modalInstance,	report) {
	
	$scope.report = report;
	
	$scope.cancel	=	function() {
		$modalInstance.dismiss();
	}
	
	$scope.delete	=	function() {
		$modalInstance.close($scope.report);
	}
}]
*/

/*var	ValidationCtrl = ['$scope',	'$modalInstance',	'msgTitle',	'message',
function ValidationCtrl($scope,	$modalInstance,	msgTitle,	message) {

	$scope.msgTitle	=	msgTitle;
	$scope.message = message;
	
	$scope.cancel	=	function() {
		$modalInstance.dismiss();
	}
	
	$scope.validated = function()	{
		$modalInstance.close(true);
	}
}]*/

//modal controller for error... not used here
var	ErrorCtrl = ['$scope',	'$modalInstance',	'msgTitle',	'message',
function ErrorCtrl($scope,	$modalInstance,	msgTitle,	message) {

	$scope.msgTitle	=	msgTitle;
	$scope.message = message;
	
	$scope.cancel	=	function() {
		$modalInstance.dismiss();
	}
}]



dashboardCtrl.controller("AppCtrl",	AppCtrl);
dashboardCtrl.controller("DeployCtrl", DeployCtrl);
dashboardCtrl.controller("ReportViewCtrl",	ReportViewCtrl);
//dashboardCtrl.controller("DeleteCtrl", DeleteCtrl);
//dashboardCtrl.controller("ValidationCtrl", ValidationCtrl);
dashboardCtrl.controller("ErrorCtrl", ErrorCtrl);
