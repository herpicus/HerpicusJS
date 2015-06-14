# HerpicusJS
Herpicus Javascript Library

#### Type Functions
**Herpicus.TypeOf**   
Return a *string* type for any operand
```
Herpicus.TypeOf({}) //object
Herpicus.TypeOf(document.createElement('div')) //htmldivelement
```
* Herpicus.isObject  
* Herpicus.isArray  
* Herpicus.isFunction  
* Herpicus.isString  
* Herpicus.isInteger  
* Herpicus.isBoolean  
* Herpicus.isDefined  
* Herpicus.isUndefined  
* Herpicus.isElement  
* Herpicus.isTextNode  
* Herpicus.isNodeList  
* Herpicus.isIterable  
Returns a *Boolean* if the operand is x 

----

**Herpicus.Extend**  
Extends an *object*  
`Herpicus.Extend(Source, Target)`
`var obj = Herpicus.Extend(obj, obj2)`

**Herpicus.Merge**  
Merges two *objects*  
`Herpicus.Merge(Object, Object)`
`var obj = Herpicus.Merge({Hello: "World"}, {Top: "Kek"});` 

**Herpicus.ForEach**  
Iterates through an *Array* or *Object*
```
Herpicus.ForEach(arr, callback[index, value]);

var arr = ["1", 2, {three: "four"}];
Herpicus.ForEach(arr, function(index, value) {
  console.log(index, value);
});
// returns
// 0 "1"
// 1 2
// 2 Object{three: "four"}
var obj = {one: "two", three: function() { return "four" }}
Herpicus.ForEach(obj, function(key, value) {
  console.log(key, value);
});
// one "two"
// three anonymous function()
```

**Herpicus.Contains**
Checks if an *Array*, *Object* or *String* contains  
`Herpicus.Contains(arr, arg); // returns boolean`  

**Herpicus.Insert**  
Inserts a value into an *Array* starting from a specific index  
`Herpicus.Insert(target, index, value); // returns new array`  

**Herpicus.Trim**  
Removes whitespaces and unnecessary spaces from a string  
`Herpicus.Trim(string) //returns trimmed string`
