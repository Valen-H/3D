targ=
if [ "$1" != "" ]; then
	it=$1
else
	it="."
fi
files=`find $it/*.js -type f -not -name "build.*" -not -name "*5.js" -not -name "*.min.js" -not -name "*.opt.js" | grep -v build\.js$ | grep -v combined\.js$`
for file in $files; do
 fn=`basename $file .js`
 sh compile.sh $file &
done
wait
exit
