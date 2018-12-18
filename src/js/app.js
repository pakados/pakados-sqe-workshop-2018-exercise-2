import $ from 'jquery';
import {evaluateProgram} from './evaluatore';
import {parseCode} from './code-analyzer';
import {substituteProgram } from './code-analyzer';
import {addLabels} from './staticFunctions';
import * as escodegen from 'escodegen';


// import {parseCodeOld} from './code-analyzer';



const getParametersFromInputString = (inputJsons)=>{
    let valuesMap = {};
    inputJsons.body.forEach(x =>{
        valuesMap [x.expression.left.name] = eval(escodegen.generate(x.expression.right));
    });
    return valuesMap;
};

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        //subtitution
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        parsedCode = substituteProgram(parsedCode);

        let parameters = $('#parametersHolder').val();
        let paramsJsons = parseCode(parameters);
        let valuesMap = getParametersFromInputString(paramsJsons);
        let trueFalseLocations = evaluateProgram(parsedCode,valuesMap);
        let lines = addLabels(parsedCode,trueFalseLocations);
        var div = document.getElementById('parsedCode');
        div.innerHTML ='';
        div.innerHTML += lines;
    });
});


export {addLabels};