
TESTS = test/*.test.js

test:
	@./support/expresso/bin/expresso \
		--serial \
		-I support \
		-I lib \
		$(TESTS)

.PHONY: test