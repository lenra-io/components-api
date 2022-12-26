# components-api

The component API project. The API is described with JSON Schema files.

## Normalization of the API

### General JSON format
The API follow the camelCase convention for keys and enum-styled values of the json object.

```json
{
    "type": "flex",
    "direction": "horizontal",
    "mainAxisAlignment": "spaceAround",
    "children": []
}
```

### The `value` key :

The `value` key describe the user-given main value of the component.
Typically the boolean of a radio/checkbox, the text of a text input, the text of a "text" component...
This value is typically replaced by a variable in the end-user code.

```json
{
    "type": "checkbox",
    "value": true,
    [...]
}
```

### The `label` key : 
The `label` key must describe a text that is displayed next to the component.

```json
{
    "type": "checkbox",
    [...]
    "label": "My Checkbox"
}
```

### The `text` key : 
The `text` key must describe a text that is displayed inside the component.

```json
{
    "type": "button",
    [...]
    "text": "My Button"
}
```



### The listeners

All the listeners must start with `on` and be passed `onPressed`, `onChanged`...
All listeners MUST have the `action` property and MAY have the `props` object property.

#### The `onPressed` listener

This listener is used to react on a click/press on a component. 
Do NOT use the `onClick` or `onTap` key.

```json
{
    "type": "checkbox",
    [...]
    "listeners": {
        "onPressed": {
            "action": "toggleCheckbox"
        },
    }
}
```

#### The `onChanged` listener
This listener is used to react on a value changed by the user.
This listener is never called when the value is changed programatically.

```json
{
    "type": "textfield",
    "listeners": {
        "onChanged": {
            "action": "myAction",
        }
    }
}
```

> **_NOTE:_** When the value is changed by a click/tap, the `onPressed` is probably the best choice.
