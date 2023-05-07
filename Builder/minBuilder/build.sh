#!/bin/sh

npm run build

# Move to the output directory
cd dist

# Get get the output files
files=(*)

# Add a minified and gziped version of each file to the build folder
for i in "${files[@]}"
do
echo "___  xip.min${i:1}  ___" 

# Create a file containing the licence
cat "../../Liscence.js" > tmp

# Minify and append
uglifyjs --compress --mangle  -- $i >> tmp

# Add gzip version to build folder
gzip -c tmp > "../../../Build/xip.min${i:1}.gzip"

# Add minified version to build folder
mv tmp "../../../Build/xip.min${i:1}"

# Remove initial build file
rm $i

echo "| plain: $(stat -c%s $(echo "../../../Build/xip.min${i:1}")) bytes"
echo "| gzip: $(stat -c%s $(echo "../../../Build/xip.min${i:1}.gzip")) bytes"
echo ""
done