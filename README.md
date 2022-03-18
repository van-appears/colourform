# colourform
Enter three formulas and press the 'Run' button to generate an image.

# formulas
In each textarea write a formula that when run will return a numeric value, that will be used as the value for a colour attribute. Each formula is parsed using plain javascript, so you can use the [Math](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math) library.

When creating a formula there are three supplied values you can use:  `x`, `y` and `pi2` (= Math.PI * 2).
Note that `x` and `y` are not absolute positions, they are scaled values from zero to one.
So, for example, setting a formula to `Math.sin(x * pi2)` when run would give a sinusuoidal shape from left to right.

Note that the text area expects a single-line formula only, not a code block, so you can't define variables. Any 'logic' can be implemented using ternaries. So, instead of
```
if (x > y) {
  return Math.sin(x * pi2 * 9)
} else {
  return Math.sin(y * pi2 * 11)
}
```
just use
```
x > y ? Math.sin(x * pi2 * 9) : Math.sin(y * pi2 * 11)
```

NOTE: As this runs any javascript entered into those boxes, never run code you don't trust.

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
* Min Max - this is effectively auto-scaling. Calculate the minimum and maximum for the formula, then scale the values to match that range. Note that if you provide a constant for a formula, then `0` will be scaled to zero and _any_ non-zero will be scaled to the maximum.
* Scale Off - no scaling performed, just use the output from the formula
* 0 to 1 - assume the formula generates a value from zero to 1 and scale appropriately
* -1 to +1 - assume the formula generates a value from -1 to +1 and scale appropriately (useful if you are using sine or cosine to generate your values)

For the latter three options limit functions can then be applied. If for example a `Scale Off` formula generates 361 for Hue, then...
* Limit - stop at the minimum or maximum, so 360 would be limited to 360
* Wrap - when passing the maximum return to the minimum plus the remainder, or when passing the minimum return to the maximum minus the remainder. In this case 361 would become 1.
* Reflect - change direction at the minimum or maximum and continue with the remainder. In this case 361 would become 359.

There are two image sizes, small (512 x 512) and big (1400 x 1400). As `x` and `y` in the formulas runs from 0 to 1 the generated image should be mostly the same, just different resolutions. Also, the smaller image will render a lot quicker.

The shuffle button mixes the formulas, but does not adjust any of the other options.

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

Potential future change - use a worker for generation?
