fn=`basename $1 .js`
(bs $1 ${fn}5.js 1> /dev/null) && echo $fn "5js" && (((optimize-js ${fn}5.js > ${fn}5.opt.js && echo $fn "5optjs" && minifyjs -m -l 2 -i ${fn}5.opt.js -o ${fn}5.min.js) && echo $fn "5minjs") || ((echo "failed ${fn}5optjs" && (minifyjs -m -l 2 -i ${fn}5.js -o ${fn}5.min.js && echo $fn "5minjs") || echo "failed ${fn}5minjs")))
wait
exit
