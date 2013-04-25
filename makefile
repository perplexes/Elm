all: install

install: elm-server

elm: runtime
	cd elm && cabal install

elm-server: elm
	cd elm-server && cabal install

runtime:
	cd core-js && ./cat.sh
