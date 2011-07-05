#!/bin/bash
# 
# This script performs the required lint checks on all JavaScript files. The
# linter will notify on any potential issues in the source code. The linter
# also enforces coding convention.
# 
# NOTE: The linter is run on the file layout used in the development
# environment, not on the combined/compiled file layout that is deployed.
# Therefore, the linter should be the first task run when building the project.
# 
# See: Google Closure Linter, http://code.google.com/closure/utilities/docs/linter_howto.html
# 

echo "*** Running Lint for development file layout ***"


# The linter is capable of fixing some issues automatically, but not all.
# This is currently disabled, as developers are expected to do this on their
# own. Additionally, if there were any fixes made they would not be checked
# into version control by the build process.
#fixjsstyle -r ../src


# Runs the actual linter.
# If the linter ends with exits status 1, the build process is assumed to be
# failed.
gjslint -r ../src/capture/ -e ../src/capture/lib
gjslint -r ../src/edit/ -e ../src/edit/lib
