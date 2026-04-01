var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/redis/lib/utils.js
var require_utils = __commonJS({
  "node_modules/redis/lib/utils.js"(exports, module) {
    "use strict";
    function replyToObject(reply) {
      if (reply.length === 0 || !(reply instanceof Array)) {
        return null;
      }
      var obj = {};
      for (var i = 0; i < reply.length; i += 2) {
        obj[reply[i].toString("binary")] = reply[i + 1];
      }
      return obj;
    }
    function replyToStrings(reply) {
      if (reply instanceof Buffer) {
        return reply.toString();
      }
      if (reply instanceof Array) {
        var res = new Array(reply.length);
        for (var i = 0; i < reply.length; i++) {
          res[i] = replyToStrings(reply[i]);
        }
        return res;
      }
      return reply;
    }
    function print(err, reply) {
      if (err) {
        console.log(err.toString());
      } else {
        console.log("Reply: " + reply);
      }
    }
    var camelCase;
    function clone(obj) {
      var copy;
      if (Array.isArray(obj)) {
        copy = new Array(obj.length);
        for (var i = 0; i < obj.length; i++) {
          copy[i] = clone(obj[i]);
        }
        return copy;
      }
      if (Object.prototype.toString.call(obj) === "[object Object]") {
        copy = {};
        var elems = Object.keys(obj);
        var elem;
        while (elem = elems.pop()) {
          if (elem === "tls") {
            copy[elem] = obj[elem];
            continue;
          }
          var snake_case = elem.replace(/[A-Z][^A-Z]/g, "_$&").toLowerCase();
          if (snake_case !== elem.toLowerCase()) {
            camelCase = true;
          }
          copy[snake_case] = clone(obj[elem]);
        }
        return copy;
      }
      return obj;
    }
    function convenienceClone(obj) {
      camelCase = false;
      obj = clone(obj) || {};
      if (camelCase) {
        obj.camel_case = true;
      }
      return obj;
    }
    function callbackOrEmit(self2, callback, err, res) {
      if (callback) {
        callback(err, res);
      } else if (err) {
        self2.emit("error", err);
      }
    }
    function replyInOrder(self2, callback, err, res, queue) {
      var command_obj;
      if (queue) {
        command_obj = queue.peekBack();
      } else {
        command_obj = self2.offline_queue.peekBack() || self2.command_queue.peekBack();
      }
      if (!command_obj) {
        process.nextTick(function() {
          callbackOrEmit(self2, callback, err, res);
        });
      } else {
        var tmp = command_obj.callback;
        command_obj.callback = tmp ? function(e, r) {
          tmp(e, r);
          callbackOrEmit(self2, callback, err, res);
        } : function(e, r) {
          if (e) {
            self2.emit("error", e);
          }
          callbackOrEmit(self2, callback, err, res);
        };
      }
    }
    module.exports = {
      reply_to_strings: replyToStrings,
      reply_to_object: replyToObject,
      print,
      err_code: /^([A-Z]+)\s+(.+)$/,
      monitor_regex: /^[0-9]{10,11}\.[0-9]+ \[[0-9]+ .+\].*"$/,
      clone: convenienceClone,
      callback_or_emit: callbackOrEmit,
      reply_in_order: replyInOrder
    };
  }
});

// node_modules/redis/lib/command.js
var require_command = __commonJS({
  "node_modules/redis/lib/command.js"(exports, module) {
    "use strict";
    var betterStackTraces = /development/i.test(process.env.NODE_ENV) || /\bredis\b/i.test(process.env.NODE_DEBUG);
    function Command(command, args, callback, call_on_write) {
      this.command = command;
      this.args = args;
      this.buffer_args = false;
      this.callback = callback;
      this.call_on_write = call_on_write;
      if (betterStackTraces) {
        this.error = new Error();
      }
    }
    module.exports = Command;
  }
});

// node_modules/denque/index.js
var require_denque = __commonJS({
  "node_modules/denque/index.js"(exports, module) {
    "use strict";
    function Denque(array, options) {
      var options = options || {};
      this._head = 0;
      this._tail = 0;
      this._capacity = options.capacity;
      this._capacityMask = 3;
      this._list = new Array(4);
      if (Array.isArray(array)) {
        this._fromArray(array);
      }
    }
    Denque.prototype.peekAt = function peekAt(index) {
      var i = index;
      if (i !== (i | 0)) {
        return void 0;
      }
      var len = this.size();
      if (i >= len || i < -len) return void 0;
      if (i < 0) i += len;
      i = this._head + i & this._capacityMask;
      return this._list[i];
    };
    Denque.prototype.get = function get2(i) {
      return this.peekAt(i);
    };
    Denque.prototype.peek = function peek() {
      if (this._head === this._tail) return void 0;
      return this._list[this._head];
    };
    Denque.prototype.peekFront = function peekFront() {
      return this.peek();
    };
    Denque.prototype.peekBack = function peekBack() {
      return this.peekAt(-1);
    };
    Object.defineProperty(Denque.prototype, "length", {
      get: function length() {
        return this.size();
      }
    });
    Denque.prototype.size = function size() {
      if (this._head === this._tail) return 0;
      if (this._head < this._tail) return this._tail - this._head;
      else return this._capacityMask + 1 - (this._head - this._tail);
    };
    Denque.prototype.unshift = function unshift(item) {
      if (item === void 0) return this.size();
      var len = this._list.length;
      this._head = this._head - 1 + len & this._capacityMask;
      this._list[this._head] = item;
      if (this._tail === this._head) this._growArray();
      if (this._capacity && this.size() > this._capacity) this.pop();
      if (this._head < this._tail) return this._tail - this._head;
      else return this._capacityMask + 1 - (this._head - this._tail);
    };
    Denque.prototype.shift = function shift() {
      var head = this._head;
      if (head === this._tail) return void 0;
      var item = this._list[head];
      this._list[head] = void 0;
      this._head = head + 1 & this._capacityMask;
      if (head < 2 && this._tail > 1e4 && this._tail <= this._list.length >>> 2) this._shrinkArray();
      return item;
    };
    Denque.prototype.push = function push(item) {
      if (item === void 0) return this.size();
      var tail = this._tail;
      this._list[tail] = item;
      this._tail = tail + 1 & this._capacityMask;
      if (this._tail === this._head) {
        this._growArray();
      }
      if (this._capacity && this.size() > this._capacity) {
        this.shift();
      }
      if (this._head < this._tail) return this._tail - this._head;
      else return this._capacityMask + 1 - (this._head - this._tail);
    };
    Denque.prototype.pop = function pop() {
      var tail = this._tail;
      if (tail === this._head) return void 0;
      var len = this._list.length;
      this._tail = tail - 1 + len & this._capacityMask;
      var item = this._list[this._tail];
      this._list[this._tail] = void 0;
      if (this._head < 2 && tail > 1e4 && tail <= len >>> 2) this._shrinkArray();
      return item;
    };
    Denque.prototype.removeOne = function removeOne(index) {
      var i = index;
      if (i !== (i | 0)) {
        return void 0;
      }
      if (this._head === this._tail) return void 0;
      var size = this.size();
      var len = this._list.length;
      if (i >= size || i < -size) return void 0;
      if (i < 0) i += size;
      i = this._head + i & this._capacityMask;
      var item = this._list[i];
      var k;
      if (index < size / 2) {
        for (k = index; k > 0; k--) {
          this._list[i] = this._list[i = i - 1 + len & this._capacityMask];
        }
        this._list[i] = void 0;
        this._head = this._head + 1 + len & this._capacityMask;
      } else {
        for (k = size - 1 - index; k > 0; k--) {
          this._list[i] = this._list[i = i + 1 + len & this._capacityMask];
        }
        this._list[i] = void 0;
        this._tail = this._tail - 1 + len & this._capacityMask;
      }
      return item;
    };
    Denque.prototype.remove = function remove(index, count) {
      var i = index;
      var removed;
      var del_count = count;
      if (i !== (i | 0)) {
        return void 0;
      }
      if (this._head === this._tail) return void 0;
      var size = this.size();
      var len = this._list.length;
      if (i >= size || i < -size || count < 1) return void 0;
      if (i < 0) i += size;
      if (count === 1 || !count) {
        removed = new Array(1);
        removed[0] = this.removeOne(i);
        return removed;
      }
      if (i === 0 && i + count >= size) {
        removed = this.toArray();
        this.clear();
        return removed;
      }
      if (i + count > size) count = size - i;
      var k;
      removed = new Array(count);
      for (k = 0; k < count; k++) {
        removed[k] = this._list[this._head + i + k & this._capacityMask];
      }
      i = this._head + i & this._capacityMask;
      if (index + count === size) {
        this._tail = this._tail - count + len & this._capacityMask;
        for (k = count; k > 0; k--) {
          this._list[i = i + 1 + len & this._capacityMask] = void 0;
        }
        return removed;
      }
      if (index === 0) {
        this._head = this._head + count + len & this._capacityMask;
        for (k = count - 1; k > 0; k--) {
          this._list[i = i + 1 + len & this._capacityMask] = void 0;
        }
        return removed;
      }
      if (i < size / 2) {
        this._head = this._head + index + count + len & this._capacityMask;
        for (k = index; k > 0; k--) {
          this.unshift(this._list[i = i - 1 + len & this._capacityMask]);
        }
        i = this._head - 1 + len & this._capacityMask;
        while (del_count > 0) {
          this._list[i = i - 1 + len & this._capacityMask] = void 0;
          del_count--;
        }
        if (index < 0) this._tail = i;
      } else {
        this._tail = i;
        i = i + count + len & this._capacityMask;
        for (k = size - (count + index); k > 0; k--) {
          this.push(this._list[i++]);
        }
        i = this._tail;
        while (del_count > 0) {
          this._list[i = i + 1 + len & this._capacityMask] = void 0;
          del_count--;
        }
      }
      if (this._head < 2 && this._tail > 1e4 && this._tail <= len >>> 2) this._shrinkArray();
      return removed;
    };
    Denque.prototype.splice = function splice(index, count) {
      var i = index;
      if (i !== (i | 0)) {
        return void 0;
      }
      var size = this.size();
      if (i < 0) i += size;
      if (i > size) return void 0;
      if (arguments.length > 2) {
        var k;
        var temp;
        var removed;
        var arg_len = arguments.length;
        var len = this._list.length;
        var arguments_index = 2;
        if (!size || i < size / 2) {
          temp = new Array(i);
          for (k = 0; k < i; k++) {
            temp[k] = this._list[this._head + k & this._capacityMask];
          }
          if (count === 0) {
            removed = [];
            if (i > 0) {
              this._head = this._head + i + len & this._capacityMask;
            }
          } else {
            removed = this.remove(i, count);
            this._head = this._head + i + len & this._capacityMask;
          }
          while (arg_len > arguments_index) {
            this.unshift(arguments[--arg_len]);
          }
          for (k = i; k > 0; k--) {
            this.unshift(temp[k - 1]);
          }
        } else {
          temp = new Array(size - (i + count));
          var leng = temp.length;
          for (k = 0; k < leng; k++) {
            temp[k] = this._list[this._head + i + count + k & this._capacityMask];
          }
          if (count === 0) {
            removed = [];
            if (i != size) {
              this._tail = this._head + i + len & this._capacityMask;
            }
          } else {
            removed = this.remove(i, count);
            this._tail = this._tail - leng + len & this._capacityMask;
          }
          while (arguments_index < arg_len) {
            this.push(arguments[arguments_index++]);
          }
          for (k = 0; k < leng; k++) {
            this.push(temp[k]);
          }
        }
        return removed;
      } else {
        return this.remove(i, count);
      }
    };
    Denque.prototype.clear = function clear() {
      this._head = 0;
      this._tail = 0;
    };
    Denque.prototype.isEmpty = function isEmpty() {
      return this._head === this._tail;
    };
    Denque.prototype.toArray = function toArray() {
      return this._copyArray(false);
    };
    Denque.prototype._fromArray = function _fromArray(array) {
      for (var i = 0; i < array.length; i++) this.push(array[i]);
    };
    Denque.prototype._copyArray = function _copyArray(fullCopy) {
      var newArray = [];
      var list = this._list;
      var len = list.length;
      var i;
      if (fullCopy || this._head > this._tail) {
        for (i = this._head; i < len; i++) newArray.push(list[i]);
        for (i = 0; i < this._tail; i++) newArray.push(list[i]);
      } else {
        for (i = this._head; i < this._tail; i++) newArray.push(list[i]);
      }
      return newArray;
    };
    Denque.prototype._growArray = function _growArray() {
      if (this._head) {
        this._list = this._copyArray(true);
        this._head = 0;
      }
      this._tail = this._list.length;
      this._list.length <<= 1;
      this._capacityMask = this._capacityMask << 1 | 1;
    };
    Denque.prototype._shrinkArray = function _shrinkArray() {
      this._list.length >>>= 1;
      this._capacityMask >>>= 1;
    };
    module.exports = Denque;
  }
});

// node_modules/redis-errors/lib/old.js
var require_old = __commonJS({
  "node_modules/redis-errors/lib/old.js"(exports, module) {
    "use strict";
    var assert = __require("assert");
    var util = __require("util");
    function RedisError(message) {
      Object.defineProperty(this, "message", {
        value: message || "",
        configurable: true,
        writable: true
      });
      Error.captureStackTrace(this, this.constructor);
    }
    util.inherits(RedisError, Error);
    Object.defineProperty(RedisError.prototype, "name", {
      value: "RedisError",
      configurable: true,
      writable: true
    });
    function ParserError(message, buffer, offset) {
      assert(buffer);
      assert.strictEqual(typeof offset, "number");
      Object.defineProperty(this, "message", {
        value: message || "",
        configurable: true,
        writable: true
      });
      const tmp = Error.stackTraceLimit;
      Error.stackTraceLimit = 2;
      Error.captureStackTrace(this, this.constructor);
      Error.stackTraceLimit = tmp;
      this.offset = offset;
      this.buffer = buffer;
    }
    util.inherits(ParserError, RedisError);
    Object.defineProperty(ParserError.prototype, "name", {
      value: "ParserError",
      configurable: true,
      writable: true
    });
    function ReplyError(message) {
      Object.defineProperty(this, "message", {
        value: message || "",
        configurable: true,
        writable: true
      });
      const tmp = Error.stackTraceLimit;
      Error.stackTraceLimit = 2;
      Error.captureStackTrace(this, this.constructor);
      Error.stackTraceLimit = tmp;
    }
    util.inherits(ReplyError, RedisError);
    Object.defineProperty(ReplyError.prototype, "name", {
      value: "ReplyError",
      configurable: true,
      writable: true
    });
    function AbortError(message) {
      Object.defineProperty(this, "message", {
        value: message || "",
        configurable: true,
        writable: true
      });
      Error.captureStackTrace(this, this.constructor);
    }
    util.inherits(AbortError, RedisError);
    Object.defineProperty(AbortError.prototype, "name", {
      value: "AbortError",
      configurable: true,
      writable: true
    });
    function InterruptError(message) {
      Object.defineProperty(this, "message", {
        value: message || "",
        configurable: true,
        writable: true
      });
      Error.captureStackTrace(this, this.constructor);
    }
    util.inherits(InterruptError, AbortError);
    Object.defineProperty(InterruptError.prototype, "name", {
      value: "InterruptError",
      configurable: true,
      writable: true
    });
    module.exports = {
      RedisError,
      ParserError,
      ReplyError,
      AbortError,
      InterruptError
    };
  }
});

// node_modules/redis-errors/lib/modern.js
var require_modern = __commonJS({
  "node_modules/redis-errors/lib/modern.js"(exports, module) {
    "use strict";
    var assert = __require("assert");
    var RedisError = class extends Error {
      get name() {
        return this.constructor.name;
      }
    };
    var ParserError = class extends RedisError {
      constructor(message, buffer, offset) {
        assert(buffer);
        assert.strictEqual(typeof offset, "number");
        const tmp = Error.stackTraceLimit;
        Error.stackTraceLimit = 2;
        super(message);
        Error.stackTraceLimit = tmp;
        this.offset = offset;
        this.buffer = buffer;
      }
      get name() {
        return this.constructor.name;
      }
    };
    var ReplyError = class extends RedisError {
      constructor(message) {
        const tmp = Error.stackTraceLimit;
        Error.stackTraceLimit = 2;
        super(message);
        Error.stackTraceLimit = tmp;
      }
      get name() {
        return this.constructor.name;
      }
    };
    var AbortError = class extends RedisError {
      get name() {
        return this.constructor.name;
      }
    };
    var InterruptError = class extends AbortError {
      get name() {
        return this.constructor.name;
      }
    };
    module.exports = {
      RedisError,
      ParserError,
      ReplyError,
      AbortError,
      InterruptError
    };
  }
});

// node_modules/redis-errors/index.js
var require_redis_errors = __commonJS({
  "node_modules/redis-errors/index.js"(exports, module) {
    "use strict";
    var Errors = process.version.charCodeAt(1) < 55 && process.version.charCodeAt(2) === 46 ? require_old() : require_modern();
    module.exports = Errors;
  }
});

// node_modules/redis/lib/customErrors.js
var require_customErrors = __commonJS({
  "node_modules/redis/lib/customErrors.js"(exports, module) {
    "use strict";
    var util = __require("util");
    var assert = __require("assert");
    var RedisError = require_redis_errors().RedisError;
    var ADD_STACKTRACE = false;
    function AbortError(obj, stack) {
      assert(obj, "The options argument is required");
      assert.strictEqual(typeof obj, "object", "The options argument has to be of type object");
      Object.defineProperty(this, "message", {
        value: obj.message || "",
        configurable: true,
        writable: true
      });
      if (stack || stack === void 0) {
        Error.captureStackTrace(this, AbortError);
      }
      for (var keys = Object.keys(obj), key = keys.pop(); key; key = keys.pop()) {
        this[key] = obj[key];
      }
    }
    function AggregateError(obj) {
      assert(obj, "The options argument is required");
      assert.strictEqual(typeof obj, "object", "The options argument has to be of type object");
      AbortError.call(this, obj, ADD_STACKTRACE);
      Object.defineProperty(this, "message", {
        value: obj.message || "",
        configurable: true,
        writable: true
      });
      Error.captureStackTrace(this, AggregateError);
      for (var keys = Object.keys(obj), key = keys.pop(); key; key = keys.pop()) {
        this[key] = obj[key];
      }
    }
    util.inherits(AbortError, RedisError);
    util.inherits(AggregateError, AbortError);
    Object.defineProperty(AbortError.prototype, "name", {
      value: "AbortError",
      configurable: true,
      writable: true
    });
    Object.defineProperty(AggregateError.prototype, "name", {
      value: "AggregateError",
      configurable: true,
      writable: true
    });
    module.exports = {
      AbortError,
      AggregateError
    };
  }
});

