#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import cgi
import sys
import subprocess
import os
import stat 

# get form data
#(not sure if has to be done this way? script not being called from form)
form = cgi.FieldStorage()

script_name = str(form.getvalue("script")) # Name of script to run
mycmd = script_name + ".py"

data = str(form.getvalue("args")) # Arguments to script
args = data.split(" ") if data != "" else []

# Print stdout from student's python script
print "Content-type: text/plain"
print

outStr = subprocess.check_output(["python", mycmd] + args, shell=False).decode("utf-8");
# shell=False is default but is written explicitly here because 
######## IT IS CRITICAL FOR SECURITY THAT SHELL=FALSE. ########
# It is *possible* to use shell=True securely with some effort, but it's playing with fire.
# When using shell=True the command is executed through the shell, enabling such things as
# args = "&& rm -rf /" to totally wreck your server (exact syntax may vary.) So DON'T.
sys.stdout.write(outStr)
