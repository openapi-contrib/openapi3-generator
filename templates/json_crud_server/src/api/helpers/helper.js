const errorModel = require('../helpers/errorResponse');
const fs = require('fs');
const getNewId = (array) => {
  if (array.length > 0) {
    return array[array.length - 1].id + 1;
  } else {
    return 100000;
  }
};
const newDate = () => new Date().toString();


function mustBeInArray(array, id) {
  return new Promise((resolve, reject) => {
    const row = array.find(r => r.id == id);
    if (!row) {
      reject(new errorModel.ErrorResponse(15,"Object with id "+ id + " was not found", "test", 404, "Object with id "+ id + " was not found"))
    }
    resolve(row);
  })
}

function writeJSONFile(filename, content) {
  fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
    if (err) {
      console.log(err);
    }
  })
}

function isArray(what) {
  if (Object.prototype.toString.call(what) === '[object Array]'){
    throw new errorModel.ErrorResponse(15,"Now Array is allowed", "test", 400, "Now Array is allowed");
  }
}
function getUniqueElementsInArray(arr, comp) {

  const unique = arr
    .map(e => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);

  return unique;
}

function checkLike(value, part){
  if(value.indexOf(part) > -1){
    return true;
  }else{
    return false;
  }
}
function filterValueWithOperator(filterParameter, operator, value, valueCollection, list){
  switch(operator){
    case "=":
      if (!isArray(value)){
        return list.filter(x => x[filterParameter] == value);
      }
    case "!=":
      if (!isArray(value)){
        return list.filter(x => x[filterParameter] != value);
      }
    case "IN":
      if (Object.prototype.toString.call(valueCollection) === '[object Array]') {
        filterlist = [];
        valueCollection.forEach(x => filterlist.push(...list.filter(y => y[filterParameter] == x)));
        return filterlist;
      }else{
        return list.filter(x => x[filterParameter] == value);
      }
      return list.filter(x => x[filterParameter] == value);
    case "NOT_IN":
      if (Object.prototype.toString.call(valueCollection) === '[object Array]') {
        filterlist = list.filter(x => !(valueCollection.includes( x[filterParameter])));
        return filterlist;
      }else{
        return list.filter(x => x[filterParameter] != value);
      }
    case "LIKE":
      return list.filter(x => checkLike(x[filterParameter],value));
    case "NOT_LIKE":
      return list.filter(x => !(checkLike(x[filterParameter],value)));
    default:
      throw new errorModel.ErrorResponse(15,"Wrong Operator", "test", 400, "Wrong Operator");
  }
}
module.exports = {
  getNewId,
  newDate,
  mustBeInArray,
  writeJSONFile,
  isArray,
  getUniqueElementsInArray,
  checkLike,
  filterValueWithOperator
};
