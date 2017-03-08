BENCHMARK_1=$(node ./benchmark/compare-commits/benchmark-solo.js)

git stash -u &> /dev/null
git checkout $1 &> /dev/null

BENCHMARK_2=$(node ./benchmark/compare-commits/benchmark-solo.js)

git checkout - &> /dev/null
git stash pop &> /dev/null

node ./benchmark/compare-commits/output-result.js $BENCHMARK_1 $BENCHMARK_2 $1
