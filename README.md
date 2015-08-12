# git-tag-soup-slurper
CLI tool to clean up old git tags

[![Build Status](https://travis-ci.org/tkissing/git-tag-soup-slurper.svg)](https://travis-ci.org/tkissing/git-tag-soup-slurper)

## Install
`npm install -g @tkissing/git-tag-soup-slurper`

## Usage Examples

### Delete pre-release tags locally and on remotes
`slurp-rc-tags`

### Delete pre-release tags locally only
`slurp-rc-tags --localonly` or `slurp-rc-tags -l`

### Delete pre-release tags locally and on remotes excluding "origin"
`slurp-rc-tags --excluderemote origin` or `slurp-rc-tags -r origin`

Note: The `excluderemote` option can be specified multiple times if you want to exclude more than one remote

### Delete pre-release tags before a specific version
`slurp-rc-tags --upto 2.0.0` will delete any pre-release tags `<= 2.0.0`

### Delete pre-releases except v1.0.0-RC5 and v2.0.0-BETA
`slurp-rc-tags --excludetag v1.0.0-RC5 --excludetag v2.0.0-BETA` or `slurp-rc-tags -t v1.0.0-RC5 -t v2.0.0-BETA`

Note: The excluded tag name must match exactly. This is a string comparison, not a SemVer match!

### Do a dry run

`slurp-rc-tags -d` will print out the git commands instead of executing them
