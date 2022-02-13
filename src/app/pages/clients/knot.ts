 
export function knot(...arg: any[]) {
  var extended = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var events = Object.create(null);

  function on(this: any, name: string, handler: any) {
    events[name] = events[name] || [];
    events[name].push(handler);
    return this ;
  }

  function once(this: any, name: string, handler: any) {
    handler._once = true;
    on(name, handler);
    return this;
  }

  function off(this: any, name: string, handler?: any) {
    var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    handler ? events[name].splice(events[name].indexOf(handler), 1) : delete events[name];

    return this;
  }

  function emit(this: any, name: string) { 

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    // cache the events, to avoid consequences of mutation
    var cache = events[name] && events[name].slice();

    // only fire handlers if they exist
    cache && cache.forEach(  (handler: any) => {
      // remove handlers added with 'once'
      handler._once && off(name, handler);

      // set 'this' context, pass args to handlers
      handler.apply(this, args);
    });

    return this;
  }

  return Object.assign({}, extended, {
    on: on,
    once: once,
    off: off,
    emit: emit
  });
};
 
