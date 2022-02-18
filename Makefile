build: build-cjs build-esm build-dts
	@echo "Done"

build-cjs:
	@echo "Building CJS"
	@rm dist/cjs/*.js dist/cjs/*.js.map 2> /dev/null
	@npx tsc -p dist/cjs/tsconfig.json

build-esm:
	@echo "Building ESM"
	@rm dist/esm/*.js dist/esm/*.js.map 2> /dev/null
	@npx tsc -p dist/esm/tsconfig.json

build-dts:
	@echo "Building DTS"
	@rm dist/dts/*.d.ts dist/dts/*.d.ts.map 2> /dev/null
	@npx tsc -p dist/dts/tsconfig.json
