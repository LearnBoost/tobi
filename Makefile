
SRC = $(shell find lib -type f)
REPORTER = list

test:
	@./node_modules/.bin/mocha \
		--timeout 4s \
		--slow 1000 \
		--growl \
		--reporter $(REPORTER) \
		--ui exports

docs: index.html

index.html: $(SRC)
	dox \
		--title "Tobi" \
		--desc "Expressive server-side functional testing with jQuery and jsdom." \
		--ribbon "http://github.com/learnboost/tobi" \
		--private \
		$^ > $@

.PHONY: test docs