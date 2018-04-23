#!/bin/sh
setup() {
  rm -rf src-web
  mkdir -p src-web/thing/thing2
  echo '' > 'src-web/thing/after.js'
  echo '' > 'src-web/after.js'
  echo '' > 'src-web/thing/thing2/after.scss'
  echo '' > 'src-web/thing/thing2/after1.scss'
}

set -f # disable wildcard expansion
run_test() {
  header_path='./headers/header.js'
  file_path=$1
  setup
  echo [FILES from $file_path]
  node app.js $file_path $header_path
  echo "------"
}

run_test src-web/**/*.scss
echo 'quoted'
run_test "src-web/**/*.scss"

run_test src-web/**/*.js


run_test src-web/**/*
echo 'quoted'
run_test "src-web/**/*"

run_test src-web/thing/thing2/after1.scss
echo 'quoted'
run_test 'src-web/thing/thing2/after1.scss'
