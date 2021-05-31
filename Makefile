build: build-cjs build-esm build-dts
	@echo "Done"

build-cjs:
	@echo "Building CJS"
	@rm lib/cjs/*.js lib/cjs/*.js.map 2> /dev/null
	@npx tsc -p lib/cjs/tsconfig.json

build-esm:
	@echo "Building ESM"
	@rm lib/esm/*.js lib/esm/*.js.map 2> /dev/null
	@npx tsc -p lib/esm/tsconfig.json

build-dts:
	@echo "Building DTS"
	@rm lib/types/*.d.ts lib/types/*.d.ts.map 2> /dev/null
	@npx tsc -p lib/types/tsconfig.json
