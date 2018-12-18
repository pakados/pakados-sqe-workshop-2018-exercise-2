import assert from 'assert';
import {parseCode, substituteProgram} from '../src/js/code-analyzer';
import {addLabels} from '../src/js/staticFunctions';

import {evaluateProgram} from '../src/js/evaluatore';


const test1 = 'function foo(x, y, z) { <br><false>&nbsp;&nbsp;&nbsp;&nbsp;if (x + 1 + y < z) {</false> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return x + y + z + (0 + 5); <br><true>&nbsp;&nbsp;&nbsp;&nbsp;} else if (x + 1 + y < z * 2) {</true> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return x + y + z + (0 + x + 5); <br>&nbsp;&nbsp;&nbsp;&nbsp;} else { <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return x + y + z + (0 + z + 5); <br>&nbsp;&nbsp;&nbsp;&nbsp;} <br>} <br>';

const test2 = 'function foo(x, y, z) { <br><true>&nbsp;&nbsp;&nbsp;&nbsp;while (x + 1 < z) {</true> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;z = (x + 1 + (x + 1 + y)) * 2; <br>&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;return z; <br>} <br>';


const test3 = 'let w = [ <br>&nbsp;&nbsp;&nbsp;&nbsp;1, <br>&nbsp;&nbsp;&nbsp;&nbsp;2, <br>&nbsp;&nbsp;&nbsp;&nbsp;3 <br>]; <br>function foo(x, y, z) { <br><false>&nbsp;&nbsp;&nbsp;&nbsp;while (w[2] < z) {</false> <br><true>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (w[2]) {</true> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;z = (w[3] + (w[2] + y)) * 2; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;return z; <br>} <br>';

const test4 = 'function bubbleSort(arr) { <br><true>&nbsp;&nbsp;&nbsp;&nbsp;while (7 - 1 >= 0) {</true> <br><true>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;while (1 <= 7 - 1) {</true> <br><false>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (arr[1 - 1] > arr[1]) {</false> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arr[j - 1] = arr[1]; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arr[j] = arr[1 - 1]; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;return arr; <br>} <br>';

const test5 = 'let t = 3; <br>let y = 6; <br>function bubbleSort(str) { <br><true>&nbsp;&nbsp;&nbsp;&nbsp;while (1 <= y) {</true> <br><true>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (str) {</true> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;str = str + 1; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;return str; <br>} <br>';

const test6 = 'let x = 2; <br>let y = x + 2; <br>function insertionSort(arr) { <br><false>&nbsp;&nbsp;&nbsp;&nbsp;while (7 < 0) {</false> <br><false>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;while (7 > 0 && arr[7 - 1] > 2) {</false> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arr[j] = arr[7 - 1]; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arr[j] = arr[7]; <br>&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;return arr; <br>} <br>';

const test7 = 'let x = 2; <br>let y = x + 2; <br>y = 2 * y; <br>function insertionSort(arr) { <br><false>&nbsp;&nbsp;&nbsp;&nbsp;while (7 < 0) {</false> <br><false>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;while (7 > 0 && arr[7 - 1] > 2) {</false> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arr[j] = arr[7 - 1]; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arr[j] = arr[7]; <br>&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;return arr; <br>} <br>';

const test8 = 'function boo(array, left, right) { <br><true>&nbsp;&nbsp;&nbsp;&nbsp;while (left <= right) {</true> <br><true>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;while (array[left] < array[(left + right) / 2]) {</true> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 1; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br><true>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;while (array[right] > array[(left + right) / 2]) {</true> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 2; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br><true>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (left <= right) {</true> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return left++; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;return 4; <br>} <br>';


const test9 = 'function boo(array, left, right) { <br>&nbsp;&nbsp;&nbsp;&nbsp;left++; <br><true>&nbsp;&nbsp;&nbsp;&nbsp;while (left <= right) {</true> <br><true>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;while (array[left] < array[(left + right) / 2]) {</true> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 1; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br><true>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;while (array[right] > array[(left + right) / 2]) {</true> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return 2; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br><true>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (left <= right) {</true> <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return left++; <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;} <br>&nbsp;&nbsp;&nbsp;&nbsp;return 4; <br>} <br>';

