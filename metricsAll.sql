SELECT reportID, COUNT(employeeID) as totalEmployees, SUM(amountPaid) AS totalAmountPaid
FROM employeepay
group by reportID;