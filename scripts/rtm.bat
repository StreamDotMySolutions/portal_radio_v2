@echo off
REM Replace the following variables with your actual values
set USER=root
set HOST=portal.muzikfmrtm.com
set REMOTE_SCRIPT="cd /var/www/portal.muzikfmrtm.com/boilerplate/ && git pull && cd rtm.gov.my && npm run build && cd ../backend && npm run build && cd ../api && php artisan migrate && exit"

REM Execute the SSH command
ssh  %USER%@%HOST% %REMOTE_SCRIPT%

pause
