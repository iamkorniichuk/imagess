# imagess

A lightweight library for **resizing** and **converting image formats** directly in the browser using the Canvas API.

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

Use `resize` function to resize **and** convert your images:

```ts
import { resize } from `imagess`;

const blob = await resize(file, {
    width: 400,
    height: 300,
    format: 'image/webp',
    quality: 0.8,
});
```

> Internally, `convert` uses `resize` function with the image's original width and height. Therefore, it's better to use `resize` if you need to resize and convert the image in one go.
