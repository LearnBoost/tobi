
TESTS = test/*.test.js

SRC = $(shell find lib -type f)

test:
	@./support/expresso/bin/expresso \
		--serial \
		--timeout 5000 \
		-I support \
		-I support/jsdom/lib \
		-I support/htmlparser/lib \
		-I lib \
		$(TEST_FLAGS) \
		$(TESTS)

test-cov:
	@$(MAKE) TEST_FLAGS=--cov

docs: index.html

index.html: $(SRC)
	dox \
		--title "Tobi" \
		--desc "Expressive server-side functional testing with jQuery and jsdom." \
		--ribbon "http://github.com/learnboost/tobi" \
		--private \
		$^ > $@

.PHONY: test test-cov docs