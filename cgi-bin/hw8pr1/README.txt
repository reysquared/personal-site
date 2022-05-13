The cs5png.py file has been modified from the original version in the CS5
homework so that it can handle reading PNGs as byte arrays in addition to
specifying a filename.
It has also been modified to remove extraneous print statements, as they
play bloody havoc with the CGI. They are still present in comments if you
feel inclined to add them back in for server-side debugging, but they are
pretty useless in fulfilling the purpose of the script, so they're gone.
The file __init__.py is empty, but is necessary to be able to import the
mandel.py module from a parent directory. Don't delete!
