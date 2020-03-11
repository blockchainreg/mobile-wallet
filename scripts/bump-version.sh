TARGET="./app.json"
if [ ! -f "$TARGET" ]; then
   echo "missing file $TARGET"
   exit 1;
fi

LINE=$(grep -o ${TARGET} -e '\"versionCode\": [0-9]*');
declare -a LINE;

LINE=(`echo $LINE | tr ":" " "`);
VERSION=(${LINE[1]});
INCREMENTED=$(($VERSION+1))

sed "s/\"versionCode\": [0-9]*/\"versionCode\": ${INCREMENTED}/" $TARGET > $TARGET.tmp && mv $TARGET.tmp $TARGET
