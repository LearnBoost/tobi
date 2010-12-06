
TESTS = test/*.test.js

test:
	@./support/expresso/bin/expresso \
		--serial \
		-I support \
		-I support/jsdom/lib \
		-I support/htmlparser/lib \
		-I lib \
		$(TEST_FLAGS) \
		$(TESTS)

test-cov:
	@$(MAKE) TEST_FLAGS=--cov

.PHONY: test test-cov