#!/bin/bash
judge=$1
inputFile=$2
outputFile=$3
all_args=("$@")
exe=("${all_args[@]:3}")
/bin/pipexec -- [ J $judge $inputFile $outputFile ] [ P $exe ] [ C /bin/cat ] "{J:1>P:0}" "{P:1>J:0}" "{J:2>C:0}"
