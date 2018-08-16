# tfjs-vis

__tfjs-vis__ is a small library for _in browser_ visualization intended for use
with TensorFlow.js.

It's main features are:

* A set of visualizations useful for visualizing model behaviour
* A set of high level functions for visualizing objects specific to TensorFlow.js
* A way to organize visualizations of model behaviour that won't interfere with your web application

The library also aims to be flexible and make it easy for you to incorporate
custom visualizations using tools of your choosing, such as d3, Chart.js or plotly.js.

## Installation

Eventually you will be able to install this library via npm. But for now
you should build the library and copy `dist/tfjs-vis.umd.js` to your project
and import it as a standard UMD bundle. The global name exposed is `tfvis`.

## Building from source

To build the library, you need to have node.js installed. We use `yarn`
instead of `npm` but you can use either.

First install dependencies with

```
yarn
```

or

```
npm install
```

Then do a build with

```
yarn build
```

or

```
npm run build
```

This should produce a `tfjs-vis.umd.js` file in the `dist` folder that you can
use.

## Sample Usage

```js
const data = [
  { index: 0, value: 50 },
  { index: 1, value: 100 },
  { index: 2, value: 150 },
];

// Get a surface
const surface = tfvis.visor().surface({ name: 'Barchart', tab: 'Charts' });

// Render a barchart on that surface
tfvis.render.barchart(data, surface, {});
```

This should show something like the following

![visor screenshot with barchart](./docs/visor-usage.png)

## API

## Visors, Surfaces and Tabs

### visor() => Visor

Returns a singleton object with the public API of the visor. This will create
the necessary DOM elements for the visor on initialization.

Initially calling visor() will create a panel that is displayed on the right. It hovers over your pages content and shouldn't disturb the flow of your page's DOM Elements. It has some display controls and by default also supports the following keyboard shortcuts:

 * __`__ (backtick): Shows or hides the visor
 * __~__ (tilde, shift+backtick): Toggles betweeen full width and smaller width view of the visor.

The returned object has the following properties, documented here with the
prefix `visor()` and annotated with type information. You can call visor() as much as you want or store a reference
to the returned object.

#### visor().el: HTMLElement

The containing `HTMLElement` for the whole visor.

#### visor().surface(options: SurfaceInfo) => Surface;

Returns a `Surface`, creating one if necessary. This is the primary container
of visualizations. Surfaces are organized onto `Tabs`.

`options` has the following structure.

```ts
{
  //The name / label of this surface
  name: string,
  // The name of the tab this surface should appear on (optional)
  tab?: string,
  // Display Styles for the surface (optional)
  styles?: StyleOptions,
}
```

StyleOptions has the following structure. All properties are optional
and generally represent css styles that will be added to the `Surface`. As these are css properties, they can be in any valid css unit e.g. `%` or `px`.

```ts
{
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
}
```

#### visor().isOpen() => boolean;

Returns true if the visor is currently open/visible.

#### visor().isFullscreen() => boolean;

Returns true if the visor is in fullscreen mode. Note that the visor may be in a closed state even if it is in fullscreen mode.

#### visor().open() => void;

Opens the visor.

#### visor().close() => void;

Closes the visor.

#### visor().toggle() => void;

Toggles the visor open and closed.

#### visor().toggleFullScreen() => void;

Toggles the fullscreen mode of the visor.

### Surface

A surface is the object returned by a call to visor().surface(...). It returns
an object with no methods and the following properties:

```ts
{
  //The containing HTML element for this surface
  container: HTMLElement;
  // A textual label for the surface.
  label: HTMLElement;
  // A container for plots and other renderings
  drawArea: HTMLElement;
}
```

Generally speaking you would only access `.drawArea` to add plots and other renders.


## Renderers

The library exposes a `render` namespace that provides a number of functions that plot particular visualizations.

## render.barchart: (data: [], container: Surface|HTMLElement, opts: {}) => Promise<void>

Renders a barchart.

* @param data — Data in the following format, (an array of objects)
              `[ {index: number, value: number} ... ]`
* @param container — A `Surface` or `HTMLElement` in which to draw the barchart. Note thatthis chart expects to have complete control over the contents of the container and can clear its contents at will.
* @param opts - optional parameters
* @param opts.width — width of chart in px
* @param opts.height — height of chart in px
* @param opts.xLabel — label for x-axis, set to null to hide the
* @param opts.yLabel — label for y-axis, set to null to hide the
* @returns Promise - indicates completion of rendering