// node_modules/redis-parser/lib/parser.js
var require_parser = __commonJS({
  "node_modules/redis-parser/lib/parser.js"(exports, module) {
    "use strict";
    var Buffer2 = __require("buffer").Buffer;
    var StringDecoder = __require("string_decoder").StringDecoder;
    var decoder = new StringDecoder();
    var errors = require_redis_errors();
    var ReplyError = errors.ReplyError;
    var ParserError = errors.ParserError;
    var bufferPool = Buffer2.allocUnsafe(32 * 1024);
    var bufferOffset = 0;
    var interval = null;
    var counter = 0;
    var notDecreased = 0;
    function parseSimpleNumbers(parser) {
      const length = parser.buffer.length - 1;
      var offset = parser.offset;
      var number = 0;
      var sign = 1;
      if (parser.buffer[offset] === 45) {
        sign = -1;
        offset++;
      }
      while (offset < length) {
        const c1 = parser.buffer[offset++];
        if (c1 === 13) {
          parser.offset = offset + 1;
          return sign * number;
        }
        number = number * 10 + (c1 - 48);
      }
    }
    function parseStringNumbers(parser) {
      const length = parser.buffer.length - 1;
      var offset = parser.offset;
      var number = 0;
      var res = "";
      if (parser.buffer[offset] === 45) {
        res += "-";
        offset++;
      }
      while (offset < length) {
        var c1 = parser.buffer[offset++];
        if (c1 === 13) {
          parser.offset = offset + 1;
          if (number !== 0) {
            res += number;
          }
          return res;
        } else if (number > 429496728) {
          res += number * 10 + (c1 - 48);
          number = 0;
        } else if (c1 === 48 && number === 0) {
          res += 0;
        } else {
          number = number * 10 + (c1 - 48);
        }
      }
    }
    function parseSimpleString(parser) {
      const start = parser.offset;
      const buffer = parser.buffer;
      const length = buffer.length - 1;
      var offset = start;
      while (offset < length) {
        if (buffer[offset++] === 13) {
          parser.offset = offset + 1;
          if (parser.optionReturnBuffers === true) {
            return parser.buffer.slice(start, offset - 1);
          }
          return parser.buffer.toString("utf8", start, offset - 1);
        }
      }
    }
    function parseLength(parser) {
      const length = parser.buffer.length - 1;
      var offset = parser.offset;
      var number = 0;
      while (offset < length) {
        const c1 = parser.buffer[offset++];
        if (c1 === 13) {
          parser.offset = offset + 1;
          return number;
        }
        number = number * 10 + (c1 - 48);
      }
    }
    function parseInteger(parser) {
      if (parser.optionStringNumbers === true) {
        return parseStringNumbers(parser);
      }
      return parseSimpleNumbers(parser);
    }
    function parseBulkString(parser) {
      const length = parseLength(parser);
      if (length === void 0) {
        return;
      }
      if (length < 0) {
        return null;
      }
      const offset = parser.offset + length;
      if (offset + 2 > parser.buffer.length) {
        parser.bigStrSize = offset + 2;
        parser.totalChunkSize = parser.buffer.length;
        parser.bufferCache.push(parser.buffer);
        return;
      }
      const start = parser.offset;
      parser.offset = offset + 2;
      if (parser.optionReturnBuffers === true) {
        return parser.buffer.slice(start, offset);
      }
      return parser.buffer.toString("utf8", start, offset);
    }
    function parseError(parser) {
      var string = parseSimpleString(parser);
      if (string !== void 0) {
        if (parser.optionReturnBuffers === true) {
          string = string.toString();
        }
        return new ReplyError(string);
      }
    }
    function handleError(parser, type) {
      const err = new ParserError(
        "Protocol error, got " + JSON.stringify(String.fromCharCode(type)) + " as reply type byte",
        JSON.stringify(parser.buffer),
        parser.offset
      );
      parser.buffer = null;
      parser.returnFatalError(err);
    }
    function parseArray(parser) {
      const length = parseLength(parser);
      if (length === void 0) {
        return;
      }
      if (length < 0) {
        return null;
      }
      const responses = new Array(length);
      return parseArrayElements(parser, responses, 0);
    }
    function pushArrayCache(parser, array, pos) {
      parser.arrayCache.push(array);
      parser.arrayPos.push(pos);
    }
    function parseArrayChunks(parser) {
      const tmp = parser.arrayCache.pop();
      var pos = parser.arrayPos.pop();
      if (parser.arrayCache.length) {
        const res = parseArrayChunks(parser);
        if (res === void 0) {
          pushArrayCache(parser, tmp, pos);
          return;
        }
        tmp[pos++] = res;
      }
      return parseArrayElements(parser, tmp, pos);
    }
    function parseArrayElements(parser, responses, i) {
      const bufferLength = parser.buffer.length;
      while (i < responses.length) {
        const offset = parser.offset;
        if (parser.offset >= bufferLength) {
          pushArrayCache(parser, responses, i);
          return;
        }
        const response = parseType(parser, parser.buffer[parser.offset++]);
        if (response === void 0) {
          if (!(parser.arrayCache.length || parser.bufferCache.length)) {
            parser.offset = offset;
          }
          pushArrayCache(parser, responses, i);
          return;
        }
        responses[i] = response;
        i++;
      }
      return responses;
    }
    function parseType(parser, type) {
      switch (type) {
        case 36:
          return parseBulkString(parser);
        case 43:
          return parseSimpleString(parser);
        case 42:
          return parseArray(parser);
        case 58:
          return parseInteger(parser);
        case 45:
          return parseError(parser);
        default:
          return handleError(parser, type);
      }
    }
    function decreaseBufferPool() {
      if (bufferPool.length > 50 * 1024) {
        if (counter === 1 || notDecreased > counter * 2) {
          const minSliceLen = Math.floor(bufferPool.length / 10);
          const sliceLength = minSliceLen < bufferOffset ? bufferOffset : minSliceLen;
          bufferOffset = 0;
          bufferPool = bufferPool.slice(sliceLength, bufferPool.length);
        } else {
          notDecreased++;
          counter--;
        }
      } else {
        clearInterval(interval);
        counter = 0;
        notDecreased = 0;
        interval = null;
      }
    }
    function resizeBuffer(length) {
      if (bufferPool.length < length + bufferOffset) {
        const multiplier = length > 1024 * 1024 * 75 ? 2 : 3;
        if (bufferOffset > 1024 * 1024 * 111) {
          bufferOffset = 1024 * 1024 * 50;
        }
        bufferPool = Buffer2.allocUnsafe(length * multiplier + bufferOffset);
        bufferOffset = 0;
        counter++;
        if (interval === null) {
          interval = setInterval(decreaseBufferPool, 50);
        }
      }
    }
    function concatBulkString(parser) {
      const list = parser.bufferCache;
      const oldOffset = parser.offset;
      var chunks = list.length;
      var offset = parser.bigStrSize - parser.totalChunkSize;
      parser.offset = offset;
      if (offset <= 2) {
        if (chunks === 2) {
          return list[0].toString("utf8", oldOffset, list[0].length + offset - 2);
        }
        chunks--;
        offset = list[list.length - 2].length + offset;
      }
      var res = decoder.write(list[0].slice(oldOffset));
      for (var i = 1; i < chunks - 1; i++) {
        res += decoder.write(list[i]);
      }
      res += decoder.end(list[i].slice(0, offset - 2));
      return res;
    }
    function concatBulkBuffer(parser) {
      const list = parser.bufferCache;
      const oldOffset = parser.offset;
      const length = parser.bigStrSize - oldOffset - 2;
      var chunks = list.length;
      var offset = parser.bigStrSize - parser.totalChunkSize;
      parser.offset = offset;
      if (offset <= 2) {
        if (chunks === 2) {
          return list[0].slice(oldOffset, list[0].length + offset - 2);
        }
        chunks--;
        offset = list[list.length - 2].length + offset;
      }
      resizeBuffer(length);
      const start = bufferOffset;
      list[0].copy(bufferPool, start, oldOffset, list[0].length);
      bufferOffset += list[0].length - oldOffset;
      for (var i = 1; i < chunks - 1; i++) {
        list[i].copy(bufferPool, bufferOffset);
        bufferOffset += list[i].length;
      }
      list[i].copy(bufferPool, bufferOffset, 0, offset - 2);
      bufferOffset += offset - 2;
      return bufferPool.slice(start, bufferOffset);
    }
    var JavascriptRedisParser = class {
      /**
       * Javascript Redis Parser constructor
       * @param {{returnError: Function, returnReply: Function, returnFatalError?: Function, returnBuffers: boolean, stringNumbers: boolean }} options
       * @constructor
       */
      constructor(options) {
        if (!options) {
          throw new TypeError("Options are mandatory.");
        }
        if (typeof options.returnError !== "function" || typeof options.returnReply !== "function") {
          throw new TypeError("The returnReply and returnError options have to be functions.");
        }
        this.setReturnBuffers(!!options.returnBuffers);
        this.setStringNumbers(!!options.stringNumbers);
        this.returnError = options.returnError;
        this.returnFatalError = options.returnFatalError || options.returnError;
        this.returnReply = options.returnReply;
        this.reset();
      }
      /**
       * Reset the parser values to the initial state
       *
       * @returns {undefined}
       */
      reset() {
        this.offset = 0;
        this.buffer = null;
        this.bigStrSize = 0;
        this.totalChunkSize = 0;
        this.bufferCache = [];
        this.arrayCache = [];
        this.arrayPos = [];
      }
      /**
       * Set the returnBuffers option
       *
       * @param {boolean} returnBuffers
       * @returns {undefined}
       */
      setReturnBuffers(returnBuffers) {
        if (typeof returnBuffers !== "boolean") {
          throw new TypeError("The returnBuffers argument has to be a boolean");
        }
        this.optionReturnBuffers = returnBuffers;
      }
      /**
       * Set the stringNumbers option
       *
       * @param {boolean} stringNumbers
       * @returns {undefined}
       */
      setStringNumbers(stringNumbers) {
        if (typeof stringNumbers !== "boolean") {
          throw new TypeError("The stringNumbers argument has to be a boolean");
        }
        this.optionStringNumbers = stringNumbers;
      }
      /**
       * Parse the redis buffer
       * @param {Buffer} buffer
       * @returns {undefined}
       */
      execute(buffer) {
        if (this.buffer === null) {
          this.buffer = buffer;
          this.offset = 0;
        } else if (this.bigStrSize === 0) {
          const oldLength = this.buffer.length;
          const remainingLength = oldLength - this.offset;
          const newBuffer = Buffer2.allocUnsafe(remainingLength + buffer.length);
          this.buffer.copy(newBuffer, 0, this.offset, oldLength);
          buffer.copy(newBuffer, remainingLength, 0, buffer.length);
          this.buffer = newBuffer;
          this.offset = 0;
          if (this.arrayCache.length) {
            const arr = parseArrayChunks(this);
            if (arr === void 0) {
              return;
            }
            this.returnReply(arr);
          }
        } else if (this.totalChunkSize + buffer.length >= this.bigStrSize) {
          this.bufferCache.push(buffer);
          var tmp = this.optionReturnBuffers ? concatBulkBuffer(this) : concatBulkString(this);
          this.bigStrSize = 0;
          this.bufferCache = [];
          this.buffer = buffer;
          if (this.arrayCache.length) {
            this.arrayCache[0][this.arrayPos[0]++] = tmp;
            tmp = parseArrayChunks(this);
            if (tmp === void 0) {
              return;
            }
          }
          this.returnReply(tmp);
        } else {
          this.bufferCache.push(buffer);
          this.totalChunkSize += buffer.length;
          return;
        }
        while (this.offset < this.buffer.length) {
          const offset = this.offset;
          const type = this.buffer[this.offset++];
          const response = parseType(this, type);
          if (response === void 0) {
            if (!(this.arrayCache.length || this.bufferCache.length)) {
              this.offset = offset;
            }
            return;
          }
          if (type === 45) {
            this.returnError(response);
          } else {
            this.returnReply(response);
          }
        }
        this.buffer = null;
      }
    };
    module.exports = JavascriptRedisParser;
  }
});

// node_modules/redis-parser/index.js
var require_redis_parser = __commonJS({
  "node_modules/redis-parser/index.js"(exports, module) {
    "use strict";
    module.exports = require_parser();
  }
});

