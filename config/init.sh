#!/bin/bash

#安装关键组件mydumper
rpm -i /home/wwwroot/mydumper-0.10.7-2.el8.x86_64.rpm

#定时任务
cat >/etc/crontab <<EOF
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root

* * * * * root cd /home/wwwroot/api && php backup.php
EOF
