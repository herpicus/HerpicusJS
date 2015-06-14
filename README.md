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
**Herpicus.Safe(Callback)**  
Safely execute a function  
```
Herpicus.Safe(function() {
  someObject.thatDoesntExist();
});
// Calls Herpicus.ErrorHandler;
// Script continues
```

**Herpicus.Queue(Callback)**  
Adds function to a queue  
*Herpicus.Queue.Run()*  
Runs all functions stored in the queue, then the queue is erased  
```
Herpicus.Queue(function() {
  console.log("Hello World!");
});

Herpicus.Ready(function() {
  Herpicus.Queue.Run();
});
```

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
*Herpicus.Http.Get(URL, Callback)*  
*Herpicus.Http.Post(URL, Data (Object), Callback)*    
*Herpicus.Http.JSON(URL, Callback)*  
`Returns Callback response as JSON`

**Herpicus.Generate.String(Integer)**  
**Herpicus.Generate.Number(Length or range[startNumber, endNumber])**  
```
Herpicus.Generate.String(10); // Returns random string with 10 characters [a-zA-Z0-9]
Herpicus.Generate.Number(10); // Returns random number 10 digits long
Herpicus.Generate.Number(40, 50) // Returns a number inbetween 40 and 50 (45)
```

**Herpicus.Timers**  
**Herpicus.ClearTimer(Timer)**  
**Herpicus.Interval(Callback, Integer)**  
**Herpicus.Timeout(Callback, Integer)**  

**Herpicus.Events**  
*Herpicus.Events.Add(EventName, Callback, Target)*  
*Herpicus.Events.Remove(EventName, Target)*  
```
var btn = Herpicus.Selector('button#k00l');
Herpicus.Events.Add('click', function() {
  console.log("I HAVE BEEN CLICKED");
}, btn);
Herpicus.Events.Add('load', function() {
  alert('DOM Ready');
}, window);
Herpicus.Events.Remove('load', window);
```

**Herpicus.Require(Array, Callback)**  
*Herpicus.Require.Config(Object)*  

**Herpicus.Module(String, Callback)**  

---

#### Herpicus.DOM
**Herpicus.DOM.Create(TagName)**  
It will create an element with the supplied TagName and return it as a Herpicus.Element, TextNode, or Comment.   
To create a document comment, use *comment*  
Or to create a simple text node, use *text*  
```
Herpicus.DOM.Create('comment')
Herpicus.DOM.Create('text')
Herpicus.DOM.Create('div')
```
**Herpicus.DOM.Parse(DOMNode)**  
Parses DOM Nodes and Herpicus.Elements  
Once a Node has been parsed it will return the following methods base on the nodeType:  
* DOMElement | Herpicus.Element:
  * $Node => Original Node properties
  * nodeType => Integer
  * Class:
    * List => Returns classes as array
    * Contains(String|className) => Returns boolean if contains class name
    * Add(String|className) => Add a class name
    * Remove(String|className) => Remove a class name
    * RemoveAll(String|className) => Removes all classes
  * Scroll:
    * Top => Scrolls to the top
    * Bottom => Scrolls to the bottom
    * Set(Integer|Value) => Sets the distance on where it should scroll to
  * Attributes:
    * Add(String|Name, String|Value) => Adds an attribute
    * Remove(String|Name) => Removes an attribute
    * RemoveAll() => Removes all attributes
    * Contains(String|Name) => Checks if attribute exists (Boolean)
    * Get(String|Name) => Returns an attributes value (String|null)
    * List => Lists attributes (Array)
  * Id(String|Id) => Set the element Id
  * ParentNode => Returns the elements parentNode or null
  * Elements(Boolean|Recursive) => Returns all nodes in the element
  * InsertBefore(Node) => Inserts a new node before this node
  * InsertAfter(Node) => Inserts a new node after this node
  * Children(Boolean|Parse) => Returns children as DOM or Herpicus.Element in array
  * Nodes => nodes
  * Node(Integer|Index) => Returns specific node
  * isEmpty() => Checks if node is empty (Boolean)
  * Clear() => Clears the innerHTML
  * ClearAll() => Clears the innerHTML, all classes and attributes
  * Delete() => Deletes this node
  * Style()
  * CSS()
  * HTML(Argument) => Returns or sets the HTML; If Argument is True return outerHTML else innerHTML; else Set HTML;
  * Text(String|Text) => Sets the text/value of element
  * AppendTo(Node) => Append this to a node
  * Append(Node) => Append a node to this
  * MouseOver(Callback)
  * MouseLeave(Callback)
  * MouseEnter(Callback)
  * Hover(Callback)
  * Click(Callback)
  * FadeIn(Integer|Time, Callback)
  * FadeOut(Integer|Time, Callback)
  * KeyPress(KeyCode, Callback, Boolean|PreventDefault)
  * Focus()
  * Show()
  * Hide()
  * Toggle()
  * Visible => if element visible (boolean)
* Comment or TextNode
  * $Node
  * nodeType
  * Text(String) => Set the text/value of the comment or textNode
```
var a = Herpicus.DOM.Create('div');
var b = Herpicus.DOM.Parse(document.body);

a.Text('Hello World!').Click(function() {
  alert('CLICK!');
}).AppendTo(b);

console.log(b.HTML());
```
---

**Herpicus.Selector(String)**  
