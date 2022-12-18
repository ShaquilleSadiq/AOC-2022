(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.day18 = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){

const path = require("path");

const max = {x: 0, y: 0, z: 0};
let points = [];
let lava_voxels = [];
let space = [];
let water_voxels = [];
let surface_area = 0;

const init = () => {
    points = readFile();
    lava_voxels.length = 0;
    space.length = 0;
    water_voxels.length = 0;

    for (let point of points) {
        const [x, y, z] = point.split(",");
        space[x] = space[x] || [];
        space[x][y] = space[x][y] || [];
        space[x][y][z] = true;

        max.x = Math.max(...[x, max.x]);
        max.y = Math.max(...[y, max.y]);
        max.z = Math.max(...[z, max.z]);

        lava_voxels.push([x, y, z]);
    }
}

const p1 = () => {
    checkAllSides(lava_voxels);
    console.log("P1: " + surface_area);

    return surface_area;
};

const p2 = () => {
    fillWater(lava_voxels);
    fillLava();
    checkAllSides(lava_voxels);
    console.log("P2: " + surface_area);

    return surface_area;
};

const fillLava = () => {
    for (let i = 0; i < space.length; i++) {
        for (let j = 0; j < space[i]?.length; j++) {
            for (let k = 0; k < space[i][j]?.length; k++) {
                if (!space[i][j][k] && !pointInArr(water_voxels, [i,j,k])) space[i][j][k] = true;
            }
        }
    }
};

const fillWater = (points) => {
    const start_voxel = [0,0,0];
    const q = [];

    q.push(start_voxel);

    while(q.length > 0){
        const voxel = q.shift();

        if(pointInArr(water_voxels, voxel)) continue;
        water_voxels.push(voxel);

        for(let neighbour of neighbours(voxel)){
            if(!neighbour) continue;
            const [nx, ny, nz] = neighbour;

            if(nx >= 0 && nx <= max.x && ny >= 0 && ny <= max.y && nz >= 0 && nz <= max.z){
                if (!pointInArr(points, neighbour)) {
                    q.push(neighbour);
                }
            }
        }
    }
}

const pointInArr = (array, voxel) => array.some(r=> JSON.stringify(r.map((num) => parseInt(num))) === JSON.stringify(voxel))

const neighbours = (voxel) => {
    const [x, y, z] = voxel;
    
    return [
        x > 0 ? [x - 1, y, z] : null,
        [x + 1, y, z],
        y > 0 ? [x, y - 1, z] : null,
        [x, y + 1, z],
        z > 0 ? [x, y, z - 1] : null,
        [x, y, z + 1],
    ]
};

const checkAllSides = (points) => {
    surface_area = 0;

    for (let point of points) {
        const [x, y, z] = point.map((num) => parseInt(num));

        checkX([x, y, z]);
        checkY([x, y, z]);
        checkZ([x, y, z]);
    }
};

const check = (voxel, ignore_area = false) => {
    const [x, y, z] = voxel;

    if (!(space[x] && space[x][y] && space[x][y][z])) {
        ignore_area || surface_area++;
        return 0;
    }

    return 1;
};

const checkX = (voxel, ignore_area = false) => {
    const [x, y, z] = voxel;
    
    let contact_area = 0;
    contact_area += check([x + 1, y, z], ignore_area);
    contact_area += check([x - 1, y, z], ignore_area);
    return contact_area;
};

const checkY = (voxel, ignore_area = false) => {
    const [x, y, z] = voxel;
    
    let contact_area = 0;
    contact_area += check([x, y + 1, z], ignore_area);
    contact_area += check([x, y - 1, z], ignore_area);
    return contact_area;
};

const checkZ = (voxel, ignore_area = false) => {
    const [x, y, z] = voxel;

    let contact_area = 0;
    contact_area += check([x, y, z + 1], ignore_area);
    contact_area += check([x, y, z - 1], ignore_area);
    return contact_area;
};

const readFile = () => "10,17,7\n8,14,15\n15,5,5\n17,7,13\n6,6,15\n9,1,11\n15,11,16\n11,5,3\n1,9,9\n8,1,9\n17,6,11\n13,3,12\n8,17,11\n3,7,12\n4,12,9\n4,13,11\n8,9,3\n7,13,15\n9,16,14\n16,6,12\n6,16,7\n17,11,7\n5,15,11\n5,4,13\n13,9,2\n16,12,11\n6,14,10\n2,8,13\n12,11,4\n9,1,10\n3,8,9\n3,14,13\n7,15,5\n6,10,16\n8,13,17\n10,17,8\n8,4,11\n5,14,9\n11,9,3\n2,7,10\n14,9,5\n6,6,14\n14,7,16\n15,3,7\n11,11,17\n16,12,14\n9,12,4\n3,16,10\n6,4,10\n4,4,15\n5,3,11\n6,15,6\n10,16,5\n10,11,1\n16,6,13\n14,3,11\n10,12,2\n14,14,10\n12,16,7\n15,14,13\n15,9,4\n2,10,7\n8,18,10\n4,3,9\n16,6,6\n1,8,10\n5,9,14\n5,9,16\n6,7,16\n4,14,12\n17,11,10\n3,10,6\n12,4,4\n5,12,15\n9,10,1\n14,15,4\n13,3,8\n12,6,4\n16,13,7\n7,16,7\n9,10,16\n17,5,6\n5,3,10\n2,12,14\n6,3,14\n8,3,15\n6,17,12\n13,3,5\n12,4,14\n7,10,18\n15,4,10\n3,11,5\n8,4,17\n10,9,4\n3,9,14\n9,4,2\n14,17,8\n17,10,12\n4,4,4\n2,7,7\n8,13,16\n11,14,6\n9,4,15\n3,5,13\n4,10,12\n8,6,3\n1,11,13\n14,14,4\n12,3,11\n6,3,4\n13,3,6\n11,15,10\n8,1,7\n11,7,2\n8,5,3\n4,15,10\n7,3,8\n17,10,6\n7,14,5\n12,17,8\n15,12,9\n1,7,10\n17,15,9\n7,10,17\n10,7,15\n8,11,17\n8,15,3\n8,15,14\n7,12,5\n4,8,14\n4,14,6\n15,7,4\n1,10,11\n10,5,5\n7,14,14\n2,7,9\n4,8,3\n7,2,8\n8,6,4\n4,16,12\n17,8,12\n9,7,16\n12,14,4\n4,4,9\n11,10,18\n9,8,2\n5,13,15\n8,5,15\n3,7,15\n3,11,4\n6,4,15\n9,6,3\n11,7,16\n11,18,6\n10,3,5\n17,9,10\n6,8,17\n14,5,6\n12,13,16\n12,3,12\n4,5,6\n15,14,8\n16,8,4\n16,9,6\n10,1,11\n9,10,17\n3,13,8\n12,13,2\n11,3,7\n12,1,8\n10,12,15\n4,6,7\n10,12,17\n15,8,13\n13,16,6\n14,8,4\n16,9,12\n14,5,13\n17,10,10\n2,9,6\n11,9,2\n9,2,7\n16,7,6\n12,15,6\n12,5,12\n11,5,15\n8,8,1\n16,7,13\n15,16,11\n6,3,9\n14,10,16\n7,3,4\n9,3,7\n13,12,2\n9,16,13\n11,8,2\n4,11,15\n14,14,14\n8,12,2\n10,16,13\n8,6,15\n4,8,4\n11,3,4\n16,13,8\n9,2,10\n11,12,3\n4,15,12\n9,18,10\n6,3,10\n7,4,5\n12,3,8\n16,11,14\n4,9,14\n3,5,12\n17,6,6\n1,12,9\n3,7,13\n8,16,8\n12,2,12\n5,6,6\n13,14,3\n12,3,13\n12,13,3\n3,5,9\n16,5,12\n8,15,15\n14,13,14\n9,15,7\n17,12,8\n5,11,3\n10,14,16\n10,15,14\n5,12,5\n12,16,12\n8,2,9\n8,12,3\n7,13,4\n16,6,5\n16,7,12\n9,17,9\n10,2,14\n16,5,10\n5,16,14\n5,5,7\n10,2,12\n5,16,11\n12,13,4\n7,17,10\n4,14,5\n10,1,10\n5,13,6\n16,8,10\n8,16,12\n2,10,8\n15,5,12\n5,15,13\n3,12,12\n17,8,8\n7,9,3\n14,14,11\n12,12,18\n15,6,13\n8,7,2\n2,8,11\n14,11,2\n3,13,7\n15,7,15\n5,7,4\n13,13,3\n15,8,16\n16,12,5\n6,7,4\n2,10,6\n3,6,11\n3,11,15\n3,11,16\n12,17,12\n9,4,5\n4,7,4\n5,16,8\n5,10,13\n12,15,3\n8,4,14\n17,10,5\n6,14,4\n13,10,16\n3,5,7\n6,3,8\n13,3,7\n14,10,17\n7,2,11\n4,4,7\n3,12,7\n9,9,2\n17,6,13\n16,12,9\n10,8,16\n16,8,7\n11,7,17\n6,4,13\n9,1,8\n13,15,5\n4,15,8\n11,3,3\n12,12,3\n14,6,4\n16,13,11\n12,17,9\n7,16,6\n7,7,16\n10,7,2\n14,13,6\n14,3,6\n10,3,4\n12,11,17\n16,13,14\n7,13,5\n3,10,15\n8,15,16\n6,16,12\n4,10,4\n13,14,15\n5,14,6\n4,5,14\n13,6,17\n3,14,11\n13,10,3\n12,14,15\n15,6,12\n12,14,6\n3,14,6\n9,14,15\n2,9,8\n4,12,5\n14,8,3\n12,18,9\n8,7,18\n2,13,9\n3,7,10\n5,8,3\n14,12,17\n10,3,6\n13,4,7\n17,13,11\n12,7,16\n12,11,18\n2,13,10\n13,15,10\n9,11,17\n8,13,2\n9,17,4\n8,10,16\n7,14,16\n16,7,7\n6,16,8\n9,17,13\n16,6,11\n11,12,16\n2,6,8\n4,8,7\n15,8,3\n5,4,6\n1,11,8\n7,9,17\n7,17,12\n14,5,5\n7,17,7\n8,14,3\n7,16,9\n16,8,9\n9,1,12\n18,11,7\n9,18,12\n9,17,8\n6,14,15\n3,8,5\n16,7,15\n4,9,4\n13,17,8\n5,5,5\n15,17,9\n12,7,3\n7,2,12\n14,13,15\n8,7,3\n11,8,16\n12,5,15\n3,14,8\n5,4,7\n4,11,13\n18,12,8\n12,16,9\n2,15,10\n16,4,11\n7,4,14\n13,12,4\n4,12,14\n6,4,4\n7,1,7\n15,14,5\n2,14,8\n3,7,14\n16,8,13\n6,6,3\n3,12,14\n16,12,6\n11,10,17\n10,4,4\n15,14,9\n16,12,4\n3,6,12\n2,12,11\n11,10,2\n9,4,7\n16,12,7\n3,7,8\n5,14,8\n14,16,11\n7,4,4\n14,8,14\n8,10,1\n13,16,5\n8,2,13\n11,4,3\n14,11,15\n4,13,14\n13,14,16\n5,5,16\n16,11,7\n13,5,7\n16,9,3\n2,12,5\n9,5,14\n9,8,3\n15,5,8\n10,2,8\n12,11,16\n9,2,13\n3,6,8\n16,9,5\n13,4,6\n12,15,12\n11,17,12\n12,5,4\n13,15,15\n14,15,14\n10,1,13\n14,11,4\n6,5,17\n8,11,16\n8,6,16\n8,3,5\n3,14,10\n4,6,16\n2,6,7\n7,6,1\n9,7,3\n9,9,17\n9,2,14\n13,8,2\n17,6,8\n5,13,5\n16,6,14\n3,10,4\n2,9,11\n14,9,1\n13,3,10\n13,15,13\n3,14,12\n14,16,10\n14,6,15\n17,8,10\n11,1,12\n6,9,4\n18,10,7\n2,11,6\n16,8,5\n10,3,15\n15,8,15\n6,8,2\n11,16,16\n3,8,11\n1,9,11\n11,14,3\n11,17,8\n13,14,4\n16,9,9\n14,15,6\n6,5,6\n10,18,10\n16,7,10\n10,4,16\n7,5,16\n15,10,16\n3,7,11\n16,10,15\n14,7,2\n10,6,2\n10,15,7\n2,9,4\n4,14,9\n3,13,9\n5,8,17\n12,12,15\n13,15,8\n8,12,16\n17,10,9\n6,6,4\n13,5,5\n12,7,2\n5,15,10\n11,2,8\n6,18,11\n4,6,5\n8,16,14\n7,18,11\n4,7,3\n17,5,9\n9,2,9\n17,11,13\n4,13,8\n18,8,10\n7,15,15\n12,17,10\n8,2,11\n6,12,6\n15,15,5\n9,16,4\n17,9,4\n15,5,13\n8,9,18\n12,15,4\n12,1,9\n8,5,5\n9,2,6\n13,5,6\n15,13,15\n11,4,4\n12,3,4\n15,11,17\n9,4,4\n4,7,13\n6,4,5\n4,14,11\n12,11,3\n1,8,12\n18,7,10\n3,14,7\n7,3,13\n14,5,16\n15,3,11\n4,7,16\n5,4,8\n5,4,12\n16,6,8\n11,11,4\n15,3,9\n2,14,10\n5,16,12\n5,7,3\n5,14,4\n13,4,10\n10,11,17\n5,8,4\n5,13,4\n10,7,17\n11,17,11\n14,10,3\n11,17,6\n15,12,6\n8,1,10\n11,3,12\n13,4,15\n14,15,10\n8,2,6\n2,9,9\n7,17,11\n3,13,13\n16,13,6\n15,6,14\n6,6,16\n11,18,7\n17,9,7\n11,14,2\n2,11,11\n9,6,1\n9,7,17\n4,9,3\n10,14,17\n17,7,15\n2,6,9\n12,8,16\n11,4,14\n6,14,7\n14,2,7\n11,17,5\n9,2,15\n9,14,4\n13,10,2\n6,3,6\n15,5,9\n16,10,5\n8,10,17\n14,4,8\n11,16,9\n14,12,15\n7,8,3\n4,16,9\n7,6,4\n9,14,14\n8,5,16\n10,15,9\n11,5,4\n11,5,16\n15,14,6\n6,7,3\n3,10,14\n9,14,18\n15,16,10\n14,15,7\n8,2,10\n11,15,6\n13,15,11\n4,14,7\n10,8,17\n5,15,12\n8,5,2\n12,5,2\n10,11,2\n14,8,16\n13,11,17\n15,4,14\n8,9,2\n4,5,8\n12,10,16\n4,15,6\n3,6,9\n4,4,11\n15,8,4\n16,8,14\n11,5,14\n9,16,15\n7,5,14\n10,2,11\n7,17,9\n4,6,14\n14,11,16\n8,12,17\n10,2,13\n5,10,3\n18,12,9\n9,3,14\n14,3,8\n13,4,9\n16,14,13\n17,7,10\n9,13,17\n16,4,12\n16,10,14\n5,10,4\n12,3,15\n7,15,16\n7,2,9\n9,16,11\n14,13,13\n8,5,17\n13,16,11\n13,15,6\n8,2,12\n12,8,4\n8,8,17\n6,9,15\n9,18,11\n7,11,17\n9,12,1\n5,17,10\n8,18,7\n14,14,7\n12,10,2\n3,14,9\n9,4,12\n5,11,4\n13,11,4\n13,9,15\n8,3,11\n14,5,14\n11,4,15\n10,1,14\n9,12,2\n17,4,11\n5,11,16\n12,9,16\n10,2,10\n2,9,5\n3,5,14\n12,14,12\n11,6,2\n7,15,12\n7,4,7\n5,3,13\n5,12,16\n9,14,16\n17,10,11\n11,3,14\n15,4,11\n5,2,13\n8,16,9\n6,5,7\n5,15,8\n11,2,6\n10,14,3\n11,13,4\n4,16,6\n7,16,4\n16,11,12\n10,7,16\n6,16,6\n12,14,17\n11,15,14\n13,12,16\n16,13,12\n11,1,8\n3,10,13\n3,5,10\n10,10,1\n8,17,7\n11,14,16\n12,18,6\n3,10,7\n15,6,9\n7,3,7\n10,1,12\n5,5,15\n15,11,15\n12,4,10\n3,9,4\n5,16,10\n8,8,2\n3,5,8\n16,5,8\n12,18,8\n14,3,13\n6,5,14\n11,6,16\n12,3,6\n13,10,17\n14,7,3\n10,16,6\n14,15,9\n13,3,15\n13,12,17\n5,8,16\n8,14,4\n9,5,16\n6,15,4\n2,8,6\n3,12,13\n4,10,14\n8,2,7\n10,18,8\n6,17,8\n6,10,15\n6,5,16\n13,4,4\n16,12,15\n8,5,11\n6,13,3\n6,13,17\n2,7,8\n6,3,5\n2,7,14\n10,11,16\n12,4,8\n14,9,3\n17,7,9\n16,12,13\n11,4,16\n16,7,5\n16,11,6\n12,14,3\n10,16,12\n12,12,2\n11,15,15\n9,5,3\n4,11,5\n8,3,9\n11,2,10\n13,16,8\n7,3,9\n7,17,14\n10,15,12\n4,12,4\n17,14,9\n8,17,5\n11,12,15\n10,5,17\n15,11,4\n15,13,14\n11,12,18\n9,9,18\n14,7,5\n14,13,3\n6,6,17\n9,8,17\n2,9,13\n14,13,16\n14,11,3\n10,16,10\n8,3,7\n11,10,1\n17,7,11\n8,4,6\n17,6,12\n16,10,13\n10,13,3\n11,16,10\n8,8,16\n3,11,12\n14,5,7\n15,7,14\n2,6,6\n11,4,5\n6,4,14\n15,7,5\n10,15,4\n16,5,7\n13,6,5\n7,17,6\n7,1,10\n3,13,12\n11,17,10\n16,14,9\n6,4,8\n7,10,1\n5,7,16\n11,2,5\n4,6,10\n7,11,3\n2,5,11\n11,13,2\n15,9,5\n4,14,8\n6,2,8\n11,8,17\n7,2,10\n6,9,16\n12,2,6\n7,16,14\n14,10,13\n4,7,14\n2,4,10\n8,10,2\n5,9,4\n2,10,9\n9,2,12\n7,12,16\n8,4,7\n16,6,15\n13,8,3\n14,8,5\n7,12,3\n2,5,10\n10,15,13\n8,2,8\n11,2,9\n16,14,8\n10,9,2\n17,13,8\n3,4,12\n8,15,4\n2,5,12\n7,16,10\n10,7,4\n5,12,2\n13,11,2\n12,15,15\n16,5,6\n2,8,9\n11,17,9\n6,11,16\n6,13,4\n3,9,5\n7,7,3\n14,17,9\n5,14,10\n4,8,11\n5,10,16\n6,5,3\n15,6,15\n4,7,15\n12,3,5\n4,11,3\n3,9,6\n9,17,7\n13,3,13\n11,16,5\n16,15,8\n11,4,6\n15,13,6\n6,5,8\n9,6,17\n7,17,8\n11,7,3\n6,2,14\n6,7,17\n14,12,2\n4,11,16\n10,10,17\n12,10,18\n8,3,13\n4,3,12\n15,14,14\n1,7,8\n13,5,15\n7,5,4\n11,18,10\n10,3,12\n2,13,11\n2,11,7\n10,5,14\n16,13,15\n4,5,7\n3,12,11\n6,16,4\n12,4,7\n11,8,1\n9,12,15\n14,8,2\n12,9,17\n15,4,6\n13,7,17\n8,15,5\n7,10,4\n14,8,6\n10,10,2\n15,6,6\n4,6,6\n14,17,11\n3,8,14\n10,3,14\n2,7,13\n10,5,4\n14,3,10\n5,17,12\n12,8,3\n15,13,13\n15,12,16\n1,7,9\n6,17,9\n14,4,7\n2,8,12\n11,3,8\n17,13,9\n8,16,7\n12,16,14\n14,14,5\n5,17,8\n4,6,15\n5,3,12\n4,4,6\n11,14,4\n15,13,4\n11,11,18\n6,16,9\n15,12,15\n12,4,15\n3,11,13\n10,4,5\n3,13,11\n14,14,3\n10,18,9\n3,13,6\n18,11,9\n6,15,14\n5,17,9\n13,18,12\n14,16,8\n3,6,4\n12,4,5\n8,4,16\n3,6,14\n18,10,12\n9,7,1\n15,15,7\n16,5,13\n4,16,7\n5,6,5\n10,18,12\n13,16,13\n12,6,3\n7,17,13\n11,2,12\n8,15,6\n16,16,9\n15,11,5\n5,3,7\n4,8,15\n9,17,15\n13,6,15\n17,7,8\n6,9,2\n14,15,12\n14,16,7\n14,13,4\n3,9,12\n5,15,5\n2,6,10\n11,15,5\n15,6,3\n15,7,6\n16,11,4\n10,12,1\n7,13,1\n15,15,12\n17,9,12\n8,6,17\n14,4,5\n8,9,16\n11,11,3\n3,11,9\n3,12,8\n7,14,6\n8,16,6\n6,7,2\n4,15,5\n12,10,17\n6,16,11\n12,16,6\n13,8,16\n7,7,4\n16,11,5\n5,13,13\n15,16,9\n12,18,11\n12,4,12\n10,7,3\n18,9,11\n10,13,15\n7,5,7\n14,2,13\n17,9,6\n7,14,15\n9,8,1\n10,6,16\n11,5,13\n9,14,3\n6,11,3\n13,11,3\n8,17,13\n4,11,9\n12,17,14\n9,13,16\n11,2,7\n17,11,11\n14,10,15\n8,11,2\n5,14,13\n16,9,16\n8,18,12\n15,3,8\n10,15,3\n12,16,13\n6,9,3\n9,4,13\n4,11,4\n10,16,7\n6,17,11\n7,13,3\n13,13,13\n10,3,10\n14,16,12\n2,7,12\n1,6,10\n3,7,7\n7,16,8\n4,16,8\n6,2,10\n13,9,17\n13,15,3\n16,12,12\n13,5,4\n9,8,16\n11,14,17\n6,7,14\n13,2,7\n7,9,16\n15,13,11\n11,3,9\n6,2,7\n13,7,4\n7,7,2\n13,9,3\n15,8,6\n15,2,8\n13,12,5\n10,17,12\n6,12,3\n14,15,11\n2,12,7\n12,1,7\n16,8,15\n17,9,9\n10,8,2\n13,6,16\n17,5,8\n16,14,7\n12,6,16\n14,9,17\n15,4,9\n13,13,16\n15,12,11\n2,9,10\n4,7,9\n17,13,14\n11,18,8\n4,13,4\n10,16,9\n11,2,11\n7,16,5\n19,11,7\n5,12,4\n2,5,9\n4,14,10\n11,16,6\n4,6,9\n12,10,4\n1,11,11\n14,7,17\n11,13,15\n18,13,9\n14,17,10\n13,9,16\n12,14,16\n2,12,6\n14,14,9\n16,6,7\n15,5,14\n17,8,9\n12,16,11\n6,12,16\n4,4,10\n6,15,12\n13,4,13\n5,12,3\n3,12,5\n5,5,14\n2,12,10\n10,18,11\n4,14,13\n5,11,15\n19,10,9\n12,2,7\n8,5,4\n7,5,6\n18,6,8\n4,7,12\n16,15,11\n2,8,5\n9,2,4\n8,4,15\n17,9,13\n10,6,17\n10,14,4\n16,13,4\n3,13,5\n2,11,5\n5,14,12\n17,6,10\n7,9,2\n5,4,5\n14,6,5\n6,5,5\n7,14,13\n2,11,14\n15,10,15\n11,12,17\n15,10,4\n2,8,4\n9,6,15\n12,4,3\n2,6,12\n3,12,6\n9,3,15\n6,12,15\n3,6,7\n3,8,6\n9,17,12\n4,9,15\n3,13,14\n11,9,18\n12,15,5\n3,7,9\n6,6,5\n12,15,14\n2,10,13\n12,4,6\n5,2,10\n17,8,6\n7,10,2\n16,14,12\n10,8,18\n11,3,10\n6,16,10\n12,2,10\n14,13,9\n9,15,15\n18,8,7\n5,2,12\n5,8,15\n7,16,13\n14,14,13\n5,7,2\n10,9,18\n11,3,13\n8,17,12\n2,12,8\n3,11,8\n9,14,12\n13,7,5\n13,14,2\n3,11,11\n15,6,7\n12,9,15\n6,10,17\n8,14,2\n13,4,8\n1,5,11\n9,16,12\n10,2,9\n2,5,8\n8,3,4\n7,4,13\n2,8,7\n16,9,4\n11,6,3\n15,10,5\n11,16,4\n6,3,11\n13,15,14\n17,11,4\n8,12,15\n14,16,9\n14,12,4\n11,5,2\n2,11,15\n3,15,9\n5,14,11\n10,17,9\n13,16,10\n2,11,12\n5,5,4\n3,16,7\n4,12,16\n10,16,8\n7,5,17\n15,7,3\n6,12,2\n15,7,9\n13,14,13\n14,8,15\n4,15,11\n16,12,8\n10,16,11\n15,8,5\n9,2,8\n10,10,3\n4,5,5\n14,12,14\n16,10,6\n5,9,15\n4,5,9\n13,6,3\n15,15,8\n12,1,11\n13,15,7\n13,8,17\n15,8,7\n13,9,1\n4,10,5\n16,8,6\n6,4,7\n17,13,13\n8,12,5\n7,14,8\n3,6,10\n8,11,3\n8,17,14\n9,2,5\n7,4,16\n6,11,4\n3,7,5\n15,13,5\n3,4,13\n8,7,1\n4,12,13\n5,8,1\n5,12,6\n5,12,13\n12,2,5\n16,14,6\n8,17,8\n7,2,6\n12,9,2\n6,17,6\n12,16,8\n11,15,8\n4,10,3\n6,4,6\n8,17,9\n12,17,11\n15,14,11\n9,13,2\n17,11,8\n5,13,17\n9,15,6\n17,12,9\n12,17,13\n7,6,16\n2,11,8\n15,5,15\n4,7,6\n10,14,2\n8,16,11\n5,9,17\n16,8,11\n10,13,17\n18,12,6\n15,7,11\n6,8,16\n13,13,17\n1,8,7\n6,13,16\n10,9,3\n4,17,6\n15,7,7\n14,7,4\n5,16,9\n8,14,17\n7,12,2\n9,11,2\n3,8,4\n3,6,6\n2,10,11\n5,14,14\n15,14,15\n13,7,2\n16,5,11\n14,5,10\n11,15,3\n4,12,6\n8,10,18\n14,3,12\n11,3,6\n8,4,4\n11,19,11\n7,14,3\n10,2,4\n16,4,10\n14,16,15\n13,17,12\n6,15,11\n5,15,9\n13,2,8\n18,10,10\n9,3,12\n10,2,5\n12,2,13\n7,11,2\n6,15,13\n13,6,14\n7,5,3\n2,7,11\n16,13,9\n17,9,8\n6,14,16\n14,6,16\n11,1,9\n8,4,10\n5,12,17\n4,5,15\n8,19,12\n5,6,16\n15,3,12\n13,4,14\n16,11,13\n16,12,10\n16,7,9\n15,15,13\n10,18,7\n6,4,16\n18,11,8\n13,14,5\n18,8,8\n5,9,3\n5,15,4\n14,10,5\n12,18,12\n6,4,3\n9,3,13\n5,13,16\n13,6,7\n4,9,12\n7,11,15\n6,11,2\n15,10,14\n5,12,14\n17,14,10\n10,14,12\n14,10,2\n14,5,11\n1,13,7\n9,18,8\n11,16,14\n10,4,15\n10,2,6\n10,7,1\n14,9,6\n10,6,4\n15,4,12\n4,5,11\n17,9,14\n5,3,9\n14,2,11\n7,8,18\n11,17,7\n9,4,6\n18,10,9\n8,17,10\n9,16,6\n4,13,12\n2,6,11\n15,15,6\n17,15,11\n7,4,15\n2,11,10\n14,14,16\n11,16,3\n18,8,12\n15,6,8\n11,18,9\n4,8,13\n5,4,9\n10,15,15\n17,12,12\n4,10,16\n0,12,10\n9,12,17\n9,18,9\n1,6,8\n9,10,18\n4,12,7\n18,9,9\n15,15,14\n10,9,17\n18,12,11\n16,4,8\n17,14,7\n16,14,15\n9,5,17\n11,12,14\n18,7,11\n3,8,13\n8,14,5\n15,9,15\n12,15,7\n11,3,5\n16,13,10\n6,17,10\n1,10,8\n7,7,1\n5,6,3\n6,10,4\n11,15,7\n2,5,6\n5,8,14\n11,4,7\n15,6,11\n9,17,6\n7,3,5\n9,13,15\n17,11,9\n7,5,15\n7,7,5\n13,16,9\n11,1,7\n11,11,1\n13,5,14\n14,12,16\n15,10,3\n10,17,10\n9,12,16\n18,11,11\n5,13,12\n7,3,6\n15,12,4\n11,13,3\n4,12,15\n13,17,6\n7,6,3\n14,4,12\n4,10,2\n2,13,7\n9,8,18\n13,17,9\n4,14,4\n6,8,4\n4,13,10\n9,17,10\n13,17,10\n7,15,3\n9,19,9\n14,13,2\n17,12,10\n14,4,4\n12,4,13\n1,7,7\n7,15,4\n13,5,13\n7,18,10\n9,4,3\n8,3,6\n16,4,7\n15,6,5\n1,8,14\n13,4,11\n11,18,11\n13,7,16\n12,3,9\n18,12,12\n6,13,15\n12,6,15\n4,5,12\n17,8,7\n12,1,10\n17,6,9\n7,13,17\n9,14,2\n9,3,11\n16,15,9\n11,11,16\n8,8,18\n5,2,9\n3,15,5\n4,3,7\n16,3,12\n3,10,5\n6,2,9\n9,15,14\n12,5,3\n14,2,8\n10,14,15\n17,12,6\n11,14,15\n11,8,4\n6,4,12\n14,15,13\n8,11,4\n14,15,8\n9,17,11\n11,4,10\n12,5,7\n3,10,11\n15,7,13\n3,9,7\n6,6,2\n4,10,15\n6,3,13\n15,12,8\n12,16,10\n10,6,15\n8,4,2\n10,9,15\n16,7,11\n8,1,12\n16,5,5\n7,7,15\n7,7,17\n2,6,13\n10,13,16\n3,6,5\n11,13,16\n10,17,5\n5,15,6\n13,2,10\n4,7,5\n9,17,5\n15,14,7\n15,2,7\n17,13,7\n17,10,13\n15,16,12\n12,2,8\n1,9,12\n9,16,5\n15,6,4\n1,9,7\n12,17,6\n2,8,8\n8,16,2\n11,11,2\n7,15,8\n15,3,6\n15,11,8\n15,9,16\n15,16,13\n16,15,6\n16,11,11\n11,17,13\n10,15,8\n9,3,5\n5,13,8\n7,8,2\n7,3,10\n2,9,7\n13,2,9\n16,9,10\n13,15,12\n5,5,8\n3,4,8\n10,11,0\n9,13,3\n18,9,12\n6,11,15\n9,16,7\n9,2,11\n6,10,2\n12,14,5\n11,17,4\n4,9,8\n6,4,11\n6,14,14\n8,4,5\n16,3,9\n15,12,3\n9,10,2\n12,2,11\n11,18,12\n8,15,12\n5,5,3\n6,3,12\n11,2,13\n12,14,14\n4,8,5\n3,15,7\n11,1,11\n10,17,13\n4,4,12\n13,8,15\n9,15,5\n17,8,5\n16,4,13\n14,7,14\n11,10,3\n10,13,2\n16,10,12\n7,16,12\n5,4,11\n1,9,8\n8,3,14\n10,5,3\n1,11,12\n12,17,15\n9,3,16\n4,15,9\n12,6,2\n11,13,17\n1,13,8\n17,5,11\n5,12,11\n14,9,16\n13,7,15\n15,12,13\n14,3,9\n15,7,16\n5,2,11\n4,14,15\n15,15,10\n7,2,5\n17,11,12\n7,11,1\n14,6,7\n1,13,12\n11,15,4\n2,12,9\n16,8,8\n10,4,12\n8,9,1\n2,7,5\n15,11,11\n8,1,11\n7,3,12\n15,12,14\n8,16,13\n4,7,8\n6,13,2\n3,9,9\n5,7,6\n8,4,8\n10,1,7\n13,6,4\n17,14,12\n4,9,5\n17,10,8\n4,3,8\n13,11,1\n8,1,8\n9,11,18\n9,4,14\n12,7,17\n14,6,14\n11,6,5\n13,12,3\n14,2,10\n14,3,15\n5,5,13\n5,10,5\n5,10,15\n17,10,7\n7,12,4\n12,7,4\n6,12,5\n3,4,6\n18,9,10\n4,9,10\n10,6,3\n17,10,16\n10,9,1\n16,16,12\n3,11,6\n17,13,12\n3,8,15\n1,8,11\n5,2,8\n10,4,8\n13,5,16\n17,4,12\n8,15,2\n2,7,6\n18,7,8\n6,12,14\n4,12,11\n4,13,15\n16,14,10\n13,10,4\n15,14,10\n5,4,14\n13,8,4\n9,14,17\n17,9,11\n8,7,17\n6,9,14\n18,9,7\n9,14,5\n13,16,12\n4,6,8\n8,15,17\n14,9,2\n10,16,4\n3,7,6\n6,10,3\n8,8,3\n15,4,8\n7,16,15\n12,18,10\n11,1,10\n14,12,5\n6,17,14\n16,10,11\n5,6,13\n9,12,3\n13,11,16\n13,3,11\n12,8,18\n10,16,14\n15,13,12\n9,18,7\n11,16,7\n8,5,14\n5,10,17\n5,11,10\n8,13,3\n14,12,3\n5,18,8\n6,12,17\n15,13,7\n9,16,8\n15,15,9\n4,15,4\n6,7,13\n9,9,1\n5,14,5\n7,3,14\n16,4,6\n14,4,6\n7,4,6\n13,10,14\n7,14,7\n9,7,18\n4,13,7\n15,5,10\n7,15,11\n9,11,1\n3,3,6\n14,4,11\n16,10,3\n15,11,6\n12,1,13\n8,3,12\n2,5,7\n7,18,8\n9,5,4\n6,8,15\n15,10,13\n12,7,15\n13,17,13\n8,14,16\n6,3,7\n8,16,16\n2,9,14\n16,10,7\n8,18,11\n2,9,12\n1,8,9\n17,8,11\n9,9,16\n6,13,5\n3,12,10\n18,10,14\n6,13,7\n12,8,17\n9,3,3\n9,3,4\n3,13,10\n3,5,6\n4,4,8\n9,15,3\n10,17,15\n5,3,14\n9,17,14\n4,5,10\n8,16,15\n10,1,9\n9,10,3\n10,16,15\n6,11,17\n16,13,5\n8,3,10\n10,5,16\n4,13,13\n4,4,13\n8,18,9\n10,17,11\n10,6,18\n9,15,13\n7,5,5\n16,4,9\n14,5,15\n3,11,7\n4,10,9\n12,2,9\n7,4,11\n10,12,3\n18,10,8\n13,4,5\n15,6,16\n13,13,15\n5,4,4\n16,9,14\n11,14,13\n2,10,5\n15,11,13\n7,9,18\n4,8,2\n16,5,9\n12,12,17\n4,6,13\n6,14,11\n11,16,12\n17,12,7\n10,6,14\n7,18,7\n10,10,16\n7,15,9\n17,12,11\n13,3,14\n14,6,13\n7,10,3\n12,14,2\n3,4,9\n2,10,4\n2,13,8\n15,4,5\n3,10,10\n6,2,11\n4,17,9\n2,14,7\n13,13,4\n5,10,2\n12,3,7\n3,15,12\n10,10,18\n14,13,5\n2,8,10\n2,8,14\n14,12,13\n1,6,9\n3,8,7\n15,14,12\n13,7,3\n6,6,6\n15,4,13\n6,5,15\n8,16,5\n12,13,15\n7,17,5\n1,12,7\n12,8,2\n9,9,3\n9,13,1\n4,3,13\n9,7,4\n7,1,11\n4,16,13\n10,4,14\n6,2,12\n12,9,18\n5,5,6\n19,11,9\n15,11,14\n15,6,10\n2,15,11\n17,12,13\n13,16,7\n15,12,5\n12,11,1\n2,12,12\n9,15,16\n9,5,2\n14,5,8\n17,5,12\n12,12,1\n14,12,7\n14,13,12\n4,17,8\n9,9,19\n13,4,12\n3,10,16\n4,6,3\n14,15,5\n6,15,15\n6,14,3\n1,8,8\n2,12,13\n3,15,10\n14,17,12\n13,17,7\n7,1,8\n6,15,3\n5,15,7\n8,9,17\n13,13,5\n17,13,10\n10,8,19\n15,8,14\n9,1,5\n6,15,5\n13,16,14\n4,9,2\n9,5,15\n10,4,3\n6,17,7\n8,15,9\n6,2,13\n6,1,9\n12,6,18\n18,11,10\n1,7,11\n15,9,14\n13,8,14\n8,14,14\n4,16,10\n10,3,8\n7,6,14\n4,13,9\n15,5,16\n16,3,8\n11,12,2\n13,3,9\n17,7,6\n3,8,12\n14,4,14\n10,16,16\n16,15,12\n7,3,16\n6,10,18\n16,13,13\n16,8,12\n5,16,13\n8,14,6\n17,7,7\n11,6,15\n5,9,2\n6,14,8\n6,14,2\n3,15,6\n18,8,9\n17,14,13\n13,2,11\n11,12,5\n7,12,17\n8,18,8\n9,1,9\n10,1,6\n12,6,17\n6,4,9\n12,15,8\n1,12,8\n14,6,8\n2,10,10\n11,16,13\n11,6,17\n10,4,13\n6,9,1\n5,17,7\n15,11,3".split("\n");

module.exports = { p1, p2, init, water_voxels, lava_voxels, max }
},{"path":1}]},{},[3])(3)
});
