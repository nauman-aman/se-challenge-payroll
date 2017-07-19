Author: Nauman Aman
Email: nauman.aman@ieee.org

# Major steps overview:
Step A: Downloading and Installing MySQL
Step B: Download and Install Node/NPM
Step C: Make sure you have unzipped/unbundled the source file 
Step D: Open browser to Firefox/Chrome to enjoy the app.


# Step A: Downloading and Installing MySQL

If you havw windows 64 bit, you can use the following link: https://dev.mysql.com/downloads/file/?id=470090 or select your appropriate OS/version: https://dev.mysql.com/downloads/mysql/ .
We are to download and install "MySQL Community Server 5.7.19" and when installer asks, select 'developer default'. It may say some components are missing, please use the fix / next / or-similar button for the installer to resolve the issues.

Once MySQL has been installed and running, we have to do following steps:

1) Use following credentials (use default settings wherever possible):
*user=root
*password=mysql123    ... this reads out to MYSQL 123 not MYSQ 1123, and in small letters

2) Create schema/db called: paymentapp
- Either use MySQL's workbench to create the schema/db or use sql query such as: create schema paymentapp

3) Prefrence is to use workbench, but if you are using cmd then... (This step may need to be done before step 2) if you will be using cmd. "Installed-Dir"\MySQL\MySQL Server 5.7\bin>mysql -u root -p paymentapp
and then enter the password.

4) Create table under the db/schema either via workbench query (preferred) or cmd sql like:
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
  
Or use file //schema.sql file in the wave's app directory to create the table.

5) Make sure the tables and database/schema has been sucessfully made.



# Step B: Download and Install Node/NPM

1) Use the following link to download and install Node/npm (prefer the msi link): https://nodejs.org/en/download/

2) Choose the correct OS/version.




# Step C: Make sure you have unzipped/unbundled the source file 

1) Make sure you have unzipped/unbundled the source file to some location on your filesystem. Example: C:\Users\Admin\Desktop\waveApp

2) Open up cmd / command line, and go to the directory mentioned above: cd C:\Users\Admin\Desktop\waveApp

3) Make sure there exists a file called appNew.js, and run following command on cmd: node appNew.js
You should see something like this:
				C:\Users\Admiin\Desktop\waveApp>node appNew.js
				App started on port 5500
				
				
				
# Step D: Open browser to Firefox/Chrome to enjoy the app.

1) Open prefered browser FireFox.

2) Make sure you have internet as some of the CDN Repositories are online, such as angular-ui.github.io/bootstrap/ui-bootstrap-tpls-0.11.0.js (all of them are listed at waveDashboard.html).

3) Copy, paste and enter the following link to address bar: http://localhost:5500/

4) Upload 'sample.csv' file, 'confirm' on the dialouge box and test out the app! :)




# Major Design Overview:
Using AngularJS on the frontend, NodeJS on the backend, express framework, and MySQL relational database.

\\waveApp\lib\db - contains db connect information for the app
\\waveApp\lib\resources - contains the endpoints file... example endpoints like: /metrics, /deploy, /generate, and /generate/metaData
\\waveApp\public\ - contains index.html and waveDashboard.html that are the main html files - waveDashboard.html shows manage.html which is at \\waveApp\public\manage.html (manage.html is where the bulk of html work is)
\\waveApp\public\partials\ - contains partials html pages such as error.html, deploy.html (to send csv data to db), and reportView.html (shows the payroll report for particular reportID).
\\waveApp\public\partials\js\ - contains the angular components. ctrl.js is the main one that contains the 'app controller' and major bulk of functions. srv.js contains factory services like dataStructureServices, dialougeServices, dataServices - that's used to send/rcv data to backend.




# What's I'm proud of in this implementation?

I'm mostly proud of the time I took to make it look and feel as production ready as possible. I have tried my best to finish all the requirements to the letter and spirit, and in fact I went above and beyond the basic requirments such as charts and meta data display like avg pay person and many more features.

Also, I believe I gave equal attention to the front-end as much as energy I devoted to the back-end and database aspect of the coding assignment.

Some things I took extra care on: 
*pay periods that deal with leap year;
*processing date of the report;
*chart data to visualize payroll analysis;
*meta data for each reportID;
*welcome 'pop-up' that senses the user is new and pops up info/welcome/tips screen; and if user is not new, then display 'regular' app;
*drag-and-drop of csv file and only accepting csv file extensions;
*error msgs pop-ups in case of an unexpected situation to let user know what's happeneing;
*organization of the data presentation and UI layout;
*deducing of 'report id' row from csv file even if there are blank spaces after the report id row (i.e. last row is not the report id row in csv file - like '\\waveApp\public\samples\sample.csv' file);
*and many more other small/big things.




# All the requirements set by wave challenge and it's implementation status:

Implemented:    Your app must accept (via a form) a comma separated file with the schema described in the previous section.
Implemented:    Your app must parse the given file, and store the timekeeping information in a relational database for archival reasons.
Implemented:    After upload, your application should display a payroll report. This report should also be accessible to the user without them having to upload a file first.
Implemented:    If an attempt is made to upload two files with the same report id, the second upload should fail with an error message indicating that this is not allowed.

The payroll report should be structured as follows:

Implemented:    There should be 3 columns in the report: Employee Id, Pay Period, Amount Paid
Implemented:    A Pay Period is a date interval that is roughly biweekly. Each month has two pay periods; the first half is from the 1st to the 15th inclusive, and the second half is from the 16th to the end of the month, inclusive.
Implemented:    Each employee should have a single row in the report for each pay period that they have recorded hours worked. The Amount Paid should be reported as the sum of the hours worked in that pay period multiplied by the hourly rate for their job group.
Implemented:    If an employee was not paid in a specific pay period, there should not be a row for that employee + pay period combination in the report.
Implemented:    The report should be sorted in some sensical order (e.g. sorted by employee id and then pay period start.)
Implemented:    The report should be based on all of the data across all of the uploaded time reports, for all time.
