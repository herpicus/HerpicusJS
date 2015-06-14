# HerpicusJS
Herpicus Javascript Library

#### Type Functions
**Herpicus.TypeOf()**   
Return a *string* type for any operand
```
Herpicus.TypeOf({}) //object
Herpicus.TypeOf(document.createElement('div')) //htmldivelement
```
* Herpicus.isObject()  
* Herpicus.isArray()  
* Herpicus.isFunction()  
* Herpicus.isString()  
* Herpicus.isInteger()  
* Herpicus.isBoolean()  
* Herpicus.isDefined()  
* Herpicus.isUndefined()  
* Herpicus.isElement()  
* Herpicus.isTextNode()  
* Herpicus.isNodeList()  
* Herpicus.isIterable()  
Returns a *Boolean* if the operand is x 

----

**Herpicus.Extend(Source, Target)**  
Extends an *object*  
`var obj = Herpicus.Extend(obj, obj2)`

**Herpicus.Merge(Object, Object)**  
Merges two *objects*  
`var obj = Herpicus.Merge({Hello: "World"}, {Top: "Kek"});`  

**Herpicus.ForEach(arr, callback[index, value])**  
Iterates through an *Array* or *Object*  
```
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

**Herpicus.Contains(arr, args)**  
Checks if an *Array*, *Object* or *String* contains x and returns boolean  

**Herpicus.Insert(target, index, value)**  
Inserts a value into an *Array* starting from a specific index  
```
var arr = ["Apple", "Banana", "Github", "Herpicus"];
arr = Herpicus.Insert(arr, 2, "k00l") // arr => ["Apple", "Banana", "k00l", "Github", "Herpicus"]
```   

**Herpicus.Trim(String)**  
*IE6+ Compatible*  
Removes whitespaces and unnecessary spaces from a string   

**Herpicus.IndexOf(arr, arg, index)**  
*IE6+ Compatible*  

**Herpicus.LastIndexOf(arr, arg)**  
*IE6+ Compatible*  

**Herpicus.Printf(String, Arguments)**  
String Formatter (Python string.Format)  
`Herpicus.Printf("Hello {0}", "World") // returns Hello World`  

**Herpicus.Sprintf(String, Arguments)**  
String Formatter  
`Herpicus.Sprintf("%s, what does the %s say about his power level? It's over %d!!", "Vegeta", "scouter", 9000)`  
`returns Vegeta, what does the scouter say about his power level? It's over 9000!!`  

**Herpicus.ErrorHandler(Error|String)**  
**Herpicus.Defer**  
**Herpicus.Safe(Callback)**  
**Herpicus.Queue(Callback)**  
Stores and calls all queued Callbacks  
**Herpicus.Function(Function)**  
Parses functions  

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
**Herpicus.ClearTimer(Timer)**  
**Herpicus.Interval(Callback, Integer)**  
**Herpicus.Timeout(Callback, Integer)**  

**Herpicus.Events**  
*Herpicus.Events.Add(EventName, Callback, Target)*  
*Herpicus.Events.Remove(EventName, Target)*  

**Herpicus.Require(Array, Callback)**  
*Herpicus.Require.Config(Object)*  

**Herpicus.Module(String, Callback)**  

---

#### Herpicus.DOM
**Herpicus.DOM.Create(String)**  
**Herpicus.DOM.Parse(DOMElement)**  

---

**Herpicus.Selector(String)**  
