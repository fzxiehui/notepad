.PHONY: run

run:
	npm run docs:dev

build:
	npm run docs:build

update:
	rm -rf /home/hello/http/newbook/*
	cp -r ./docs/.vitepress/dist/* /home/hello/http/newbook/
