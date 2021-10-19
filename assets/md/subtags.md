## Table of Contents

- [Terminology](#terminology)
  - [BBTag](#bbtag)
  - [Subtag](#subtag)
  - [Tag](#tag)
  - [Argument](#argument)
  - [Variable](#variable)
  - [Array](#array)
- [Subtags](#subtags)
  - [Subtag Arguments](#subtag-arguments)
    - [Required Arguments <>](#required-arguments)
    - [Optional Arguments []](#optional-arguments)
    - [Multiple Arguments ...](#multiple-arguments)
    - [Nested Arguments <<> <>>](#nested-arguments)
  - [Nested Subtags](#nested-subtags)
  - [Dynamic Subtags](#dynamic-subtags)
- [Variables](#variables)
  - [Local Variables](#local-variables)
  - [Temporary Variables](#temporary-variables)
  - [Server Variables](#server-variables)
  - [Author Variables](#author-variables)
  - [Global Variables](#global-variables)

## Terminology

There are various terms used in BBTag that might not be intuitive, so here is a list of definitions for some of the most important ones:

### BBTag

BBTag is a text replacement language. Any text between a `{` and `}` pair (called a subtag)
will be taken as code and run, with the output of that replacing the whole subtag.
Each subtag does something different, and each accepts its own list of arguments.

### Subtag

A subtag is a pre-defined function that accepts some arguments and returns a single output.
Subtags can be called by placing their name between a pair of `{` and `}`,
with any arguments to be passed to the subtag being separated by `;`.

As an example:
```
{math;+;1;2}
```

Subtag: `math`  
Arguments: `+`, `1`, `2`  
Result: `3`

### Tag

A tag is a user-made block of text which may or may not contain subtags. 
Any subtags that it does contain will be executed and be replaced by their output.

### Argument

An argument is a single value which gets given to a subtag. Arguments can be numbers, text, arrays, anything you can type really.
Each subtag will require a different argument pattern, so be sure to check what pattern your subtag needs!

### Variable

A variable is a value that is stored in the bots memory ready to access it later on.
For more in-depth details about variables, please see [variables](#variables).

### Array 

An array is a collection of values all grouped together, commonly done so by enclosing them inside `[]`.
In BBTag, arrays can be assigned to a variable to store them for later use. In this situation, you might 
see an array displayed like this `{"v":["1","2","3"],"n":"varname"}`. If you do, dont worry, nothing is broken!
That is just there to allow BBTag to modify the array in place within certain subtags.

## Subtags 

Subtags are the core of how BBTag functions. They're defined by surrounding a chunk of text with { and } characters.
Each subtag is essentially a function. After running the subtag, it will be replaced by the result. For example,

```
Your name is {username}.
```

In this example, we're running the subtag called `username`. When used like this, `{username}`
will return the username of the user who is running the code. For example, if a user named "stupid cat"
were to execute this code, they would get the response:

```
Your name is stupid cat.
```

### Subtag Arguments 

As you may have noticed, the various help documentation for subtags will have a usage that often look like this:

```
{subtag;<arg1>;[arg2];<arg3...>}
```

This way of formatting arguments is designed to easily be able to tell you what is and is not required.
All arguments are separated by `;`'s and each will be displayed in a way
that tells you what kind of argument it is.

The basic rules are as follows:

#### Required Arguments `<> `

Required arguments must be supplied for a subtag to work. If they are not then you will normally be given a `Not enough args` error.

```
<arg>
```

#### Optional Arguments `[]`

Optional arguments may or may not be provided. If supplied, optional arguments may either change
the functionality of the tag (e.g. [shuffle](/bbtag/subtags#shuffle)) or simply replace a default value
(e.g. [username](/bbtag/subtags#username)).

```
[arg]
```

#### Multiple arguments `...`

Some arguments can accept multiple values, meaning you are able to list additional values, still separated by `;`, which will be included in the execution (e.g. [randchoose](/bbtag/subtags#randchoose)). 

```
<arg...>
```

#### Nested Arguments `<<> <>>`

Some subtags may have special rules for how their arguments are grouped (e.g. [switch](/bbtag/subtags#switch)) 
and will use nested arguments to show that grouping. When actually calling the subtag,
you provide the arguments as normal, however you must obey the grouping rules.

In the example of `switch`, you may optionally supply `<case>` and `<then>` as many times as you like,
but they must always be in pairs. e.g. `{switch;value;case1;then1}` or `{switch;value;case1;then1;case2;then2}`.

### Nested Subtags 

You can run subtags from within other subtags! Subtags get run in the order that they appear (from left to right, top to bottom).
When run, the subtag will attempt to determine the arguments provided to them. If these arguments contain more subtags, it'll run *those* subtags as well before continuing. For example, a simple command to flip a coin might look like this:

```
{if;{randint;0;1};==;1;{username} flipped heads!;Tails was flipped...}

{increment;coins} coins have been flipped.
```

When run, this might be the flow that gets executed:
1. The command sees the [if](/bbtag/subtags#if) subtag, and runs it.
    1. The first argument contains a [randint](/bbtag/subtags#randint) subtag. Before it can continue, it has to run this subtag. 
        1. randint gets run, and returns 1.
    1. The second argument is `==`, so the subtag knows it has to compare the first argument to the third
    1. The third argument is `1`. Since this matches the first argument, the test case succeeds, and the fourth argument gets run.
    1. The fourth argument gets run.
        1. The argument contains a [username](/bbtage/subtags#username). This subtag gets run, and returns the value "stupid cat".
        1. The argument continues with " flipped heads!". This gets concatenated to the first value.
    1. The fifth argument does not get run.
1. The `if` subtag returns the value "stupid cat flipped heads!"
1. Continuing on, the command sees the [increment](/bbtag/subtags#increment) subtag, and runs it
    1. The first argument contains the value "coins" - this corresponds to a variable name.
    1. The variable named "coins" already had the value 10, so it gets set to 11.
1. The `increment` subtag returns the value "11".
1. Continuing on, the command sees the text "coins have been flipped.", and concatenates this to the previous values.

The final output in this situation would be:
```
stupid cat flipped heads!

11 coins have been flipped.
```

### Dynamic Subtags 

In bbtag, even the names of subtags can be dynamic. This can be achieved simply by placing subtags before the
first `;` of a subtag. For example,

```
{user{get;~action}}
```

If `~action` is set to `name`,
then this will run the `username` subtag.
If it is set to `avatar` then it will run the `useravatar` subtag, and so on.

## Variables 

In BBTag there are several different scopes that can be used for storing your data.
These scopes are determined by the first character of your variable name, so choose carefully!

The available scopes are as follows:

### Local Variables 

Local variables are the default variable type, only usable if your variable name doesnt start with one of the other prefixes.
These variables are only accessible by the tag that created them, meaning there is no possibility to share the values with any other tag.

These are useful if you are intending to create a single tag which is usable anywhere, as the variables are not confined to a single server, just a single tag.

### Temporary Variables 

Temporary variables are never stored to the database, meaning they are by far the fastest variable type.

If you are working with data which you only need to store for later use within the same tag call, then you should use temporary variables over any other type.

### Server Variables 

Server variables (also referred to as Guild variables) are commonly used if you wish to store data on a per server level.
They are however stored in 2 separate 'pools', one for tags and one for custom commands,
meaning they cannot be used to pass data between the two.

This makes them very useful for communicating data between tags that are intended to be used within 1 server at a time.

### Author Variables 

Author variables are stored against the author of the tag, meaning that only tags made by you can access or edit your author variables.

These are very useful when you have a set of tags that are designed to be used by people between servers, effectively allowing servers to communicate with each other.

### Global Variables 

Global variables are completely public, anyone can read **OR EDIT** your global variables.

These are very useful if you like pain.
