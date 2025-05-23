# partikle

A zero-dependency library for rendering floating particles

# Example usage

Browser (UMD/IIFE):

```html
<script src="https://unpkg.com/partikle@latest/dist/index.iife.js"></script>
<div class="particle-canvas-wrapper" style="width: 100%; height: 100vh; position: relative; overflow: hidden;">
  <div class="particle-canvas"></div>
</div>
<script>
partikle({
  nodeId: 'particle-canvas',
  particleColor: '#fefefe',
  particlesAmount: 400
});
</script>
```

ES modules:

```js
import { partikle } from 'partikle';

partikle({
  nodeId: 'particle-canvas',
  particleColor: '#fefefe',
  particlesAmount: 400
});
```

CommonJS:

```js
const { partikle } = require('partikle');

partikle({
  nodeId: 'particle-canvas',
  particleColor: '#fefefe',
  particlesAmount: 400
});
```

# Prerequisites

It is suggested that wrapper element that will contain the node with particles have following styling properties:

```css
{
  position: relative;
  overflow: hidden;
}
```

# Showcase

Feel free to add your website here:

- [lukaszkups.net](https://lukaszkups.net)

Author: [@lukaszkups](https://github.com/lukaszkups)

License: [MIT](https://github.com/lukaszkups/partikle/blob/main/LICENSE)
