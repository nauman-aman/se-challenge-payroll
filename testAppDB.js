var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql123',
  database: 'paymentapp',
  dateStrings: true
})

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})

connection.query('INSERT INTO employeepay (date, hoursWorked, employeeID, jobGroup, reportID, payRate) VALUES (?, ?, ?, ?, ?, ?)', ['17-1-1', 4, 1, 'A', 32, 15], function(err, result) {
      if (err) throw err
})

/*connection.query('SELECT * FROM employeepay', function(err, results) {
        if (err) throw err
        for (var i = 0; i < results.length; i++) 
		{
			console.log("\nEmployee ID: "+results[i].employeeID+" Amount Paid: "+results[i].amountPaid+" Report ID: "+results[i].reportID+" Pay Period: "+results[i].payPeriodStart)
		}
		
		
      })
 */   

connection.query('SELECT employeeID, payPeriodStart, payPeriodEnd,SUM(amountPaid) AS amountPaid, reportID FROM employeepay where reportID=? group by employeeID, payPeriodStart, payPeriodEnd, reportID', [33], function(err, results) {
        if (err) throw err
        for (var i = 0; i < results.length; i++) 
		{
			console.log("\nEmployee ID: "+results[i].employeeID+" Amount Paid: "+results[i].amountPaid+" Report ID: "+results[i].reportID+" Pay Period: "+results[i].payPeriodStart)
		}
		
		
      })

connection.end(function(err) {
  // The connection is terminated now
  console.log('The connection is terminated now...')
});