const test10 = 'function foo(a) { <br>&nbsp;&nbsp;&nbsp;&nbsp;a = 1; <br>&nbsp;&nbsp;&nbsp;&nbsp;return a + 2; <br>} <br>';


describe('test 1', () => {
    it('first Test', () => {
        let substitutedCode = substituteProgram(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' + '        c = c + 5;\n' + '        return x + y + z + c;\n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' + '        return x + y + z + c;\n' + '    } else {\n' + '        c = c + z + 5;\n' + '        return x + y + z + c;\n' + '    }\n' + '}\n'));
        assert.equal(
            addLabels(substitutedCode,evaluateProgram(substitutedCode,{'x':1,'y':2,'z':3})),
            test1
        );
    });
});


describe('test 2', () => {
    it('second Test', () => {
        let substitutedCode = substituteProgram(parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' + '    \n' + '    while (a < z) {\n' + '        c = a + b;\n' + '        z = c * 2;\n' + '    }\n' + '    \n' + '    return z;\n' + '}'));
        assert.equal(
            addLabels(substitutedCode,evaluateProgram(substitutedCode,{'x':1,'y':2,'z':3})),
            test2
        );
    });
});


describe('test 3', () => {
    it('third Test', () => {
        let substitutedCode = substituteProgram(parseCode('let w = [1,2,3];\n' +
            'function foo(x, y, z){\n' +
            '    w[2] = w[1];\n' +
            '    let b = w[2] + y;\n' + '    let c = 0;    \n' + '    while (w[2] < z) {\n' + '        if (w[2])\n' + '        {\n' + '            c = w[3] + b;\n' + '            z = c * 2;         \n' + '        }\n' + '\n' + '    }    \n' + '    return z;\n' + '}'));
        assert.equal(
            addLabels(substitutedCode,evaluateProgram(substitutedCode,{'x':1,'y':2,'z':1})),
            test3
        );
    });
});


describe('test 4', () => {
    it('fourth Test', () => {
        let substitutedCode = substituteProgram(parseCode('function bubbleSort(arr){\n' +
            '   let len = 7;\n' +
            '   let i = len - 1;\n' +
            '   while(i>=0){\n' +
            '     let j = 1;\n' +
            '     while(j<=i){\n' + '       if(arr[j-1]>arr[j]){\n' + '           var temp = arr[j-1];\n' + '           arr[j-1] = arr[j];\n' + '           arr[j] = temp;\n' + '        }\n' + '       j=j+1;\n' + '     }\n' + '    i= i-1;\n' + '   }\n' + '   return arr;\n' + '}'));
        assert.equal(
            addLabels(substitutedCode,evaluateProgram(substitutedCode,{'arr':[1,2,3]})),
            test4
        );
    });
});

describe('test 5', () => {
    it('fifth Test', () => {
        let substitutedCode = substituteProgram(parseCode('let t = 3;\n' +
            'let y = 6;\n' +
            'function bubbleSort(str){\n' + '   let len = y;\n' + '   let i = 1;\n' + '   while(i<=len ){\n' + '    if(str){\n' + '       str = str+i;\n' + '    }    \n' + '    i= i +1;\n' + '   }\n' + '   return str;\n' + '}'));
        assert.equal(
            addLabels(substitutedCode,evaluateProgram(substitutedCode,{'str':'wow'})),
            test5
        );
    });
});

