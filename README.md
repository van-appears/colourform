# colourform
Enter three formulas and press the 'Run' button to generate an image.

# formulas
When creating a formula there are three supplies values you can use:  `x`, `y` and `pi2` (= Math.PI * 2).
Note that `x` and `y` are not absolute positions, they are scaled values from zero to one.
So, for example, setting a formula to `Math.sin(x * pi2)` when run would give a sinusuoidal shape from left to right.
Each formula is parsed using plain javascript.

# control
Each attribute expects a different value range
For HSV
* Hue: 0 - 360
* Saturation: 0 - 100
* Value: 0 - 100

For RGB
* Red: 0 - 255
* Green: 0 - 255
* Blue: 0 - 255

Under each text area there are a set of controls for scaling and limiting the output of the formula entered to match the needed range.
* Min Max - calculate the minimum and maximum for the formula, then scale the values to match the range
* Scale Off - no scaling performed, just use the output from the formula
* 0 to 1 - assume the formula generates a value from zero to 1 and scale appropriately
* -1 to +1 - assume the formula generates a value from -1 to +1 and scale appropriately (useful if you are using sine or cosine to generate your values)

For the latter three options limit functions can then be applied. If for example a `Scale Off` formula generates 361 for Hue, then...
* Limit - stop at the minimum or maximum, so 360 would be limited to 360
* Wrap - when passing the maximum return to the minimum plus the remainder, or when passing the minimum return to the maximum minus the remainder. In this case 361 would become 1.
* Reflect - change direction at the minimum or maximum and continue with the remainder. In this case 361 would become 359.

# development
To run development mode
```
npm start
```
To create a production build
```
export NODE_ENV=production
npm run build
```

TODO - show formular error message
TODO - finish documentation
TODO - worker for generation?
TODO - handle when mix=max and no scale
TODO - add formula shuffle