// node_modules/redis-commands/commands.json
var require_commands = __commonJS({
  "node_modules/redis-commands/commands.json"(exports, module) {
    module.exports = {
      acl: {
        arity: -2,
        flags: [
          "admin",
          "noscript",
          "loading",
          "stale",
          "skip_slowlog"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      append: {
        arity: 3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      asking: {
        arity: 1,
        flags: [
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      auth: {
        arity: -2,
        flags: [
          "noscript",
          "loading",
          "stale",
          "skip_monitor",
          "skip_slowlog",
          "fast",
          "no_auth"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      bgrewriteaof: {
        arity: 1,
        flags: [
          "admin",
          "noscript"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      bgsave: {
        arity: -1,
        flags: [
          "admin",
          "noscript"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      bitcount: {
        arity: -2,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      bitfield: {
        arity: -2,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      bitfield_ro: {
        arity: -2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      bitop: {
        arity: -4,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 2,
        keyStop: -1,
        step: 1
      },
      bitpos: {
        arity: -3,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      blmove: {
        arity: 6,
        flags: [
          "write",
          "denyoom",
          "noscript"
        ],
        keyStart: 1,
        keyStop: 2,
        step: 1
      },
      blpop: {
        arity: -3,
        flags: [
          "write",
          "noscript"
        ],
        keyStart: 1,
        keyStop: -2,
        step: 1
      },
      brpop: {
        arity: -3,
        flags: [
          "write",
          "noscript"
        ],
        keyStart: 1,
        keyStop: -2,
        step: 1
      },
      brpoplpush: {
        arity: 4,
        flags: [
          "write",
          "denyoom",
          "noscript"
        ],
        keyStart: 1,
        keyStop: 2,
        step: 1
      },
      bzpopmax: {
        arity: -3,
        flags: [
          "write",
          "noscript",
          "fast"
        ],
        keyStart: 1,
        keyStop: -2,
        step: 1
      },
      bzpopmin: {
        arity: -3,
        flags: [
          "write",
          "noscript",
          "fast"
        ],
        keyStart: 1,
        keyStop: -2,
        step: 1
      },
      client: {
        arity: -2,
        flags: [
          "admin",
          "noscript",
          "random",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      cluster: {
        arity: -2,
        flags: [
          "admin",
          "random",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      command: {
        arity: -1,
        flags: [
          "random",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      config: {
        arity: -2,
        flags: [
          "admin",
          "noscript",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      copy: {
        arity: -3,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 2,
        step: 1
      },
      dbsize: {
        arity: 1,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      debug: {
        arity: -2,
        flags: [
          "admin",
          "noscript",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      decr: {
        arity: 2,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      decrby: {
        arity: 3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      del: {
        arity: -2,
        flags: [
          "write"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      discard: {
        arity: 1,
        flags: [
          "noscript",
          "loading",
          "stale",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      dump: {
        arity: 2,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      echo: {
        arity: 2,
        flags: [
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      eval: {
        arity: -3,
        flags: [
          "noscript",
          "may_replicate",
          "movablekeys"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      evalsha: {
        arity: -3,
        flags: [
          "noscript",
          "may_replicate",
          "movablekeys"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      exec: {
        arity: 1,
        flags: [
          "noscript",
          "loading",
          "stale",
          "skip_monitor",
          "skip_slowlog"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      exists: {
        arity: -2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      expire: {
        arity: 3,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      expireat: {
        arity: 3,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      failover: {
        arity: -1,
        flags: [
          "admin",
          "noscript",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      flushall: {
        arity: -1,
        flags: [
          "write"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      flushdb: {
        arity: -1,
        flags: [
          "write"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      geoadd: {
        arity: -5,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      geodist: {
        arity: -4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      geohash: {
        arity: -2,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      geopos: {
        arity: -2,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      georadius: {
        arity: -6,
        flags: [
          "write",
          "denyoom",
          "movablekeys"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      georadius_ro: {
        arity: -6,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      georadiusbymember: {
        arity: -5,
        flags: [
          "write",
          "denyoom",
          "movablekeys"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      georadiusbymember_ro: {
        arity: -5,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      geosearch: {
        arity: -7,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      geosearchstore: {
        arity: -8,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 2,
        step: 1
      },
      get: {
        arity: 2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      getbit: {
        arity: 3,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      getdel: {
        arity: 2,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      getex: {
        arity: -2,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      getrange: {
        arity: 4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      getset: {
        arity: 3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hdel: {
        arity: -3,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hello: {
        arity: -1,
        flags: [
          "noscript",
          "loading",
          "stale",
          "skip_monitor",
          "skip_slowlog",
          "fast",
          "no_auth"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      hexists: {
        arity: 3,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hget: {
        arity: 3,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hgetall: {
        arity: 2,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hincrby: {
        arity: 4,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hincrbyfloat: {
        arity: 4,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hkeys: {
        arity: 2,
        flags: [
          "readonly",
          "sort_for_script"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hlen: {
        arity: 2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hmget: {
        arity: -3,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hmset: {
        arity: -4,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      "host:": {
        arity: -1,
        flags: [
          "readonly",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      hrandfield: {
        arity: -2,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hscan: {
        arity: -3,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hset: {
        arity: -4,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hsetnx: {
        arity: 4,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hstrlen: {
        arity: 3,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      hvals: {
        arity: 2,
        flags: [
          "readonly",
          "sort_for_script"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      incr: {
        arity: 2,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      incrby: {
        arity: 3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      incrbyfloat: {
        arity: 3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      info: {
        arity: -1,
        flags: [
          "random",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      keys: {
        arity: 2,
        flags: [
          "readonly",
          "sort_for_script"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      lastsave: {
        arity: 1,
        flags: [
          "random",
          "loading",
          "stale",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      latency: {
        arity: -2,
        flags: [
          "admin",
          "noscript",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      lindex: {
        arity: 3,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      linsert: {
        arity: 5,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      llen: {
        arity: 2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      lmove: {
        arity: 5,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 2,
        step: 1
      },
      lolwut: {
        arity: -1,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      lpop: {
        arity: -2,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      lpos: {
        arity: -3,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      lpush: {
        arity: -3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      lpushx: {
        arity: -3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      lrange: {
        arity: 4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      lrem: {
        arity: 4,
        flags: [
          "write"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      lset: {
        arity: 4,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      ltrim: {
        arity: 4,
        flags: [
          "write"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      memory: {
        arity: -2,
        flags: [
          "readonly",
          "random",
          "movablekeys"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      mget: {
        arity: -2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      migrate: {
        arity: -6,
        flags: [
          "write",
          "random",
          "movablekeys"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      module: {
        arity: -2,
        flags: [
          "admin",
          "noscript"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      monitor: {
        arity: 1,
        flags: [
          "admin",
          "noscript",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      move: {
        arity: 3,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      mset: {
        arity: -3,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 2
      },
      msetnx: {
        arity: -3,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 2
      },
      multi: {
        arity: 1,
        flags: [
          "noscript",
          "loading",
          "stale",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      object: {
        arity: -2,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 2,
        keyStop: 2,
        step: 1
      },
      persist: {
        arity: 2,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      pexpire: {
        arity: 3,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      pexpireat: {
        arity: 3,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      pfadd: {
        arity: -2,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      pfcount: {
        arity: -2,
        flags: [
          "readonly",
          "may_replicate"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      pfdebug: {
        arity: -3,
        flags: [
          "write",
          "denyoom",
          "admin"
        ],
        keyStart: 2,
        keyStop: 2,
        step: 1
      },
      pfmerge: {
        arity: -2,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      pfselftest: {
        arity: 1,
        flags: [
          "admin"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      ping: {
        arity: -1,
        flags: [
          "stale",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      post: {
        arity: -1,
        flags: [
          "readonly",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      psetex: {
        arity: 4,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      psubscribe: {
        arity: -2,
        flags: [
          "pubsub",
          "noscript",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      psync: {
        arity: -3,
        flags: [
          "admin",
          "noscript"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      pttl: {
        arity: 2,
        flags: [
          "readonly",
          "random",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      publish: {
        arity: 3,
        flags: [
          "pubsub",
          "loading",
          "stale",
          "fast",
          "may_replicate"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      pubsub: {
        arity: -2,
        flags: [
          "pubsub",
          "random",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      punsubscribe: {
        arity: -1,
        flags: [
          "pubsub",
          "noscript",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      quit: {
        arity: 1,
        flags: [
          "loading",
          "stale",
          "readonly"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      randomkey: {
        arity: 1,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      readonly: {
        arity: 1,
        flags: [
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      readwrite: {
        arity: 1,
        flags: [
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      rename: {
        arity: 3,
        flags: [
          "write"
        ],
        keyStart: 1,
        keyStop: 2,
        step: 1
      },
      renamenx: {
        arity: 3,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 2,
        step: 1
      },
      replconf: {
        arity: -1,
        flags: [
          "admin",
          "noscript",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      replicaof: {
        arity: 3,
        flags: [
          "admin",
          "noscript",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      reset: {
        arity: 1,
        flags: [
          "noscript",
          "loading",
          "stale",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      restore: {
        arity: -4,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      "restore-asking": {
        arity: -4,
        flags: [
          "write",
          "denyoom",
          "asking"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      role: {
        arity: 1,
        flags: [
          "noscript",
          "loading",
          "stale",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      rpop: {
        arity: -2,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      rpoplpush: {
        arity: 3,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 2,
        step: 1
      },
      rpush: {
        arity: -3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      rpushx: {
        arity: -3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      sadd: {
        arity: -3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      save: {
        arity: 1,
        flags: [
          "admin",
          "noscript"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      scan: {
        arity: -2,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      scard: {
        arity: 2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      script: {
        arity: -2,
        flags: [
          "noscript",
          "may_replicate"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      sdiff: {
        arity: -2,
        flags: [
          "readonly",
          "sort_for_script"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      sdiffstore: {
        arity: -3,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      select: {
        arity: 2,
        flags: [
          "loading",
          "stale",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      set: {
        arity: -3,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      setbit: {
        arity: 4,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      setex: {
        arity: 4,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      setnx: {
        arity: 3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      setrange: {
        arity: 4,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      shutdown: {
        arity: -1,
        flags: [
          "admin",
          "noscript",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      sinter: {
        arity: -2,
        flags: [
          "readonly",
          "sort_for_script"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      sinterstore: {
        arity: -3,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      sismember: {
        arity: 3,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      slaveof: {
        arity: 3,
        flags: [
          "admin",
          "noscript",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      slowlog: {
        arity: -2,
        flags: [
          "admin",
          "random",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      smembers: {
        arity: 2,
        flags: [
          "readonly",
          "sort_for_script"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      smismember: {
        arity: -3,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      smove: {
        arity: 4,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 2,
        step: 1
      },
      sort: {
        arity: -2,
        flags: [
          "write",
          "denyoom",
          "movablekeys"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      spop: {
        arity: -2,
        flags: [
          "write",
          "random",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      srandmember: {
        arity: -2,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      srem: {
        arity: -3,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      sscan: {
        arity: -3,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      stralgo: {
        arity: -2,
        flags: [
          "readonly",
          "movablekeys"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      strlen: {
        arity: 2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      subscribe: {
        arity: -2,
        flags: [
          "pubsub",
          "noscript",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      substr: {
        arity: 4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      sunion: {
        arity: -2,
        flags: [
          "readonly",
          "sort_for_script"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      sunionstore: {
        arity: -3,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      swapdb: {
        arity: 3,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      sync: {
        arity: 1,
        flags: [
          "admin",
          "noscript"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      time: {
        arity: 1,
        flags: [
          "random",
          "loading",
          "stale",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      touch: {
        arity: -2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      ttl: {
        arity: 2,
        flags: [
          "readonly",
          "random",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      type: {
        arity: 2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      unlink: {
        arity: -2,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      unsubscribe: {
        arity: -1,
        flags: [
          "pubsub",
          "noscript",
          "loading",
          "stale"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      unwatch: {
        arity: 1,
        flags: [
          "noscript",
          "loading",
          "stale",
          "fast"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      wait: {
        arity: 3,
        flags: [
          "noscript"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      watch: {
        arity: -2,
        flags: [
          "noscript",
          "loading",
          "stale",
          "fast"
        ],
        keyStart: 1,
        keyStop: -1,
        step: 1
      },
      xack: {
        arity: -4,
        flags: [
          "write",
          "random",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      xadd: {
        arity: -5,
        flags: [
          "write",
          "denyoom",
          "random",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      xautoclaim: {
        arity: -6,
        flags: [
          "write",
          "random",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      xclaim: {
        arity: -6,
        flags: [
          "write",
          "random",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      xdel: {
        arity: -3,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      xgroup: {
        arity: -2,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 2,
        keyStop: 2,
        step: 1
      },
      xinfo: {
        arity: -2,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 2,
        keyStop: 2,
        step: 1
      },
      xlen: {
        arity: 2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      xpending: {
        arity: -3,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      xrange: {
        arity: -4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      xread: {
        arity: -4,
        flags: [
          "readonly",
          "movablekeys"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      xreadgroup: {
        arity: -7,
        flags: [
          "write",
          "movablekeys"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      xrevrange: {
        arity: -4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      xsetid: {
        arity: 3,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      xtrim: {
        arity: -2,
        flags: [
          "write",
          "random"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zadd: {
        arity: -4,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zcard: {
        arity: 2,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zcount: {
        arity: 4,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zdiff: {
        arity: -3,
        flags: [
          "readonly",
          "movablekeys"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      zdiffstore: {
        arity: -4,
        flags: [
          "write",
          "denyoom",
          "movablekeys"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zincrby: {
        arity: 4,
        flags: [
          "write",
          "denyoom",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zinter: {
        arity: -3,
        flags: [
          "readonly",
          "movablekeys"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      zinterstore: {
        arity: -4,
        flags: [
          "write",
          "denyoom",
          "movablekeys"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zlexcount: {
        arity: 4,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zmscore: {
        arity: -3,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zpopmax: {
        arity: -2,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zpopmin: {
        arity: -2,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zrandmember: {
        arity: -2,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zrange: {
        arity: -4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zrangebylex: {
        arity: -4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zrangebyscore: {
        arity: -4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zrangestore: {
        arity: -5,
        flags: [
          "write",
          "denyoom"
        ],
        keyStart: 1,
        keyStop: 2,
        step: 1
      },
      zrank: {
        arity: 3,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zrem: {
        arity: -3,
        flags: [
          "write",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zremrangebylex: {
        arity: 4,
        flags: [
          "write"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zremrangebyrank: {
        arity: 4,
        flags: [
          "write"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zremrangebyscore: {
        arity: 4,
        flags: [
          "write"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zrevrange: {
        arity: -4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zrevrangebylex: {
        arity: -4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zrevrangebyscore: {
        arity: -4,
        flags: [
          "readonly"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zrevrank: {
        arity: 3,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zscan: {
        arity: -3,
        flags: [
          "readonly",
          "random"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zscore: {
        arity: 3,
        flags: [
          "readonly",
          "fast"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      },
      zunion: {
        arity: -3,
        flags: [
          "readonly",
          "movablekeys"
        ],
        keyStart: 0,
        keyStop: 0,
        step: 0
      },
      zunionstore: {
        arity: -4,
        flags: [
          "write",
          "denyoom",
          "movablekeys"
        ],
        keyStart: 1,
        keyStop: 1,
        step: 1
      }
    };
  }
});

// node_modules/redis-commands/index.js
var require_redis_commands = __commonJS({
  "node_modules/redis-commands/index.js"(exports) {
    "use strict";
    var commands = require_commands();
    exports.list = Object.keys(commands);
    var flags = {};
    exports.list.forEach(function(commandName) {
      flags[commandName] = commands[commandName].flags.reduce(function(flags2, flag) {
        flags2[flag] = true;
        return flags2;
      }, {});
    });
    exports.exists = function(commandName) {
      return Boolean(commands[commandName]);
    };
    exports.hasFlag = function(commandName, flag) {
      if (!flags[commandName]) {
        throw new Error("Unknown command " + commandName);
      }
      return Boolean(flags[commandName][flag]);
    };
    exports.getKeyIndexes = function(commandName, args, options) {
      var command = commands[commandName];
      if (!command) {
        throw new Error("Unknown command " + commandName);
      }
      if (!Array.isArray(args)) {
        throw new Error("Expect args to be an array");
      }
      var keys = [];
      var i, keyStart, keyStop, parseExternalKey;
      switch (commandName) {
        case "zunionstore":
        case "zinterstore":
          keys.push(0);
        // fall through
        case "eval":
        case "evalsha":
          keyStop = Number(args[1]) + 2;
          for (i = 2; i < keyStop; i++) {
            keys.push(i);
          }
          break;
        case "sort":
          parseExternalKey = options && options.parseExternalKey;
          keys.push(0);
          for (i = 1; i < args.length - 1; i++) {
            if (typeof args[i] !== "string") {
              continue;
            }
            var directive = args[i].toUpperCase();
            if (directive === "GET") {
              i += 1;
              if (args[i] !== "#") {
                if (parseExternalKey) {
                  keys.push([i, getExternalKeyNameLength(args[i])]);
                } else {
                  keys.push(i);
                }
              }
            } else if (directive === "BY") {
              i += 1;
              if (parseExternalKey) {
                keys.push([i, getExternalKeyNameLength(args[i])]);
              } else {
                keys.push(i);
              }
            } else if (directive === "STORE") {
              i += 1;
              keys.push(i);
            }
          }
          break;
        case "migrate":
          if (args[2] === "") {
            for (i = 5; i < args.length - 1; i++) {
              if (args[i].toUpperCase() === "KEYS") {
                for (var j = i + 1; j < args.length; j++) {
                  keys.push(j);
                }
                break;
              }
            }
          } else {
            keys.push(2);
          }
          break;
        case "xreadgroup":
        case "xread":
          for (i = commandName === "xread" ? 0 : 3; i < args.length - 1; i++) {
            if (String(args[i]).toUpperCase() === "STREAMS") {
              for (j = i + 1; j <= i + (args.length - 1 - i) / 2; j++) {
                keys.push(j);
              }
              break;
            }
          }
          break;
        default:
          if (command.step > 0) {
            keyStart = command.keyStart - 1;
            keyStop = command.keyStop > 0 ? command.keyStop : args.length + command.keyStop + 1;
            for (i = keyStart; i < keyStop; i += command.step) {
              keys.push(i);
            }
          }
          break;
      }
      return keys;
    };
    function getExternalKeyNameLength(key) {
      if (typeof key !== "string") {
        key = String(key);
      }
      var hashPos = key.indexOf("->");
      return hashPos === -1 ? key.length : hashPos;
    }
  }
});

// node_modules/redis/lib/debug.js
var require_debug = __commonJS({
  "node_modules/redis/lib/debug.js"(exports, module) {
    "use strict";
    var index = require_redis();
    function debug() {
      if (index.debug_mode) {
        var data = Array.prototype.slice.call(arguments);
        data.unshift((/* @__PURE__ */ new Date()).toISOString());
        console.error.apply(null, data);
      }
    }
    module.exports = debug;
  }
});

// node_modules/redis/lib/createClient.js
var require_createClient = __commonJS({
  "node_modules/redis/lib/createClient.js"(exports, module) {
    "use strict";
    var utils = require_utils();
    var URL = __require("url");
    module.exports = function createClient(port_arg, host_arg, options) {
      if (typeof port_arg === "number" || typeof port_arg === "string" && /^\d+$/.test(port_arg)) {
        var host;
        if (typeof host_arg === "string") {
          host = host_arg;
        } else {
          if (options && host_arg) {
            throw new TypeError("Unknown type of connection in createClient()");
          }
          options = options || host_arg;
        }
        options = utils.clone(options);
        options.host = host || options.host;
        options.port = port_arg;
      } else if (typeof port_arg === "string" || port_arg && port_arg.url) {
        options = utils.clone(port_arg.url ? port_arg : host_arg || options);
        var url = port_arg.url || port_arg;
        var parsed = URL.parse(url, true, true);
        if (parsed.slashes) {
          if (parsed.auth) {
            var columnIndex = parsed.auth.indexOf(":");
            options.password = parsed.auth.slice(columnIndex + 1);
            if (columnIndex > 0) {
              options.user = parsed.auth.slice(0, columnIndex);
            }
          }
          if (parsed.protocol) {
            if (parsed.protocol === "rediss:") {
              options.tls = options.tls || {};
            } else if (parsed.protocol !== "redis:") {
              console.warn('node_redis: WARNING: You passed "' + parsed.protocol.substring(0, parsed.protocol.length - 1) + '" as protocol instead of the "redis" protocol!');
            }
          }
          if (parsed.pathname && parsed.pathname !== "/") {
            options.db = parsed.pathname.substr(1);
          }
          if (parsed.hostname) {
            options.host = parsed.hostname;
          }
          if (parsed.port) {
            options.port = parsed.port;
          }
          if (parsed.search !== "") {
            var elem;
            for (elem in parsed.query) {
              if (elem in options) {
                if (options[elem] === parsed.query[elem]) {
                  console.warn("node_redis: WARNING: You passed the " + elem + " option twice!");
                } else {
                  throw new RangeError("The " + elem + " option is added twice and does not match");
                }
              }
              options[elem] = parsed.query[elem];
            }
          }
        } else if (parsed.hostname) {
          throw new RangeError('The redis url must begin with slashes "//" or contain slashes after the redis protocol');
        } else {
          options.path = url;
        }
      } else if (typeof port_arg === "object" || port_arg === void 0) {
        options = utils.clone(port_arg || options);
        options.host = options.host || host_arg;
        if (port_arg && arguments.length !== 1) {
          throw new TypeError("Too many arguments passed to createClient. Please only pass the options object");
        }
      }
      if (!options) {
        throw new TypeError("Unknown type of connection in createClient()");
      }
      return options;
    };
  }
});

// node_modules/redis/lib/multi.js
var require_multi = __commonJS({
  "node_modules/redis/lib/multi.js"(exports, module) {
    "use strict";
    var Queue = require_denque();
    var utils = require_utils();
    var Command = require_command();
    function Multi(client2, args) {
      this._client = client2;
      this.queue = new Queue();
      var command, tmp_args;
      if (args) {
        for (var i = 0; i < args.length; i++) {
          command = args[i][0];
          tmp_args = args[i].slice(1);
          if (Array.isArray(command)) {
            this[command[0]].apply(this, command.slice(1).concat(tmp_args));
          } else {
            this[command].apply(this, tmp_args);
          }
        }
      }
    }
    function pipeline_transaction_command(self2, command_obj, index) {
      var tmp = command_obj.callback;
      command_obj.callback = function(err, reply) {
        if (err && index !== -1) {
          if (tmp) {
            tmp(err);
          }
          err.position = index;
          self2.errors.push(err);
        }
        self2.wants_buffers[index] = command_obj.buffer_args;
        command_obj.callback = tmp;
      };
      self2._client.internal_send_command(command_obj);
    }
    Multi.prototype.exec_atomic = Multi.prototype.EXEC_ATOMIC = Multi.prototype.execAtomic = function exec_atomic(callback) {
      if (this.queue.length < 2) {
        return this.exec_batch(callback);
      }
      return this.exec(callback);
    };
    function multi_callback(self2, err, replies) {
      var i = 0, command_obj;
      if (err) {
        err.errors = self2.errors;
        if (self2.callback) {
          self2.callback(err);
        } else if (err.code !== "CONNECTION_BROKEN") {
          self2._client.emit("error", err);
        }
        return;
      }
      if (replies) {
        while (command_obj = self2.queue.shift()) {
          if (replies[i] instanceof Error) {
            var match = replies[i].message.match(utils.err_code);
            if (match) {
              replies[i].code = match[1];
            }
            replies[i].command = command_obj.command.toUpperCase();
            if (typeof command_obj.callback === "function") {
              command_obj.callback(replies[i]);
            }
          } else {
            replies[i] = self2._client.handle_reply(replies[i], command_obj.command, self2.wants_buffers[i]);
            if (typeof command_obj.callback === "function") {
              command_obj.callback(null, replies[i]);
            }
          }
          i++;
        }
      }
      if (self2.callback) {
        self2.callback(null, replies);
      }
    }
    Multi.prototype.exec_transaction = function exec_transaction(callback) {
      if (this.monitoring || this._client.monitoring) {
        var err = new RangeError(
          "Using transaction with a client that is in monitor mode does not work due to faulty return values of Redis."
        );
        err.command = "EXEC";
        err.code = "EXECABORT";
        return utils.reply_in_order(this._client, callback, err);
      }
      var self2 = this;
      var len = self2.queue.length;
      self2.errors = [];
      self2.callback = callback;
      self2._client.cork();
      self2.wants_buffers = new Array(len);
      pipeline_transaction_command(self2, new Command("multi", []), -1);
      for (var index = 0; index < len; index++) {
        pipeline_transaction_command(self2, self2.queue.get(index), index);
      }
      self2._client.internal_send_command(new Command("exec", [], function(err2, replies) {
        multi_callback(self2, err2, replies);
      }));
      self2._client.uncork();
      return !self2._client.should_buffer;
    };
    function batch_callback(self2, cb, i) {
      return function batch_callback2(err, res) {
        if (err) {
          self2.results[i] = err;
          self2.results[i].position = i;
        } else {
          self2.results[i] = res;
        }
        cb(err, res);
      };
    }
    Multi.prototype.exec = Multi.prototype.EXEC = Multi.prototype.exec_batch = function exec_batch(callback) {
      var self2 = this;
      var len = self2.queue.length;
      var index = 0;
      var command_obj;
      if (len === 0) {
        utils.reply_in_order(self2._client, callback, null, []);
        return !self2._client.should_buffer;
      }
      self2._client.cork();
      if (!callback) {
        while (command_obj = self2.queue.shift()) {
          self2._client.internal_send_command(command_obj);
        }
        self2._client.uncork();
        return !self2._client.should_buffer;
      }
      var callback_without_own_cb = function(err, res) {
        if (err) {
          self2.results.push(err);
          var i = self2.results.length - 1;
          self2.results[i].position = i;
        } else {
          self2.results.push(res);
        }
      };
      var last_callback = function(cb) {
        return function(err, res) {
          cb(err, res);
          callback(null, self2.results);
        };
      };
      self2.results = [];
      while (command_obj = self2.queue.shift()) {
        if (typeof command_obj.callback === "function") {
          command_obj.callback = batch_callback(self2, command_obj.callback, index);
        } else {
          command_obj.callback = callback_without_own_cb;
        }
        if (typeof callback === "function" && index === len - 1) {
          command_obj.callback = last_callback(command_obj.callback);
        }
        this._client.internal_send_command(command_obj);
        index++;
      }
      self2._client.uncork();
      return !self2._client.should_buffer;
    };
    module.exports = Multi;
  }
});

// node_modules/redis/lib/individualCommands.js
var require_individualCommands = __commonJS({
  "node_modules/redis/lib/individualCommands.js"() {
    "use strict";
    var utils = require_utils();
    var debug = require_debug();
    var Multi = require_multi();
    var Command = require_command();
    var no_password_is_set = /no password is set|called without any password configured/;
    var loading = /LOADING/;
    var RedisClient = require_redis().RedisClient;
    RedisClient.prototype.multi = RedisClient.prototype.MULTI = function multi(args) {
      var multi2 = new Multi(this, args);
      multi2.exec = multi2.EXEC = multi2.exec_transaction;
      return multi2;
    };
    RedisClient.prototype.batch = RedisClient.prototype.BATCH = function batch(args) {
      return new Multi(this, args);
    };
    function select_callback(self2, db, callback) {
      return function(err, res) {
        if (err === null) {
          self2.selected_db = db;
        }
        utils.callback_or_emit(self2, callback, err, res);
      };
    }
    RedisClient.prototype.select = RedisClient.prototype.SELECT = function select(db, callback) {
      return this.internal_send_command(new Command("select", [db], select_callback(this, db, callback)));
    };
    Multi.prototype.select = Multi.prototype.SELECT = function select(db, callback) {
      this.queue.push(new Command("select", [db], select_callback(this._client, db, callback)));
      return this;
    };
    RedisClient.prototype.monitor = RedisClient.prototype.MONITOR = function monitor(callback) {
      var self2 = this;
      var call_on_write = function() {
        self2.monitoring = true;
      };
      return this.internal_send_command(new Command("monitor", [], callback, call_on_write));
    };
    Multi.prototype.monitor = Multi.prototype.MONITOR = function monitor(callback) {
      if (this.exec !== this.exec_transaction) {
        var self2 = this;
        var call_on_write = function() {
          self2._client.monitoring = true;
        };
        this.queue.push(new Command("monitor", [], callback, call_on_write));
        return this;
      }
      this.monitoring = true;
      return this;
    };
    function quit_callback(self2, callback) {
      return function(err, res) {
        if (err && err.code === "NR_CLOSED") {
          err = null;
          res = "OK";
        }
        utils.callback_or_emit(self2, callback, err, res);
        if (self2.stream.writable) {
          self2.stream.destroy();
        }
      };
    }
    RedisClient.prototype.QUIT = RedisClient.prototype.quit = function quit(callback) {
      var backpressure_indicator = this.internal_send_command(new Command("quit", [], quit_callback(this, callback)));
      this.closing = true;
      this.ready = false;
      return backpressure_indicator;
    };
    Multi.prototype.QUIT = Multi.prototype.quit = function quit(callback) {
      var self2 = this._client;
      var call_on_write = function() {
        self2.closing = true;
        self2.ready = false;
      };
      this.queue.push(new Command("quit", [], quit_callback(self2, callback), call_on_write));
      return this;
    };
    function info_callback(self2, callback) {
      return function(err, res) {
        if (res) {
          var obj = {};
          var lines = res.toString().split("\r\n");
          var line, parts, sub_parts;
          for (var i = 0; i < lines.length; i++) {
            parts = lines[i].split(":");
            if (parts[1]) {
              if (parts[0].indexOf("db") === 0) {
                sub_parts = parts[1].split(",");
                obj[parts[0]] = {};
                while (line = sub_parts.pop()) {
                  line = line.split("=");
                  obj[parts[0]][line[0]] = +line[1];
                }
              } else {
                obj[parts[0]] = parts[1];
              }
            }
          }
          obj.versions = [];
          if (obj.redis_version) {
            obj.redis_version.split(".").forEach(function(num) {
              obj.versions.push(+num);
            });
          }
          self2.server_info = obj;
        } else {
          self2.server_info = {};
        }
        utils.callback_or_emit(self2, callback, err, res);
      };
    }
    RedisClient.prototype.info = RedisClient.prototype.INFO = function info(section, callback) {
      var args = [];
      if (typeof section === "function") {
        callback = section;
      } else if (section !== void 0) {
        args = Array.isArray(section) ? section : [section];
      }
      return this.internal_send_command(new Command("info", args, info_callback(this, callback)));
    };
    Multi.prototype.info = Multi.prototype.INFO = function info(section, callback) {
      var args = [];
      if (typeof section === "function") {
        callback = section;
      } else if (section !== void 0) {
        args = Array.isArray(section) ? section : [section];
      }
      this.queue.push(new Command("info", args, info_callback(this._client, callback)));
      return this;
    };
    function auth_callback(self2, pass, user, callback) {
      return function(err, res) {
        if (err) {
          if (no_password_is_set.test(err.message)) {
            self2.warn("Warning: Redis server does not require a password, but a password was supplied.");
            err = null;
            res = "OK";
          } else if (loading.test(err.message)) {
            debug("Redis still loading, trying to authenticate later");
            setTimeout(function() {
              self2.auth(pass, user, callback);
            }, 100);
            return;
          }
        }
        utils.callback_or_emit(self2, callback, err, res);
      };
    }
    RedisClient.prototype.auth = RedisClient.prototype.AUTH = function auth(pass, user, callback) {
      debug("Sending auth to " + this.address + " id " + this.connection_id);
      if (user instanceof Function) {
        callback = user;
        user = null;
      }
      this.auth_pass = pass;
      this.auth_user = user;
      var ready = this.ready;
      this.ready = ready || this.offline_queue.length === 0;
      var tmp = this.internal_send_command(new Command("auth", user ? [user, pass] : [pass], auth_callback(this, pass, user, callback)));
      this.ready = ready;
      return tmp;
    };
    Multi.prototype.auth = Multi.prototype.AUTH = function auth(pass, user, callback) {
      debug("Sending auth to " + this.address + " id " + this.connection_id);
      if (user instanceof Function) {
        callback = user;
        user = null;
      }
      this.auth_pass = pass;
      this.auth_user = user;
      this.queue.push(new Command("auth", user ? [user, pass] : [pass], auth_callback(this._client, pass, user, callback)));
      return this;
    };
    RedisClient.prototype.client = RedisClient.prototype.CLIENT = function client2() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0];
        callback = arguments[1];
      } else if (Array.isArray(arguments[1])) {
        if (len === 3) {
          callback = arguments[2];
        }
        len = arguments[1].length;
        arr = new Array(len + 1);
        arr[0] = arguments[0];
        for (; i < len; i += 1) {
          arr[i + 1] = arguments[1][i];
        }
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      var self2 = this;
      var call_on_write = void 0;
      if (arr.length === 2 && arr[0].toString().toUpperCase() === "REPLY") {
        var reply_on_off = arr[1].toString().toUpperCase();
        if (reply_on_off === "ON" || reply_on_off === "OFF" || reply_on_off === "SKIP") {
          call_on_write = function() {
            self2.reply = reply_on_off;
          };
        }
      }
      return this.internal_send_command(new Command("client", arr, callback, call_on_write));
    };
    Multi.prototype.client = Multi.prototype.CLIENT = function client2() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0];
        callback = arguments[1];
      } else if (Array.isArray(arguments[1])) {
        if (len === 3) {
          callback = arguments[2];
        }
        len = arguments[1].length;
        arr = new Array(len + 1);
        arr[0] = arguments[0];
        for (; i < len; i += 1) {
          arr[i + 1] = arguments[1][i];
        }
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      var self2 = this._client;
      var call_on_write = void 0;
      if (arr.length === 2 && arr[0].toString().toUpperCase() === "REPLY") {
        var reply_on_off = arr[1].toString().toUpperCase();
        if (reply_on_off === "ON" || reply_on_off === "OFF" || reply_on_off === "SKIP") {
          call_on_write = function() {
            self2.reply = reply_on_off;
          };
        }
      }
      this.queue.push(new Command("client", arr, callback, call_on_write));
      return this;
    };
    RedisClient.prototype.hmset = RedisClient.prototype.HMSET = function hmset() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0];
        callback = arguments[1];
      } else if (Array.isArray(arguments[1])) {
        if (len === 3) {
          callback = arguments[2];
        }
        len = arguments[1].length;
        arr = new Array(len + 1);
        arr[0] = arguments[0];
        for (; i < len; i += 1) {
          arr[i + 1] = arguments[1][i];
        }
      } else if (typeof arguments[1] === "object" && (arguments.length === 2 || arguments.length === 3 && (typeof arguments[2] === "function" || typeof arguments[2] === "undefined"))) {
        arr = [arguments[0]];
        for (var field in arguments[1]) {
          arr.push(field, arguments[1][field]);
        }
        callback = arguments[2];
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      return this.internal_send_command(new Command("hmset", arr, callback));
    };
    Multi.prototype.hmset = Multi.prototype.HMSET = function hmset() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0];
        callback = arguments[1];
      } else if (Array.isArray(arguments[1])) {
        if (len === 3) {
          callback = arguments[2];
        }
        len = arguments[1].length;
        arr = new Array(len + 1);
        arr[0] = arguments[0];
        for (; i < len; i += 1) {
          arr[i + 1] = arguments[1][i];
        }
      } else if (typeof arguments[1] === "object" && (arguments.length === 2 || arguments.length === 3 && (typeof arguments[2] === "function" || typeof arguments[2] === "undefined"))) {
        arr = [arguments[0]];
        for (var field in arguments[1]) {
          arr.push(field, arguments[1][field]);
        }
        callback = arguments[2];
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      this.queue.push(new Command("hmset", arr, callback));
      return this;
    };
    RedisClient.prototype.subscribe = RedisClient.prototype.SUBSCRIBE = function subscribe() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      var self2 = this;
      var call_on_write = function() {
        self2.pub_sub_mode = self2.pub_sub_mode || self2.command_queue.length + 1;
      };
      return this.internal_send_command(new Command("subscribe", arr, callback, call_on_write));
    };
    Multi.prototype.subscribe = Multi.prototype.SUBSCRIBE = function subscribe() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      var self2 = this._client;
      var call_on_write = function() {
        self2.pub_sub_mode = self2.pub_sub_mode || self2.command_queue.length + 1;
      };
      this.queue.push(new Command("subscribe", arr, callback, call_on_write));
      return this;
    };
    RedisClient.prototype.unsubscribe = RedisClient.prototype.UNSUBSCRIBE = function unsubscribe() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      var self2 = this;
      var call_on_write = function() {
        self2.pub_sub_mode = self2.pub_sub_mode || self2.command_queue.length + 1;
      };
      return this.internal_send_command(new Command("unsubscribe", arr, callback, call_on_write));
    };
    Multi.prototype.unsubscribe = Multi.prototype.UNSUBSCRIBE = function unsubscribe() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      var self2 = this._client;
      var call_on_write = function() {
        self2.pub_sub_mode = self2.pub_sub_mode || self2.command_queue.length + 1;
      };
      this.queue.push(new Command("unsubscribe", arr, callback, call_on_write));
      return this;
    };
    RedisClient.prototype.psubscribe = RedisClient.prototype.PSUBSCRIBE = function psubscribe() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      var self2 = this;
      var call_on_write = function() {
        self2.pub_sub_mode = self2.pub_sub_mode || self2.command_queue.length + 1;
      };
      return this.internal_send_command(new Command("psubscribe", arr, callback, call_on_write));
    };
    Multi.prototype.psubscribe = Multi.prototype.PSUBSCRIBE = function psubscribe() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      var self2 = this._client;
      var call_on_write = function() {
        self2.pub_sub_mode = self2.pub_sub_mode || self2.command_queue.length + 1;
      };
      this.queue.push(new Command("psubscribe", arr, callback, call_on_write));
      return this;
    };
    RedisClient.prototype.punsubscribe = RedisClient.prototype.PUNSUBSCRIBE = function punsubscribe() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      var self2 = this;
      var call_on_write = function() {
        self2.pub_sub_mode = self2.pub_sub_mode || self2.command_queue.length + 1;
      };
      return this.internal_send_command(new Command("punsubscribe", arr, callback, call_on_write));
    };
    Multi.prototype.punsubscribe = Multi.prototype.PUNSUBSCRIBE = function punsubscribe() {
      var arr, len = arguments.length, callback, i = 0;
      if (Array.isArray(arguments[0])) {
        arr = arguments[0].slice(0);
        callback = arguments[1];
      } else {
        len = arguments.length;
        if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
          len--;
          callback = arguments[len];
        }
        arr = new Array(len);
        for (; i < len; i += 1) {
          arr[i] = arguments[i];
        }
      }
      var self2 = this._client;
      var call_on_write = function() {
        self2.pub_sub_mode = self2.pub_sub_mode || self2.command_queue.length + 1;
      };
      this.queue.push(new Command("punsubscribe", arr, callback, call_on_write));
      return this;
    };
  }
});

// node_modules/redis/lib/extendedApi.js
var require_extendedApi = __commonJS({
  "node_modules/redis/lib/extendedApi.js"() {
    "use strict";
    var utils = require_utils();
    var debug = require_debug();
    var RedisClient = require_redis().RedisClient;
    var Command = require_command();
    var noop = function() {
    };
    RedisClient.prototype.send_command = RedisClient.prototype.sendCommand = function(command, args, callback) {
      if (typeof command !== "string") {
        throw new TypeError('Wrong input type "' + (command !== null && command !== void 0 ? command.constructor.name : command) + '" for command name');
      }
      command = command.toLowerCase();
      if (!Array.isArray(args)) {
        if (args === void 0 || args === null) {
          args = [];
        } else if (typeof args === "function" && callback === void 0) {
          callback = args;
          args = [];
        } else {
          throw new TypeError('Wrong input type "' + args.constructor.name + '" for args');
        }
      }
      if (typeof callback !== "function" && callback !== void 0) {
        throw new TypeError('Wrong input type "' + (callback !== null ? callback.constructor.name : "null") + '" for callback function');
      }
      if (command === "multi" || typeof this[command] !== "function") {
        return this.internal_send_command(new Command(command, args, callback));
      }
      if (typeof callback === "function") {
        args = args.concat([callback]);
      }
      return this[command].apply(this, args);
    };
    RedisClient.prototype.end = function(flush) {
      if (flush) {
        this.flush_and_error({
          message: "Connection forcefully ended and command aborted.",
          code: "NR_CLOSED"
        });
      } else if (arguments.length === 0) {
        this.warn(
          "Using .end() without the flush parameter is deprecated and throws from v.3.0.0 on.\nPlease check the doku (https://github.com/NodeRedis/node_redis) and explictly use flush."
        );
      }
      if (this.retry_timer) {
        clearTimeout(this.retry_timer);
        this.retry_timer = null;
      }
      this.stream.removeAllListeners();
      this.stream.on("error", noop);
      this.connected = false;
      this.ready = false;
      this.closing = true;
      return this.stream.destroySoon();
    };
    RedisClient.prototype.unref = function() {
      if (this.connected) {
        debug("Unref'ing the socket connection");
        this.stream.unref();
      } else {
        debug("Not connected yet, will unref later");
        this.once("connect", function() {
          this.unref();
        });
      }
    };
    RedisClient.prototype.duplicate = function(options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = null;
      }
      var existing_options = utils.clone(this.options);
      options = utils.clone(options);
      for (var elem in options) {
        existing_options[elem] = options[elem];
      }
      var client2 = new RedisClient(existing_options);
      client2.selected_db = options.db || this.selected_db;
      if (typeof callback === "function") {
        var ready_listener = function() {
          callback(null, client2);
          client2.removeAllListeners(error_listener);
        };
        var error_listener = function(err) {
          callback(err);
          client2.end(true);
        };
        client2.once("ready", ready_listener);
        client2.once("error", error_listener);
        return;
      }
      return client2;
    };
  }
});

// node_modules/redis/lib/commands.js
var require_commands2 = __commonJS({
  "node_modules/redis/lib/commands.js"(exports, module) {
    "use strict";
    var commands = require_redis_commands();
    var Multi = require_multi();
    var RedisClient = require_redis().RedisClient;
    var Command = require_command();
    var addCommand = function(command) {
      var commandName = command.replace(/(?:^([0-9])|[^a-zA-Z0-9_$])/g, "_$1");
      if (!RedisClient.prototype[command]) {
        RedisClient.prototype[command.toUpperCase()] = RedisClient.prototype[command] = function() {
          var arr;
          var len = arguments.length;
          var callback;
          var i = 0;
          if (Array.isArray(arguments[0])) {
            arr = arguments[0];
            if (len === 2) {
              callback = arguments[1];
            }
          } else if (len > 1 && Array.isArray(arguments[1])) {
            if (len === 3) {
              callback = arguments[2];
            }
            len = arguments[1].length;
            arr = new Array(len + 1);
            arr[0] = arguments[0];
            for (; i < len; i += 1) {
              arr[i + 1] = arguments[1][i];
            }
          } else {
            if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
              len--;
              callback = arguments[len];
            }
            arr = new Array(len);
            for (; i < len; i += 1) {
              arr[i] = arguments[i];
            }
          }
          return this.internal_send_command(new Command(command, arr, callback));
        };
        if (commandName !== command) {
          RedisClient.prototype[commandName.toUpperCase()] = RedisClient.prototype[commandName] = RedisClient.prototype[command];
        }
        Object.defineProperty(RedisClient.prototype[command], "name", {
          value: commandName
        });
      }
      if (!Multi.prototype[command]) {
        Multi.prototype[command.toUpperCase()] = Multi.prototype[command] = function() {
          var arr;
          var len = arguments.length;
          var callback;
          var i = 0;
          if (Array.isArray(arguments[0])) {
            arr = arguments[0];
            if (len === 2) {
              callback = arguments[1];
            }
          } else if (len > 1 && Array.isArray(arguments[1])) {
            if (len === 3) {
              callback = arguments[2];
            }
            len = arguments[1].length;
            arr = new Array(len + 1);
            arr[0] = arguments[0];
            for (; i < len; i += 1) {
              arr[i + 1] = arguments[1][i];
            }
          } else {
            if (len !== 0 && (typeof arguments[len - 1] === "function" || typeof arguments[len - 1] === "undefined")) {
              len--;
              callback = arguments[len];
            }
            arr = new Array(len);
            for (; i < len; i += 1) {
              arr[i] = arguments[i];
            }
          }
          this.queue.push(new Command(command, arr, callback));
          return this;
        };
        if (commandName !== command) {
          Multi.prototype[commandName.toUpperCase()] = Multi.prototype[commandName] = Multi.prototype[command];
        }
        Object.defineProperty(Multi.prototype[command], "name", {
          value: commandName
        });
      }
    };
    commands.list.forEach(addCommand);
    module.exports = addCommand;
  }
});

// node_modules/redis/index.js
var require_redis = __commonJS({
  "node_modules/redis/index.js"(exports) {
    "use strict";
    var net = __require("net");
    var tls = __require("tls");
    var util = __require("util");
    var utils = require_utils();
    var Command = require_command();
    var Queue = require_denque();
    var errorClasses = require_customErrors();
    var EventEmitter = __require("events");
    var Parser = require_redis_parser();
    var RedisErrors = require_redis_errors();
    var commands = require_redis_commands();
    var debug = require_debug();
    var unifyOptions = require_createClient();
    var SUBSCRIBE_COMMANDS = {
      subscribe: true,
      unsubscribe: true,
      psubscribe: true,
      punsubscribe: true
    };
    function noop() {
    }
    function handle_detect_buffers_reply(reply, command, buffer_args) {
      if (buffer_args === false || this.message_buffers) {
        reply = utils.reply_to_strings(reply);
      }
      if (command === "hgetall") {
        reply = utils.reply_to_object(reply);
      }
      return reply;
    }
    exports.debug_mode = /\bredis\b/i.test(process.env.NODE_DEBUG);
    function RedisClient(options, stream) {
      options = utils.clone(options);
      EventEmitter.call(this);
      var cnx_options = {};
      var self2 = this;
      for (var tls_option in options.tls) {
        cnx_options[tls_option] = options.tls[tls_option];
        if (tls_option === "port" || tls_option === "host" || tls_option === "path" || tls_option === "family") {
          options[tls_option] = options.tls[tls_option];
        }
      }
      if (stream) {
        options.stream = stream;
        this.address = '"Private stream"';
      } else if (options.path) {
        cnx_options.path = options.path;
        this.address = options.path;
      } else {
        cnx_options.port = +options.port || 6379;
        cnx_options.host = options.host || "127.0.0.1";
        cnx_options.family = !options.family && net.isIP(cnx_options.host) || (options.family === "IPv6" ? 6 : 4);
        this.address = cnx_options.host + ":" + cnx_options.port;
      }
      this.connection_options = cnx_options;
      this.connection_id = RedisClient.connection_id++;
      this.connected = false;
      this.ready = false;
      if (options.socket_keepalive === void 0) {
        options.socket_keepalive = true;
      }
      if (options.socket_initial_delay === void 0) {
        options.socket_initial_delay = 0;
      }
      for (var command in options.rename_commands) {
        options.rename_commands[command.toLowerCase()] = options.rename_commands[command];
      }
      options.return_buffers = !!options.return_buffers;
      options.detect_buffers = !!options.detect_buffers;
      if (options.return_buffers && options.detect_buffers) {
        self2.warn("WARNING: You activated return_buffers and detect_buffers at the same time. The return value is always going to be a buffer.");
        options.detect_buffers = false;
      }
      if (options.detect_buffers) {
        this.handle_reply = handle_detect_buffers_reply;
      }
      this.should_buffer = false;
      this.command_queue = new Queue();
      this.offline_queue = new Queue();
      this.pipeline_queue = new Queue();
      this.connect_timeout = +options.connect_timeout || 36e5;
      this.enable_offline_queue = options.enable_offline_queue === false ? false : true;
      this.initialize_retry_vars();
      this.pub_sub_mode = 0;
      this.subscription_set = {};
      this.monitoring = false;
      this.message_buffers = false;
      this.closing = false;
      this.server_info = {};
      this.auth_pass = options.auth_pass || options.password;
      this.auth_user = options.auth_user || options.user;
      this.selected_db = options.db;
      this.fire_strings = true;
      this.pipeline = false;
      this.sub_commands_left = 0;
      this.times_connected = 0;
      this.buffers = options.return_buffers || options.detect_buffers;
      this.options = options;
      this.reply = "ON";
      this.create_stream();
      this.on("newListener", function(event) {
        if ((event === "message_buffer" || event === "pmessage_buffer" || event === "messageBuffer" || event === "pmessageBuffer") && !this.buffers && !this.message_buffers) {
          this.reply_parser.optionReturnBuffers = true;
          this.message_buffers = true;
          this.handle_reply = handle_detect_buffers_reply;
        }
      });
    }
    util.inherits(RedisClient, EventEmitter);
    RedisClient.connection_id = 0;
    function create_parser(self2) {
      return new Parser({
        returnReply: function(data) {
          self2.return_reply(data);
        },
        returnError: function(err) {
          self2.return_error(err);
        },
        returnFatalError: function(err) {
          err.message += ". Please report this.";
          self2.ready = false;
          self2.flush_and_error({
            message: "Fatal error encountered. Command aborted.",
            code: "NR_FATAL"
          }, {
            error: err,
            queues: ["command_queue"]
          });
          self2.emit("error", err);
          self2.create_stream();
        },
        returnBuffers: self2.buffers || self2.message_buffers,
        stringNumbers: self2.options.string_numbers || false
      });
    }
    RedisClient.prototype.create_stream = function() {
      var self2 = this;
      this.reply_parser = create_parser(this);
      if (this.options.stream) {
        if (this.stream) {
          return;
        }
        this.stream = this.options.stream;
      } else {
        if (this.stream) {
          this.stream.removeAllListeners();
          this.stream.destroy();
        }
        if (this.options.tls) {
          this.stream = tls.connect(this.connection_options);
        } else {
          this.stream = net.createConnection(this.connection_options);
        }
      }
      if (this.options.connect_timeout) {
        this.stream.setTimeout(this.connect_timeout, function() {
          self2.retry_totaltime = self2.connect_timeout;
          self2.connection_gone("timeout");
        });
      }
      var connect_event = this.options.tls ? "secureConnect" : "connect";
      this.stream.once(connect_event, function() {
        this.removeAllListeners("timeout");
        self2.times_connected++;
        self2.on_connect();
      });
      this.stream.on("data", function(buffer_from_socket) {
        debug("Net read " + self2.address + " id " + self2.connection_id);
        self2.reply_parser.execute(buffer_from_socket);
      });
      this.stream.on("error", function(err) {
        self2.on_error(err);
      });
      this.stream.once("close", function(hadError) {
        self2.connection_gone("close");
      });
      this.stream.once("end", function() {
        self2.connection_gone("end");
      });
      this.stream.on("drain", function() {
        self2.drain();
      });
      this.stream.setNoDelay();
      if (this.auth_pass !== void 0) {
        this.ready = true;
        this.auth(this.auth_pass, this.auth_user, function(err) {
          if (err && err.code !== "UNCERTAIN_STATE") {
            self2.emit("error", err);
          }
        });
        this.ready = false;
      }
    };
    RedisClient.prototype.handle_reply = function(reply, command) {
      if (command === "hgetall") {
        reply = utils.reply_to_object(reply);
      }
      return reply;
    };
    RedisClient.prototype.cork = noop;
    RedisClient.prototype.uncork = noop;
    RedisClient.prototype.initialize_retry_vars = function() {
      this.retry_timer = null;
      this.retry_totaltime = 0;
      this.retry_delay = 200;
      this.retry_backoff = 1.7;
      this.attempts = 1;
    };
    RedisClient.prototype.warn = function(msg) {
      var self2 = this;
      process.nextTick(function() {
        if (self2.listeners("warning").length !== 0) {
          self2.emit("warning", msg);
        } else {
          console.warn("node_redis:", msg);
        }
      });
    };
    RedisClient.prototype.flush_and_error = function(error_attributes, options) {
      options = options || {};
      var aggregated_errors = [];
      var queue_names = options.queues || ["command_queue", "offline_queue"];
      for (var i = 0; i < queue_names.length; i++) {
        if (queue_names[i] === "command_queue") {
          error_attributes.message += " It might have been processed.";
        } else {
          error_attributes.message = error_attributes.message.replace(" It might have been processed.", "");
        }
        for (var command_obj = this[queue_names[i]].shift(); command_obj; command_obj = this[queue_names[i]].shift()) {
          var err = new errorClasses.AbortError(error_attributes);
          if (command_obj.error) {
            err.stack = err.stack + command_obj.error.stack.replace(/^Error.*?\n/, "\n");
          }
          err.command = command_obj.command.toUpperCase();
          if (command_obj.args && command_obj.args.length) {
            err.args = command_obj.args;
          }
          if (options.error) {
            err.origin = options.error;
          }
          if (typeof command_obj.callback === "function") {
            command_obj.callback(err);
          } else {
            aggregated_errors.push(err);
          }
        }
      }
      if (exports.debug_mode && aggregated_errors.length) {
        var error;
        if (aggregated_errors.length === 1) {
          error = aggregated_errors[0];
        } else {
          error_attributes.message = error_attributes.message.replace("It", "They").replace(/command/i, "$&s");
          error = new errorClasses.AggregateError(error_attributes);
          error.errors = aggregated_errors;
        }
        this.emit("error", error);
      }
    };
    RedisClient.prototype.on_error = function(err) {
      if (this.closing) {
        return;
      }
      err.message = "Redis connection to " + this.address + " failed - " + err.message;
      debug(err.message);
      this.connected = false;
      this.ready = false;
      if (!this.options.retry_strategy) {
        this.emit("error", err);
      }
      this.connection_gone("error", err);
    };
    RedisClient.prototype.on_connect = function() {
      debug("Stream connected " + this.address + " id " + this.connection_id);
      this.connected = true;
      this.ready = false;
      this.emitted_end = false;
      this.stream.setKeepAlive(this.options.socket_keepalive, this.options.socket_initial_delay);
      this.stream.setTimeout(0);
      this.emit("connect");
      this.initialize_retry_vars();
      if (this.options.no_ready_check) {
        this.on_ready();
      } else {
        this.ready_check();
      }
    };
    RedisClient.prototype.on_ready = function() {
      var self2 = this;
      debug("on_ready called " + this.address + " id " + this.connection_id);
      this.ready = true;
      this.cork = function() {
        self2.pipeline = true;
        if (self2.stream.cork) {
          self2.stream.cork();
        }
      };
      this.uncork = function() {
        if (self2.fire_strings) {
          self2.write_strings();
        } else {
          self2.write_buffers();
        }
        self2.pipeline = false;
        self2.fire_strings = true;
        if (self2.stream.uncork) {
          self2.stream.uncork();
        }
      };
      if (this.selected_db !== void 0) {
        this.internal_send_command(new Command("select", [this.selected_db]));
      }
      if (this.monitoring) {
        this.internal_send_command(new Command("monitor", []));
      }
      var callback_count = Object.keys(this.subscription_set).length;
      if (!this.options.disable_resubscribing && callback_count) {
        var callback = function() {
          callback_count--;
          if (callback_count === 0) {
            self2.emit("ready");
          }
        };
        debug("Sending pub/sub on_ready commands");
        for (var key in this.subscription_set) {
          var command = key.slice(0, key.indexOf("_"));
          var args = this.subscription_set[key];
          this[command]([args], callback);
        }
        this.send_offline_queue();
        return;
      }
      this.send_offline_queue();
      this.emit("ready");
    };
    RedisClient.prototype.on_info_cmd = function(err, res) {
      if (err) {
        if (err.message === "ERR unknown command 'info'") {
          this.on_ready();
          return;
        }
        err.message = "Ready check failed: " + err.message;
        this.emit("error", err);
        return;
      }
      if (!res) {
        debug("The info command returned without any data.");
        this.on_ready();
        return;
      }
      if (!this.server_info.loading || this.server_info.loading === "0") {
        if (this.server_info.master_link_status && this.server_info.master_link_status !== "up") {
          this.server_info.loading_eta_seconds = 0.05;
        } else {
          debug("Redis server ready.");
          this.on_ready();
          return;
        }
      }
      var retry_time = +this.server_info.loading_eta_seconds * 1e3;
      if (retry_time > 1e3) {
        retry_time = 1e3;
      }
      debug("Redis server still loading, trying again in " + retry_time);
      setTimeout(function(self2) {
        self2.ready_check();
      }, retry_time, this);
    };
    RedisClient.prototype.ready_check = function() {
      var self2 = this;
      debug("Checking server ready state...");
      this.ready = true;
      this.info(function(err, res) {
        self2.on_info_cmd(err, res);
      });
      this.ready = false;
    };
    RedisClient.prototype.send_offline_queue = function() {
      for (var command_obj = this.offline_queue.shift(); command_obj; command_obj = this.offline_queue.shift()) {
        debug("Sending offline command: " + command_obj.command);
        this.internal_send_command(command_obj);
      }
      this.drain();
    };
    var retry_connection = function(self2, error) {
      debug("Retrying connection...");
      var reconnect_params = {
        delay: self2.retry_delay,
        attempt: self2.attempts,
        error
      };
      if (self2.options.camel_case) {
        reconnect_params.totalRetryTime = self2.retry_totaltime;
        reconnect_params.timesConnected = self2.times_connected;
      } else {
        reconnect_params.total_retry_time = self2.retry_totaltime;
        reconnect_params.times_connected = self2.times_connected;
      }
      self2.emit("reconnecting", reconnect_params);
      self2.retry_totaltime += self2.retry_delay;
      self2.attempts += 1;
      self2.retry_delay = Math.round(self2.retry_delay * self2.retry_backoff);
      self2.create_stream();
      self2.retry_timer = null;
    };
    RedisClient.prototype.connection_gone = function(why, error) {
      if (this.retry_timer) {
        return;
      }
      error = error || null;
      debug("Redis connection is gone from " + why + " event.");
      this.connected = false;
      this.ready = false;
      this.cork = noop;
      this.uncork = noop;
      this.pipeline = false;
      this.pub_sub_mode = 0;
      if (!this.emitted_end) {
        this.emit("end");
        this.emitted_end = true;
      }
      if (this.closing) {
        debug("Connection ended by quit / end command, not retrying.");
        this.flush_and_error({
          message: "Stream connection ended and command aborted.",
          code: "NR_CLOSED"
        }, {
          error
        });
        return;
      }
      if (typeof this.options.retry_strategy === "function") {
        var retry_params = {
          attempt: this.attempts,
          error
        };
        if (this.options.camel_case) {
          retry_params.totalRetryTime = this.retry_totaltime;
          retry_params.timesConnected = this.times_connected;
        } else {
          retry_params.total_retry_time = this.retry_totaltime;
          retry_params.times_connected = this.times_connected;
        }
        this.retry_delay = this.options.retry_strategy(retry_params);
        if (typeof this.retry_delay !== "number") {
          if (this.retry_delay instanceof Error) {
            error = this.retry_delay;
          }
          var errorMessage = "Redis connection in broken state: retry aborted.";
          this.flush_and_error({
            message: errorMessage,
            code: "CONNECTION_BROKEN"
          }, {
            error
          });
          var retryError = new Error(errorMessage);
          retryError.code = "CONNECTION_BROKEN";
          if (error) {
            retryError.origin = error;
          }
          this.end(false);
          this.emit("error", retryError);
          return;
        }
      }
      if (this.retry_totaltime >= this.connect_timeout) {
        var message = "Redis connection in broken state: connection timeout exceeded.";
        this.flush_and_error({
          message,
          code: "CONNECTION_BROKEN"
        }, {
          error
        });
        var err = new Error(message);
        err.code = "CONNECTION_BROKEN";
        if (error) {
          err.origin = error;
        }
        this.end(false);
        this.emit("error", err);
        return;
      }
      if (this.options.retry_unfulfilled_commands) {
        this.offline_queue.unshift.apply(this.offline_queue, this.command_queue.toArray());
        this.command_queue.clear();
      } else if (this.command_queue.length !== 0) {
        this.flush_and_error({
          message: "Redis connection lost and command aborted.",
          code: "UNCERTAIN_STATE"
        }, {
          error,
          queues: ["command_queue"]
        });
      }
      if (this.retry_totaltime + this.retry_delay > this.connect_timeout) {
        this.retry_delay = this.connect_timeout - this.retry_totaltime;
      }
      debug("Retry connection in " + this.retry_delay + " ms");
      this.retry_timer = setTimeout(retry_connection, this.retry_delay, this, error);
    };
    RedisClient.prototype.return_error = function(err) {
      var command_obj = this.command_queue.shift();
      if (command_obj.error) {
        err.stack = command_obj.error.stack.replace(/^Error.*?\n/, "ReplyError: " + err.message + "\n");
      }
      err.command = command_obj.command.toUpperCase();
      if (command_obj.args && command_obj.args.length) {
        err.args = command_obj.args;
      }
      if (this.pub_sub_mode > 1) {
        this.pub_sub_mode--;
      }
      var match = err.message.match(utils.err_code);
      if (match) {
        err.code = match[1];
      }
      utils.callback_or_emit(this, command_obj.callback, err);
    };
    RedisClient.prototype.drain = function() {
      this.should_buffer = false;
    };
    function normal_reply(self2, reply) {
      var command_obj = self2.command_queue.shift();
      if (typeof command_obj.callback === "function") {
        if (command_obj.command !== "exec") {
          reply = self2.handle_reply(reply, command_obj.command, command_obj.buffer_args);
        }
        command_obj.callback(null, reply);
      } else {
        debug("No callback for reply");
      }
    }
    function subscribe_unsubscribe(self2, reply, type) {
      var command_obj = self2.command_queue.get(0);
      var buffer = self2.options.return_buffers || self2.options.detect_buffers && command_obj.buffer_args;
      var channel = buffer || reply[1] === null ? reply[1] : reply[1].toString();
      var count = +reply[2];
      debug(type, channel);
      if (channel !== null) {
        self2.emit(type, channel, count);
        if (type === "subscribe" || type === "psubscribe") {
          self2.subscription_set[type + "_" + channel] = channel;
        } else {
          type = type === "unsubscribe" ? "subscribe" : "psubscribe";
          delete self2.subscription_set[type + "_" + channel];
        }
      }
      if (command_obj.args.length === 1 || self2.sub_commands_left === 1 || command_obj.args.length === 0 && (count === 0 || channel === null)) {
        if (count === 0) {
          var running_command;
          var i = 1;
          self2.pub_sub_mode = 0;
          while (running_command = self2.command_queue.get(i)) {
            if (SUBSCRIBE_COMMANDS[running_command.command]) {
              self2.pub_sub_mode = i;
              break;
            }
            i++;
          }
        }
        self2.command_queue.shift();
        if (typeof command_obj.callback === "function") {
          command_obj.callback(null, channel);
        }
        self2.sub_commands_left = 0;
      } else {
        if (self2.sub_commands_left !== 0) {
          self2.sub_commands_left--;
        } else {
          self2.sub_commands_left = command_obj.args.length ? command_obj.args.length - 1 : count;
        }
      }
    }
    function return_pub_sub(self2, reply) {
      var type = reply[0].toString();
      if (type === "message") {
        if (!self2.options.return_buffers || self2.message_buffers) {
          self2.emit("message", reply[1].toString(), reply[2].toString());
          self2.emit("message_buffer", reply[1], reply[2]);
          self2.emit("messageBuffer", reply[1], reply[2]);
        } else {
          self2.emit("message", reply[1], reply[2]);
        }
      } else if (type === "pmessage") {
        if (!self2.options.return_buffers || self2.message_buffers) {
          self2.emit("pmessage", reply[1].toString(), reply[2].toString(), reply[3].toString());
          self2.emit("pmessage_buffer", reply[1], reply[2], reply[3]);
          self2.emit("pmessageBuffer", reply[1], reply[2], reply[3]);
        } else {
          self2.emit("pmessage", reply[1], reply[2], reply[3]);
        }
      } else {
        subscribe_unsubscribe(self2, reply, type);
      }
    }
    RedisClient.prototype.return_reply = function(reply) {
      if (this.monitoring) {
        var replyStr;
        if (this.buffers && Buffer.isBuffer(reply)) {
          replyStr = reply.toString();
        } else {
          replyStr = reply;
        }
        if (typeof replyStr === "string" && utils.monitor_regex.test(replyStr)) {
          var timestamp = replyStr.slice(0, replyStr.indexOf(" "));
          var args = replyStr.slice(replyStr.indexOf('"') + 1, -1).split('" "').map(function(elem) {
            return elem.replace(/\\"/g, '"');
          });
          this.emit("monitor", timestamp, args, replyStr);
          return;
        }
      }
      if (this.pub_sub_mode === 0) {
        normal_reply(this, reply);
      } else if (this.pub_sub_mode !== 1) {
        this.pub_sub_mode--;
        normal_reply(this, reply);
      } else if (!(reply instanceof Array) || reply.length <= 2) {
        normal_reply(this, reply);
      } else {
        return_pub_sub(this, reply);
      }
    };
    function handle_offline_command(self2, command_obj) {
      var command = command_obj.command;
      var err, msg;
      if (self2.closing || !self2.enable_offline_queue) {
        command = command.toUpperCase();
        if (!self2.closing) {
          if (self2.stream.writable) {
            msg = "The connection is not yet established and the offline queue is deactivated.";
          } else {
            msg = "Stream not writeable.";
          }
        } else {
          msg = "The connection is already closed.";
        }
        err = new errorClasses.AbortError({
          message: command + " can't be processed. " + msg,
          code: "NR_CLOSED",
          command
        });
        if (command_obj.args.length) {
          err.args = command_obj.args;
        }
        utils.reply_in_order(self2, command_obj.callback, err);
      } else {
        debug("Queueing " + command + " for next server connection.");
        self2.offline_queue.push(command_obj);
      }
      self2.should_buffer = true;
    }
    RedisClient.prototype.internal_send_command = function(command_obj) {
      var arg, prefix_keys;
      var i = 0;
      var command_str = "";
      var args = command_obj.args;
      var command = command_obj.command;
      var len = args.length;
      var big_data = false;
      var args_copy = new Array(len);
      if (process.domain && command_obj.callback) {
        command_obj.callback = process.domain.bind(command_obj.callback);
      }
      if (this.ready === false || this.stream.writable === false) {
        handle_offline_command(this, command_obj);
        return false;
      }
      for (i = 0; i < len; i += 1) {
        if (typeof args[i] === "string") {
          if (args[i].length > 3e4) {
            big_data = true;
            args_copy[i] = Buffer.from(args[i], "utf8");
          } else {
            args_copy[i] = args[i];
          }
        } else if (typeof args[i] === "object") {
          if (args[i] instanceof Date) {
            args_copy[i] = args[i].toString();
          } else if (Buffer.isBuffer(args[i])) {
            args_copy[i] = args[i];
            command_obj.buffer_args = true;
            big_data = true;
          } else {
            var invalidArgError = new Error(
              "node_redis: The " + command.toUpperCase() + " command contains a invalid argument type.\nOnly strings, dates and buffers are accepted. Please update your code to use valid argument types."
            );
            invalidArgError.command = command_obj.command.toUpperCase();
            if (command_obj.args && command_obj.args.length) {
              invalidArgError.args = command_obj.args;
            }
            if (command_obj.callback) {
              command_obj.callback(invalidArgError);
              return false;
            }
            throw invalidArgError;
          }
        } else if (typeof args[i] === "undefined") {
          var undefinedArgError = new Error(
            "node_redis: The " + command.toUpperCase() + ' command contains a invalid argument type of "undefined".\nOnly strings, dates and buffers are accepted. Please update your code to use valid argument types.'
          );
          undefinedArgError.command = command_obj.command.toUpperCase();
          if (command_obj.args && command_obj.args.length) {
            undefinedArgError.args = command_obj.args;
          }
          command_obj.callback(undefinedArgError);
          return false;
        } else {
          args_copy[i] = "" + args[i];
        }
      }
      if (this.options.prefix) {
        prefix_keys = commands.getKeyIndexes(command, args_copy);
        for (i = prefix_keys.pop(); i !== void 0; i = prefix_keys.pop()) {
          args_copy[i] = this.options.prefix + args_copy[i];
        }
      }
      if (this.options.rename_commands && this.options.rename_commands[command]) {
        command = this.options.rename_commands[command];
      }
      command_str = "*" + (len + 1) + "\r\n$" + command.length + "\r\n" + command + "\r\n";
      if (big_data === false) {
        for (i = 0; i < len; i += 1) {
          arg = args_copy[i];
          command_str += "$" + Buffer.byteLength(arg) + "\r\n" + arg + "\r\n";
        }
        debug("Send " + this.address + " id " + this.connection_id + ": " + command_str);
        this.write(command_str);
      } else {
        debug("Send command (" + command_str + ") has Buffer arguments");
        this.fire_strings = false;
        this.write(command_str);
        for (i = 0; i < len; i += 1) {
          arg = args_copy[i];
          if (typeof arg === "string") {
            this.write("$" + Buffer.byteLength(arg) + "\r\n" + arg + "\r\n");
          } else {
            this.write("$" + arg.length + "\r\n");
            this.write(arg);
            this.write("\r\n");
          }
          debug("send_command: buffer send " + arg.length + " bytes");
        }
      }
      if (command_obj.call_on_write) {
        command_obj.call_on_write();
      }
      if (this.reply === "ON") {
        this.command_queue.push(command_obj);
      } else {
        if (command_obj.callback) {
          utils.reply_in_order(this, command_obj.callback, null, void 0, this.command_queue);
        }
        if (this.reply === "SKIP") {
          this.reply = "SKIP_ONE_MORE";
        } else if (this.reply === "SKIP_ONE_MORE") {
          this.reply = "ON";
        }
      }
      return !this.should_buffer;
    };
    RedisClient.prototype.write_strings = function() {
      var str = "";
      for (var command = this.pipeline_queue.shift(); command; command = this.pipeline_queue.shift()) {
        if (str.length + command.length > 4 * 1024 * 1024) {
          this.should_buffer = !this.stream.write(str);
          str = "";
        }
        str += command;
      }
      if (str !== "") {
        this.should_buffer = !this.stream.write(str);
      }
    };
    RedisClient.prototype.write_buffers = function() {
      for (var command = this.pipeline_queue.shift(); command; command = this.pipeline_queue.shift()) {
        this.should_buffer = !this.stream.write(command);
      }
    };
    RedisClient.prototype.write = function(data) {
      if (this.pipeline === false) {
        this.should_buffer = !this.stream.write(data);
        return;
      }
      this.pipeline_queue.push(data);
    };
    Object.defineProperty(exports, "debugMode", {
      get: function() {
        return this.debug_mode;
      },
      set: function(val) {
        this.debug_mode = val;
      }
    });
    Object.defineProperty(RedisClient.prototype, "command_queue_length", {
      get: function() {
        return this.command_queue.length;
      }
    });
    Object.defineProperty(RedisClient.prototype, "offline_queue_length", {
      get: function() {
        return this.offline_queue.length;
      }
    });
    Object.defineProperty(RedisClient.prototype, "retryDelay", {
      get: function() {
        return this.retry_delay;
      }
    });
    Object.defineProperty(RedisClient.prototype, "retryBackoff", {
      get: function() {
        return this.retry_backoff;
      }
    });
    Object.defineProperty(RedisClient.prototype, "commandQueueLength", {
      get: function() {
        return this.command_queue.length;
      }
    });
    Object.defineProperty(RedisClient.prototype, "offlineQueueLength", {
      get: function() {
        return this.offline_queue.length;
      }
    });
    Object.defineProperty(RedisClient.prototype, "shouldBuffer", {
      get: function() {
        return this.should_buffer;
      }
    });
    Object.defineProperty(RedisClient.prototype, "connectionId", {
      get: function() {
        return this.connection_id;
      }
    });
    Object.defineProperty(RedisClient.prototype, "serverInfo", {
      get: function() {
        return this.server_info;
      }
    });
    exports.createClient = function() {
      return new RedisClient(unifyOptions.apply(null, arguments));
    };
    exports.RedisClient = RedisClient;
    exports.print = utils.print;
    exports.Multi = require_multi();
    exports.AbortError = errorClasses.AbortError;
    exports.RedisError = RedisErrors.RedisError;
    exports.ParserError = RedisErrors.ParserError;
    exports.ReplyError = RedisErrors.ReplyError;
    exports.AggregateError = errorClasses.AggregateError;
    require_individualCommands();
    require_extendedApi();
    exports.addCommand = exports.add_command = require_commands2();
  }
});

// node_modules/fast-memoize/src/index.js
var require_src = __commonJS({
  "node_modules/fast-memoize/src/index.js"(exports, module) {
    function memoize2(fn, options) {
      var cache = options && options.cache ? options.cache : cacheDefault;
      var serializer = options && options.serializer ? options.serializer : serializerDefault;
      var strategy = options && options.strategy ? options.strategy : strategyDefault;
      return strategy(fn, {
        cache,
        serializer
      });
    }
    function isPrimitive(value) {
      return value == null || typeof value === "number" || typeof value === "boolean";
    }
    function monadic(fn, cache, serializer, arg) {
      var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
      var computedValue = cache.get(cacheKey);
      if (typeof computedValue === "undefined") {
        computedValue = fn.call(this, arg);
        cache.set(cacheKey, computedValue);
      }
      return computedValue;
    }
    function variadic(fn, cache, serializer) {
      var args = Array.prototype.slice.call(arguments, 3);
      var cacheKey = serializer(args);
      var computedValue = cache.get(cacheKey);
      if (typeof computedValue === "undefined") {
        computedValue = fn.apply(this, args);
        cache.set(cacheKey, computedValue);
      }
      return computedValue;
    }
    function assemble(fn, context, strategy, cache, serialize) {
      return strategy.bind(
        context,
        fn,
        cache,
        serialize
      );
    }
    function strategyDefault(fn, options) {
      var strategy = fn.length === 1 ? monadic : variadic;
      return assemble(
        fn,
        this,
        strategy,
        options.cache.create(),
        options.serializer
      );
    }
    function strategyVariadic(fn, options) {
      var strategy = variadic;
      return assemble(
        fn,
        this,
        strategy,
        options.cache.create(),
        options.serializer
      );
    }
    function strategyMonadic(fn, options) {
      var strategy = monadic;
      return assemble(
        fn,
        this,
        strategy,
        options.cache.create(),
        options.serializer
      );
    }
    function serializerDefault() {
      return JSON.stringify(arguments);
    }
    function ObjectWithoutPrototypeCache() {
      this.cache = /* @__PURE__ */ Object.create(null);
    }
    ObjectWithoutPrototypeCache.prototype.has = function(key) {
      return key in this.cache;
    };
    ObjectWithoutPrototypeCache.prototype.get = function(key) {
      return this.cache[key];
    };
    ObjectWithoutPrototypeCache.prototype.set = function(key, value) {
      this.cache[key] = value;
    };
    var cacheDefault = {
      create: function create() {
        return new ObjectWithoutPrototypeCache();
      }
    };
    module.exports = memoize2;
    module.exports.strategies = {
      variadic: strategyVariadic,
      monadic: strategyMonadic
    };
  }
});

// node_modules/seedrandom/lib/alea.js
var require_alea = __commonJS({
  "node_modules/seedrandom/lib/alea.js"(exports, module) {
    (function(global2, module2, define2) {
      function Alea(seed) {
        var me = this, mash = Mash();
        me.next = function() {
          var t = 2091639 * me.s0 + me.c * 23283064365386963e-26;
          me.s0 = me.s1;
          me.s1 = me.s2;
          return me.s2 = t - (me.c = t | 0);
        };
        me.c = 1;
        me.s0 = mash(" ");
        me.s1 = mash(" ");
        me.s2 = mash(" ");
        me.s0 -= mash(seed);
        if (me.s0 < 0) {
          me.s0 += 1;
        }
        me.s1 -= mash(seed);
        if (me.s1 < 0) {
          me.s1 += 1;
        }
        me.s2 -= mash(seed);
        if (me.s2 < 0) {
          me.s2 += 1;
        }
        mash = null;
      }
      function copy(f, t) {
        t.c = f.c;
        t.s0 = f.s0;
        t.s1 = f.s1;
        t.s2 = f.s2;
        return t;
      }
      function impl(seed, opts) {
        var xg = new Alea(seed), state = opts && opts.state, prng = xg.next;
        prng.int32 = function() {
          return xg.next() * 4294967296 | 0;
        };
        prng.double = function() {
          return prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
        };
        prng.quick = prng;
        if (state) {
          if (typeof state == "object") copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      function Mash() {
        var n = 4022871197;
        var mash = function(data) {
          data = String(data);
          for (var i = 0; i < data.length; i++) {
            n += data.charCodeAt(i);
            var h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 4294967296;
          }
          return (n >>> 0) * 23283064365386963e-26;
        };
        return mash;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.alea = impl;
      }
    })(
      exports,
      typeof module == "object" && module,
      // present in node.js
      typeof define == "function" && define
      // present with an AMD loader
    );
  }
});

// node_modules/seedrandom/lib/xor128.js
var require_xor128 = __commonJS({
  "node_modules/seedrandom/lib/xor128.js"(exports, module) {
    (function(global2, module2, define2) {
      function XorGen(seed) {
        var me = this, strseed = "";
        me.x = 0;
        me.y = 0;
        me.z = 0;
        me.w = 0;
        me.next = function() {
          var t = me.x ^ me.x << 11;
          me.x = me.y;
          me.y = me.z;
          me.z = me.w;
          return me.w ^= me.w >>> 19 ^ t ^ t >>> 8;
        };
        if (seed === (seed | 0)) {
          me.x = seed;
        } else {
          strseed += seed;
        }
        for (var k = 0; k < strseed.length + 64; k++) {
          me.x ^= strseed.charCodeAt(k) | 0;
          me.next();
        }
      }
      function copy(f, t) {
        t.x = f.x;
        t.y = f.y;
        t.z = f.z;
        t.w = f.w;
        return t;
      }
      function impl(seed, opts) {
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object") copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xor128 = impl;
      }
    })(
      exports,
      typeof module == "object" && module,
      // present in node.js
      typeof define == "function" && define
      // present with an AMD loader
    );
  }
});

// node_modules/seedrandom/lib/xorwow.js
var require_xorwow = __commonJS({
  "node_modules/seedrandom/lib/xorwow.js"(exports, module) {
    (function(global2, module2, define2) {
      function XorGen(seed) {
        var me = this, strseed = "";
        me.next = function() {
          var t = me.x ^ me.x >>> 2;
          me.x = me.y;
          me.y = me.z;
          me.z = me.w;
          me.w = me.v;
          return (me.d = me.d + 362437 | 0) + (me.v = me.v ^ me.v << 4 ^ (t ^ t << 1)) | 0;
        };
        me.x = 0;
        me.y = 0;
        me.z = 0;
        me.w = 0;
        me.v = 0;
        if (seed === (seed | 0)) {
          me.x = seed;
        } else {
          strseed += seed;
        }
        for (var k = 0; k < strseed.length + 64; k++) {
          me.x ^= strseed.charCodeAt(k) | 0;
          if (k == strseed.length) {
            me.d = me.x << 10 ^ me.x >>> 4;
          }
          me.next();
        }
      }
      function copy(f, t) {
        t.x = f.x;
        t.y = f.y;
        t.z = f.z;
        t.w = f.w;
        t.v = f.v;
        t.d = f.d;
        return t;
      }
      function impl(seed, opts) {
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object") copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xorwow = impl;
      }
    })(
      exports,
      typeof module == "object" && module,
      // present in node.js
      typeof define == "function" && define
      // present with an AMD loader
    );
  }
});

// node_modules/seedrandom/lib/xorshift7.js
var require_xorshift7 = __commonJS({
  "node_modules/seedrandom/lib/xorshift7.js"(exports, module) {
    (function(global2, module2, define2) {
      function XorGen(seed) {
        var me = this;
        me.next = function() {
          var X = me.x, i = me.i, t, v, w;
          t = X[i];
          t ^= t >>> 7;
          v = t ^ t << 24;
          t = X[i + 1 & 7];
          v ^= t ^ t >>> 10;
          t = X[i + 3 & 7];
          v ^= t ^ t >>> 3;
          t = X[i + 4 & 7];
          v ^= t ^ t << 7;
          t = X[i + 7 & 7];
          t = t ^ t << 13;
          v ^= t ^ t << 9;
          X[i] = v;
          me.i = i + 1 & 7;
          return v;
        };
        function init(me2, seed2) {
          var j, w, X = [];
          if (seed2 === (seed2 | 0)) {
            w = X[0] = seed2;
          } else {
            seed2 = "" + seed2;
            for (j = 0; j < seed2.length; ++j) {
              X[j & 7] = X[j & 7] << 15 ^ seed2.charCodeAt(j) + X[j + 1 & 7] << 13;
            }
          }
          while (X.length < 8) X.push(0);
          for (j = 0; j < 8 && X[j] === 0; ++j) ;
          if (j == 8) w = X[7] = -1;
          else w = X[j];
          me2.x = X;
          me2.i = 0;
          for (j = 256; j > 0; --j) {
            me2.next();
          }
        }
        init(me, seed);
      }
      function copy(f, t) {
        t.x = f.x.slice();
        t.i = f.i;
        return t;
      }
      function impl(seed, opts) {
        if (seed == null) seed = +/* @__PURE__ */ new Date();
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (state.x) copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xorshift7 = impl;
      }
    })(
      exports,
      typeof module == "object" && module,
      // present in node.js
      typeof define == "function" && define
      // present with an AMD loader
    );
  }
});

// node_modules/seedrandom/lib/xor4096.js
var require_xor4096 = __commonJS({
  "node_modules/seedrandom/lib/xor4096.js"(exports, module) {
    (function(global2, module2, define2) {
      function XorGen(seed) {
        var me = this;
        me.next = function() {
          var w = me.w, X = me.X, i = me.i, t, v;
          me.w = w = w + 1640531527 | 0;
          v = X[i + 34 & 127];
          t = X[i = i + 1 & 127];
          v ^= v << 13;
          t ^= t << 17;
          v ^= v >>> 15;
          t ^= t >>> 12;
          v = X[i] = v ^ t;
          me.i = i;
          return v + (w ^ w >>> 16) | 0;
        };
        function init(me2, seed2) {
          var t, v, i, j, w, X = [], limit = 128;
          if (seed2 === (seed2 | 0)) {
            v = seed2;
            seed2 = null;
          } else {
            seed2 = seed2 + "\0";
            v = 0;
            limit = Math.max(limit, seed2.length);
          }
          for (i = 0, j = -32; j < limit; ++j) {
            if (seed2) v ^= seed2.charCodeAt((j + 32) % seed2.length);
            if (j === 0) w = v;
            v ^= v << 10;
            v ^= v >>> 15;
            v ^= v << 4;
            v ^= v >>> 13;
            if (j >= 0) {
              w = w + 1640531527 | 0;
              t = X[j & 127] ^= v + w;
              i = 0 == t ? i + 1 : 0;
            }
          }
          if (i >= 128) {
            X[(seed2 && seed2.length || 0) & 127] = -1;
          }
          i = 127;
          for (j = 4 * 128; j > 0; --j) {
            v = X[i + 34 & 127];
            t = X[i = i + 1 & 127];
            v ^= v << 13;
            t ^= t << 17;
            v ^= v >>> 15;
            t ^= t >>> 12;
            X[i] = v ^ t;
          }
          me2.w = w;
          me2.X = X;
          me2.i = i;
        }
        init(me, seed);
      }
      function copy(f, t) {
        t.i = f.i;
        t.w = f.w;
        t.X = f.X.slice();
        return t;
      }
      ;
      function impl(seed, opts) {
        if (seed == null) seed = +/* @__PURE__ */ new Date();
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (state.X) copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.xor4096 = impl;
      }
    })(
      exports,
      // window object or global
      typeof module == "object" && module,
      // present in node.js
      typeof define == "function" && define
      // present with an AMD loader
    );
  }
});

// node_modules/seedrandom/lib/tychei.js
var require_tychei = __commonJS({
  "node_modules/seedrandom/lib/tychei.js"(exports, module) {
    (function(global2, module2, define2) {
      function XorGen(seed) {
        var me = this, strseed = "";
        me.next = function() {
          var b = me.b, c = me.c, d = me.d, a = me.a;
          b = b << 25 ^ b >>> 7 ^ c;
          c = c - d | 0;
          d = d << 24 ^ d >>> 8 ^ a;
          a = a - b | 0;
          me.b = b = b << 20 ^ b >>> 12 ^ c;
          me.c = c = c - d | 0;
          me.d = d << 16 ^ c >>> 16 ^ a;
          return me.a = a - b | 0;
        };
        me.a = 0;
        me.b = 0;
        me.c = 2654435769 | 0;
        me.d = 1367130551;
        if (seed === Math.floor(seed)) {
          me.a = seed / 4294967296 | 0;
          me.b = seed | 0;
        } else {
          strseed += seed;
        }
        for (var k = 0; k < strseed.length + 20; k++) {
          me.b ^= strseed.charCodeAt(k) | 0;
          me.next();
        }
      }
      function copy(f, t) {
        t.a = f.a;
        t.b = f.b;
        t.c = f.c;
        t.d = f.d;
        return t;
      }
      ;
      function impl(seed, opts) {
        var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
          return (xg.next() >>> 0) / 4294967296;
        };
        prng.double = function() {
          do {
            var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
          } while (result === 0);
          return result;
        };
        prng.int32 = xg.next;
        prng.quick = prng;
        if (state) {
          if (typeof state == "object") copy(state, xg);
          prng.state = function() {
            return copy(xg, {});
          };
        }
        return prng;
      }
      if (module2 && module2.exports) {
        module2.exports = impl;
      } else if (define2 && define2.amd) {
        define2(function() {
          return impl;
        });
      } else {
        this.tychei = impl;
      }
    })(
      exports,
      typeof module == "object" && module,
      // present in node.js
      typeof define == "function" && define
      // present with an AMD loader
    );
  }
});

// node_modules/seedrandom/seedrandom.js
var require_seedrandom = __commonJS({
  "node_modules/seedrandom/seedrandom.js"(exports, module) {
    (function(global2, pool, math) {
      var width = 256, chunks = 6, digits = 52, rngname = "random", startdenom = math.pow(width, chunks), significance = math.pow(2, digits), overflow = significance * 2, mask = width - 1, nodecrypto;
      function seedrandom2(seed, options, callback) {
        var key = [];
        options = options == true ? { entropy: true } : options || {};
        var shortseed = mixkey(flatten(
          options.entropy ? [seed, tostring(pool)] : seed == null ? autoseed() : seed,
          3
        ), key);
        var arc4 = new ARC4(key);
        var prng = function() {
          var n = arc4.g(chunks), d = startdenom, x = 0;
          while (n < significance) {
            n = (n + x) * width;
            d *= width;
            x = arc4.g(1);
          }
          while (n >= overflow) {
            n /= 2;
            d /= 2;
            x >>>= 1;
          }
          return (n + x) / d;
        };
        prng.int32 = function() {
          return arc4.g(4) | 0;
        };
        prng.quick = function() {
          return arc4.g(4) / 4294967296;
        };
        prng.double = prng;
        mixkey(tostring(arc4.S), pool);
        return (options.pass || callback || function(prng2, seed2, is_math_call, state) {
          if (state) {
            if (state.S) {
              copy(state, arc4);
            }
            prng2.state = function() {
              return copy(arc4, {});
            };
          }
          if (is_math_call) {
            math[rngname] = prng2;
            return seed2;
          } else return prng2;
        })(
          prng,
          shortseed,
          "global" in options ? options.global : this == math,
          options.state
        );
      }
      function ARC4(key) {
        var t, keylen = key.length, me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];
        if (!keylen) {
          key = [keylen++];
        }
        while (i < width) {
          s[i] = i++;
        }
        for (i = 0; i < width; i++) {
          s[i] = s[j = mask & j + key[i % keylen] + (t = s[i])];
          s[j] = t;
        }
        (me.g = function(count) {
          var t2, r = 0, i2 = me.i, j2 = me.j, s2 = me.S;
          while (count--) {
            t2 = s2[i2 = mask & i2 + 1];
            r = r * width + s2[mask & (s2[i2] = s2[j2 = mask & j2 + t2]) + (s2[j2] = t2)];
          }
          me.i = i2;
          me.j = j2;
          return r;
        })(width);
      }
      function copy(f, t) {
        t.i = f.i;
        t.j = f.j;
        t.S = f.S.slice();
        return t;
      }
      ;
      function flatten(obj, depth) {
        var result = [], typ = typeof obj, prop;
        if (depth && typ == "object") {
          for (prop in obj) {
            try {
              result.push(flatten(obj[prop], depth - 1));
            } catch (e) {
            }
          }
        }
        return result.length ? result : typ == "string" ? obj : obj + "\0";
      }
      function mixkey(seed, key) {
        var stringseed = seed + "", smear, j = 0;
        while (j < stringseed.length) {
          key[mask & j] = mask & (smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++);
        }
        return tostring(key);
      }
      function autoseed() {
        try {
          var out;
          if (nodecrypto && (out = nodecrypto.randomBytes)) {
            out = out(width);
          } else {
            out = new Uint8Array(width);
            (global2.crypto || global2.msCrypto).getRandomValues(out);
          }
          return tostring(out);
        } catch (e) {
          var browser = global2.navigator, plugins = browser && browser.plugins;
          return [+/* @__PURE__ */ new Date(), global2, plugins, global2.screen, tostring(pool)];
        }
      }
      function tostring(a) {
        return String.fromCharCode.apply(0, a);
      }
      mixkey(math.random(), pool);
      if (typeof module == "object" && module.exports) {
        module.exports = seedrandom2;
        try {
          nodecrypto = __require("crypto");
        } catch (ex) {
        }
      } else if (typeof define == "function" && define.amd) {
        define(function() {
          return seedrandom2;
        });
      } else {
        math["seed" + rngname] = seedrandom2;
      }
    })(
      // global: `self` in browsers (including strict mode and web workers),
      // otherwise `this` in Node and other environments
      typeof self !== "undefined" ? self : exports,
      [],
      // pool: entropy pool starts empty
      Math
      // math: package containing random, pow, and seedrandom
    );
  }
});

// node_modules/seedrandom/index.js
var require_seedrandom2 = __commonJS({
  "node_modules/seedrandom/index.js"(exports, module) {
    var alea = require_alea();
    var xor128 = require_xor128();
    var xorwow = require_xorwow();
    var xorshift7 = require_xorshift7();
    var xor4096 = require_xor4096();
    var tychei = require_tychei();
    var sr = require_seedrandom();
    sr.alea = alea;
    sr.xor128 = xor128;
    sr.xorwow = xorwow;
    sr.xorshift7 = xorshift7;
    sr.xor4096 = xor4096;
    sr.tychei = tychei;
    module.exports = sr;
  }
});

// node_modules/global/window.js
var require_window = __commonJS({
  "node_modules/global/window.js"(exports, module) {
    var win;
    if (typeof window !== "undefined") {
      win = window;
    } else if (typeof global !== "undefined") {
      win = global;
    } else if (typeof self !== "undefined") {
      win = self;
    } else {
      win = {};
    }
    module.exports = win;
  }
});

// api-src/post-day-results.ts
var import_redis2 = __toESM(require_redis(), 1);

// src/enums.ts
var cropType = (
  /** @type {const} */
  {
    ASPARAGUS: "ASPARAGUS",
    CARROT: "CARROT",
    CORN: "CORN",
    GARLIC: "GARLIC",
    GRAPE: "GRAPE",
    JALAPENO: "JALAPENO",
    OLIVE: "OLIVE",
    ONION: "ONION",
    PEA: "PEA",
    POTATO: "POTATO",
    PUMPKIN: "PUMPKIN",
    SOYBEAN: "SOYBEAN",
    SPINACH: "SPINACH",
    SUNFLOWER: "SUNFLOWER",
    STRAWBERRY: "STRAWBERRY",
    SWEET_POTATO: "SWEET_POTATO",
    TOMATO: "TOMATO",
    WATERMELON: "WATERMELON",
    WHEAT: "WHEAT",
    WEED: "WEED"
  }
);
var recipeType = (
  /** @type {const} */
  {
    FERMENTATION: "FERMENTATION",
    FORGE: "FORGE",
    KITCHEN: "KITCHEN",
    RECYCLING: "RECYCLING",
    WINE: "WINE"
  }
);
var fieldMode = (
  /** @type {const} */
  {
    CLEANUP: "CLEANUP",
    FERTILIZE: "FERTILIZE",
    HARVEST: "HARVEST",
    MINE: "MINE",
    OBSERVE: "OBSERVE",
    PLANT: "PLANT",
    SET_SPRINKLER: "SET_SPRINKLER",
    SET_SCARECROW: "SET_SCARECROW",
    WATER: "WATER"
  }
);
var stageFocusType = (
  /** @type {const} */
  {
    NONE: "NONE",
    // Used for testing
    HOME: "HOME",
    FIELD: "FIELD",
    FOREST: "FOREST",
    SHOP: "SHOP",
    COW_PEN: "COW_PEN",
    INVENTORY: "INVENTORY",
    WORKSHOP: "WORKSHOP",
    CELLAR: "CELLAR"
  }
);
var itemType = (
  /** @type {const} */
  {
    COW_FEED: "COW_FEED",
    CRAFTED_ITEM: "CRAFTED_ITEM",
    CROP: "CROP",
    FERTILIZER: "FERTILIZER",
    FUEL: "FUEL",
    HUGGING_MACHINE: "HUGGING_MACHINE",
    MILK: "MILK",
    ORE: "ORE",
    SCARECROW: "SCARECROW",
    SPRINKLER: "SPRINKLER",
    STONE: "STONE",
    TOOL_UPGRADE: "TOOL_UPGRADE",
    WEED: "WEED"
  }
);
var cowColors = (
  /** @type {const} */
  {
    BLUE: "BLUE",
    BROWN: "BROWN",
    GREEN: "GREEN",
    ORANGE: "ORANGE",
    PURPLE: "PURPLE",
    RAINBOW: "RAINBOW",
    WHITE: "WHITE",
    YELLOW: "YELLOW"
  }
);
var { RAINBOW, ...standardCowColors } = cowColors;
var toolType = (
  /** @type {const} */
  {
    SCYTHE: "SCYTHE",
    SHOVEL: "SHOVEL",
    HOE: "HOE",
    WATERING_CAN: "WATERING_CAN"
  }
);
var toolLevel = (
  /** @type {const} */
  {
    UNAVAILABLE: "UNAVAILABLE",
    DEFAULT: "DEFAULT",
    BRONZE: "BRONZE",
    IRON: "IRON",
    SILVER: "SILVER",
    GOLD: "GOLD"
  }
);
var cropFamily = {
  GRAPE: "GRAPE"
};
var grapeVariety = {
  CHARDONNAY: "CHARDONNAY",
  SAUVIGNON_BLANC: "SAUVIGNON_BLANC",
  //PINOT_BLANC: 'PINOT_BLANC',
  //MUSCAT: 'MUSCAT',
  //RIESLING: 'RIESLING',
  //MERLOT: 'MERLOT',
  CABERNET_SAUVIGNON: "CABERNET_SAUVIGNON",
  //SYRAH: 'SYRAH',
  TEMPRANILLO: "TEMPRANILLO",
  NEBBIOLO: "NEBBIOLO"
};

// src/data/recipes.ts
var recipes_exports = {};
__export(recipes_exports, {
  bread: () => bread,
  bronzeIngot: () => bronzeIngot,
  burger: () => burger,
  butter: () => butter,
  carrotSoup: () => carrotSoup,
  cheese: () => cheese,
  chicknPotPie: () => chicknPotPie,
  chocolate: () => chocolate,
  chocolateSoyMilk: () => chocolateSoyMilk,
  compost: () => compost,
  fertilizer: () => fertilizer,
  flour: () => flour,
  frenchOnionSoup: () => frenchOnionSoup,
  friedTofu: () => friedTofu,
  garlicBread: () => garlicBread,
  garlicFries: () => garlicFries,
  goldIngot: () => goldIngot,
  hotSauce: () => hotSauce,
  ironIngot: () => ironIngot,
  jackolantern: () => jackolantern,
  oliveOil: () => oliveOil,
  onionRings: () => onionRings,
  popcorn: () => popcorn,
  pumpkinPie: () => pumpkinPie,
  rainbowCheese: () => rainbowCheese,
  salsa: () => salsa,
  salt: () => salt,
  silverIngot: () => silverIngot,
  soyMilk: () => soyMilk,
  spaghetti: () => spaghetti,
  spicyCheese: () => spicyCheese,
  spicyPickledGarlic: () => spicyPickledGarlic,
  strawberryJam: () => strawberryJam,
  summerSalad: () => summerSalad,
  sunButter: () => sunButter,
  sweetPotatoFries: () => sweetPotatoFries,
  sweetPotatoPie: () => sweetPotatoPie,
  tofu: () => tofu,
  vegetableOil: () => vegetableOil,
  wineCabernetSauvignon: () => wineCabernetSauvignon,
  wineChardonnay: () => wineChardonnay,
  wineNebbiolo: () => wineNebbiolo,
  wineSauvignonBlanc: () => wineSauvignonBlanc,
  wineTempranillo: () => wineTempranillo,
  yeast: () => yeast
});

// src/constants.ts
var { freeze } = Object;
var MEMOIZE_CACHE_CLEAR_THRESHOLD = 10;
var PURCHASEABLE_FIELD_SIZES = freeze(
  /* @__PURE__ */ new Map([
    [1, { columns: 8, rows: 12, price: 1e3 }],
    [2, { columns: 10, rows: 16, price: 5e3 }],
    [3, { columns: 12, rows: 18, price: 2e4 }]
  ])
);
var PURCHASABLE_FOREST_SIZES = freeze(
  /* @__PURE__ */ new Map([
    [1, { columns: 4, rows: 2, price: 1e5 }],
    [2, { columns: 4, rows: 3, price: 2e5 }],
    [3, { columns: 4, rows: 4, price: 3e5 }]
  ])
);
var LARGEST_PURCHASABLE_FIELD_SIZE = (
  /** @type {farmhand.purchaseableFieldSize} */
  PURCHASEABLE_FIELD_SIZES.get(
    PURCHASEABLE_FIELD_SIZES.size
  )
);
var PURCHASEABLE_COMBINES = freeze(
  /* @__PURE__ */ new Map([[1, { type: "Basic", price: 25e4 }]])
);
var PURCHASEABLE_COMPOSTERS = freeze(
  /* @__PURE__ */ new Map([[1, { type: "Basic", price: 1e3 }]])
);
var PURCHASEABLE_SMELTERS = freeze(
  /* @__PURE__ */ new Map([[1, { type: "Basic", price: 25e4 }]])
);
var PURCHASEABLE_COW_PENS = freeze(
  /* @__PURE__ */ new Map([
    [1, { cows: 10, price: 1500 }],
    [2, { cows: 20, price: 1e4 }],
    [3, { cows: 30, price: 5e4 }]
  ])
);
var PURCHASEABLE_CELLARS = freeze(
  /* @__PURE__ */ new Map([
    [1, { space: 10, price: 25e4 }],
    [2, { space: 20, price: 75e4 }],
    [3, { space: 30, price: 2e6 }]
  ])
);
var INITIAL_SPRINKLER_RANGE = 1;
var COW_FEED_ITEM_ID = "cow-feed";
var HUGGING_MACHINE_ITEM_ID = "hugging-machine";
var NOTIFICATION_DURATION = import.meta.env?.MODE === "test" ? 1 : 6e3;
var STAGE_TITLE_MAP = {
  [stageFocusType.HOME]: "Home",
  [stageFocusType.FIELD]: "Field",
  [stageFocusType.FOREST]: "Forest",
  [stageFocusType.SHOP]: "Shop",
  [stageFocusType.COW_PEN]: "Cows",
  [stageFocusType.WORKSHOP]: "Workshop",
  [stageFocusType.CELLAR]: "Cellar"
};
var RECIPE_INGREDIENT_VALUE_MULTIPLIER = 1.25;
var TOOLBELT_FIELD_MODES = /* @__PURE__ */ new Set([
  fieldMode.CLEANUP,
  fieldMode.HARVEST,
  fieldMode.WATER,
  fieldMode.MINE
]);
var COAL_SPAWN_CHANCE = 0.15;
var STONE_SPAWN_CHANCE = 0.4;
var SALT_ROCK_SPAWN_CHANCE = 0.3;
var BRONZE_SPAWN_CHANCE = 0.4;
var GOLD_SPAWN_CHANCE = 0.07;
var IRON_SPAWN_CHANCE = 0.33;
var SILVER_SPAWN_CHANCE = 0.2;
var HOE_LEVEL_TO_SEED_RECLAIM_RATE = {
  [toolLevel.DEFAULT]: 0,
  [toolLevel.BRONZE]: 0.25,
  [toolLevel.IRON]: 0.5,
  [toolLevel.SILVER]: 0.75,
  [toolLevel.GOLD]: 1
};
var COW_COLORS_HEX_MAP = {
  [cowColors.BLUE]: "#8ff0f9",
  [cowColors.BROWN]: "#b45f28",
  [cowColors.GREEN]: "#65f295",
  [cowColors.ORANGE]: "#ff7031",
  [cowColors.PURPLE]: "#d884f2",
  [cowColors.WHITE]: "#ffffff",
  [cowColors.YELLOW]: "#fff931"
};
var STANDARD_VIEW_LIST = [stageFocusType.SHOP, stageFocusType.FIELD];
var HEARTBEAT_INTERVAL_PERIOD = 10 * 1e3;
var GRAPES_REQUIRED_FOR_WINE = 50;
var YEAST_REQUIREMENT_FOR_WINE_MULTIPLIER = 5;

// src/utils/memoize.ts
var import_fast_memoize = __toESM(require_src(), 1);
var MemoizeCache = class {
  cache = {};
  /**
   * @param {Object} [config] Can also contain the config options used to
   * configure fast-memoize.
   * @param {number} [config.cacheSize]
   * @see https://github.com/caiogondim/fast-memoize.js
   */
  constructor({ cacheSize = MEMOIZE_CACHE_CLEAR_THRESHOLD } = {}) {
    this.cacheSize = cacheSize;
  }
  has(key) {
    return key in this.cache;
  }
  get(key) {
    return this.cache[key];
  }
  set(key, value) {
    if (Object.keys(this.cache).length > this.cacheSize) {
      this.cache = {};
    }
    this.cache[key] = value;
  }
};
var memoize = (fn, config) => (0, import_fast_memoize.default)(fn, {
  cache: { create: () => new MemoizeCache(config) },
  ...config
});

// src/utils/getCropLifecycleDuration.ts
var getCropLifecycleDuration = memoize(({ cropTimeline }) => {
  return cropTimeline.reduce((acc, value) => {
    return acc + value;
  }, 0);
});

// src/data/crop.ts
var { freeze: freeze2 } = Object;
var crop = ({
  cropTimeline,
  growsInto,
  tier = 1,
  isSeed = Boolean(growsInto),
  cropLifecycleDuration = getCropLifecycleDuration({ cropTimeline }),
  id = "",
  name = "",
  ...rest
}) => freeze2(
  /** @type {farmhand.item} */
  {
    id,
    name,
    cropTimeline,
    doesPriceFluctuate: true,
    tier,
    type: itemType.CROP,
    value: 10 + cropLifecycleDuration * tier * (isSeed ? 1 : 3),
    ...isSeed && {
      enablesFieldMode: fieldMode.PLANT,
      growsInto,
      isPlantableCrop: true
    },
    ...rest
  }
);
var fromSeed = ({ cropTimeline, cropType: cropType2, growsInto, tier = 1 }, { variantIdx = 0, canBeFermented = false } = {}) => {
  const variants = Array.isArray(growsInto) ? growsInto : [growsInto];
  return (
    /** @type {farmhand.item} */
    {
      id: variants[variantIdx] || "",
      cropTimeline,
      cropType: cropType2,
      doesPriceFluctuate: true,
      tier,
      type: itemType.CROP,
      ...canBeFermented && {
        daysToFerment: getCropLifecycleDuration({ cropTimeline }) * tier
      }
    }
  );
};
var cropVariety = ({
  imageId,
  cropFamily: cropFamily2,
  variety,
  ...cropVarietyProperties
}) => {
  return { imageId, cropFamily: cropFamily2, variety, ...crop({ ...cropVarietyProperties }) };
};

// src/data/crops/grape.ts
var isGrape = (item) => {
  return "cropFamily" in item && item.cropFamily === cropFamily.GRAPE;
};
var grape = (grapeProps) => {
  const newGrape = {
    ...cropVariety({
      ...grapeProps,
      cropFamily: (
        /** @type {'GRAPE'} */
        cropFamily.GRAPE
      )
    })
  };
  if (!isGrape(newGrape)) {
    throw new Error(`Invalid cropVariety props`);
  }
  return newGrape;
};
var grapeSeed = crop({
  cropType: cropType.GRAPE,
  cropTimeline: [3, 4],
  growsInto: [
    "grape-chardonnay",
    "grape-sauvignon-blanc",
    // 'grape-pinot-blanc',
    // 'grape-muscat',
    // 'grape-riesling',
    // 'grape-merlot',
    "grape-cabernet-sauvignon",
    // 'grape-syrah',
    "grape-tempranillo",
    "grape-nebbiolo"
  ],
  id: "grape-seed",
  name: "Grape Seed",
  tier: 7
});
var grapeVarietyNameMap = {
  [grapeVariety.CHARDONNAY]: "Chardonnay",
  [grapeVariety.SAUVIGNON_BLANC]: "Sauvignon Blanc",
  //[grapeVariety.PINOT_BLANC]: 'Pinot Blanc',
  //[grapeVariety.MUSCAT]: 'Muscat',
  //[grapeVariety.RIESLING]: 'Riesling',
  //[grapeVariety.MERLOT]: 'Merlot',
  [grapeVariety.CABERNET_SAUVIGNON]: "Cabernet Sauvignon",
  //[grapeVariety.SYRAH]: 'Syrah',
  [grapeVariety.TEMPRANILLO]: "Tempranillo",
  [grapeVariety.NEBBIOLO]: "Nebbiolo"
};
var wineVarietyValueMap = {
  [grapeVariety.CHARDONNAY]: 1,
  [grapeVariety.SAUVIGNON_BLANC]: 8,
  //[grapeVariety.PINOT_BLANC]: 2,
  //[grapeVariety.MUSCAT]: 4,
  //[grapeVariety.RIESLING]: 7,
  //[grapeVariety.MERLOT]: 6,
  [grapeVariety.CABERNET_SAUVIGNON]: 3,
  //[grapeVariety.SYRAH]: 9,
  [grapeVariety.TEMPRANILLO]: 5,
  [grapeVariety.NEBBIOLO]: 10
};
var grapeChardonnay = grape({
  // @ts-expect-error
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf("grape-chardonnay")
  }),
  name: "Chardonnay Grape",
  imageId: "grape-green",
  variety: (
    /** @type {'CHARDONNAY'} */
    grapeVariety.CHARDONNAY
  ),
  wineId: "wine-chardonnay"
});
var grapeSauvignonBlanc = grape({
  // @ts-expect-error
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf("grape-sauvignon-blanc")
  }),
  name: "Sauvignon Blanc Grape",
  imageId: "grape-green",
  variety: (
    /** @type {'SAUVIGNON_BLANC'} */
    grapeVariety.SAUVIGNON_BLANC
  ),
  wineId: "wine-sauvignon-blanc"
});
var grapeCabernetSauvignon = grape({
  // @ts-expect-error
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf("grape-cabernet-sauvignon")
  }),
  name: "Cabernet Sauvignon Grape",
  imageId: "grape-purple",
  variety: (
    /** @type {'CABERNET_SAUVIGNON'} */
    grapeVariety.CABERNET_SAUVIGNON
  ),
  wineId: "wine-cabernet-sauvignon"
});
var grapeTempranillo = grape({
  // @ts-expect-error
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf("grape-tempranillo")
  }),
  name: "Tempranillo Grape",
  imageId: "grape-purple",
  variety: (
    /** @type {'TEMPRANILLO'} */
    grapeVariety.TEMPRANILLO
  ),
  wineId: "wine-tempranillo"
});
var grapeNebbiolo = grape({
  // @ts-expect-error
  ...fromSeed(grapeSeed, {
    variantIdx: grapeSeed.growsInto?.indexOf("grape-nebbiolo")
  }),
  name: "Nebbiolo Grape",
  imageId: "grape-purple",
  variety: (
    /** @type {'NEBBIOLO'} */
    grapeVariety.NEBBIOLO
  ),
  wineId: "wine-nebbiolo"
});
var grapeVarietyToGrapeItemMap = {
  [grapeVariety.CHARDONNAY]: grapeChardonnay,
  [grapeVariety.SAUVIGNON_BLANC]: grapeSauvignonBlanc,
  //[grapeVariety.PINOT_BLANC]: grapePinotBlanc,
  //[grapeVariety.MUSCAT]: grapeMuscat,
  //[grapeVariety.RIESLING]: grapeRiesling,
  //[grapeVariety.MERLOT]: grapeMerlot,
  [grapeVariety.CABERNET_SAUVIGNON]: grapeCabernetSauvignon,
  //[grapeVariety.SYRAH]: grapeSyrah,
  [grapeVariety.TEMPRANILLO]: grapeTempranillo,
  [grapeVariety.NEBBIOLO]: grapeNebbiolo
};

// src/utils/getYeastRequiredForWine.ts
var getYeastRequiredForWine = (grapeVariety2) => {
  return wineVarietyValueMap[grapeVariety2] * YEAST_REQUIREMENT_FOR_WINE_MULTIPLIER;
};

// src/data/items.ts
var items_exports = {};
__export(items_exports, {
  asparagus: () => asparagus,
  asparagusSeed: () => asparagusSeed,
  bronzeOre: () => bronzeOre,
  carrot: () => carrot,
  carrotSeed: () => carrotSeed,
  chocolateMilk: () => chocolateMilk,
  coal: () => coal,
  corn: () => corn,
  cornSeed: () => cornSeed,
  cowFeed: () => cowFeed,
  garlic: () => garlic,
  garlicSeed: () => garlicSeed,
  goldOre: () => goldOre,
  grapeCabernetSauvignon: () => grapeCabernetSauvignon,
  grapeChardonnay: () => grapeChardonnay,
  grapeNebbiolo: () => grapeNebbiolo,
  grapeSauvignonBlanc: () => grapeSauvignonBlanc,
  grapeSeed: () => grapeSeed,
  grapeTempranillo: () => grapeTempranillo,
  huggingMachine: () => huggingMachine,
  ironOre: () => ironOre,
  jalapeno: () => jalapeno,
  jalapenoSeed: () => jalapenoSeed,
  milk1: () => milk1,
  milk2: () => milk2,
  milk3: () => milk3,
  olive: () => olive,
  oliveSeed: () => oliveSeed,
  onion: () => onion,
  onionSeed: () => onionSeed,
  pea: () => pea,
  peaSeed: () => peaSeed,
  potato: () => potato,
  potatoSeed: () => potatoSeed,
  pumpkin: () => pumpkin,
  pumpkinSeed: () => pumpkinSeed,
  rainbowFertilizer: () => rainbowFertilizer,
  rainbowMilk1: () => rainbowMilk1,
  rainbowMilk2: () => rainbowMilk2,
  rainbowMilk3: () => rainbowMilk3,
  saltRock: () => saltRock,
  scarecrow: () => scarecrow,
  silverOre: () => silverOre,
  soybean: () => soybean,
  soybeanSeed: () => soybeanSeed,
  spinach: () => spinach,
  spinachSeed: () => spinachSeed,
  sprinkler: () => sprinkler,
  stone: () => stone,
  strawberry: () => strawberry,
  strawberrySeed: () => strawberrySeed,
  sunflower: () => sunflower,
  sunflowerSeed: () => sunflowerSeed,
  sweetPotato: () => sweetPotato,
  sweetPotatoSeed: () => sweetPotatoSeed,
  tomato: () => tomato,
  tomatoSeed: () => tomatoSeed,
  watermelon: () => watermelon,
  watermelonSeed: () => watermelonSeed,
  weed: () => weed,
  wheat: () => wheat,
  wheatSeed: () => wheatSeed
});

// src/data/crops/asparagus.ts
var asparagusSeed = crop({
  cropType: cropType.ASPARAGUS,
  cropTimeline: [4, 2, 2, 1],
  growsInto: "asparagus",
  id: "asparagus-seed",
  name: "Asparagus Seed",
  tier: 4
});
var asparagus = crop({
  // @ts-expect-error
  ...fromSeed(asparagusSeed, {
    canBeFermented: true
  }),
  name: "Asparagus"
});

// src/data/crops/carrot.ts
var carrotSeed = crop({
  cropType: cropType.CARROT,
  cropTimeline: [2, 1, 1, 1],
  growsInto: "carrot",
  id: "carrot-seed",
  name: "Carrot Seed",
  tier: 1
});
var carrot = crop({
  // @ts-expect-error
  ...fromSeed(carrotSeed, {
    canBeFermented: true
  }),
  name: "Carrot"
});

// src/data/crops/corn.ts
var cornSeed = crop({
  cropType: cropType.CORN,
  cropTimeline: [3, 1, 1, 1, 2, 2],
  growsInto: "corn",
  id: "corn-seed",
  name: "Corn Kernels",
  tier: 2
});
var corn = crop({
  // @ts-expect-error
  ...fromSeed(cornSeed, {
    canBeFermented: true
  }),
  name: "Corn"
});

// src/data/crops/garlic.ts
var garlicSeed = crop({
  cropType: cropType.GARLIC,
  cropTimeline: [2, 1, 1, 1],
  growsInto: "garlic",
  id: "garlic-seed",
  name: "Garlic Bulb",
  tier: 5
});
var garlic = crop({
  // @ts-expect-error
  ...fromSeed(garlicSeed, {
    canBeFermented: true
  }),
  name: "Garlic"
});

// src/data/crops/jalapeno.ts
var jalapenoSeed = crop({
  cropType: cropType.JALAPENO,
  cropTimeline: [2, 1, 1, 1],
  growsInto: "jalapeno",
  id: "jalapeno-seed",
  name: "Jalape\xF1o Seed",
  tier: 4
});
var jalapeno = crop({
  // @ts-expect-error
  ...fromSeed(jalapenoSeed, {
    canBeFermented: true
  }),
  name: "Jalape\xF1o"
});

// src/data/crops/olive.ts
var oliveSeed = crop({
  cropType: cropType.OLIVE,
  cropTimeline: [3, 6],
  growsInto: "olive",
  id: "olive-seed",
  name: "Olive Seed",
  tier: 6
});
var olive = crop({
  // @ts-expect-error
  ...fromSeed(oliveSeed, {
    canBeFermented: true
  }),
  name: "Olive"
});

// src/data/crops/onion.ts
var onionSeed = crop({
  cropType: cropType.ONION,
  cropTimeline: [3, 1, 2, 1],
  growsInto: "onion",
  id: "onion-seed",
  name: "Onion Seeds",
  tier: 2
});
var onion = crop({
  // @ts-expect-error
  ...fromSeed(onionSeed, {
    canBeFermented: true
  }),
  name: "Onion"
});

// src/data/crops/pea.ts
var peaSeed = crop({
  cropType: cropType.PEA,
  cropTimeline: [2, 3],
  growsInto: "pea",
  id: "pea-seed",
  name: "Pea Seed",
  tier: 5
});
var pea = crop({
  // @ts-expect-error
  ...fromSeed(peaSeed, {
    canBeFermented: true
  }),
  name: "Pea"
});

// src/data/crops/potato.ts
var potatoSeed = crop({
  cropType: cropType.POTATO,
  cropTimeline: [2, 1, 1, 1],
  growsInto: "potato",
  id: "potato-seed",
  name: "Potato Seeds",
  tier: 2
});
var potato = crop({
  // @ts-expect-error
  ...fromSeed(potatoSeed, {
    canBeFermented: true
  }),
  name: "Potato"
});

// src/data/crops/pumpkin.ts
var pumpkinSeed = crop({
  cropType: cropType.PUMPKIN,
  cropTimeline: [3, 1, 1, 1, 1, 1],
  growsInto: "pumpkin",
  id: "pumpkin-seed",
  name: "Pumpkin Seed",
  tier: 1
});
var pumpkin = crop({
  // @ts-expect-error
  ...fromSeed(pumpkinSeed, {
    canBeFermented: true
  }),
  name: "Pumpkin"
});

// src/data/crops/soybean.ts
var soybeanSeed = crop({
  cropType: cropType.SOYBEAN,
  cropTimeline: [2, 2],
  growsInto: "soybean",
  id: "soybean-seed",
  name: "Soybean Seeds",
  tier: 3
});
var soybean = crop({
  // @ts-expect-error
  ...fromSeed(soybeanSeed, {
    canBeFermented: true
  }),
  name: "Soybean"
});

// src/data/crops/spinach.ts
var spinachSeed = crop({
  cropType: cropType.SPINACH,
  cropTimeline: [2, 4],
  growsInto: "spinach",
  id: "spinach-seed",
  name: "Spinach Seed",
  tier: 1
});
var spinach = crop({
  // @ts-expect-error
  ...fromSeed(spinachSeed, {
    canBeFermented: true
  }),
  name: "Spinach"
});

// src/data/crops/sunflower.ts
var sunflowerSeed = crop({
  cropType: cropType.SUNFLOWER,
  cropTimeline: [1, 1, 1, 1, 1, 1],
  growsInto: "sunflower",
  id: "sunflower-seed",
  name: "Sunflower Seed",
  tier: 6
});
var sunflower = crop({
  // @ts-expect-error
  ...fromSeed(sunflowerSeed, {
    canBeFermented: true
  }),
  name: "Sunflower"
});

// src/data/crops/strawberry.ts
var strawberrySeed = crop({
  cropType: cropType.STRAWBERRY,
  cropTimeline: [6, 2],
  growsInto: "strawberry",
  id: "strawberry-seed",
  name: "Strawberry Seed",
  tier: 5
});
var strawberry = crop({
  // @ts-expect-error
  ...fromSeed(strawberrySeed),
  name: "Strawberry"
});

// src/data/crops/sweet-potato.ts
var sweetPotatoSeed = crop({
  cropType: cropType.SWEET_POTATO,
  cropTimeline: [2, 1, 1, 2, 2],
  growsInto: "sweet-potato",
  id: "sweet-potato-seed",
  name: "Sweet Potato Slip",
  tier: 6
});
var sweetPotato = crop({
  // @ts-expect-error
  ...fromSeed(sweetPotatoSeed, {
    canBeFermented: true
  }),
  name: "Sweet Potato"
});

// src/data/crops/tomato.ts
var tomatoSeed = crop({
  cropType: cropType.TOMATO,
  cropTimeline: [2, 1, 1, 1, 2, 2, 2],
  growsInto: "tomato",
  id: "tomato-seed",
  name: "Tomato Seeds",
  tier: 3
});
var tomato = crop({
  // @ts-expect-error
  ...fromSeed(tomatoSeed, {
    canBeFermented: true
  }),
  name: "Tomato"
});

// src/data/crops/watermelon.ts
var watermelonSeed = crop({
  cropType: cropType.WATERMELON,
  cropTimeline: [2, 10],
  growsInto: "watermelon",
  id: "watermelon-seed",
  name: "Watermelon Seed",
  tier: 4
});
var watermelon = crop({
  // @ts-expect-error
  ...fromSeed(watermelonSeed),
  name: "Watermelon"
});

// src/data/crops/wheat.ts
var wheatSeed = crop({
  cropType: cropType.WHEAT,
  cropTimeline: [1, 1],
  growsInto: "wheat",
  id: "wheat-seed",
  name: "Wheat Seeds",
  tier: 3
});
var wheat = crop({
  // @ts-expect-error
  ...fromSeed(wheatSeed),
  name: "Wheat"
});

// src/data/ores/bronzeOre.ts
var { freeze: freeze3 } = Object;
var bronzeOre = freeze3({
  description: "A piece of bronze ore.",
  doesPriceFluctuate: true,
  id: "bronze-ore",
  name: "Bronze Ore",
  type: (
    /** @type {farmhand.itemType} */
    itemType.ORE
  ),
  value: 25,
  spawnChance: BRONZE_SPAWN_CHANCE
});

// src/data/ores/coal.ts
var { freeze: freeze4 } = Object;
var coal = freeze4({
  description: "A piece of coal.",
  doesPriceFluctuate: false,
  id: "coal",
  name: "Coal",
  type: (
    /** @type {farmhand.itemType} */
    itemType.FUEL
  ),
  spawnChance: COAL_SPAWN_CHANCE,
  value: 2
});

// src/data/ores/goldOre.ts
var { freeze: freeze5 } = Object;
var goldOre = freeze5({
  description: "A piece of gold ore.",
  doesPriceFluctuate: true,
  id: "gold-ore",
  name: "Gold Ore",
  type: (
    /** @type {farmhand.itemType} */
    itemType.ORE
  ),
  value: 500,
  spawnChance: GOLD_SPAWN_CHANCE
});

// src/data/ores/ironOre.ts
var { freeze: freeze6 } = Object;
var ironOre = freeze6({
  description: "A piece of iron ore.",
  doesPriceFluctuate: true,
  id: "iron-ore",
  name: "Iron Ore",
  type: (
    /** @type {farmhand.itemType} */
    itemType.ORE
  ),
  value: 40,
  spawnChance: IRON_SPAWN_CHANCE
});

// src/data/ores/silverOre.ts
var { freeze: freeze7 } = Object;
var silverOre = freeze7({
  description: "A piece of silver ore.",
  doesPriceFluctuate: true,
  id: "silver-ore",
  name: "Silver Ore",
  type: (
    /** @type {farmhand.itemType} */
    itemType.ORE
  ),
  value: 100,
  spawnChance: SILVER_SPAWN_CHANCE
});

// src/data/ores/stone.ts
var { freeze: freeze8 } = Object;
var stone = freeze8({
  description: "A piece of rock.",
  doesPriceFluctuate: false,
  id: "stone",
  name: "Stone",
  spawnChance: STONE_SPAWN_CHANCE,
  type: (
    /** @type {farmhand.itemType} */
    itemType.STONE
  ),
  value: 10
});

// src/data/ores/saltRock.ts
var { freeze: freeze9 } = Object;
var saltRock = freeze9({
  description: "A large chunk of salt.",
  doesPriceFluctuate: true,
  id: "salt-rock",
  name: "Salt Rock",
  spawnChance: SALT_ROCK_SPAWN_CHANCE,
  type: (
    /** @type {farmhand.itemType} */
    itemType.STONE
  ),
  value: 10
});

// src/data/items.ts
var { freeze: freeze10 } = Object;
var {
  COW_FEED,
  FERTILIZER,
  HUGGING_MACHINE,
  MILK,
  SCARECROW,
  SPRINKLER,
  WEED
} = itemType;
var weed = freeze10({
  id: "weed",
  name: "Weed",
  value: 0.1,
  doesPriceFluctuate: false,
  type: WEED
});
var rainbowFertilizer = freeze10({
  description: "Helps crops grow a little faster and automatically replants them upon harvesting. Consumes seeds upon replanting and disappears if none are available. Also works for Scarecrows.",
  enablesFieldMode: fieldMode.FERTILIZE,
  id: "rainbow-fertilizer",
  name: "Rainbow Fertilizer",
  type: (
    /** @type {farmhand.itemType} */
    FERTILIZER
  ),
  // Rainbow Fertilizer is worth less than regular Fertilizer because it is not
  // sold in the shop. Items that are sold in the shop have automatically
  // reduced resale value, but since that would not apply to Rainbow
  // Fertilizer, it is pre-reduced via this hardcoded value.
  value: 15
});
var sprinkler = freeze10({
  description: "Automatically waters adjacent plants every day.",
  enablesFieldMode: fieldMode.SET_SPRINKLER,
  // Note: The actual hoveredPlotRangeSize of sprinklers grows with the
  // player's level.
  hoveredPlotRangeSize: INITIAL_SPRINKLER_RANGE,
  id: "sprinkler",
  isReplantable: true,
  name: "Sprinkler",
  type: (
    /** @type {farmhand.itemType} */
    SPRINKLER
  ),
  value: 120
});
var scarecrow = freeze10({
  description: "Prevents crows from eating your crops. One scarecrow covers an entire field, but they are afraid of storms.",
  enablesFieldMode: fieldMode.SET_SCARECROW,
  // Note: This needs to be a safe number (rather than Infinity) because it
  // potentially gets JSON.stringify-ed during data export. Non-safe numbers
  // get stringify-ed to "null", which breaks reimporting.
  hoveredPlotRangeSize: Number.MAX_SAFE_INTEGER,
  id: "scarecrow",
  isReplantable: true,
  name: "Scarecrow",
  type: (
    /** @type {farmhand.itemType} */
    SCARECROW
  ),
  value: 160
});
var cowFeed = freeze10({
  id: COW_FEED_ITEM_ID,
  description: "Each cow automatically consumes one unit of Cow Feed per day. Fed cows gain and maintain weight.",
  name: "Cow Feed",
  type: (
    /** @type {farmhand.itemType} */
    COW_FEED
  ),
  value: 5
});
var huggingMachine = freeze10({
  id: HUGGING_MACHINE_ITEM_ID,
  description: "Automatically hugs one cow three times every day.",
  name: "Hugging Machine",
  type: (
    /** @type {farmhand.itemType} */
    HUGGING_MACHINE
  ),
  value: 500
});
var milk1 = freeze10({
  id: "milk-1",
  name: "Grade C Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 40
});
var milk2 = freeze10({
  id: "milk-2",
  name: "Grade B Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 80
});
var milk3 = freeze10({
  id: "milk-3",
  name: "Grade A Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 120
});
var rainbowMilk1 = freeze10({
  id: "rainbow-milk-1",
  name: "Grade C Rainbow Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 60
});
var rainbowMilk2 = freeze10({
  id: "rainbow-milk-2",
  name: "Grade B Rainbow Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 120
});
var rainbowMilk3 = freeze10({
  id: "rainbow-milk-3",
  name: "Grade A Rainbow Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 180
});
var chocolateMilk = freeze10({
  id: "chocolate-milk",
  name: "Chocolate Milk",
  type: (
    /** @type {farmhand.itemType} */
    MILK
  ),
  value: 80
});

// src/data/items-map.ts
var itemsMap = {
  ...Object.keys(items_exports).reduce((acc, itemName) => {
    const item = items_exports[itemName];
    acc[item.id] = item;
    return acc;
  }, {})
};
var items_map_default = itemsMap;

// src/data/recipes.ts
var itemsMap2 = { ...items_map_default };
var convertToRecipe = (partialRecipe) => {
  const recipe = Object.freeze({
    type: itemType.CRAFTED_ITEM,
    value: Object.keys(partialRecipe.ingredients).reduce(
      (sum, itemId) => sum + RECIPE_INGREDIENT_VALUE_MULTIPLIER * itemsMap2[itemId].value * partialRecipe.ingredients[itemId],
      0
    ),
    ...partialRecipe
  });
  itemsMap2[partialRecipe.id] = /** @type {farmhand.item} */
  recipe;
  return (
    /** @type {farmhand.recipe} */
    recipe
  );
};
var salt = convertToRecipe({
  id: "salt",
  name: "Salt",
  ingredients: {
    [saltRock.id]: 1
  },
  condition: (state) => (state.itemsSold[saltRock.id] || 0) >= 30,
  description: "Useful for seasoning food and fermentation.",
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var flour = convertToRecipe({
  id: "flour",
  name: "Flour",
  ingredients: {
    [wheat.id]: 10
  },
  condition: (state) => (state.itemsSold[wheat.id] || 0) >= 20,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var yeast = convertToRecipe({
  id: "yeast",
  name: "Yeast",
  ingredients: {
    [flour.id]: 5
  },
  condition: (state) => (state.itemsSold[flour.id] || 0) >= 25,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var getWineRecipeFromGrape = (grape2) => {
  return {
    ...convertToRecipe({
      id: grape2.wineId,
      name: `${grapeVarietyNameMap[grape2.variety]} Wine`,
      type: itemType.CRAFTED_ITEM,
      ingredients: {
        [grape2.id]: GRAPES_REQUIRED_FOR_WINE,
        [yeast.id]: getYeastRequiredForWine(grape2.variety)
      },
      recipeType: (
        /** @type {farmhand.recipeType} */
        recipeType.WINE
      ),
      // NOTE: This prevents wines from appearing in the Learned Recipes list in the Workshop
      condition: () => false
    }),
    variety: grape2.variety
  };
};
var bread = convertToRecipe({
  id: "bread",
  name: "Bread",
  ingredients: {
    [flour.id]: 10,
    [yeast.id]: 5
  },
  condition: (state) => (state.itemsSold[flour.id] || 0) >= 30 && (state.itemsSold[yeast.id] || 0) >= 15,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var butter = convertToRecipe({
  id: "butter",
  name: "Butter",
  ingredients: {
    [milk3.id]: 5
  },
  condition: (state) => (state.itemsSold[milk3.id] || 0) >= 30,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var sunButter = convertToRecipe({
  id: "sun-butter",
  name: "Sun Butter",
  ingredients: {
    [sunflower.id]: 25
  },
  condition: (state) => (state.itemsSold[sunflower.id] || 0) >= 200,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var oliveOil = convertToRecipe({
  id: "olive-oil",
  name: "Olive Oil",
  ingredients: {
    [olive.id]: 250
  },
  condition: (state) => (state.itemsSold[olive.id] || 0) >= 500,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var cheese = convertToRecipe({
  id: "cheese",
  name: "Cheese",
  ingredients: {
    [milk3.id]: 8
  },
  condition: (state) => (state.itemsSold[milk3.id] || 0) >= 20,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var rainbowCheese = convertToRecipe({
  id: "rainbowCheese",
  name: "Rainbow Cheese",
  ingredients: {
    [rainbowMilk3.id]: 10
  },
  condition: (state) => (state.itemsSold[rainbowMilk3.id] || 0) >= 30,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var chocolate = convertToRecipe({
  id: "chocolate",
  name: "Chocolate",
  ingredients: {
    [chocolateMilk.id]: 10
  },
  condition: (state) => (state.itemsSold[chocolateMilk.id] || 0) >= 25,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var carrotSoup = convertToRecipe({
  id: "carrot-soup",
  name: "Carrot Soup",
  ingredients: {
    [carrot.id]: 4
  },
  condition: (state) => (state.itemsSold[carrot.id] || 0) >= 10,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var jackolantern = convertToRecipe({
  id: "jackolantern",
  name: "Jack-o'-lantern",
  ingredients: {
    [pumpkin.id]: 1
  },
  condition: (state) => (state.itemsSold[pumpkin.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var spaghetti = convertToRecipe({
  id: "spaghetti",
  name: "Spaghetti",
  ingredients: {
    [wheat.id]: 10,
    [tomato.id]: 2
  },
  condition: (state) => (state.itemsSold[wheat.id] || 0) >= 20 && (state.itemsSold[tomato.id] || 0) >= 5,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var frenchOnionSoup = convertToRecipe({
  id: "french-onion-soup",
  name: "French Onion Soup",
  ingredients: {
    [onion.id]: 5,
    [cheese.id]: 2,
    [salt.id]: 2
  },
  condition: (state) => (state.itemsSold[onion.id] || 0) >= 15 && (state.itemsSold[cheese.id] || 0) >= 10,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var burger = convertToRecipe({
  id: "burger",
  name: "Burger",
  ingredients: {
    [bread.id]: 1,
    [cheese.id]: 1,
    [onion.id]: 1,
    [soybean.id]: 12,
    [spinach.id]: 1,
    [tomato.id]: 1
  },
  condition: (state) => (state.itemsSold[bread.id] || 0) >= 5 && (state.itemsSold[cheese.id] || 0) >= 5 && (state.itemsSold[onion.id] || 0) >= 5 && (state.itemsSold[soybean.id] || 0) >= 25 && (state.itemsSold[spinach.id] || 0) >= 5 && (state.itemsSold[tomato.id] || 0) >= 5,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var summerSalad = convertToRecipe({
  id: "summer-salad",
  name: "Summer Salad",
  ingredients: {
    [spinach.id]: 6,
    [corn.id]: 1,
    [carrot.id]: 1
  },
  condition: (state) => (state.itemsSold[spinach.id] || 0) >= 30 && (state.itemsSold[corn.id] || 0) > 5 && (state.itemsSold[carrot.id] || 0) > 5,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var soyMilk = convertToRecipe({
  id: "soy-milk",
  name: "Soy Milk",
  ingredients: {
    [soybean.id]: 20
  },
  condition: (state) => (state.itemsSold[soybean.id] || 0) >= 100,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var chocolateSoyMilk = convertToRecipe({
  id: "chocolate-soy-milk",
  name: "Chocolate Soy Milk",
  ingredients: {
    [soyMilk.id]: 1,
    [chocolate.id]: 1
  },
  condition: (state) => (state.itemsSold[soyMilk.id] || 0) >= 5 && (state.itemsSold[chocolate.id] || 0) >= 5,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var tofu = convertToRecipe({
  id: "tofu",
  name: "Tofu",
  ingredients: {
    [soyMilk.id]: 4
  },
  condition: (state) => (state.itemsSold[soyMilk.id] || 0) >= 20,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var chicknPotPie = convertToRecipe({
  id: "chickn-pot-pie",
  name: "Chick'n Pot Pie",
  ingredients: {
    [tofu.id]: 6,
    [pea.id]: 10,
    [carrot.id]: 8,
    [wheat.id]: 12,
    [soyMilk.id]: 3
  },
  condition: (state) => (state.itemsSold[tofu.id] || 0) >= 30 && (state.itemsSold[pea.id] || 0) >= 225 && (state.itemsSold[carrot.id] || 0) >= 300 && (state.itemsSold[wheat.id] || 0) >= 425 && (state.itemsSold[soyMilk.id] || 0) >= 15,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var hotSauce = convertToRecipe({
  id: "hot-sauce",
  name: "Hot Sauce",
  ingredients: {
    [jalapeno.id]: 10,
    [salt.id]: 1
  },
  condition: (state) => (state.itemsSold[jalapeno.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var salsa = convertToRecipe({
  id: "salsa",
  name: "Salsa",
  ingredients: {
    [jalapeno.id]: 1,
    [onion.id]: 1,
    [tomato.id]: 1,
    [corn.id]: 1
  },
  condition: (state) => (state.itemsSold[jalapeno.id] || 0) >= 5 && (state.itemsSold[onion.id] || 0) >= 5 && (state.itemsSold[tomato.id] || 0) >= 5 && (state.itemsSold[corn.id] || 0) >= 5,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var spicyCheese = convertToRecipe({
  id: "spicy-cheese",
  name: "Spicy Cheese",
  ingredients: {
    [jalapeno.id]: 4,
    [milk3.id]: 10
  },
  condition: (state) => (state.itemsSold[jalapeno.id] || 0) >= 20 && (state.itemsSold[milk3.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var vegetableOil = convertToRecipe({
  id: "vegetable-oil",
  name: "Vegetable Oil",
  ingredients: {
    [soybean.id]: 350
  },
  condition: (state) => (state.itemsSold[soybean.id] || 0) >= 900,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var friedTofu = convertToRecipe({
  id: "fried-tofu",
  name: "Deep Fried Tofu",
  ingredients: {
    [tofu.id]: 1,
    [vegetableOil.id]: 2
  },
  condition: (state) => (state.itemsSold[tofu.id] || 0) >= 50 && (state.itemsSold[vegetableOil.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var spicyPickledGarlic = convertToRecipe({
  id: "spicy-pickled-garlic",
  name: "Spicy Pickled Garlic",
  ingredients: {
    [jalapeno.id]: 2,
    [garlic.id]: 5
  },
  condition: (state) => (state.itemsSold[jalapeno.id] || 0) >= 12 && (state.itemsSold[garlic.id] || 0) >= 25,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var garlicFries = convertToRecipe({
  id: "garlic-fries",
  name: "Garlic Fries",
  ingredients: {
    [potato.id]: 5,
    [garlic.id]: 3,
    [vegetableOil.id]: 1,
    [salt.id]: 2
  },
  condition: (state) => (state.itemsSold[potato.id] || 0) >= 50 && (state.itemsSold[garlic.id] || 0) >= 30,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var garlicBread = convertToRecipe({
  id: "garlic-bread",
  name: "Garlic Bread",
  ingredients: {
    [bread.id]: 1,
    [garlic.id]: 5,
    [oliveOil.id]: 1
  },
  condition: (state) => (state.itemsSold[bread.id] || 0) >= 30 && (state.itemsSold[oliveOil.id] || 0) >= 20 && (state.itemsSold[garlic.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var strawberryJam = convertToRecipe({
  id: "strawberry-jam",
  name: "Strawberry Jam",
  ingredients: {
    [strawberry.id]: 10
  },
  condition: (state) => (state.itemsSold[strawberry.id] || 0) >= 60,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var popcorn = convertToRecipe({
  id: "popcorn",
  name: "Popcorn",
  ingredients: {
    [corn.id]: 2,
    [butter.id]: 1
  },
  condition: (state) => (state.itemsSold[corn.id] || 0) >= 12 && (state.itemsSold[butter.id] || 0) >= 6,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var pumpkinPie = convertToRecipe({
  id: "pumpkin-pie",
  name: "Pumpkin Pie",
  ingredients: {
    [pumpkin.id]: 4,
    [wheat.id]: 10,
    [butter.id]: 2
  },
  condition: (state) => (state.itemsSold[pumpkin.id] || 0) >= 200 && (state.itemsSold[wheat.id] || 0) >= 250 && (state.itemsSold[butter.id] || 0) >= 75,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var sweetPotatoPie = convertToRecipe({
  id: "sweet-potato-pie",
  name: "Sweet Potato Pie",
  ingredients: {
    [sweetPotato.id]: 6,
    [wheat.id]: 10,
    [butter.id]: 2
  },
  condition: (state) => (state.itemsSold[sweetPotato.id] || 0) >= 200 && (state.itemsSold[wheat.id] || 0) >= 250 && (state.itemsSold[butter.id] || 0) >= 75,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var sweetPotatoFries = convertToRecipe({
  id: "sweet-potato-fries",
  name: "Sweet Potato Fries",
  ingredients: {
    [sweetPotato.id]: 10,
    [vegetableOil.id]: 1,
    [salt.id]: 1
  },
  condition: (state) => (state.itemsSold[sweetPotato.id] || 0) >= 100,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var onionRings = convertToRecipe({
  id: "onion-rings",
  name: "Onion Rings",
  ingredients: {
    [onion.id]: 1,
    [vegetableOil.id]: 1,
    [wheat.id]: 5,
    [soyMilk.id]: 1,
    [salt.id]: 3
  },
  condition: (state) => (state.itemsSold[onion.id] || 0) >= 50 && (state.itemsSold[vegetableOil.id] || 0) > 20 && (state.itemsSold[soyMilk.id] || 0) > 20 && (state.itemsSold[wheat.id] || 0) > 30,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.KITCHEN
  )
});
var bronzeIngot = convertToRecipe({
  id: "bronze-ingot",
  name: "Bronze Ingot",
  ingredients: {
    [bronzeOre.id]: 5,
    [coal.id]: 5
  },
  condition: (state) => state.purchasedSmelter > 0 && (state.itemsSold[bronzeOre.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.FORGE
  )
});
var ironIngot = convertToRecipe({
  id: "iron-ingot",
  name: "Iron Ingot",
  ingredients: {
    [ironOre.id]: 5,
    [coal.id]: 12
  },
  condition: (state) => state.purchasedSmelter > 0 && (state.itemsSold[ironOre.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.FORGE
  )
});
var silverIngot = convertToRecipe({
  id: "silver-ingot",
  name: "Silver Ingot",
  ingredients: {
    [silverOre.id]: 5,
    [coal.id]: 8
  },
  condition: (state) => state.purchasedSmelter > 0 && (state.itemsSold[silverOre.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.FORGE
  )
});
var goldIngot = convertToRecipe({
  id: "gold-ingot",
  name: "Gold Ingot",
  ingredients: {
    [goldOre.id]: 5,
    [coal.id]: 10
  },
  condition: (state) => state.purchasedSmelter > 0 && (state.itemsSold[goldOre.id] || 0) >= 50,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.FORGE
  )
});
var compost = convertToRecipe({
  id: "compost",
  name: "Compost",
  ingredients: {
    [weed.id]: 25
  },
  condition: (state) => state.purchasedComposter > 0 && (state.itemsSold[weed.id] || 0) >= 100,
  description: "Can be used to make fertilizer.",
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.RECYCLING
  ),
  type: itemType.CRAFTED_ITEM
});
var fertilizer = convertToRecipe({
  id: "fertilizer",
  name: "Fertilizer",
  ingredients: {
    [compost.id]: 10
  },
  condition: (state) => state.purchasedComposter > 0 && (state.itemsSold[compost.id] || 0) >= 10,
  description: "Helps crops grow and mature a little faster.",
  enablesFieldMode: fieldMode.FERTILIZE,
  recipeType: (
    /** @type {farmhand.recipeType} */
    recipeType.RECYCLING
  ),
  type: itemType.FERTILIZER,
  value: 25
});
var wineChardonnay = getWineRecipeFromGrape({
  ...grapeChardonnay
});
var wineSauvignonBlanc = getWineRecipeFromGrape({
  ...grapeSauvignonBlanc
});
var wineCabernetSauvignon = getWineRecipeFromGrape({
  ...grapeCabernetSauvignon
});
var wineTempranillo = getWineRecipeFromGrape({
  ...grapeTempranillo
});
var wineNebbiolo = getWineRecipeFromGrape({
  ...grapeNebbiolo
});

// src/data/upgrades.ts
var coalNeededForIngots = (ingotId, amount = 1) => {
  switch (ingotId) {
    case bronzeIngot.id:
      return amount * 2;
    case ironIngot.id:
      return Math.round(amount * 3.5);
    case silverIngot.id:
      return Math.round(amount * 2.5);
    case goldIngot.id:
      return amount * 3;
    default:
      return amount;
  }
};
var { bronzeIngot: bronzeIngot2, ironIngot: ironIngot2, silverIngot: silverIngot2, goldIngot: goldIngot2 } = recipes_exports;
var { coal: coal2 } = items_exports;
var upgrades = {
  [toolType.HOE]: {
    [toolLevel.DEFAULT]: {
      id: "hoe-default",
      name: "Basic Hoe",
      nextLevel: toolLevel.BRONZE
    },
    [toolLevel.BRONZE]: {
      id: "hoe-bronze",
      description: "Gives 25% chance to retrieve seeds when digging up crops",
      name: "Bronze Hoe",
      ingredients: {
        [bronzeIngot2.id]: 8,
        [coal2.id]: coalNeededForIngots(bronzeIngot2.id, 8)
      },
      nextLevel: toolLevel.IRON
    },
    [toolLevel.IRON]: {
      id: "hoe-iron",
      description: "Gives 50% chance to retrieve seeds when digging up crops",
      name: "Iron Hoe",
      ingredients: {
        [ironIngot2.id]: 8,
        [coal2.id]: coalNeededForIngots(ironIngot2.id, 8)
      },
      nextLevel: toolLevel.SILVER
    },
    [toolLevel.SILVER]: {
      id: "hoe-silver",
      description: "Gives 75% chance to retrieve seeds when digging up crops",
      name: "Silver Hoe",
      ingredients: {
        [silverIngot2.id]: 8,
        [coal2.id]: coalNeededForIngots(silverIngot2.id, 8)
      },
      nextLevel: toolLevel.GOLD
    },
    [toolLevel.GOLD]: {
      id: "hoe-gold",
      description: "Gives 100% chance to retrieve seeds when digging up crops",
      name: "Gold Hoe",
      ingredients: {
        [goldIngot2.id]: 8,
        [coal2.id]: coalNeededForIngots(goldIngot2.id, 8)
      },
      isMaxLevel: true
    }
  },
  [toolType.SCYTHE]: {
    [toolLevel.DEFAULT]: {
      id: "scythe-default",
      name: "Basic Scythe",
      nextLevel: toolLevel.BRONZE
    },
    [toolLevel.BRONZE]: {
      id: "scythe-bronze",
      description: "Increases crop yield by 1 when harvesting",
      name: "Bronze Scythe",
      ingredients: {
        [bronzeIngot2.id]: 10,
        [coal2.id]: coalNeededForIngots(bronzeIngot2.id, 10)
      },
      nextLevel: toolLevel.IRON
    },
    [toolLevel.IRON]: {
      id: "scythe-iron",
      description: "Increases crop yield by 2 when harvesting",
      name: "Iron Scythe",
      ingredients: {
        [ironIngot2.id]: 10,
        [coal2.id]: coalNeededForIngots(ironIngot2.id, 10)
      },
      nextLevel: toolLevel.SILVER
    },
    [toolLevel.SILVER]: {
      id: "scythe-silver",
      description: "Increases crop yield by 3 when harvesting",
      name: "Silver Scythe",
      ingredients: {
        [silverIngot2.id]: 10,
        [coal2.id]: coalNeededForIngots(silverIngot2.id, 10)
      },
      nextLevel: toolLevel.GOLD
    },
    [toolLevel.GOLD]: {
      id: "scythe-gold",
      description: "Increases crop yield by 4 when harvesting",
      name: "Gold Scythe",
      ingredients: {
        [goldIngot2.id]: 10,
        [coal2.id]: coalNeededForIngots(goldIngot2.id, 10)
      },
      isMaxLevel: true
    }
  },
  [toolType.SHOVEL]: {
    [toolLevel.DEFAULT]: {
      id: "shovel-default",
      name: "Basic Shovel",
      nextLevel: toolLevel.BRONZE
    },
    [toolLevel.BRONZE]: {
      id: "shovel-bronze",
      description: "Increases chance of finding ore",
      name: "Bronze Shovel",
      ingredients: {
        [bronzeIngot2.id]: 15,
        [coal2.id]: coalNeededForIngots(bronzeIngot2.id, 15)
      },
      nextLevel: toolLevel.IRON
    },
    [toolLevel.IRON]: {
      id: "shovel-iron",
      description: "Increases chance of finding ore",
      name: "Iron Shovel",
      ingredients: {
        [ironIngot2.id]: 15,
        [coal2.id]: coalNeededForIngots(ironIngot2.id, 15)
      },
      nextLevel: toolLevel.SILVER
    },
    [toolLevel.SILVER]: {
      id: "shovel-silver",
      description: "Increases chance of finding ore",
      name: "Silver Shovel",
      ingredients: {
        [silverIngot2.id]: 15,
        [coal2.id]: coalNeededForIngots(silverIngot2.id, 15)
      },
      nextLevel: toolLevel.GOLD
    },
    [toolLevel.GOLD]: {
      id: "shovel-gold",
      description: "Increases chance of finding ore",
      name: "Gold Shovel",
      ingredients: {
        [goldIngot2.id]: 15,
        [coal2.id]: coalNeededForIngots(goldIngot2.id, 15)
      },
      isMaxLevel: true
    }
  }
};
for (let currentToolType in upgrades) {
  for (let i in upgrades[currentToolType]) {
    Object.assign(upgrades[currentToolType][i], {
      toolType: currentToolType,
      value: 0,
      doesPriceFluctuate: false,
      type: itemType.TOOL_UPGRADE,
      level: i
    });
  }
}
var upgrades_default = upgrades;

// src/data/maps.ts
var {
  ASPARAGUS,
  CARROT,
  CORN,
  GARLIC,
  GRAPE,
  JALAPENO,
  OLIVE,
  ONION,
  PEA,
  POTATO,
  PUMPKIN,
  SOYBEAN,
  SPINACH,
  SUNFLOWER,
  STRAWBERRY,
  SWEET_POTATO,
  TOMATO,
  WATERMELON,
  WHEAT,
  WEED: WEED2
} = cropType;
var recipeCategories = {
  [recipeType.KITCHEN]: {},
  [recipeType.FORGE]: {},
  [recipeType.FERMENTATION]: {},
  [recipeType.RECYCLING]: {},
  [recipeType.WINE]: {}
};
var recipesMap = {};
for (const recipeId of Object.keys(recipes_exports)) {
  const recipe = recipes_exports[recipeId];
  recipeCategories[recipe.recipeType][recipe.id] = recipe;
  recipesMap[recipe.id] = recipe;
}
var upgradesMap = {};
for (let toolType2 of Object.keys(upgrades_default)) {
  for (let upgrade of Object.values(upgrades_default[toolType2])) {
    upgradesMap[upgrade.id] = upgrade;
  }
}
var itemsMap3 = {
  ...items_map_default,
  ...recipesMap,
  ...upgradesMap
};
var fermentableItemsMap = Object.fromEntries(
  Object.entries(itemsMap3).filter(([itemId]) => {
    const item = itemsMap3[itemId];
    return "daysToFerment" in item;
  })
);
var cropItemIdToSeedItemMap = Object.entries(items_map_default).reduce(
  (acc, [itemId, item]) => {
    const { growsInto } = item;
    if (growsInto) {
      const variants = Array.isArray(growsInto) ? growsInto : [growsInto];
      for (const variantId of variants) {
        acc[variantId] = items_map_default[itemId];
      }
    }
    return acc;
  },
  {}
);
var cropTypeToIdMap = {
  [ASPARAGUS]: "asparagus",
  [CARROT]: "carrot",
  [CORN]: "corn",
  [GARLIC]: "garlic",
  [
    GRAPE
    /** @type {string | string[]} */
  ]: grapeSeed.growsInto,
  [JALAPENO]: "jalapeno",
  [OLIVE]: "olive",
  [ONION]: "onion",
  [PEA]: "pea",
  [POTATO]: "potato",
  [PUMPKIN]: "pumpkin",
  [SOYBEAN]: "soybean",
  [SPINACH]: "spinach",
  [STRAWBERRY]: "strawberry",
  [SUNFLOWER]: "sunflower",
  [SWEET_POTATO]: "sweet-potato",
  [TOMATO]: "tomato",
  [WATERMELON]: "watermelon",
  [WHEAT]: "wheat",
  [WEED2]: "weed"
};

// src/common/services/randomNumber.ts
var import_seedrandom = __toESM(require_seedrandom2(), 1);
var import_window = __toESM(require_window(), 1);
var RandomNumberService = class {
  /**
   * @type {Function?}
   */
  seededRandom = null;
  constructor() {
    const initialSeed = new URLSearchParams(import_window.default.location?.search).get(
      "seed"
    );
    if (initialSeed) {
      this.seedRandomNumber(initialSeed);
    }
  }
  /**
   * @param {string} seed
   */
  seedRandomNumber(seed) {
    this.seededRandom = (0, import_seedrandom.default)(seed);
  }
  /**
   * @returns {number}
   */
  generateRandomNumber() {
    return this.seededRandom ? this.seededRandom() : Math.random();
  }
  unseedRandomNumber() {
    this.seededRandom = null;
  }
  /**
   * Compares given number against a randomly generated number.
   * @param {number} chance Float between 0-1 to compare dice roll against.
   * @returns {boolean} True if the dice roll was equal to or lower than the
   * given chance, false otherwise.
   */
  isRandomNumberLessThan(chance) {
    return this.generateRandomNumber() <= chance;
  }
};
var randomNumberService = new RandomNumberService();

// src/common/utils.ts
var random = () => {
  return randomNumberService.generateRandomNumber();
};
var generateValueAdjustments = (priceCrashes = {}, priceSurges = {}) => Object.keys(itemsMap3).reduce((acc, key) => {
  if (itemsMap3[key].doesPriceFluctuate) {
    if (priceCrashes[key]) {
      acc[key] = 0.5;
    } else if (priceSurges[key]) {
      acc[key] = 1.5;
    } else {
      acc[key] = random() + 0.5;
    }
  }
  return acc;
}, {});

// src/common/constants.ts
var MAX_ROOM_NAME_LENGTH = 25;

// api-etc/constants.ts
var GLOBAL_ROOM_KEY = "global";
var ACCEPTED_ORIGINS = /* @__PURE__ */ new Set([
  "http://localhost:3000",
  "http://farmhand:3000",
  // E2E environment
  "https://farmhand.vercel.app",
  "https://jeremyckahn.github.io",
  "https://www.farmhand.life",
  "https://v6p9d9t4.ssl.hwcdn.net"
  // itch.io's CDN that the game is served from
]);

// api-src/post-day-results.ts
import { promisify } from "util";

// api-etc/utils.ts
var import_redis = __toESM(require_redis(), 1);
var getRedisClient = () => {
  const client2 = import_redis.default.createClient({
    host: process.env.REDIS_ENDPOINT,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  });
  ["connect", "ready", "reconnecting"].forEach(
    (event) => client2.on(event, () => {
      console.log(`[REDIS] ${event}`);
    })
  );
  client2.on("error", function(error) {
    console.log("[REDIS] error");
    console.error(error);
  });
  return client2;
};
var getRoomData = async (roomKey, get2, set2) => {
  let roomData = JSON.parse(await get2(roomKey)) || {};
  let { valueAdjustments } = roomData;
  if (!valueAdjustments) {
    valueAdjustments = generateValueAdjustments();
    roomData = { valueAdjustments };
    set2(roomKey, JSON.stringify(roomData));
  }
  return roomData;
};
var getRoomName = (req) => `room-${(req.query?.room || req.body?.room || GLOBAL_ROOM_KEY).slice(
  0,
  MAX_ROOM_NAME_LENGTH
)}`;
var allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  const { origin = "" } = req.headers;
  if (ACCEPTED_ORIGINS.has(origin) || origin.match(/https:\/\/farmhand-.*-jeremy-kahns-projects.*.vercel.app/)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// api-src/post-day-results.ts
var client = getRedisClient();
var get = promisify(client.get).bind(client);
var set = promisify(client.set).bind(client);
client.on("error", function(error) {
  console.error(error);
});
var applyPositionsToMarket = (valueAdjustments, positions) => {
  return Object.keys(valueAdjustments).reduce(
    (acc, itemName) => {
      const itemPositionChange = positions[itemName];
      const variance = random() * 0.2;
      const MAX = 1.5;
      const MIN = 0.5;
      if (itemPositionChange > 0) {
        acc[itemName] = Math.min(MAX, acc[itemName] + variance);
      } else if (itemPositionChange < 0) {
        acc[itemName] = Math.max(MIN, acc[itemName] - variance);
      } else {
        if (acc[itemName] === MAX || acc[itemName] === MIN) {
          acc[itemName] = random() + MIN;
        }
      }
      return acc;
    },
    {
      ...valueAdjustments
    }
  );
};
var post_day_results_default = allowCors(async (req, res) => {
  const {
    body: { positions = {} }
  } = req;
  const roomKey = getRoomName(req);
  const { valueAdjustments, ...roomData } = await getRoomData(roomKey, get, set);
  const updatedValueAdjustments = applyPositionsToMarket(
    valueAdjustments,
    positions
  );
  set(
    roomKey,
    JSON.stringify({ ...roomData, valueAdjustments: updatedValueAdjustments })
  );
  res.status(200).json({ valueAdjustments: updatedValueAdjustments });
});
export {
  post_day_results_default as default
};
