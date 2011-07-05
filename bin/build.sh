#!/bin/bash
# Builds Hannotaatio Front end to the directory defined in parameter

# Give running rights to all scripts
chmod +x *

# Use Google Closure Compiler to pack the code

SRC_CAPTURE=../public/javascripts/capture
SRC_EDIT=../public/javascripts/view
TMP=../tmp/javascript
DIST=../dist
PUBLIC=../public

mkdir -p $TMP
mkdir -p $DIST

echo "*** Compiling Capture tool ***"

java -jar ../tools/compiler.jar \
	--js ${SRC_CAPTURE}/URL.js \
	--js ${SRC_CAPTURE}/CaptureUtils.js \
	--js ${SRC_CAPTURE}/Preferences.js \
	--js ${SRC_CAPTURE}/Capturer.js \
	--js ${SRC_CAPTURE}/Uploader.js \
	--js ${SRC_CAPTURE}/lib/json2.js \
	--js ${SRC_CAPTURE}/ImageCapturer.js \
	--js ${SRC_CAPTURE}/capturetool.js \
	--js_output_file ${TMP}/hannotaatio_capture_tool_compiled_tmp.js
	
echo 'Wrap the compiled code in a wrapper'
str='\/\/ @OUTPUT@'
sed -e "/$str/r ${TMP}/hannotaatio_capture_tool_compiled_tmp.js" -e "/$str/d" ${SRC_CAPTURE}/Wrapper.js > ${TMP}/hannotaatio_capture_tool_compiled.js

echo "*** Compiling Edit tool ***"

OUTPUT_FILE=${TMP}/hannotaatio_edit_tool_compiled.js

java -jar ../tools/compiler.jar \
	--js ${SRC_EDIT}/Utils.js \
	--js ${SRC_EDIT}/Arrow.js \
	--js ${SRC_EDIT}/Box.js \
	--js ${SRC_EDIT}/Text.js \
	--js ${SRC_EDIT}/UI.js \
	--js ${SRC_EDIT}/Ajax.js \
	--js ${SRC_EDIT}/EditPreferences.js \
	--js ${SRC_EDIT}/edittool.js \
	--js_output_file $OUTPUT_FILE

# Builds dist js files with version number header

echo "*** Create version number file ***"

WORKING_DIR=`pwd`
VERSION_FILE="${TMP}/version_number"
VERSION_SCRIPT_PATH="../../"
VERSION_SCRIPT="version_number.sh"

cd $VERSION_SCRIPT_PATH
VERSION_NUMBER=`sh $VERSION_SCRIPT`
echo "Current version is $VERSION_NUMBER"

cd $WORKING_DIR
echo " * version: $VERSION_NUMBER" > $VERSION_FILE

echo '*** Adding version number to capture tool ***'

echo 'Adding version number'
str='\/\/ @VERSION_INFO@'
sed -e "/$str/r $VERSION_FILE" -e "/$str/d" ${TMP}/hannotaatio_capture_tool_compiled.js > ${TMP}/capturetool.js

cp ${TMP}/capturetool.js ${PUBLIC}/hannotaatio.js

echo '*** Adding version number to edit tool ***'

echo 'Adding version number'
str='\/\/ @VERSION_INFO@'
sed -e "/$str/r $VERSION_FILE" -e "/$str/d" ${TMP}/hannotaatio_edit_tool_compiled.js > ${TMP}/edittool.js

cp ${TMP}/edittool.js ${PUBLIC}/view/edittool.js

echo '*** Adding version number to index page ***'

INDEX_FILE="${PUBLIC}/index.html"
str='@VERSION@'

# Notice: Sed implementions differ. The line below works in Linux (CI server) but not in Mac OSX
sed -i "s/$str/$VERSION_NUMBER/g" $INDEX_FILE