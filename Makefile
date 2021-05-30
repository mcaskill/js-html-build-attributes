NPMPACKAGE := "{\\n    \"type\": \"module\",\\n    \"private\": true\\n}"

build: build-cjs build-esm build-dts
	@echo "Done"

build-cjs:
	@echo "Building CommonJS"
	@rm -rf lib/cjs 2> /dev/null
	@npx tsc -p tsconfig.cjs.json
	@echo $(subst module,commonjs,$(NPMPACKAGE)) > lib/cjs/package.json

build-esm:
	@echo "Building ESM"
	@rm -rf lib/esm 2> /dev/null
	@npx tsc -p tsconfig.esm.json
	@echo $(NPMPACKAGE) > lib/esm/package.json

build-dts:
	@echo "Building TypeScript declarations"
	@rm -rf lib/dts 2> /dev/null
	@npx tsc -p tsconfig.dts.json
