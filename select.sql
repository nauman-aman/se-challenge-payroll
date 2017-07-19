SELECT employeeID, payPeriodStart, payPeriodEnd, SUM(amountPaid) AS amountPaid, reportID
FROM employeepay
where reportID=43
group by employeeID, payPeriodStart, payPeriodEnd, reportID;