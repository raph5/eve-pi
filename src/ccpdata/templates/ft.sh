
get_id() {
  if (( $1 < 10 )); then
    echo "0$1"
  else
    echo $1
  fi
}


type=$1
name=$2

rm ~/code/redFilesReader/input/* -f
rm ~/code/redFilesReader/output/* -f

cd ~/code/redFilesReader/input

for i in {1..99}; do
  
  id=$(get_id $i)
  url="https://developers.eveonline.com/ccpwgl/assetpath/1097993/dx9/model/worldobject/planet/template/$type/p_${type}_${id}.red"
  file="p_${type}_$id.red"
  echo $url
  curl -L $url -o $file

  sample=$(cat $file)
  if [[ ${sample:0:6} != binred ]]; then
    rm $file
  fi

done

cd ~/code/redFilesReader
node .

cd ~/code/eve-pi/src/ccpdata/templates
mkdir $name

for i in ~/code/redFilesReader/output/*; do
  
  file=${i##*/}
  id=${file:(-7):2}
  echo $name$id
  python3.8 templateBuilder.py $i $name/$name$id.json

done