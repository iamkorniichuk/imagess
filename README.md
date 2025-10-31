# imagess

A lightweight library for **manipulating** images directly in the browser using the Canvas API.

## Installation

Your package manager is **npm** - use this:
```bash
npm install imagess
```

Your package manager is **yarn** - use this:

```bash
yarn add imagess
```

## Usage


### Convert 

Use `convert` function to convert images to any type supported by user's browser:

```ts
import { convert } from `imagess`;

const input = document.querySelector('input[type="file"]');

input.addEventListener('change', async (e) => {
  const file = e.target.files[0];

  const blob = await convert(file, {
    format: 'image/webp',
    quality: 0.8,
  });
});
```

### Flip

Use `flip` function to flip your images horizontally or/and vertically:

```ts
import { flip } from `imagess`;

const blob = await flip(file, {
    horizontally: true,
    vertically: false,
});
```

### Rotate

Use `rotate` function to rotate your images:

```ts
import { rotate } from `imagess`;

const blob = await rotate(file, {
  angle: Math.PI / 2, // 90 degree
});
```

> Argument `angle` expects the angle in radians.

### Resize

Use `resize` function to resize your images:

```ts
import { resize } from `imagess`;

const blob = await resize(file, {
    width: 400,
    height: 300,
});
```

## Nesting

Nesting manipulations is possible but not efficient as the resulting blob would need to decode each time.

```ts
 // Calls `loadImage` internally
const blob = await convert(
   // Calls `loadImage` internally
  await flip(
     // Calls `loadImage` internally
    await rotate(
       // Calls `loadImage` internally
      await resize(
        file, { width: 300, height: 400 }
      ),
      { angle: Math.PI },
    ),
    { horizontally: true, vertically: false },
  ), 
  { format: 'image/png' },
);
```

Better solutions to use `manipulate` - a master function that all above functions use under-the-hood. The optimized code would look like this:

```ts
const blob = await manipulate(file,
  {
    // Resize's options
    width: 300,
    height: 400,
    // Rotate's option
    rotateAngle: Math.PI,
    // Flip's options
    flipHorizontally: true,
    flipVertically: false,
    // Convert's option
    format: 'image/png',
  }
);
```
