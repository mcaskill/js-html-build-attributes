publishable: publishable-cjs publishable-esm copy-files
	@echo "Done"

publishable-cjs: clean-cjs _publishable-cjs _fix-cjs

publishable-esm: clean-esm _publishable-esm

testable: testable-cjs testable-esm
	@echo "Done"

testable-cjs: clean-cjs _testable-cjs _fix-cjs

testable-esm: clean-esm _testable-esm

copy-files:
	@echo "Copy repository files for publishing"
	@cp README.md dist
	@cp LICENSE dist

clean: clean-cjs clean-esm
	@echo "Done"

clean-cjs:
	@echo "Cleaning CJS"
	@rm -rf dist/cjs/*.js dist/cjs/*.cjs dist/cjs/*.js.map dist/cjs/*.cjs.map dist/cjs/*.d.ts dist/cjs/*.d.cts dist/cjs/*.d.ts.map dist/cjs/*.d.cts.map dist/cjs/lib 2> /dev/null

clean-esm:
	@echo "Cleaning ESM"
	@rm -rf dist/esm/*.js dist/esm/*.mjs dist/esm/*.js.map dist/esm/*.mjs.map dist/esm/*.d.ts dist/esm/*.d.mts dist/esm/*.d.ts.map dist/esm/*.d.mts.map dist/esm/lib 2> /dev/null

lint:
	@echo "Linting"
	@npx tsc -p config/ts/esm.json --noEmit
	@npx eslint 'src/**/*.ts' 'tests/**/*.js' 'examples/**/*.js'

test:
	@echo "Testing"
	@npm run pretest:cjs
	@npm run pretest:esm
	@npm exec -- uvu tests

_fix-cjs:
	@echo "Fixing CJS"
	@bash ./build/fix-cjs.sh

_publishable-cjs:
	@echo "Building CJS for publishing"
	@npx tsc -p config/ts/cjs.json

_publishable-esm:
	@echo "Building ESM for publishing"
	@npx tsc -p config/ts/esm.json

_testable-cjs:
	@echo "Building CJS for testing"
	@npx tsc -p config/ts/cjs.json --declarationMap --sourceMap

_testable-esm:
	@echo "Building ESM for testing"
	@npx tsc -p config/ts/esm.json --declarationMap --sourceMap
