#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

import cgi
# enable debugging
#import cgitb
#cgitb.enable(1)

# This script should not be served if it is in the ~/public_html/ directory.
# It may be a useful diagnostic for whether Apache is configured correctly.

print("Content-type: text/plain")
print()
print("Hello World!")

#note - python 3, not python 2
