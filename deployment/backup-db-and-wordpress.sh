# Backup wordpress files
docker cp $(docker ps --filter name=wordpress -q):/var/www/html/ wordpress/files

# Backup databases
docker exec $(docker ps --filter name=mysql -q) /usr/bin/mysqldump -u root --password=example --databases wordpress yxsecnyo_ysc > mysql/backup.sql