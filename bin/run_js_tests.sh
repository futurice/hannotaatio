#!/bin/bash
# 
# This script executes the JavaScript tests in an environment, that does not
# run a GUI environment by default.
# 
# NOTE: The tests are not run using the deployment file layout. The QUnit
# framework requires the development file layout. Therefore these tests do
# not verify the final deployment file layout.
# 
# The exit status is 1 if the tests fail.
# 

#
# NOT IN USE
#

echo "*** Running QUnit tests for development file layout ***"

JS_TEST_DRIVER_CONF=../src_test/jsTestDriver.conf


XVFB=`which xvfb-run`
if [ "$?" -eq 1 ];
then
   echo "xvfb-run not found."
   exit 1
fi

# This works on Mac: 
#BROWSER_EXECUTABLE=/Applications/Firefox.app/Contents/MacOS/firefox-bin
#BROWSER_EXECUTABLE=`which firefox`
BROWSER_EXECUTABLE=`which chromium-browser`
if [ "$?" -eq 1 ];
then
    echo "Browser executable not found."
    exit 1
fi

# $XVFB :99 -ac &    # launch virtual framebuffer into the background
# PID_XVFB="$!"      # take the process ID
# export DISPLAY=:99 # set display to use that of the xvfb

# Run local server
java -jar ../tools/JsTestDriver.jar --config $JS_TEST_DRIVER_CONF --port 4224 &
PID_SERVER="$!"

# Run browser
$XVFB $BROWSER_EXECUTABLE http://localhost:9876/capture &
PID_BROWSER="$!"

# run the tests
# java -jar ../tools/JsTestDriver.jar --config $JS_TEST_DRIVER_CONF --port 4224 --browser $BROWSER_EXECUTABLE --tests all
java -jar ../tools/JsTestDriver.jar --config $JS_TEST_DRIVER_CONF --tests all
java -jar ../tools/JsTestDriver.jar --config $JS_TEST_DRIVER_CONF --tests all
EXIT_STATUS="$?"

if [ $EXIT_STATUS -eq 1 ]
then
	echo "Tests failed"
fi

if [ $EXIT_STATUS -eq 0 ]
then
	echo "Tests passed"
fi

kill $PID_BROWSER
kill $PID_SERVER

exit $EXIT_STATUS
