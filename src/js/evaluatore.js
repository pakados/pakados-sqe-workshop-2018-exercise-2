import * as escodegen from 'escodegen';
import * as esprima from 'esprima';
import {copyMap} from './staticFunctions';



let trueLocations = [];
let falseLocations = [];

const getLocationMap = (start, end)=>{
    return {'start':start,'end':end};
};

const addTrueLocation = (start, end)=>{
    trueLocations.push(getLocationMap(start,end));
};

const addFalseLocation = (start, end)=>{
    falseLocations.push(getLocationMap(start,end));
};

const getPrePostValues = (programJson, mapValues)=>{
    programJson.body.forEach((x)=>{
        let preStatments = '';
        Object.keys(mapValues).reverse().forEach((y)=>{
            if (x.type == 'ExpressionStatement' && escodegen.generate(x.expression.right).includes(y)){
                preStatments = 'let ' + y + '=' + mapValues[y] + ';' + preStatments;
            }
            else if (x.type == 'VariableDeclaration' && escodegen.generate(x.declarations[0].init).includes(y)) {
                preStatments = 'let ' + y + '=' + mapValues[y] + ';' + preStatments;
            }
        });
        if (x.type == 'ExpressionStatement')
            mapValues[x.expression.left.name] = eval(preStatments + escodegen.generate(x.expression.right));
        else if (x.type == 'VariableDeclaration')
            mapValues[x.declarations[0].id.name] = eval(preStatments + escodegen.generate(x.declarations[0].init));
    });
    return mapValues;
};



const evaluateProgram = (substitutedCode,paramsValues)=> {
    trueLocations = [];
    falseLocations = [];
    let subtitutedCodeJsons = esprima.parseScript(substitutedCode,{loc:true});
    paramsValues = getPrePostValues(subtitutedCodeJsons,paramsValues);
    subtitutedCodeJsons.body.forEach((x)=>{
        if (x.type == 'FunctionDeclaration') {
            evaluateFunction(x, paramsValues);
        }
    });
    return {'true':trueLocations,'false':falseLocations};
};

const evaluateFunction = (functionJson,paramsValues)=> {
    functionJson.body.body.forEach((x)=>{
        if(evaluationArr[x.type] )
            evaluationArr[x.type] (x,paramsValues);
    });
};

const evaluateExpression = (expressionJson,paramsValues)=> {
    evaluationArr[expressionJson.expression.type](expressionJson.expression,paramsValues);
};

const evaluateBlock = (blockJson,paramsValues)=> {
    blockJson.body.forEach(x=>{
        if (evaluationArr[x.type])
            evaluationArr[x.type](x,paramsValues);
    });
};

const evaluateIfStatement = (ifJson,paramsValues)=> {
    checkCondition(ifJson.test,paramsValues);
    let thenCaseMap =  copyMap(paramsValues);
    let alternateMap =  copyMap(paramsValues);
    evaluationArr[ifJson.consequent.type](ifJson.consequent,thenCaseMap);
    if(ifJson.alternate)
        evaluationArr[ifJson.alternate.type](ifJson.alternate,alternateMap);
};

const evaluateWhileStatement = (whileJson,paramsValues)=> {
    checkCondition(whileJson.test,paramsValues);
    evaluationArr[whileJson.body.type](whileJson.body,paramsValues);
};

const evaluateAssignment = (assignmentJson,paramsValues)=> {
    let preStatements= '';
    Object.keys(paramsValues).reverse().forEach((y)=>{
        if (escodegen.generate(assignmentJson.right).includes(y)){
            preStatements = 'let ' + y + '=' + JSON.stringify(paramsValues[y]) + ';' + preStatements;
        }
    });
    let newValue = eval(preStatements + escodegen.generate(assignmentJson.right));
    paramsValues [assignmentJson.left.name] = newValue;
};


const checkCondition = (conditionJson,paramsValues)=> {
    let preStatements= '';
    Object.keys(paramsValues).reverse().forEach((y)=>{
        if ((escodegen.generate(conditionJson) + preStatements).includes(y)){
            preStatements ='let ' + y + '=' + JSON.stringify(paramsValues[y]) + ';' + preStatements;
        }
    });
    if (eval(preStatements + escodegen.generate(conditionJson))) {
        addTrueLocation(conditionJson.loc.start.line,conditionJson.loc.end.line);
    }
    else {
        addFalseLocation(conditionJson.loc.start.line,conditionJson.loc.end.line);
    }
};

const evaluateUpdate = (UpdateJson,paramsValues)=> {
    let preStatements= '';
    Object.keys(paramsValues).reverse().forEach((y)=>{
        if (escodegen.generate(UpdateJson).includes(y)){
            preStatements = 'let ' + y + '=' + JSON.stringify(paramsValues[y]) + ';' + preStatements;
        }
    });
    let newValue = eval(preStatements + escodegen.generate(UpdateJson));
    paramsValues [UpdateJson.argument.name] = newValue;
};


const evaluationArr = {'ExpressionStatement':evaluateExpression,'FunctionDeclaration':evaluateFunction,'BlockStatement':evaluateBlock,
    'IfStatement':evaluateIfStatement,'WhileStatement':evaluateWhileStatement,'AssignmentExpression':evaluateAssignment,'UpdateExpression':evaluateUpdate};


export {evaluateProgram };
