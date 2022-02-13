import { knot } from './knot';

export function bricks(...arg: any) {
  var options =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // privates

  var persist: any = void 0; // packing new elements, or all elements?
  var ticking: any = void 0; // for debounced resize

  var sizeIndex: any = void 0;
  var sizeDetail: any = void 0;

  var columnTarget: any = void 0;
  var columnHeights: any = void 0;

  var nodeTop: any = void 0;
  var nodeLeft: any = void 0;
  var nodeWidth: any = void 0;
  var nodeHeight: any = void 0;

  var nodes: any = void 0;
  var nodesWidths: any = void 0;
  var nodesHeights: any = void 0;

  // resolve options

  var packed =
    options.packed.indexOf('data-') === 0
      ? options.packed
      : 'data-' + options.packed;
  var sizes = options.sizes.slice().reverse();
  var position = options.position !== false;

  var container = options.container.nodeType
    ? options.container
    : document.querySelector(options.container);

  var selectors = {
    all: function all() {
      return toArray(container.children);
    },
    new: function _new() {
      return toArray(container.children).filter(function (node) {
        return !node.hasAttribute('' + packed);
      });
    },
  };

  // series

  var setup = [setSizeIndex, setSizeDetail, setColumns];

  var run = [setNodes, setNodesDimensions, setNodesStyles, setContainerStyles];

  // instance

  var instance = knot({
    pack: pack,
    update: update,
    resize: resize,
  });

  return instance;

  // general helpers

  function runSeries(functions: any[]) {
    functions.forEach(function (func) {
      return func();
    });
  }

  // array helpers

  function toArray(input: any) {
    var scope =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : document;

    return Array.prototype.slice.call(input);
  }

  function fillArray(length: number) {
    return Array.apply(null, Array(length)).map(function () {
      return 0;
    });
  }

  // size helpers

  function getSizeIndex() {
    // find index of widest matching media query
    return sizes
      .map(function (size: any) {
        return (
          size.mq && window.matchMedia('(min-width: ' + size.mq + ')').matches
        );
      })
      .indexOf(true);
  }

  function setSizeIndex() {
    sizeIndex = getSizeIndex();
  }

  function setSizeDetail() {
    // if no media queries matched, use the base case
    sizeDetail = sizeIndex === -1 ? sizes[sizes.length - 1] : sizes[sizeIndex];
  }

  // column helpers

  function setColumns() {
    columnHeights = fillArray(sizeDetail.columns);
  }

  // node helpers

  function setNodes() {
    nodes = selectors[persist ? 'new' : 'all']();
  }

  function setNodesDimensions() {
    // exit if empty container
    if (nodes.length === 0) {
      return;
    }

    nodesWidths = nodes.map(function (element: any) {
      return element.clientWidth;
    });
    nodesHeights = nodes.map(function (element: any) {
      return element.clientHeight;
    });
  }

  function setNodesStyles() {
    nodes.forEach(function (element: any, index: number) {
      columnTarget = columnHeights.indexOf(Math.min.apply(Math, columnHeights));

      element.style.position = 'absolute';

      nodeTop = columnHeights[columnTarget] + 'px';
      nodeLeft =
        columnTarget * nodesWidths[index] +
        columnTarget * sizeDetail.gutter +
        'px';

      // support positioned elements (default) or transformed elements
      if (position) {
        element.style.top = nodeTop;
        element.style.left = nodeLeft;
      } else {
        element.style.transform =
          'translate3d(' + nodeLeft + ', ' + nodeTop + ', 0)';
      }

      element.setAttribute(packed, '');

      // ignore nodes with no width and/or height
      nodeWidth = nodesWidths[index];
      nodeHeight = nodesHeights[index];

      if (nodeWidth && nodeHeight) {
        columnHeights[columnTarget] += nodeHeight + sizeDetail.gutter;
      }
    });
  }

  // container helpers

  function setContainerStyles() {
    container.style.position = 'relative';
    container.style.width =
      sizeDetail.columns * nodeWidth +
      (sizeDetail.columns - 1) * sizeDetail.gutter +
      'px';
    container.style.height =
      Math.max.apply(Math, columnHeights) - sizeDetail.gutter + 'px';
  }

  // resize helpers

  function resizeFrame() {
    if (!ticking) {
      window.requestAnimationFrame(resizeHandler);
      ticking = true;
    }
  }

  function resizeHandler() {
    if (sizeIndex !== getSizeIndex()) {
      pack();
      instance.emit('resize', sizeDetail);
    }

    ticking = false;
  }

  // API

  function pack() {
    persist = false;
    runSeries(setup.concat(run));

    return instance.emit('pack');
  }

  function update() {
    persist = true;
    runSeries(run);

    return instance.emit('update');
  }

  function resize() {
    if (typeof window !== 'object') return;
    var flag =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    var action = flag ? 'addEventListener' : 'removeEventListener';

    (window as any)[action]('resize', resizeFrame);

    return instance;
  }
}
