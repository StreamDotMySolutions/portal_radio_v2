@echo off
REM Step 1: SSH into the server and dump the data for table 'directories' in 'rtm_portal2_dev' database
ssh root@portal.muzikfmrtm.com "mysqldump -u root rtmportal2_dev directories > /tmp/data.sql"

REM Step 2: Secure copy the dumped data back to Windows
scp root@portal.muzikfmrtm.com:/tmp/data.sql C:\Users\user\data.sql

REM Step 3: Clean up the temporary file on the server
ssh root@portal.muzikfmrtm.com "rm /tmp/data.sql"

echo Data dump completed and saved as data.sql
pause
