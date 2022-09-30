build: build-cjs build-esm build-dts
	@echo "Done"

build-cjs: clean-cjs
	@echo "Building CJS"
	@npx tsc -p dist/cjs/tsconfig.json

build-esm: clean-esm
	@echo "Building ESM"
	@npx tsc -p dist/esm/tsconfig.json

build-dts: clean-dts
	@echo "Building DTS"
	@npx tsc -p dist/dts/tsconfig.json

clean: clean-cjs clean-esm clean-dts
	@echo "Done"

clean-cjs:
	@echo "Cleaning CJS"
	@rm -rf dist/cjs/*.js dist/cjs/*.js.map dist/cjs/lib 2> /dev/null

clean-esm:
	@echo "Cleaning ESM"
	@rm -rf dist/esm/*.js dist/esm/*.js.map dist/esm/lib 2> /dev/null

clean-dts:
	@echo "Cleaning DTS"
	@rm -rf dist/dts/*.d.ts dist/dts/*.d.ts.map dist/dts/lib 2> /dev/null
