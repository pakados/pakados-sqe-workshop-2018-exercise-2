import * as escodegen from 'escodegen';

const copyMap = (myMap)=>{
    var newMap = {};
    for (var i in myMap)
        newMap[i] = myMap[i];
    return newMap;
};

const addLabels = (code,trueFalseLocations)=>{
    let lines = code.split('\n');
    let ans = '';
    let trueLocations = trueFalseLocations[true];
    let falseLocations = trueFalseLocations[false];
    trueLocations.forEach(x=>{
        lines[x.start-1] = '<true>'+ lines[x.start-1];
        lines[x.end-1] = lines[x.end-1]+'</true>';
    });
    falseLocations.forEach(x=>{
        lines[x.start-1] = '<false>'+lines[x.start-1];
        lines[x.end -1] = lines[x.end-1]+'</false>';
    });
    lines.forEach(x=>{
        ans = ans + x + ' <br>';
    });
    return ans.replace(/\s\s\s\s/g,'&nbsp;&nbsp;&nbsp;&nbsp;');
};



export {copyMap };
export {addLabels };
