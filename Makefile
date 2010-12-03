
test:
	@./support/expresso/bin/expresso \
		--serial \
		-I support \
		-I lib

.PHONY: test