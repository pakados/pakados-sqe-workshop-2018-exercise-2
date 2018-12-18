# Sample project

In this assignment we were asked to do kind of subtitution on a given function so there will be no local veraibles in the function.
Also for each predicate (while/if) we were asked to mark it in green in case of ture case or red otherwise.

#### I/O Example

The input:

```javascript
function foo(x, y, z){
    let a = x + 1;
    let b = a + y;
    let c = 0;
    
    if (b < z) {
        c = c + 5;
        return x + y + z + c;
    } else if (b < z * 2) {
        c = c + x + 5;
        return x + y + z + c;
    } else {
        c = c + z + 5;
        return x + y + z + c;
    }
}


```

Should produce:
```javascript
function foo(x, y, z){
    if (x + 1 + y < z) {                //this line is red
        return x + y + z + 5;
    } else if (x + 1 + y < z * 2) {     //this line is green
        return x + y + z + x + 5; 
    } else {
        return x + y + z + z + 5;
    }
}
```
