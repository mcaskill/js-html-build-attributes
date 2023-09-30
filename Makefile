build: build-cjs build-esm
	@echo "Done"

build-cjs: clean-cjs
	@echo "Building CJS"
	@npx tsc -p dist/cjs/tsconfig.json

build-esm: clean-esm
	@echo "Building ESM"
	@npx tsc -p dist/esm/tsconfig.json

clean: clean-cjs clean-esm
	@echo "Done"

clean-cjs:
	@echo "Cleaning CJS"
	@rm -rf dist/cjs/*.js dist/cjs/*.js.map dist/cjs/*.d.ts dist/cjs/*.d.ts.map dist/cjs/lib 2> /dev/null

clean-esm:
	@echo "Cleaning ESM"
	@rm -rf dist/esm/*.js dist/esm/*.js.map dist/esm/*.d.ts dist/esm/*.d.ts.map dist/esm/lib 2> /dev/null
