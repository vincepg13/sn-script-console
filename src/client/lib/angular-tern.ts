  const angularJsTern = {
    "$anchorScroll": {
      "!type": "fn()"
    },
    "$animate": {
      "addClass": {
        "!type": "fn(element: jQueryLite, className: string, done: ?)"
      },
      "enabled": {
        "!type": "fn(value: bool) -> bool"
      },
      "enter": {
        "!type": "fn(element: jQueryLite, parent: jQueryLite, after: jQueryLite, done: ?)"
      },
      "leave": {
        "!type": "fn(element: jQueryLite, done: ?)"
      },
      "move": {
        "!type": "fn(element: jQueryLite, parent: jQueryLite, after: jQueryLite, done: ?)"
      },
      "removeClass": {
        "!type": "fn(element: jQueryLite, className: string, done: ?)"
      }
    },
    "$document": {
      "!proto": "jQueryLite"
    },
    "cacheFactoryObjInfo": {
      "id": {},
      "size": {},
      "options": {}
    },
    "cacheFactoryObj": {
      "info": {
        "!type": "fn() -> cacheFactoryObjInfo"
      },
      "put": {
        "!type": "fn(key: string, value: ?)"
      },
      "get": {
        "!type": "fn(key: string) -> ?"
      },
      "remove": {
        "!type": "fn(key: string)"
      },
      "removeAll": {
        "!type": "fn()"
      },
      "destroy": {
        "!type": "fn()"
      }
    },
    "$cacheFactory": {
      "!type": "fn(cacheId: string, options: obj) -> cacheFactoryObj"
    },
    "$compile": {
      "!type": "fn(element: string, transclude: fn(), maxPriority: number) -> fn(scope: ?, cloneAttachFn: fn())"
    },
    "$controller": {
      "!type": "fn(constructor: fn(), locals: obj) -> obj"
    },
    "$cookies": {
      "!type": "fn(?) -> ?"
    },
    "$cookieStore": {
      "get": {
        "!type": "fn(key: string) -> obj"
      },
      "put": {
        "!type": "fn(key: string, value: obj)"
      },
      "remove": {
        "!type": "fn(key: string)"
      }
    },
    "Deferred": {
      "resolve": {
        "!type": "fn(value: ?)"
      },
      "reject": {
        "!type": "fn(reason: ?)"
      },
      "promise": {
        "!proto": "Promise"
      }
    },
    "EmitEvent": {
      "!type": "fn()",
      "prototype": {
        "targetScope": {
          "!type": "+Scope"
        },
        "currentScope": {
          "!type": "+Scope"
        },
        "name": {
          "!type": "string"
        },
        "stopPropagation": {
          "!type": "fn()"
        },
        "preventDefault": {
          "!type": "fn()"
        },
        "defaultPrevented": {
          "!type": "bool"
        }
      }
    },
    "$exceptionHandler": {
      "!type": "fn(exception: error, cause: string)"
    },
    "$filter": {
      "!type": "fn(name: string) -> fn()"
    },
    "$httpBackend": {
      "when": {
        "!type": "fn(method: string, url: string, data: string, headers: ?)"
      },
      "whenDELETE": {
        "!type": "fn(url: string, headers: ?)"
      },
      "whenGET": {
        "!type": "fn(url: string, headers: ?)"
      },
      "whenHEAD": {
        "!type": "fn(url: string, headers: ?)"
      },
      "whenJSONP": {
        "!type": "fn(url: string)"
      },
      "whenPATCH": {
        "!type": "fn(url: string, data: string, headers: ?)"
      },
      "whenPOST": {
        "!type": "fn(url: string, data: string, headers: ?)"
      },
      "whenPUT": {
        "!type": "fn(url: string, data: string, headers: ?)"
      }
    },
    "HttpPromise": {
      "success": {
        "!type": "fn(callback: fn(data: ?, status: number, headers: ?, config: obj)) -> HttpPromise"
      },
      "error": {
        "!type": "fn(callback: fn(data: ?, status: number, headers: ?, config: obj)) -> HttpPromise"
      },
      "then": {
        "!type": "fn(successCallback: fn(), errorCallback: fn()) -> HttpPromise"
      }
    },
    "$http": {
      "!type": "fn(config: obj) -> HttpPromise",
      "get": {
        "!type": "fn(url: string, config: obj) -> HttpPromise"
      },
      "head": {
        "!type": "fn(url: string, config: obj) -> HttpPromise"
      },
      "post": {
        "!type": "fn(url: string, data: ?, config: obj) -> HttpPromise"
      },
      "put": {
        "!type": "fn(url: string, data: ?, config: obj) -> HttpPromise"
      },
      "delete": {
        "!type": "fn(url: string, config: obj) -> HttpPromise"
      },
      "jsonp": {
        "!type": "fn(url: string, config: obj) -> HttpPromise"
      },
      "defaults": {
        "!type": "obj"
      },
      "pendingRequests": {
        "!type": "[obj]"
      }
    },
    "$injector": {
      "annotate": {
        "!type": "fn(fn: fn()) -> [string]"
      },
      "get": {
        "!type": "fn(name: string) -> ?"
      },
      "instantiate": {
        "!type": "fn(type: fn, locals: obj) -> obj"
      },
      "invoke": {
        "!type": "fn(fn: fn(), self: ?, locals: ?) -> ?"
      }
    },
    "$interpolateProvider": {
      "endSymbol": {
        "!type": "fn(value: string) -> string"
      },
      "startSymbol": {
        "!type": "fn(value: string) -> string"
      }
    },
    "$interpolate": {
      "!type": "fn(text: string, mustHaveExpresion: bool) -> fn(context: obj)"
    },
    "jQueryLite": {
      "!type": "[+Element]",
      "addClass": {
        "!type": "fn(className: string) -> jQueryLite"
      },
      "after": {
        "!type": "fn(content: ?) -> jQueryLite"
      },
      "append": {
        "!type": "fn(content: ?) -> jQueryLite"
      },
      "attr": {
        "!type": "fn(name: string, value?: string) -> jQueryLite"
      },
      "bind": {
        "!type": "fn(eventType: string, handler: fn(e: +Event)) -> jQueryLite"
      },
      "children": {
        "!type": "fn() -> jQueryLite"
      },
      "clone": {
        "!type": "fn(dataAndEvents?: bool, deep?: bool) -> jQueryLite"
      },
      "contents": {
        "!type": "fn() -> jQueryLite"
      },
      "css": {
        "!type": "fn(name: string, value?: string) -> jQueryLite"
      },
      "data": {
        "!type": "fn(key: string, value?: ?) -> !1"
      },
      "eq": {
        "!type": "fn(i: number) -> jQueryLite"
      },
      "find": {
        "!type": "fn(tagName: string) -> jQueryLite"
      },
      "hasClass": {
        "!type": "fn(className: string) -> bool"
      },
      "html": {
        "!type": "fn() -> string"
      },
      "next": {
        "!type": "fn() -> jQueryLite"
      },
      "parent": {
        "!type": "fn() -> jQueryLite"
      },
      "prepend": {
        "!type": "fn(content: ?) -> jQueryLite"
      },
      "prop": {
        "!type": "fn(name: string, value?: string) -> string"
      },
      "ready": {
        "!type": "fn(fn: fn()) -> jQueryLite"
      },
      "remove": {
        "!type": "fn(selector?: string) -> jQueryLite"
      },
      "removeAttr": {
        "!type": "fn(attrName: string) -> jQueryLite"
      },
      "removeClass": {
        "!type": "fn(className?: string) -> jQueryLite"
      },
      "removeData": {
        "!type": "fn(name?: string) -> jQueryLite"
      },
      "replaceWith": {
        "!type": "fn(newContent: ?) -> jQueryLite"
      },
      "text": {
        "!type": "fn() -> string"
      },
      "toggleClass": {
        "!type": "fn(duration?: number, complete?: fn()) -> jQueryLite"
      },
      "triggerHandler": {
        "!type": "fn(eventType: string, params: ?) -> jQueryLite"
      },
      "unbind": {
        "!type": "fn(eventType?: string, handler?: fn()) -> jQueryLite"
      },
      "val": {
        "!type": "fn() -> string"
      },
      "wrap": {
        "!type": "fn(wrappingElement: ?) -> jQueryLite"
      }
    },
    "$locale": {
      "id": {
        "!type": "string"
      }
    },
    "module": {
      "!type": "fn(modName: string, modParams: ?) -> module",
      "config": {
        "!type": "fn(configFn: fn()) -> module"
      },
      "constant": {
        "!type": "fn(name: string, obj: obj) -> !custom:ngReturnValInject",
        "!effects": ["call and return module"]
      },
      "controller": {
        "!type": "fn(name: string, constructor: fn(args?: ?)) -> !custom:ngInject",
        "!effects": ["call and return module"]
      },
      "directive": {
        "!type": "fn(name: string, directiveFactory: ?) -> !custom:ngDirectiveInject",
        "!effects": ["call and return module"]
      },
      "factory": {
        "!type": "fn(factoryName: string, provider: ?) -> !custom:ngReturnValInject",
        "!effects": ["call and return module"]
      },
      "filter": {
        "!type": "fn(name: string, filterFactory: fn()) -> !custom:ngReturnValInject",
        "!effects": ["call and return module"]
      },
      "provider": {
        "!type": "fn(name: string, providerType: fn()) -> module"
      },
      "run": {
        "!type": "fn(initializationFn: fn()) -> module"
      },
      "service": {
        "!type": "fn(name: string, constructor: ?) -> !custom:ngServiceInject",
        "!effects": ["call and return module"]
      },
      "value": {
        "!type": "fn(name: string, obj: ?) -> !custom:ngValueInject",
        "!effects": ["call and return module"]
      },
      "component": {
        "!type": "fn(name: string, options: obj) -> module",
        "!effects": ["call and return module"]
      },
      "name": {
        "!type": "string"
      },
      "requires": {
        "!type": "[string]"
      }
    },
    "Promise": {
      "then": {
        "!type": "fn(successCallback: fn(), errorCallback: fn()) -> Promise"
      }
    },
    "$provider": {
      "constant": {
        "!type": "fn(name: string, value: ?) -> obj: obj"
      },
      "decorator": {
        "!type": "fn(name: string, decorator: fn())"
      },
      "factory": {
        "!type": "fn(name: string, $getFn: fn()) -> ?",
        "!effects": ["custom ngReturnValInject"]
      },
      "service": {
        "!type": "fn(name: string, constructor: fn()) -> ?"
      },
      "value": {
        "!type": "fn(name: string, value: ?) -> ?"
      }
    },
    "$q": {
      "defer": {
        "!type": "fn() -> Deferred"
      },
      "all": {
        "!type": "fn(promises: ?) -> Promise"
      },
      "when": {
        "!type": "fn(value: ?) -> Promise"
      },
      "reject": {
        "!type": "fn(reason: ?) -> Promise"
      },
      "resolve": {
        "!type": "fn(value: ?) -> Promise"
      }
    },
    "ResourceClass": {
      "get": {
        "!type": "fn(method: string)"
      },
      "save": {
        "!type": "fn(method: string)"
      },
      "query": {
        "!type": "fn(method: string, isArray: bool)"
      },
      "remove": {
        "!type": "fn(method: string)"
      },
      "delete": {
        "!type": "fn(method: string)"
      }
    },
    "$resource": {
      "!proto": "ResourceClass",
      "!type": "fn(url: string, paramDefaults?: ?) -> +$resource"
    },
    "$rootElement": {
      "!proto": "jQueryLite"
    },
    "$rootScope": {
      "!proto": "Scope"
    },
    "$sce": {
      "getTrusted": {
        "!type": "fn(type: string, maybeTrusted: ?)"
      },
      "getTrustedCss": {
        "!type": "fn(value: ?)"
      },
      "getTrustedHtml": {
        "!type": "fn(value: ?)"
      },
      "getTrustedJs": {
        "!type": "fn(value: ?)"
      },
      "getTrustedResourceUrl": {
        "!type": "fn(value: ?)"
      },
      "getTrustedUrl": {
        "!type": "fn(value: ?)"
      },
      "parse": {
        "!type": "fn(type: string, expression: string) -> fn(context: obj, locals: obj)"
      },
      "parseAsCss": {
        "!type": "fn(expression: string) -> fn(context: obj, locals: obj)"
      },
      "parseAsJs": {
        "!type": "fn(expression: string) -> fn(context: obj, locals: obj)"
      },
      "parseAsResourceUrl": {
        "!type": "fn(expression: string) -> fn(context: obj, locals: obj)"
      },
      "parseAsUrl": {
        "!type": "fn(expression: string) -> fn(context: obj, locals: obj)"
      },
      "trustAs": {
        "!type": "fn(type: string, value: ?)"
      },
      "trustAsHtml": {
        "!type": "fn(value: ?) -> obj"
      },
      "trustAsJs": {
        "!type": "fn(value: ?) -> obj"
      },
      "trustAsResourceUrl": {
        "!type": "fn(value: ?) -> obj"
      },
      "trustAsUrl": {
        "!type": "fn(value: ?) -> obj"
      },
      "isEnabled": {
        "!type": "fn() -> bool"
      }
    },
    "$sceDelegate": {
      "getTrusted": {
        "!type": "fn(type: string, maybeTrusted: ?)"
      },
      "trustAs": {
        "!type": "fn(type: string, value: ?)"
      },
      "valueOf": {
        "!type": "fn(value: ?)"
      }
    },
    "$scope": {
      "!proto": "Scope"
    },
    "$templateCache": {
      "put": {
        "!type": "fn(templateID: string, templateContent: string)"
      },
      "get": {
        "!type": "fn(templateID: string) -> string"
      }
    },
    "$timeout": {
      "!type": "fn(fn: fn(), delay?: number, invokeApply?: bool) -> Promise",
      "cancel": {
        "!type": "fn(promise: Promise) -> bool"
      }
    },
    "$swipe": {
      "bind": {
        "!type": "fn(element: jQueryLite, handlersObj: obj)"
      }
    },
    "$interval": {
      "!type": "fn(fn: fn(), delay: number, count?: number, invokeApply?: bool) -> Promise",
      "cancel": {
        "!type": "fn(promise: Promise) -> bool"
      }
    },
    "$log": {
      "debug": {
        "!type": "fn(message: ?)"
      },
      "info": {
        "!type": "fn(message: ?)"
      },
      "warn": {
        "!type": "fn(message: ?)"
      },
      "error": {
        "!type": "fn(message: ?)"
      },
      "log": {
        "!type": "fn(message: ?)"
      }
    },
    "$location": {
      "absUrl": {
        "!type": "fn() -> string"
      },
      "url": {
        "!type": "fn(url?: string) -> string"
      },
      "path": {
        "!type": "fn(path?: string) -> string"
      },
      "search": {
        "!type": "fn(search?: ?, paramValue?: ?) -> obj"
      },
      "hash": {
        "!type": "fn(hash?: string) -> string"
      },
      "protocol": {
        "!type": "fn() -> string"
      },
      "host": {
        "!type": "fn() -> string"
      },
      "port": {
        "!type": "fn() -> number"
      },
      "replace": {
        "!type": "fn()"
      }
    },
    "$parse": {
      "!type": "fn(expression: string) -> fn(context: obj, locals?: obj)"
    },
    "Scope": {
      "$apply": {
        "!type": "fn(exp?: ?)"
      },
      "$broadcast": {
        "!type": "fn(name: string, args?: ?) -> +EmitEvent"
      },
      "$destroy": {
        "!type": "fn()"
      },
      "$digest": {
        "!type": "fn()"
      },
      "$emit": {
        "!type": "fn(name: string, args?: ?) -> +EmitEvent"
      },
      "$eval": {
        "!type": "fn(exp: ?) -> ?"
      },
      "$evalAsync": {
        "!type": "fn(exp?: ?)"
      },
      "$new": {
        "!type": "fn(isolate: bool) -> Scope"
      },
      "$on": {
        "!type": "fn(name: string, listener: fn(e: EmitEvent, args?: ?)) -> fn()"
      },
      "$watch": {
        "!type": "fn(watchExpression: ?, listener?: fn(new: ?, old: ?), objectEquality?: bool) -> fn()"
      },
      "$watchCollection": {
        "!type": "fn(obj: ?, listener: fn(newVal: ?, oldVal: ?)) -> fn()"
      },
      "$watchGroup": {
        "!type": "fn(watchExpressions: [?], listener: fn(newValues: [?], oldValues: [?])) -> fn()"
      },
      "$id": {
        "!type": "number"
      },
      "$parent": {
        "!type": "+Scope"
      },
      "$root": {
        "!type": "+Scope"
      }
    },
    "Attrs": {
      "$set": {
        "!type": "fn(name: string, value: string)"
      },
      "$attr": {}
    },
    "version": {
      "full": {
        "!type": "string"
      },
      "major": {
        "!type": "number"
      },
      "minor": {
        "!type": "number"
      },
      "dot": {
        "!type": "number"
      },
      "codeName": {
        "!type": "string"
      }
    },
    "$window": {
      "document": {
        "!type": "obj"
      },
      "location": {
        "!type": "obj"
      },
      "setTimeout": {
        "!type": "fn(fn: fn(), delay: number) -> number"
      },
      "clearTimeout": {
        "!type": "fn(id: number)"
      },
      "setInterval": {
        "!type": "fn(fn: fn(), delay: number) -> number"
      },
      "clearInterval": {
        "!type": "fn(id: number)"
      }
    },
    "$provide": {
      "!proto": "$provider"
    },
    "angular": {
      "module": "module",
      "element": {
        "!type": "fn(elem: ?) -> jQueryLite"
      },
      "bind": {
        "!type": "fn(self: ?, fn: fn(), args: ?) -> fn()"
      },
      "bootstrap": {
        "!type": "fn(element: +Element, modules: []) -> $injector"
      },
      "copy": {
        "!type": "fn(source: ?, destination: ?) -> !0",
        "!effects": ["copy !1 !0"]
      },
      "equals": {
        "!type": "fn(o1: ?, o2: ?) -> bool"
      },
      "extend": {
        "!type": "fn(dst: ?, src: ?) -> !0",
        "!effects": ["copy !1 !0"]
      },
      "forEach": {
        "!type": "fn(collection: ?, callback: fn(value: ?, key: ?), context?: ?) -> !0",
        "!effects": ["call !1 this=!2"]
      },
      "fromJson": {
        "!type": "fn(json: string) -> ?"
      },
      "identity": {
        "!type": "fn(arg: ?) -> ?"
      },
      "injector": {
        "!type": "fn(modules: []) -> $injector"
      },
      "isArray": {
        "!type": "fn(ref: ?) -> bool"
      },
      "isDate": {
        "!type": "fn(ref: ?) -> bool"
      },
      "isDefined": {
        "!type": "fn(ref: ?) -> bool"
      },
      "isElement": {
        "!type": "fn(ref: ?) -> bool"
      },
      "isFunction": {
        "!type": "fn(ref: ?) -> bool"
      },
      "isNumber": {
        "!type": "fn(ref: ?) -> bool"
      },
      "isObject": {
        "!type": "fn(ref: ?) -> bool"
      },
      "isString": {
        "!type": "fn(ref: ?) -> bool"
      },
      "isUndefined": {
        "!type": "fn(ref: ?) -> bool"
      },
      "lowercase": {
        "!type": "fn(str: string) -> string"
      },
      "mock": {
        "dump": {
          "!type": "fn(obj: obj) -> string"
        },
        "inject": {
          "!type": "$inject"
        },
        "module": {
          "!type": "fn(fns: ?)"
        }
      },
      "noop": {
        "!type": "fn() -> fn()"
      },
      "toJson": {
        "!type": "fn(obj: obj, pretty: bool) -> string"
      },
      "uppercase": {
        "!type": "fn(str: string) -> string"
      },
      "version": {
        "!type": "version"
      }
    }
  };

  export { angularJsTern };