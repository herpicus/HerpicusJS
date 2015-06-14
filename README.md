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
*IE6+ Compatible*  
Removes whitespaces and unnecessary spaces from a string  
`Herpicus.Trim(string) //returns trimmed string`  

**Herpicus.IndexOf**  
*IE6+ Compatible*  
`Herpicus.IndexOf(arr, arg, index)`  

**Herpicus.LastIndexOf**  
*IE6+ Compatible*  
`Herpicus.LastIndexOf(arr, arg)`  

**Herpicus.Printf**  
String Formatter (Python string.Format)  
`Herpicus.Printf(String, Arguments)`  
`Herpicus.Printf("Hello {0}", "World") // returns Hello World`  

**Herpicus.Sprintf**  
String Formatter 
`Herpicus.Sprintf(String, Arguments)`
`Herpicus.Sprintf("%s, what does the %s say about his power level? It's over %d!!", "Vegeta", "scouter", 9000)`  

**Herpicus.ErrorHandler**  
**Herpicus.Defer**  
**Herpicus.Safe**  
**Herpicus.Queue**  
**Herpicus.Function**  

**Herpicus.JSON**  
JSON Stringify and Parse  
`Herpicus.JSON.Stringify(operand)`  
`Herpicus.JSON.Parse(String, Reviver)`  


**Herpicus.Http**  
```
Herpicus.Http({
  URL: String, // Required
  Method: String, // "GET", "POST"
  Params: String,
  Data: Object,
  Cache: Boolean,
  Async: Boolean,
  Headers: Array, // Header as Object
  Type: String, // Return Type [Text, JSON]
  Timeout: Integer, // Timeout in seconds
  Callback: Function // Called after request, returns response
});
```
*Herpicus.Get*  
`Herpicus.Get(URL (String), Callback (Function))`  
*Herpicus.Post*  
`Herpicus.Post(URL (String), Data (Object), Callback (Function))`  
*Herpicus.JSON*  
`Herpicus.JSON(URL (String), Callback (Function)) // Response as JSON`  
*Herpicus.JSONP*  

**Herpicus.Generate.String**  
**Herpicus.Generate.Number**  

**Herpicus.Timers**  
**Herpicus.ClearTimer**  
**Herpicus.Interval**  
**Herpicus.Timeout**  

**Herpicus.Events**
*Herpicus.Events.Add*  
*Herpicus.Events.Remove*  

**Herpicus.Require**
*Herpicus.Require.Config*  

**Herpicus.Module**  

---

#### Herpicus.DOM
**Herpicus.DOM.Create**  
**Herpicus.DOM.Parse**  

---

**Herpicus.Selector**
