SELECT reportID, COUNT(employeeID) as totalEmployees, SUM(amountPaid) AS totalAmountPaid
FROM employeepay
where reportID=44
group by reportID;