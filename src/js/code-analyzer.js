import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
import {copyMap} from './staticFunctions';


const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};

let isParameter = {};

const substituteProgram = (programJson)=>{
    // let mapValues = getPrePostValues(programJson);
    programJson.body.forEach((x)=>{
        if (x.type == 'FunctionDeclaration') {
            subtituteStatmentArr[x.type](x, {});
        }
    });
    return escodegen.generate(programJson);
};

const addToParamList = (functionJson)=>{
    isParameter={};
    functionJson.params.forEach(x =>isParameter[x.name]=true);
};

const checkIfSpliceBlock = (x)=>{
    return ((x.type == 'ExpressionStatement' && x.expression.type == 'AssignmentExpression'&&
        (!checkUserIsParameter (x.expression.left)))
        || (x.type == 'VariableDeclaration'  && !checkUserIsParameter[x.declarations[0].id.name]));
};

const substituteFunction = (functionJson, mapValues)=>{
    addToParamList(functionJson);
    subtituteStatmentArr[functionJson.body.type](functionJson.body,mapValues);
    // for (let i=0 ;i<functionJson.body.body.length;i++){
    //     let x = functionJson.body.body[i];
    //     subtituteStatmentArr[x.type](x,mapValues);
    //     if(checkIfSpliceBlock(x)){
    //         functionJson.body.body.splice(functionJson.body.body.indexOf(x),1);
    //         i--;
    //     }
    // }
    return functionJson;
};

const substituteIfStatment = (ifJson, mapValues)=>{
    let newMapValue = copyMap(mapValues);
    let newMapValue2 = copyMap(mapValues);
    subtituteStatmentArr[ifJson.test.type](ifJson.test,mapValues); //test
    subtituteStatmentArr[ifJson.consequent.type](ifJson.consequent,newMapValue); //consequent
    if(ifJson.alternate)
        subtituteStatmentArr[ifJson.alternate.type](ifJson.alternate,newMapValue2); //alternate
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const subVariableDeclaration = (varDecJson, mapValues)=> {
    varDecJson.declarations.forEach((x)=> {
        Object.keys(mapValues).forEach((y) => {
            if (escodegen.generate(x.init).includes(y)) {
                x.init = ((esprima.parse('let x =' + escodegen.generate(x.init).replaceAll(y, mapValues[y])).body[0]).declarations[0]).init;
            }
        });
        mapValues[x.id.name] = escodegen.generate(x.init);
    }
    );
};

const subBinary = (binaryJson, mapValues)=>{
    if (binaryJson.operator!= '=' && subtituteStatmentArr[binaryJson.left.type])
        binaryJson.left = subtituteStatmentArr[binaryJson.left.type](binaryJson.left,mapValues);
    if (subtituteStatmentArr[binaryJson.right.type])
        binaryJson.right = subtituteStatmentArr[binaryJson.right.type](binaryJson.right,mapValues);
    if (binaryJson.operator == '='){
        mapValues[escodegen.generate(binaryJson.left)] = escodegen.generate(binaryJson.right);
    }
    return binaryJson;
};

const checkUserIsParameter = (arrayUseJson)=>{
    if (arrayUseJson.type == 'MemberExpression' && isParameter[escodegen.generate(arrayUseJson.object)])
        return true;
    if (isParameter[escodegen.generate(arrayUseJson)])
        return true;
    return false;
};

const subBlockExpressions = (blockStatement, mapValues)=>{
    for (let i=0 ;i<blockStatement.body.length;i++){
        let x = blockStatement.body[i];
        subtituteStatmentArr [x.type](x,mapValues);
        if(checkIfSpliceBlock(x)){
            blockStatement.body.splice(blockStatement.body.indexOf(x),1);
            i--;
        }
    }
};

const subIdentifier = (identifierJson, mapValues)=>{
    if (mapValues[identifierJson.name] && !isParameter[identifierJson.name])
        return esprima.parse(mapValues[identifierJson.name]).body[0].expression;
    else
        return identifierJson;
};

const subExpression= (expressionJson, mapValues)=>{
    if(subtituteStatmentArr[expressionJson.expression.type])
        subtituteStatmentArr[expressionJson.expression.type](expressionJson.expression, mapValues);
};

const subWhile= (whileJson, mapValues)=>{
    whileJson.test = subtituteStatmentArr[whileJson.test.type](whileJson.test,mapValues);
    subtituteStatmentArr[whileJson.body.type](whileJson.body,mapValues);
};

const subReturn= (returnJson, mapValues)=>{
    if (subtituteStatmentArr[returnJson.argument.type])
        returnJson.argument = subtituteStatmentArr[returnJson.argument.type](returnJson.argument,mapValues);
};

const subMember= (memberJson, mapValues)=>{
    memberJson.object= subtituteStatmentArr[memberJson.object.type](memberJson.object,mapValues);
    if(subtituteStatmentArr[memberJson.property.type])
        memberJson.property= subtituteStatmentArr[memberJson.property.type](memberJson.property,mapValues);
    return  memberJson;
};

const subtituteStatmentArr = {'VariableDeclaration':subVariableDeclaration, 'Program':substituteProgram, 'FunctionDeclaration':substituteFunction,'BlockStatement':subBlockExpressions, 'IfStatement':substituteIfStatment,'BinaryExpression':subBinary,
    'Identifier':subIdentifier, 'ExpressionStatement':subExpression,'AssignmentExpression':subBinary,'ReturnStatement':subReturn,'WhileStatement':subWhile,'MemberExpression':subMember
    ,'LogicalExpression':subBinary};





export {parseCode};
export {substituteProgram };
