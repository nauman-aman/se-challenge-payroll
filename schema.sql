CREATE TABLE `employeepay` (
  `date` date DEFAULT NULL,
  `hoursWorked` float DEFAULT NULL,
  `employeeID` varchar(255) DEFAULT NULL,
  `jobGroup` varchar(2) DEFAULT NULL,
  `reportID` int(11) DEFAULT NULL,
  `payRate` float DEFAULT NULL,
  `amountPaid` float GENERATED ALWAYS AS ((`payRate` * `hoursWorked`)) VIRTUAL,
  `payPeriodStart` date GENERATED ALWAYS AS (if((extract(day from `date`) > 15),last_day(`date` - INTERVAL 1 MONTH) + INTERVAL 16 DAY, last_day(`date` - INTERVAL 1 MONTH) + INTERVAL 1 DAY)) VIRTUAL,
  `payPeriodEnd` date GENERATED ALWAYS AS (if((extract(day from `date`) > 15),last_day(`date`), last_day(`date` - INTERVAL 1 MONTH) + INTERVAL 15 DAY)) VIRTUAL,
  `processedOn` DATETIME NOT NULL DEFAULT NOW()
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8