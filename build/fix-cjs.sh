#!/bin/bash

#
# Rename imports from JS and TS to CJS and CTS.
#

find dist/cjs -type f \( -name '*.ts' -o -name '*.js' -o -name '*.map' \) -exec gsed -i 's/\.js\b/.cjs/g' {} +
find dist/cjs -type f \( -name '*.ts' -o -name '*.js' -o -name '*.map' \) -exec gsed -i 's/\.ts\b/.cts/g' {} +

#
# Rename files from JS and TS to CJS and CTS.
#

find dist/cjs -type f -name "*.js" -exec sh -c 'mv "$1" "${1%.js}.cjs"' _ {} \;
find dist/cjs -type f -name "*.ts" -exec sh -c 'mv "$1" "${1%.ts}.cts"' _ {} \;
