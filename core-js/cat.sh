#!/bin/bash
# I do not use this script, so it may be out of date.
# Please make sure that this matches with cat.bat to
# avoid confusing "errors".

filename=$(cat ../elm/Elm.cabal |\
 grep Data-files |\
 sed 's/Data-files:          //')

files=$(cat cat.bat |\
 grep js |\
 tail -r |\
 tail -n +3 |\
 tail -r |\
 sed 's/\^//;s/\+//;s/\\/\//')

cat $files > ../elm/$filename