describe('test 6', () => {
    it('sixth Test', () => {
        let substitutedCode = substituteProgram(parseCode('let x = 2;\n' +
            'let y = x + 2;\n' +
            'function insertionSort(arr){\n' +
            '  let  i = 7;\n' +
            '  let len = 0;\n' + '  let el = 0;\n' + '  let j = 0 ;\n' + '  let toInsert = 2;\n' + '  while(i<len){\n' + '    el = arr[i];\n' + '    j = i;\n' + '\n' + '    while(j>0 && arr[j-1]>toInsert){\n' + '      arr[j] = arr[j-1];\n' + '      j = j -1;\n' + '   }\n' + '\n' + '   arr[j] = el;\n' + '   i = i+1;\n' + '  }\n' + '\n' + '  return arr;\n' + '}'));
        assert.equal(
            addLabels(substitutedCode,evaluateProgram(substitutedCode,{'arr':[1,2,3]})),
            test6
        );
    });
});

describe('test 7', () => {
    it('seventh Test', () => {
        let substitutedCode = substituteProgram(parseCode('let x = 2;\n' +
            'let y = x + 2;\n' +
            'y =2*y;\n' +
            'function insertionSort(arr){\n' +
            '  let  i = 7;\n' + '  let len = 0;\n' + '  let el = 0;\n' + '  let j = 0 ;\n' + '  let toInsert = 2;\n' + '  while(i<len){\n' + '    el = arr[i];\n' + '    j = i;\n' + '\n' + '    while(j>0 && arr[j-1]>toInsert){\n' + '      arr[j] = arr[j-1];\n' + '      j = j -1;\n' + '   }\n' + '\n' + '   arr[j] = el;\n' + '   i = i+1;\n' + '  }\n' + '\n' + '  return arr;\n' + '}'));
        assert.equal(
            addLabels(substitutedCode,evaluateProgram(substitutedCode,{'arr':[1,2,3]})),
            test7
        );
    });
});


describe('test 8', () => {
    it('eigth Test', () => {
        let substitutedCode = substituteProgram(parseCode('function boo(array, left, right){\n' +
            '  let pivotIndex =  (left + right) / 2;\n' +
            '  let pivot = array[pivotIndex];\n' +
            '\n' +
            '  let leftIndex = left;\n' +
            '  let rightIndex = right;\n' + '  \n' + '  while (leftIndex <= rightIndex){\n' + '    while(array[leftIndex] < pivot){\n' + '      return 1;\n' + '    }\n' + '    \n' + '    while(array[rightIndex] > pivot){\n' + '      return 2;\n' + '    }\n' + '    \n' + '    if (leftIndex <= rightIndex){\n' + '      return left++;\n' + '    }\n' + '  }\n' + '  return 4;\n' + '}'));
        assert.equal(
            addLabels(substitutedCode,evaluateProgram(substitutedCode,{'array':[1,2,3],'left':0,'right':2})),
            test8
        );
    });
});

describe('test 9', () => {
    it('eigth Test', () => {
        let substitutedCode = substituteProgram(parseCode('function boo(array, left, right){\n' + '  let pivotIndex =  (left + right) / 2;\n' + '  let pivot = array[pivotIndex];\n' + '  left++;\n' + '  let leftIndex = left;\n' + '  let rightIndex = right;\n' + '  \n' + '  while (leftIndex <= rightIndex){\n' + '    while(array[leftIndex] < pivot){\n' + '      return 1;\n' + '    }\n' + '    \n' + '    while(array[rightIndex] > pivot){\n' + '      return 2;\n' + '    }\n' + '    \n' + '    if (leftIndex <= rightIndex){\n' + '      return left++;\n' + '    }\n' + '  }\n' +
            '  return 4;\n' +
            '}'));
        assert.equal(
            addLabels(substitutedCode,evaluateProgram(substitutedCode,{'array':[1,2,3],'left':0,'right':2})),
            test9
        );
    });
});

describe('test 10', () => {
    it('tenth Test', () => {
        let substitutedCode = substituteProgram(parseCode('function foo(a) {\n' +
            'a = 1;\n' +
            'return a+2;\n' +
            '}'));
        assert.equal(
            addLabels(substitutedCode,evaluateProgram(substitutedCode,{'array':[1,2,3],'left':0,'right':2})),
            test10
        );
    });
});

