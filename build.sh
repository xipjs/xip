#!/bin/sh

# exit on error
set -e

# Prepare the Build folder
rm -r Build || true
mkdir Build
cp -r src Build
mv Build/src Build/npm
cp readme.md Build
mkdir Build/min

cd Builder/min

npm install

npm run build

# Move to the output directory
cd dist/assets

# Get get the output files
files=(*)

# Add a minified and gziped version of each file to the build folder
for i in "${files[@]}"
do
echo "___  xip.gt.min.js  ___" 

# Create a file containing the licence
cat "../../../Liscence.js" > tmp

# Minify and append
uglifyjs --compress --mangle  -- $i >> tmp

# Add gzip version to build folder
gzip -c tmp > "../../../../Build/min/xip.gt.min.js.gz"

# Add minified version to build folder
mv tmp "../../../../Build/min/xip.gt.min.js"

# Remove initial build file
rm $i

echo "| plain: $(stat -c%s $(echo "../../../../Build/min/xip.gt.min.js")) bytes"
echo "| gzip: $(stat -c%s $(echo "../../../../Build/min/xip.gt.min.js.gz")) bytes"
echo ""
done

cd ../../../../Build

cp -r min npm
mv readme.md npm