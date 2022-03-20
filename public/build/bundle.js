
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop$1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$2(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse$1(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1, Object: Object_1, console: console_1$2 } = globals;

    // (251:0) {:else}
    function create_else_block$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap$1(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$2({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation$1() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation$1());

    	const update = () => {
    		set(getLocation$1());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse$1(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$2,
    		wrap: wrap$1,
    		getLocation: getLocation$1,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse: parse$1,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function devAssert(condition, message) {
      const booleanCondition = Boolean(condition);

      if (!booleanCondition) {
        throw new Error(message);
      }
    }

    const MAX_ARRAY_LENGTH = 10;
    const MAX_RECURSIVE_DEPTH = 2;
    /**
     * Used to print values in error messages.
     */

    function inspect(value) {
      return formatValue(value, []);
    }

    function formatValue(value, seenValues) {
      switch (typeof value) {
        case 'string':
          return JSON.stringify(value);

        case 'function':
          return value.name ? `[function ${value.name}]` : '[function]';

        case 'object':
          return formatObjectValue(value, seenValues);

        default:
          return String(value);
      }
    }

    function formatObjectValue(value, previouslySeenValues) {
      if (value === null) {
        return 'null';
      }

      if (previouslySeenValues.includes(value)) {
        return '[Circular]';
      }

      const seenValues = [...previouslySeenValues, value];

      if (isJSONable(value)) {
        const jsonValue = value.toJSON(); // check for infinite recursion

        if (jsonValue !== value) {
          return typeof jsonValue === 'string'
            ? jsonValue
            : formatValue(jsonValue, seenValues);
        }
      } else if (Array.isArray(value)) {
        return formatArray(value, seenValues);
      }

      return formatObject(value, seenValues);
    }

    function isJSONable(value) {
      return typeof value.toJSON === 'function';
    }

    function formatObject(object, seenValues) {
      const entries = Object.entries(object);

      if (entries.length === 0) {
        return '{}';
      }

      if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return '[' + getObjectTag(object) + ']';
      }

      const properties = entries.map(
        ([key, value]) => key + ': ' + formatValue(value, seenValues),
      );
      return '{ ' + properties.join(', ') + ' }';
    }

    function formatArray(array, seenValues) {
      if (array.length === 0) {
        return '[]';
      }

      if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return '[Array]';
      }

      const len = Math.min(MAX_ARRAY_LENGTH, array.length);
      const remaining = array.length - len;
      const items = [];

      for (let i = 0; i < len; ++i) {
        items.push(formatValue(array[i], seenValues));
      }

      if (remaining === 1) {
        items.push('... 1 more item');
      } else if (remaining > 1) {
        items.push(`... ${remaining} more items`);
      }

      return '[' + items.join(', ') + ']';
    }

    function getObjectTag(object) {
      const tag = Object.prototype.toString
        .call(object)
        .replace(/^\[object /, '')
        .replace(/]$/, '');

      if (tag === 'Object' && typeof object.constructor === 'function') {
        const name = object.constructor.name;

        if (typeof name === 'string' && name !== '') {
          return name;
        }
      }

      return tag;
    }

    /**
     * Contains a range of UTF-8 character offsets and token references that
     * identify the region of the source from which the AST derived.
     */
    class Location {
      /**
       * The character offset at which this Node begins.
       */

      /**
       * The character offset at which this Node ends.
       */

      /**
       * The Token at which this Node begins.
       */

      /**
       * The Token at which this Node ends.
       */

      /**
       * The Source document the AST represents.
       */
      constructor(startToken, endToken, source) {
        this.start = startToken.start;
        this.end = endToken.end;
        this.startToken = startToken;
        this.endToken = endToken;
        this.source = source;
      }

      get [Symbol.toStringTag]() {
        return 'Location';
      }

      toJSON() {
        return {
          start: this.start,
          end: this.end,
        };
      }
    }
    /**
     * Represents a range of characters represented by a lexical token
     * within a Source.
     */

    class Token {
      /**
       * The kind of Token.
       */

      /**
       * The character offset at which this Node begins.
       */

      /**
       * The character offset at which this Node ends.
       */

      /**
       * The 1-indexed line number on which this Token appears.
       */

      /**
       * The 1-indexed column number at which this Token begins.
       */

      /**
       * For non-punctuation tokens, represents the interpreted value of the token.
       *
       * Note: is undefined for punctuation tokens, but typed as string for
       * convenience in the parser.
       */

      /**
       * Tokens exist as nodes in a double-linked-list amongst all tokens
       * including ignored tokens. <SOF> is always the first node and <EOF>
       * the last.
       */
      constructor(kind, start, end, line, column, value) {
        this.kind = kind;
        this.start = start;
        this.end = end;
        this.line = line;
        this.column = column; // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

        this.value = value;
        this.prev = null;
        this.next = null;
      }

      get [Symbol.toStringTag]() {
        return 'Token';
      }

      toJSON() {
        return {
          kind: this.kind,
          value: this.value,
          line: this.line,
          column: this.column,
        };
      }
    }
    /**
     * The list of all possible AST node types.
     */

    /**
     * @internal
     */
    const QueryDocumentKeys = {
      Name: [],
      Document: ['definitions'],
      OperationDefinition: [
        'name',
        'variableDefinitions',
        'directives',
        'selectionSet',
      ],
      VariableDefinition: ['variable', 'type', 'defaultValue', 'directives'],
      Variable: ['name'],
      SelectionSet: ['selections'],
      Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
      Argument: ['name', 'value'],
      FragmentSpread: ['name', 'directives'],
      InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
      FragmentDefinition: [
        'name', // Note: fragment variable definitions are deprecated and will removed in v17.0.0
        'variableDefinitions',
        'typeCondition',
        'directives',
        'selectionSet',
      ],
      IntValue: [],
      FloatValue: [],
      StringValue: [],
      BooleanValue: [],
      NullValue: [],
      EnumValue: [],
      ListValue: ['values'],
      ObjectValue: ['fields'],
      ObjectField: ['name', 'value'],
      Directive: ['name', 'arguments'],
      NamedType: ['name'],
      ListType: ['type'],
      NonNullType: ['type'],
      SchemaDefinition: ['description', 'directives', 'operationTypes'],
      OperationTypeDefinition: ['type'],
      ScalarTypeDefinition: ['description', 'name', 'directives'],
      ObjectTypeDefinition: [
        'description',
        'name',
        'interfaces',
        'directives',
        'fields',
      ],
      FieldDefinition: ['description', 'name', 'arguments', 'type', 'directives'],
      InputValueDefinition: [
        'description',
        'name',
        'type',
        'defaultValue',
        'directives',
      ],
      InterfaceTypeDefinition: [
        'description',
        'name',
        'interfaces',
        'directives',
        'fields',
      ],
      UnionTypeDefinition: ['description', 'name', 'directives', 'types'],
      EnumTypeDefinition: ['description', 'name', 'directives', 'values'],
      EnumValueDefinition: ['description', 'name', 'directives'],
      InputObjectTypeDefinition: ['description', 'name', 'directives', 'fields'],
      DirectiveDefinition: ['description', 'name', 'arguments', 'locations'],
      SchemaExtension: ['directives', 'operationTypes'],
      ScalarTypeExtension: ['name', 'directives'],
      ObjectTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
      InterfaceTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
      UnionTypeExtension: ['name', 'directives', 'types'],
      EnumTypeExtension: ['name', 'directives', 'values'],
      InputObjectTypeExtension: ['name', 'directives', 'fields'],
    };
    const kindValues = new Set(Object.keys(QueryDocumentKeys));
    /**
     * @internal
     */

    function isNode(maybeNode) {
      const maybeKind =
        maybeNode === null || maybeNode === void 0 ? void 0 : maybeNode.kind;
      return typeof maybeKind === 'string' && kindValues.has(maybeKind);
    }
    /** Name */

    let OperationTypeNode;

    (function (OperationTypeNode) {
      OperationTypeNode['QUERY'] = 'query';
      OperationTypeNode['MUTATION'] = 'mutation';
      OperationTypeNode['SUBSCRIPTION'] = 'subscription';
    })(OperationTypeNode || (OperationTypeNode = {}));

    /**
     * The set of allowed kind values for AST nodes.
     */
    let Kind;
    /**
     * The enum type representing the possible kind values of AST nodes.
     *
     * @deprecated Please use `Kind`. Will be remove in v17.
     */

    (function (Kind) {
      Kind['NAME'] = 'Name';
      Kind['DOCUMENT'] = 'Document';
      Kind['OPERATION_DEFINITION'] = 'OperationDefinition';
      Kind['VARIABLE_DEFINITION'] = 'VariableDefinition';
      Kind['SELECTION_SET'] = 'SelectionSet';
      Kind['FIELD'] = 'Field';
      Kind['ARGUMENT'] = 'Argument';
      Kind['FRAGMENT_SPREAD'] = 'FragmentSpread';
      Kind['INLINE_FRAGMENT'] = 'InlineFragment';
      Kind['FRAGMENT_DEFINITION'] = 'FragmentDefinition';
      Kind['VARIABLE'] = 'Variable';
      Kind['INT'] = 'IntValue';
      Kind['FLOAT'] = 'FloatValue';
      Kind['STRING'] = 'StringValue';
      Kind['BOOLEAN'] = 'BooleanValue';
      Kind['NULL'] = 'NullValue';
      Kind['ENUM'] = 'EnumValue';
      Kind['LIST'] = 'ListValue';
      Kind['OBJECT'] = 'ObjectValue';
      Kind['OBJECT_FIELD'] = 'ObjectField';
      Kind['DIRECTIVE'] = 'Directive';
      Kind['NAMED_TYPE'] = 'NamedType';
      Kind['LIST_TYPE'] = 'ListType';
      Kind['NON_NULL_TYPE'] = 'NonNullType';
      Kind['SCHEMA_DEFINITION'] = 'SchemaDefinition';
      Kind['OPERATION_TYPE_DEFINITION'] = 'OperationTypeDefinition';
      Kind['SCALAR_TYPE_DEFINITION'] = 'ScalarTypeDefinition';
      Kind['OBJECT_TYPE_DEFINITION'] = 'ObjectTypeDefinition';
      Kind['FIELD_DEFINITION'] = 'FieldDefinition';
      Kind['INPUT_VALUE_DEFINITION'] = 'InputValueDefinition';
      Kind['INTERFACE_TYPE_DEFINITION'] = 'InterfaceTypeDefinition';
      Kind['UNION_TYPE_DEFINITION'] = 'UnionTypeDefinition';
      Kind['ENUM_TYPE_DEFINITION'] = 'EnumTypeDefinition';
      Kind['ENUM_VALUE_DEFINITION'] = 'EnumValueDefinition';
      Kind['INPUT_OBJECT_TYPE_DEFINITION'] = 'InputObjectTypeDefinition';
      Kind['DIRECTIVE_DEFINITION'] = 'DirectiveDefinition';
      Kind['SCHEMA_EXTENSION'] = 'SchemaExtension';
      Kind['SCALAR_TYPE_EXTENSION'] = 'ScalarTypeExtension';
      Kind['OBJECT_TYPE_EXTENSION'] = 'ObjectTypeExtension';
      Kind['INTERFACE_TYPE_EXTENSION'] = 'InterfaceTypeExtension';
      Kind['UNION_TYPE_EXTENSION'] = 'UnionTypeExtension';
      Kind['ENUM_TYPE_EXTENSION'] = 'EnumTypeExtension';
      Kind['INPUT_OBJECT_TYPE_EXTENSION'] = 'InputObjectTypeExtension';
    })(Kind || (Kind = {}));

    /**
     * A visitor is provided to visit, it contains the collection of
     * relevant functions to be called during the visitor's traversal.
     */

    const BREAK = Object.freeze({});
    /**
     * visit() will walk through an AST using a depth-first traversal, calling
     * the visitor's enter function at each node in the traversal, and calling the
     * leave function after visiting that node and all of its child nodes.
     *
     * By returning different values from the enter and leave functions, the
     * behavior of the visitor can be altered, including skipping over a sub-tree of
     * the AST (by returning false), editing the AST by returning a value or null
     * to remove the value, or to stop the whole traversal by returning BREAK.
     *
     * When using visit() to edit an AST, the original AST will not be modified, and
     * a new version of the AST with the changes applied will be returned from the
     * visit function.
     *
     * ```ts
     * const editedAST = visit(ast, {
     *   enter(node, key, parent, path, ancestors) {
     *     // @return
     *     //   undefined: no action
     *     //   false: skip visiting this node
     *     //   visitor.BREAK: stop visiting altogether
     *     //   null: delete this node
     *     //   any value: replace this node with the returned value
     *   },
     *   leave(node, key, parent, path, ancestors) {
     *     // @return
     *     //   undefined: no action
     *     //   false: no action
     *     //   visitor.BREAK: stop visiting altogether
     *     //   null: delete this node
     *     //   any value: replace this node with the returned value
     *   }
     * });
     * ```
     *
     * Alternatively to providing enter() and leave() functions, a visitor can
     * instead provide functions named the same as the kinds of AST nodes, or
     * enter/leave visitors at a named key, leading to three permutations of the
     * visitor API:
     *
     * 1) Named visitors triggered when entering a node of a specific kind.
     *
     * ```ts
     * visit(ast, {
     *   Kind(node) {
     *     // enter the "Kind" node
     *   }
     * })
     * ```
     *
     * 2) Named visitors that trigger upon entering and leaving a node of a specific kind.
     *
     * ```ts
     * visit(ast, {
     *   Kind: {
     *     enter(node) {
     *       // enter the "Kind" node
     *     }
     *     leave(node) {
     *       // leave the "Kind" node
     *     }
     *   }
     * })
     * ```
     *
     * 3) Generic visitors that trigger upon entering and leaving any node.
     *
     * ```ts
     * visit(ast, {
     *   enter(node) {
     *     // enter any node
     *   },
     *   leave(node) {
     *     // leave any node
     *   }
     * })
     * ```
     */

    function visit(root, visitor, visitorKeys = QueryDocumentKeys) {
      const enterLeaveMap = new Map();

      for (const kind of Object.values(Kind)) {
        enterLeaveMap.set(kind, getEnterLeaveForKind(visitor, kind));
      }
      /* eslint-disable no-undef-init */

      let stack = undefined;
      let inArray = Array.isArray(root);
      let keys = [root];
      let index = -1;
      let edits = [];
      let node = root;
      let key = undefined;
      let parent = undefined;
      const path = [];
      const ancestors = [];
      /* eslint-enable no-undef-init */

      do {
        index++;
        const isLeaving = index === keys.length;
        const isEdited = isLeaving && edits.length !== 0;

        if (isLeaving) {
          key = ancestors.length === 0 ? undefined : path[path.length - 1];
          node = parent;
          parent = ancestors.pop();

          if (isEdited) {
            if (inArray) {
              node = node.slice();
              let editOffset = 0;

              for (const [editKey, editValue] of edits) {
                const arrayKey = editKey - editOffset;

                if (editValue === null) {
                  node.splice(arrayKey, 1);
                  editOffset++;
                } else {
                  node[arrayKey] = editValue;
                }
              }
            } else {
              node = Object.defineProperties(
                {},
                Object.getOwnPropertyDescriptors(node),
              );

              for (const [editKey, editValue] of edits) {
                node[editKey] = editValue;
              }
            }
          }

          index = stack.index;
          keys = stack.keys;
          edits = stack.edits;
          inArray = stack.inArray;
          stack = stack.prev;
        } else if (parent) {
          key = inArray ? index : keys[index];
          node = parent[key];

          if (node === null || node === undefined) {
            continue;
          }

          path.push(key);
        }

        let result;

        if (!Array.isArray(node)) {
          var _enterLeaveMap$get, _enterLeaveMap$get2;

          isNode(node) || devAssert(false, `Invalid AST Node: ${inspect(node)}.`);
          const visitFn = isLeaving
            ? (_enterLeaveMap$get = enterLeaveMap.get(node.kind)) === null ||
              _enterLeaveMap$get === void 0
              ? void 0
              : _enterLeaveMap$get.leave
            : (_enterLeaveMap$get2 = enterLeaveMap.get(node.kind)) === null ||
              _enterLeaveMap$get2 === void 0
            ? void 0
            : _enterLeaveMap$get2.enter;
          result =
            visitFn === null || visitFn === void 0
              ? void 0
              : visitFn.call(visitor, node, key, parent, path, ancestors);

          if (result === BREAK) {
            break;
          }

          if (result === false) {
            if (!isLeaving) {
              path.pop();
              continue;
            }
          } else if (result !== undefined) {
            edits.push([key, result]);

            if (!isLeaving) {
              if (isNode(result)) {
                node = result;
              } else {
                path.pop();
                continue;
              }
            }
          }
        }

        if (result === undefined && isEdited) {
          edits.push([key, node]);
        }

        if (isLeaving) {
          path.pop();
        } else {
          var _node$kind;

          stack = {
            inArray,
            index,
            keys,
            edits,
            prev: stack,
          };
          inArray = Array.isArray(node);
          keys = inArray
            ? node
            : (_node$kind = visitorKeys[node.kind]) !== null &&
              _node$kind !== void 0
            ? _node$kind
            : [];
          index = -1;
          edits = [];

          if (parent) {
            ancestors.push(parent);
          }

          parent = node;
        }
      } while (stack !== undefined);

      if (edits.length !== 0) {
        // New root
        return edits[edits.length - 1][1];
      }

      return root;
    }
    /**
     * Given a visitor instance and a node kind, return EnterLeaveVisitor for that kind.
     */

    function getEnterLeaveForKind(visitor, kind) {
      const kindVisitor = visitor[kind];

      if (typeof kindVisitor === 'object') {
        // { Kind: { enter() {}, leave() {} } }
        return kindVisitor;
      } else if (typeof kindVisitor === 'function') {
        // { Kind() {} }
        return {
          enter: kindVisitor,
          leave: undefined,
        };
      } // { enter() {}, leave() {} }

      return {
        enter: visitor.enter,
        leave: visitor.leave,
      };
    }

    /**
     * ```
     * WhiteSpace ::
     *   - "Horizontal Tab (U+0009)"
     *   - "Space (U+0020)"
     * ```
     * @internal
     */
    function isWhiteSpace(code) {
      return code === 0x0009 || code === 0x0020;
    }
    /**
     * ```
     * Digit :: one of
     *   - `0` `1` `2` `3` `4` `5` `6` `7` `8` `9`
     * ```
     * @internal
     */

    function isDigit(code) {
      return code >= 0x0030 && code <= 0x0039;
    }
    /**
     * ```
     * Letter :: one of
     *   - `A` `B` `C` `D` `E` `F` `G` `H` `I` `J` `K` `L` `M`
     *   - `N` `O` `P` `Q` `R` `S` `T` `U` `V` `W` `X` `Y` `Z`
     *   - `a` `b` `c` `d` `e` `f` `g` `h` `i` `j` `k` `l` `m`
     *   - `n` `o` `p` `q` `r` `s` `t` `u` `v` `w` `x` `y` `z`
     * ```
     * @internal
     */

    function isLetter(code) {
      return (
        (code >= 0x0061 && code <= 0x007a) || // A-Z
        (code >= 0x0041 && code <= 0x005a) // a-z
      );
    }
    /**
     * ```
     * NameStart ::
     *   - Letter
     *   - `_`
     * ```
     * @internal
     */

    function isNameStart(code) {
      return isLetter(code) || code === 0x005f;
    }
    /**
     * ```
     * NameContinue ::
     *   - Letter
     *   - Digit
     *   - `_`
     * ```
     * @internal
     */

    function isNameContinue(code) {
      return isLetter(code) || isDigit(code) || code === 0x005f;
    }

    /**
     * Produces the value of a block string from its parsed raw value, similar to
     * CoffeeScript's block string, Python's docstring trim or Ruby's strip_heredoc.
     *
     * This implements the GraphQL spec's BlockStringValue() static algorithm.
     *
     * @internal
     */

    function dedentBlockStringLines(lines) {
      var _firstNonEmptyLine2;

      let commonIndent = Number.MAX_SAFE_INTEGER;
      let firstNonEmptyLine = null;
      let lastNonEmptyLine = -1;

      for (let i = 0; i < lines.length; ++i) {
        var _firstNonEmptyLine;

        const line = lines[i];
        const indent = leadingWhitespace(line);

        if (indent === line.length) {
          continue; // skip empty lines
        }

        firstNonEmptyLine =
          (_firstNonEmptyLine = firstNonEmptyLine) !== null &&
          _firstNonEmptyLine !== void 0
            ? _firstNonEmptyLine
            : i;
        lastNonEmptyLine = i;

        if (i !== 0 && indent < commonIndent) {
          commonIndent = indent;
        }
      }

      return lines // Remove common indentation from all lines but first.
        .map((line, i) => (i === 0 ? line : line.slice(commonIndent))) // Remove leading and trailing blank lines.
        .slice(
          (_firstNonEmptyLine2 = firstNonEmptyLine) !== null &&
            _firstNonEmptyLine2 !== void 0
            ? _firstNonEmptyLine2
            : 0,
          lastNonEmptyLine + 1,
        );
    }

    function leadingWhitespace(str) {
      let i = 0;

      while (i < str.length && isWhiteSpace(str.charCodeAt(i))) {
        ++i;
      }

      return i;
    }
    /**
     * Print a block string in the indented block form by adding a leading and
     * trailing blank line. However, if a block string starts with whitespace and is
     * a single-line, adding a leading blank line would strip that whitespace.
     *
     * @internal
     */

    function printBlockString(value, options) {
      const escapedValue = value.replace(/"""/g, '\\"""'); // Expand a block string's raw value into independent lines.

      const lines = escapedValue.split(/\r\n|[\n\r]/g);
      const isSingleLine = lines.length === 1; // If common indentation is found we can fix some of those cases by adding leading new line

      const forceLeadingNewLine =
        lines.length > 1 &&
        lines
          .slice(1)
          .every((line) => line.length === 0 || isWhiteSpace(line.charCodeAt(0))); // Trailing triple quotes just looks confusing but doesn't force trailing new line

      const hasTrailingTripleQuotes = escapedValue.endsWith('\\"""'); // Trailing quote (single or double) or slash forces trailing new line

      const hasTrailingQuote = value.endsWith('"') && !hasTrailingTripleQuotes;
      const hasTrailingSlash = value.endsWith('\\');
      const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
      const printAsMultipleLines =
        !(options !== null && options !== void 0 && options.minimize) && // add leading and trailing new lines only if it improves readability
        (!isSingleLine ||
          value.length > 70 ||
          forceTrailingNewline ||
          forceLeadingNewLine ||
          hasTrailingTripleQuotes);
      let result = ''; // Format a multi-line block quote to account for leading space.

      const skipLeadingNewLine = isSingleLine && isWhiteSpace(value.charCodeAt(0));

      if ((printAsMultipleLines && !skipLeadingNewLine) || forceLeadingNewLine) {
        result += '\n';
      }

      result += escapedValue;

      if (printAsMultipleLines || forceTrailingNewline) {
        result += '\n';
      }

      return '"""' + result + '"""';
    }

    /**
     * Prints a string as a GraphQL StringValue literal. Replaces control characters
     * and excluded characters (" U+0022 and \\ U+005C) with escape sequences.
     */
    function printString(str) {
      return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
    } // eslint-disable-next-line no-control-regex

    const escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;

    function escapedReplacer(str) {
      return escapeSequences[str.charCodeAt(0)];
    } // prettier-ignore

    const escapeSequences = [
      '\\u0000',
      '\\u0001',
      '\\u0002',
      '\\u0003',
      '\\u0004',
      '\\u0005',
      '\\u0006',
      '\\u0007',
      '\\b',
      '\\t',
      '\\n',
      '\\u000B',
      '\\f',
      '\\r',
      '\\u000E',
      '\\u000F',
      '\\u0010',
      '\\u0011',
      '\\u0012',
      '\\u0013',
      '\\u0014',
      '\\u0015',
      '\\u0016',
      '\\u0017',
      '\\u0018',
      '\\u0019',
      '\\u001A',
      '\\u001B',
      '\\u001C',
      '\\u001D',
      '\\u001E',
      '\\u001F',
      '',
      '',
      '\\"',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '', // 2F
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '', // 3F
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '', // 4F
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '\\\\',
      '',
      '',
      '', // 5F
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '', // 6F
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '\\u007F',
      '\\u0080',
      '\\u0081',
      '\\u0082',
      '\\u0083',
      '\\u0084',
      '\\u0085',
      '\\u0086',
      '\\u0087',
      '\\u0088',
      '\\u0089',
      '\\u008A',
      '\\u008B',
      '\\u008C',
      '\\u008D',
      '\\u008E',
      '\\u008F',
      '\\u0090',
      '\\u0091',
      '\\u0092',
      '\\u0093',
      '\\u0094',
      '\\u0095',
      '\\u0096',
      '\\u0097',
      '\\u0098',
      '\\u0099',
      '\\u009A',
      '\\u009B',
      '\\u009C',
      '\\u009D',
      '\\u009E',
      '\\u009F',
    ];

    /**
     * Converts an AST into a string, using one set of reasonable
     * formatting rules.
     */

    function print(ast) {
      return visit(ast, printDocASTReducer);
    }
    const MAX_LINE_LENGTH = 80;
    const printDocASTReducer = {
      Name: {
        leave: (node) => node.value,
      },
      Variable: {
        leave: (node) => '$' + node.name,
      },
      // Document
      Document: {
        leave: (node) => join(node.definitions, '\n\n'),
      },
      OperationDefinition: {
        leave(node) {
          const varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
          const prefix = join(
            [
              node.operation,
              join([node.name, varDefs]),
              join(node.directives, ' '),
            ],
            ' ',
          ); // Anonymous queries with no directives or variable definitions can use
          // the query short form.

          return (prefix === 'query' ? '' : prefix + ' ') + node.selectionSet;
        },
      },
      VariableDefinition: {
        leave: ({ variable, type, defaultValue, directives }) =>
          variable +
          ': ' +
          type +
          wrap(' = ', defaultValue) +
          wrap(' ', join(directives, ' ')),
      },
      SelectionSet: {
        leave: ({ selections }) => block(selections),
      },
      Field: {
        leave({ alias, name, arguments: args, directives, selectionSet }) {
          const prefix = wrap('', alias, ': ') + name;
          let argsLine = prefix + wrap('(', join(args, ', '), ')');

          if (argsLine.length > MAX_LINE_LENGTH) {
            argsLine = prefix + wrap('(\n', indent(join(args, '\n')), '\n)');
          }

          return join([argsLine, join(directives, ' '), selectionSet], ' ');
        },
      },
      Argument: {
        leave: ({ name, value }) => name + ': ' + value,
      },
      // Fragments
      FragmentSpread: {
        leave: ({ name, directives }) =>
          '...' + name + wrap(' ', join(directives, ' ')),
      },
      InlineFragment: {
        leave: ({ typeCondition, directives, selectionSet }) =>
          join(
            [
              '...',
              wrap('on ', typeCondition),
              join(directives, ' '),
              selectionSet,
            ],
            ' ',
          ),
      },
      FragmentDefinition: {
        leave: (
          { name, typeCondition, variableDefinitions, directives, selectionSet }, // Note: fragment variable definitions are experimental and may be changed
        ) =>
          // or removed in the future.
          `fragment ${name}${wrap('(', join(variableDefinitions, ', '), ')')} ` +
          `on ${typeCondition} ${wrap('', join(directives, ' '), ' ')}` +
          selectionSet,
      },
      // Value
      IntValue: {
        leave: ({ value }) => value,
      },
      FloatValue: {
        leave: ({ value }) => value,
      },
      StringValue: {
        leave: ({ value, block: isBlockString }) =>
          isBlockString ? printBlockString(value) : printString(value),
      },
      BooleanValue: {
        leave: ({ value }) => (value ? 'true' : 'false'),
      },
      NullValue: {
        leave: () => 'null',
      },
      EnumValue: {
        leave: ({ value }) => value,
      },
      ListValue: {
        leave: ({ values }) => '[' + join(values, ', ') + ']',
      },
      ObjectValue: {
        leave: ({ fields }) => '{' + join(fields, ', ') + '}',
      },
      ObjectField: {
        leave: ({ name, value }) => name + ': ' + value,
      },
      // Directive
      Directive: {
        leave: ({ name, arguments: args }) =>
          '@' + name + wrap('(', join(args, ', '), ')'),
      },
      // Type
      NamedType: {
        leave: ({ name }) => name,
      },
      ListType: {
        leave: ({ type }) => '[' + type + ']',
      },
      NonNullType: {
        leave: ({ type }) => type + '!',
      },
      // Type System Definitions
      SchemaDefinition: {
        leave: ({ description, directives, operationTypes }) =>
          wrap('', description, '\n') +
          join(['schema', join(directives, ' '), block(operationTypes)], ' '),
      },
      OperationTypeDefinition: {
        leave: ({ operation, type }) => operation + ': ' + type,
      },
      ScalarTypeDefinition: {
        leave: ({ description, name, directives }) =>
          wrap('', description, '\n') +
          join(['scalar', name, join(directives, ' ')], ' '),
      },
      ObjectTypeDefinition: {
        leave: ({ description, name, interfaces, directives, fields }) =>
          wrap('', description, '\n') +
          join(
            [
              'type',
              name,
              wrap('implements ', join(interfaces, ' & ')),
              join(directives, ' '),
              block(fields),
            ],
            ' ',
          ),
      },
      FieldDefinition: {
        leave: ({ description, name, arguments: args, type, directives }) =>
          wrap('', description, '\n') +
          name +
          (hasMultilineItems(args)
            ? wrap('(\n', indent(join(args, '\n')), '\n)')
            : wrap('(', join(args, ', '), ')')) +
          ': ' +
          type +
          wrap(' ', join(directives, ' ')),
      },
      InputValueDefinition: {
        leave: ({ description, name, type, defaultValue, directives }) =>
          wrap('', description, '\n') +
          join(
            [name + ': ' + type, wrap('= ', defaultValue), join(directives, ' ')],
            ' ',
          ),
      },
      InterfaceTypeDefinition: {
        leave: ({ description, name, interfaces, directives, fields }) =>
          wrap('', description, '\n') +
          join(
            [
              'interface',
              name,
              wrap('implements ', join(interfaces, ' & ')),
              join(directives, ' '),
              block(fields),
            ],
            ' ',
          ),
      },
      UnionTypeDefinition: {
        leave: ({ description, name, directives, types }) =>
          wrap('', description, '\n') +
          join(
            ['union', name, join(directives, ' '), wrap('= ', join(types, ' | '))],
            ' ',
          ),
      },
      EnumTypeDefinition: {
        leave: ({ description, name, directives, values }) =>
          wrap('', description, '\n') +
          join(['enum', name, join(directives, ' '), block(values)], ' '),
      },
      EnumValueDefinition: {
        leave: ({ description, name, directives }) =>
          wrap('', description, '\n') + join([name, join(directives, ' ')], ' '),
      },
      InputObjectTypeDefinition: {
        leave: ({ description, name, directives, fields }) =>
          wrap('', description, '\n') +
          join(['input', name, join(directives, ' '), block(fields)], ' '),
      },
      DirectiveDefinition: {
        leave: ({ description, name, arguments: args, repeatable, locations }) =>
          wrap('', description, '\n') +
          'directive @' +
          name +
          (hasMultilineItems(args)
            ? wrap('(\n', indent(join(args, '\n')), '\n)')
            : wrap('(', join(args, ', '), ')')) +
          (repeatable ? ' repeatable' : '') +
          ' on ' +
          join(locations, ' | '),
      },
      SchemaExtension: {
        leave: ({ directives, operationTypes }) =>
          join(
            ['extend schema', join(directives, ' '), block(operationTypes)],
            ' ',
          ),
      },
      ScalarTypeExtension: {
        leave: ({ name, directives }) =>
          join(['extend scalar', name, join(directives, ' ')], ' '),
      },
      ObjectTypeExtension: {
        leave: ({ name, interfaces, directives, fields }) =>
          join(
            [
              'extend type',
              name,
              wrap('implements ', join(interfaces, ' & ')),
              join(directives, ' '),
              block(fields),
            ],
            ' ',
          ),
      },
      InterfaceTypeExtension: {
        leave: ({ name, interfaces, directives, fields }) =>
          join(
            [
              'extend interface',
              name,
              wrap('implements ', join(interfaces, ' & ')),
              join(directives, ' '),
              block(fields),
            ],
            ' ',
          ),
      },
      UnionTypeExtension: {
        leave: ({ name, directives, types }) =>
          join(
            [
              'extend union',
              name,
              join(directives, ' '),
              wrap('= ', join(types, ' | ')),
            ],
            ' ',
          ),
      },
      EnumTypeExtension: {
        leave: ({ name, directives, values }) =>
          join(['extend enum', name, join(directives, ' '), block(values)], ' '),
      },
      InputObjectTypeExtension: {
        leave: ({ name, directives, fields }) =>
          join(['extend input', name, join(directives, ' '), block(fields)], ' '),
      },
    };
    /**
     * Given maybeArray, print an empty string if it is null or empty, otherwise
     * print all items together separated by separator if provided
     */

    function join(maybeArray, separator = '') {
      var _maybeArray$filter$jo;

      return (_maybeArray$filter$jo =
        maybeArray === null || maybeArray === void 0
          ? void 0
          : maybeArray.filter((x) => x).join(separator)) !== null &&
        _maybeArray$filter$jo !== void 0
        ? _maybeArray$filter$jo
        : '';
    }
    /**
     * Given array, print each item on its own line, wrapped in an indented `{ }` block.
     */

    function block(array) {
      return wrap('{\n', indent(join(array, '\n')), '\n}');
    }
    /**
     * If maybeString is not null or empty, then wrap with start and end, otherwise print an empty string.
     */

    function wrap(start, maybeString, end = '') {
      return maybeString != null && maybeString !== ''
        ? start + maybeString + end
        : '';
    }

    function indent(str) {
      return wrap('  ', str.replace(/\n/g, '\n  '));
    }

    function hasMultilineItems(maybeArray) {
      var _maybeArray$some;

      // FIXME: https://github.com/graphql/graphql-js/issues/2203

      /* c8 ignore next */
      return (_maybeArray$some =
        maybeArray === null || maybeArray === void 0
          ? void 0
          : maybeArray.some((str) => str.includes('\n'))) !== null &&
        _maybeArray$some !== void 0
        ? _maybeArray$some
        : false;
    }

    /**
     * Return true if `value` is object-like. A value is object-like if it's not
     * `null` and has a `typeof` result of "object".
     */
    function isObjectLike(value) {
      return typeof value == 'object' && value !== null;
    }

    function invariant(condition, message) {
      const booleanCondition = Boolean(condition);

      if (!booleanCondition) {
        throw new Error(
          message != null ? message : 'Unexpected invariant triggered.',
        );
      }
    }

    const LineRegExp = /\r\n|[\n\r]/g;
    /**
     * Represents a location in a Source.
     */

    /**
     * Takes a Source and a UTF-8 character offset, and returns the corresponding
     * line and column as a SourceLocation.
     */
    function getLocation(source, position) {
      let lastLineStart = 0;
      let line = 1;

      for (const match of source.body.matchAll(LineRegExp)) {
        typeof match.index === 'number' || invariant(false);

        if (match.index >= position) {
          break;
        }

        lastLineStart = match.index + match[0].length;
        line += 1;
      }

      return {
        line,
        column: position + 1 - lastLineStart,
      };
    }

    /**
     * Render a helpful description of the location in the GraphQL Source document.
     */
    function printLocation(location) {
      return printSourceLocation(
        location.source,
        getLocation(location.source, location.start),
      );
    }
    /**
     * Render a helpful description of the location in the GraphQL Source document.
     */

    function printSourceLocation(source, sourceLocation) {
      const firstLineColumnOffset = source.locationOffset.column - 1;
      const body = ''.padStart(firstLineColumnOffset) + source.body;
      const lineIndex = sourceLocation.line - 1;
      const lineOffset = source.locationOffset.line - 1;
      const lineNum = sourceLocation.line + lineOffset;
      const columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
      const columnNum = sourceLocation.column + columnOffset;
      const locationStr = `${source.name}:${lineNum}:${columnNum}\n`;
      const lines = body.split(/\r\n|[\n\r]/g);
      const locationLine = lines[lineIndex]; // Special case for minified documents

      if (locationLine.length > 120) {
        const subLineIndex = Math.floor(columnNum / 80);
        const subLineColumnNum = columnNum % 80;
        const subLines = [];

        for (let i = 0; i < locationLine.length; i += 80) {
          subLines.push(locationLine.slice(i, i + 80));
        }

        return (
          locationStr +
          printPrefixedLines([
            [`${lineNum} |`, subLines[0]],
            ...subLines.slice(1, subLineIndex + 1).map((subLine) => ['|', subLine]),
            ['|', '^'.padStart(subLineColumnNum)],
            ['|', subLines[subLineIndex + 1]],
          ])
        );
      }

      return (
        locationStr +
        printPrefixedLines([
          // Lines specified like this: ["prefix", "string"],
          [`${lineNum - 1} |`, lines[lineIndex - 1]],
          [`${lineNum} |`, locationLine],
          ['|', '^'.padStart(columnNum)],
          [`${lineNum + 1} |`, lines[lineIndex + 1]],
        ])
      );
    }

    function printPrefixedLines(lines) {
      const existingLines = lines.filter(([_, line]) => line !== undefined);
      const padLen = Math.max(...existingLines.map(([prefix]) => prefix.length));
      return existingLines
        .map(([prefix, line]) => prefix.padStart(padLen) + (line ? ' ' + line : ''))
        .join('\n');
    }

    function toNormalizedArgs(args) {
      const firstArg = args[0];

      if (firstArg == null || 'kind' in firstArg || 'length' in firstArg) {
        return {
          nodes: firstArg,
          source: args[1],
          positions: args[2],
          path: args[3],
          originalError: args[4],
          extensions: args[5],
        };
      }

      return firstArg;
    }
    /**
     * A GraphQLError describes an Error found during the parse, validate, or
     * execute phases of performing a GraphQL operation. In addition to a message
     * and stack trace, it also includes information about the locations in a
     * GraphQL document and/or execution result that correspond to the Error.
     */

    class GraphQLError extends Error {
      /**
       * An array of `{ line, column }` locations within the source GraphQL document
       * which correspond to this error.
       *
       * Errors during validation often contain multiple locations, for example to
       * point out two things with the same name. Errors during execution include a
       * single location, the field which produced the error.
       *
       * Enumerable, and appears in the result of JSON.stringify().
       */

      /**
       * An array describing the JSON-path into the execution response which
       * corresponds to this error. Only included for errors during execution.
       *
       * Enumerable, and appears in the result of JSON.stringify().
       */

      /**
       * An array of GraphQL AST Nodes corresponding to this error.
       */

      /**
       * The source GraphQL document for the first location of this error.
       *
       * Note that if this Error represents more than one node, the source may not
       * represent nodes after the first node.
       */

      /**
       * An array of character offsets within the source GraphQL document
       * which correspond to this error.
       */

      /**
       * The original error thrown from a field resolver during execution.
       */

      /**
       * Extension fields to add to the formatted error.
       */

      /**
       * @deprecated Please use the `GraphQLErrorArgs` constructor overload instead.
       */
      constructor(message, ...rawArgs) {
        var _this$nodes, _nodeLocations$, _ref;

        const { nodes, source, positions, path, originalError, extensions } =
          toNormalizedArgs(rawArgs);
        super(message);
        this.name = 'GraphQLError';
        this.path = path !== null && path !== void 0 ? path : undefined;
        this.originalError =
          originalError !== null && originalError !== void 0
            ? originalError
            : undefined; // Compute list of blame nodes.

        this.nodes = undefinedIfEmpty(
          Array.isArray(nodes) ? nodes : nodes ? [nodes] : undefined,
        );
        const nodeLocations = undefinedIfEmpty(
          (_this$nodes = this.nodes) === null || _this$nodes === void 0
            ? void 0
            : _this$nodes.map((node) => node.loc).filter((loc) => loc != null),
        ); // Compute locations in the source for the given nodes/positions.

        this.source =
          source !== null && source !== void 0
            ? source
            : nodeLocations === null || nodeLocations === void 0
            ? void 0
            : (_nodeLocations$ = nodeLocations[0]) === null ||
              _nodeLocations$ === void 0
            ? void 0
            : _nodeLocations$.source;
        this.positions =
          positions !== null && positions !== void 0
            ? positions
            : nodeLocations === null || nodeLocations === void 0
            ? void 0
            : nodeLocations.map((loc) => loc.start);
        this.locations =
          positions && source
            ? positions.map((pos) => getLocation(source, pos))
            : nodeLocations === null || nodeLocations === void 0
            ? void 0
            : nodeLocations.map((loc) => getLocation(loc.source, loc.start));
        const originalExtensions = isObjectLike(
          originalError === null || originalError === void 0
            ? void 0
            : originalError.extensions,
        )
          ? originalError === null || originalError === void 0
            ? void 0
            : originalError.extensions
          : undefined;
        this.extensions =
          (_ref =
            extensions !== null && extensions !== void 0
              ? extensions
              : originalExtensions) !== null && _ref !== void 0
            ? _ref
            : Object.create(null); // Only properties prescribed by the spec should be enumerable.
        // Keep the rest as non-enumerable.

        Object.defineProperties(this, {
          message: {
            writable: true,
            enumerable: true,
          },
          name: {
            enumerable: false,
          },
          nodes: {
            enumerable: false,
          },
          source: {
            enumerable: false,
          },
          positions: {
            enumerable: false,
          },
          originalError: {
            enumerable: false,
          },
        }); // Include (non-enumerable) stack trace.

        /* c8 ignore start */
        // FIXME: https://github.com/graphql/graphql-js/issues/2317

        if (
          originalError !== null &&
          originalError !== void 0 &&
          originalError.stack
        ) {
          Object.defineProperty(this, 'stack', {
            value: originalError.stack,
            writable: true,
            configurable: true,
          });
        } else if (Error.captureStackTrace) {
          Error.captureStackTrace(this, GraphQLError);
        } else {
          Object.defineProperty(this, 'stack', {
            value: Error().stack,
            writable: true,
            configurable: true,
          });
        }
        /* c8 ignore stop */
      }

      get [Symbol.toStringTag]() {
        return 'GraphQLError';
      }

      toString() {
        let output = this.message;

        if (this.nodes) {
          for (const node of this.nodes) {
            if (node.loc) {
              output += '\n\n' + printLocation(node.loc);
            }
          }
        } else if (this.source && this.locations) {
          for (const location of this.locations) {
            output += '\n\n' + printSourceLocation(this.source, location);
          }
        }

        return output;
      }

      toJSON() {
        const formattedError = {
          message: this.message,
        };

        if (this.locations != null) {
          formattedError.locations = this.locations;
        }

        if (this.path != null) {
          formattedError.path = this.path;
        }

        if (this.extensions != null && Object.keys(this.extensions).length > 0) {
          formattedError.extensions = this.extensions;
        }

        return formattedError;
      }
    }

    function undefinedIfEmpty(array) {
      return array === undefined || array.length === 0 ? undefined : array;
    }

    /**
     * Produces a GraphQLError representing a syntax error, containing useful
     * descriptive information about the syntax error's position in the source.
     */

    function syntaxError(source, position, description) {
      return new GraphQLError(`Syntax Error: ${description}`, undefined, source, [
        position,
      ]);
    }

    /**
     * The set of allowed directive location values.
     */
    let DirectiveLocation;
    /**
     * The enum type representing the directive location values.
     *
     * @deprecated Please use `DirectiveLocation`. Will be remove in v17.
     */

    (function (DirectiveLocation) {
      DirectiveLocation['QUERY'] = 'QUERY';
      DirectiveLocation['MUTATION'] = 'MUTATION';
      DirectiveLocation['SUBSCRIPTION'] = 'SUBSCRIPTION';
      DirectiveLocation['FIELD'] = 'FIELD';
      DirectiveLocation['FRAGMENT_DEFINITION'] = 'FRAGMENT_DEFINITION';
      DirectiveLocation['FRAGMENT_SPREAD'] = 'FRAGMENT_SPREAD';
      DirectiveLocation['INLINE_FRAGMENT'] = 'INLINE_FRAGMENT';
      DirectiveLocation['VARIABLE_DEFINITION'] = 'VARIABLE_DEFINITION';
      DirectiveLocation['SCHEMA'] = 'SCHEMA';
      DirectiveLocation['SCALAR'] = 'SCALAR';
      DirectiveLocation['OBJECT'] = 'OBJECT';
      DirectiveLocation['FIELD_DEFINITION'] = 'FIELD_DEFINITION';
      DirectiveLocation['ARGUMENT_DEFINITION'] = 'ARGUMENT_DEFINITION';
      DirectiveLocation['INTERFACE'] = 'INTERFACE';
      DirectiveLocation['UNION'] = 'UNION';
      DirectiveLocation['ENUM'] = 'ENUM';
      DirectiveLocation['ENUM_VALUE'] = 'ENUM_VALUE';
      DirectiveLocation['INPUT_OBJECT'] = 'INPUT_OBJECT';
      DirectiveLocation['INPUT_FIELD_DEFINITION'] = 'INPUT_FIELD_DEFINITION';
    })(DirectiveLocation || (DirectiveLocation = {}));

    /**
     * An exported enum describing the different kinds of tokens that the
     * lexer emits.
     */
    let TokenKind;
    /**
     * The enum type representing the token kinds values.
     *
     * @deprecated Please use `TokenKind`. Will be remove in v17.
     */

    (function (TokenKind) {
      TokenKind['SOF'] = '<SOF>';
      TokenKind['EOF'] = '<EOF>';
      TokenKind['BANG'] = '!';
      TokenKind['DOLLAR'] = '$';
      TokenKind['AMP'] = '&';
      TokenKind['PAREN_L'] = '(';
      TokenKind['PAREN_R'] = ')';
      TokenKind['SPREAD'] = '...';
      TokenKind['COLON'] = ':';
      TokenKind['EQUALS'] = '=';
      TokenKind['AT'] = '@';
      TokenKind['BRACKET_L'] = '[';
      TokenKind['BRACKET_R'] = ']';
      TokenKind['BRACE_L'] = '{';
      TokenKind['PIPE'] = '|';
      TokenKind['BRACE_R'] = '}';
      TokenKind['NAME'] = 'Name';
      TokenKind['INT'] = 'Int';
      TokenKind['FLOAT'] = 'Float';
      TokenKind['STRING'] = 'String';
      TokenKind['BLOCK_STRING'] = 'BlockString';
      TokenKind['COMMENT'] = 'Comment';
    })(TokenKind || (TokenKind = {}));

    /**
     * Given a Source object, creates a Lexer for that source.
     * A Lexer is a stateful stream generator in that every time
     * it is advanced, it returns the next token in the Source. Assuming the
     * source lexes, the final Token emitted by the lexer will be of kind
     * EOF, after which the lexer will repeatedly return the same EOF token
     * whenever called.
     */

    class Lexer {
      /**
       * The previously focused non-ignored token.
       */

      /**
       * The currently focused non-ignored token.
       */

      /**
       * The (1-indexed) line containing the current token.
       */

      /**
       * The character offset at which the current line begins.
       */
      constructor(source) {
        const startOfFileToken = new Token(TokenKind.SOF, 0, 0, 0, 0);
        this.source = source;
        this.lastToken = startOfFileToken;
        this.token = startOfFileToken;
        this.line = 1;
        this.lineStart = 0;
      }

      get [Symbol.toStringTag]() {
        return 'Lexer';
      }
      /**
       * Advances the token stream to the next non-ignored token.
       */

      advance() {
        this.lastToken = this.token;
        const token = (this.token = this.lookahead());
        return token;
      }
      /**
       * Looks ahead and returns the next non-ignored token, but does not change
       * the state of Lexer.
       */

      lookahead() {
        let token = this.token;

        if (token.kind !== TokenKind.EOF) {
          do {
            if (token.next) {
              token = token.next;
            } else {
              // Read the next token and form a link in the token linked-list.
              const nextToken = readNextToken(this, token.end); // @ts-expect-error next is only mutable during parsing.

              token.next = nextToken; // @ts-expect-error prev is only mutable during parsing.

              nextToken.prev = token;
              token = nextToken;
            }
          } while (token.kind === TokenKind.COMMENT);
        }

        return token;
      }
    }
    /**
     * @internal
     */

    function isPunctuatorTokenKind(kind) {
      return (
        kind === TokenKind.BANG ||
        kind === TokenKind.DOLLAR ||
        kind === TokenKind.AMP ||
        kind === TokenKind.PAREN_L ||
        kind === TokenKind.PAREN_R ||
        kind === TokenKind.SPREAD ||
        kind === TokenKind.COLON ||
        kind === TokenKind.EQUALS ||
        kind === TokenKind.AT ||
        kind === TokenKind.BRACKET_L ||
        kind === TokenKind.BRACKET_R ||
        kind === TokenKind.BRACE_L ||
        kind === TokenKind.PIPE ||
        kind === TokenKind.BRACE_R
      );
    }
    /**
     * A Unicode scalar value is any Unicode code point except surrogate code
     * points. In other words, the inclusive ranges of values 0x0000 to 0xD7FF and
     * 0xE000 to 0x10FFFF.
     *
     * SourceCharacter ::
     *   - "Any Unicode scalar value"
     */

    function isUnicodeScalarValue(code) {
      return (
        (code >= 0x0000 && code <= 0xd7ff) || (code >= 0xe000 && code <= 0x10ffff)
      );
    }
    /**
     * The GraphQL specification defines source text as a sequence of unicode scalar
     * values (which Unicode defines to exclude surrogate code points). However
     * JavaScript defines strings as a sequence of UTF-16 code units which may
     * include surrogates. A surrogate pair is a valid source character as it
     * encodes a supplementary code point (above U+FFFF), but unpaired surrogate
     * code points are not valid source characters.
     */

    function isSupplementaryCodePoint(body, location) {
      return (
        isLeadingSurrogate(body.charCodeAt(location)) &&
        isTrailingSurrogate(body.charCodeAt(location + 1))
      );
    }

    function isLeadingSurrogate(code) {
      return code >= 0xd800 && code <= 0xdbff;
    }

    function isTrailingSurrogate(code) {
      return code >= 0xdc00 && code <= 0xdfff;
    }
    /**
     * Prints the code point (or end of file reference) at a given location in a
     * source for use in error messages.
     *
     * Printable ASCII is printed quoted, while other points are printed in Unicode
     * code point form (ie. U+1234).
     */

    function printCodePointAt(lexer, location) {
      const code = lexer.source.body.codePointAt(location);

      if (code === undefined) {
        return TokenKind.EOF;
      } else if (code >= 0x0020 && code <= 0x007e) {
        // Printable ASCII
        const char = String.fromCodePoint(code);
        return char === '"' ? "'\"'" : `"${char}"`;
      } // Unicode code point

      return 'U+' + code.toString(16).toUpperCase().padStart(4, '0');
    }
    /**
     * Create a token with line and column location information.
     */

    function createToken(lexer, kind, start, end, value) {
      const line = lexer.line;
      const col = 1 + start - lexer.lineStart;
      return new Token(kind, start, end, line, col, value);
    }
    /**
     * Gets the next token from the source starting at the given position.
     *
     * This skips over whitespace until it finds the next lexable token, then lexes
     * punctuators immediately or calls the appropriate helper function for more
     * complicated tokens.
     */

    function readNextToken(lexer, start) {
      const body = lexer.source.body;
      const bodyLength = body.length;
      let position = start;

      while (position < bodyLength) {
        const code = body.charCodeAt(position); // SourceCharacter

        switch (code) {
          // Ignored ::
          //   - UnicodeBOM
          //   - WhiteSpace
          //   - LineTerminator
          //   - Comment
          //   - Comma
          //
          // UnicodeBOM :: "Byte Order Mark (U+FEFF)"
          //
          // WhiteSpace ::
          //   - "Horizontal Tab (U+0009)"
          //   - "Space (U+0020)"
          //
          // Comma :: ,
          case 0xfeff: // <BOM>

          case 0x0009: // \t

          case 0x0020: // <space>

          case 0x002c:
            // ,
            ++position;
            continue;
          // LineTerminator ::
          //   - "New Line (U+000A)"
          //   - "Carriage Return (U+000D)" [lookahead != "New Line (U+000A)"]
          //   - "Carriage Return (U+000D)" "New Line (U+000A)"

          case 0x000a:
            // \n
            ++position;
            ++lexer.line;
            lexer.lineStart = position;
            continue;

          case 0x000d:
            // \r
            if (body.charCodeAt(position + 1) === 0x000a) {
              position += 2;
            } else {
              ++position;
            }

            ++lexer.line;
            lexer.lineStart = position;
            continue;
          // Comment

          case 0x0023:
            // #
            return readComment(lexer, position);
          // Token ::
          //   - Punctuator
          //   - Name
          //   - IntValue
          //   - FloatValue
          //   - StringValue
          //
          // Punctuator :: one of ! $ & ( ) ... : = @ [ ] { | }

          case 0x0021:
            // !
            return createToken(lexer, TokenKind.BANG, position, position + 1);

          case 0x0024:
            // $
            return createToken(lexer, TokenKind.DOLLAR, position, position + 1);

          case 0x0026:
            // &
            return createToken(lexer, TokenKind.AMP, position, position + 1);

          case 0x0028:
            // (
            return createToken(lexer, TokenKind.PAREN_L, position, position + 1);

          case 0x0029:
            // )
            return createToken(lexer, TokenKind.PAREN_R, position, position + 1);

          case 0x002e:
            // .
            if (
              body.charCodeAt(position + 1) === 0x002e &&
              body.charCodeAt(position + 2) === 0x002e
            ) {
              return createToken(lexer, TokenKind.SPREAD, position, position + 3);
            }

            break;

          case 0x003a:
            // :
            return createToken(lexer, TokenKind.COLON, position, position + 1);

          case 0x003d:
            // =
            return createToken(lexer, TokenKind.EQUALS, position, position + 1);

          case 0x0040:
            // @
            return createToken(lexer, TokenKind.AT, position, position + 1);

          case 0x005b:
            // [
            return createToken(lexer, TokenKind.BRACKET_L, position, position + 1);

          case 0x005d:
            // ]
            return createToken(lexer, TokenKind.BRACKET_R, position, position + 1);

          case 0x007b:
            // {
            return createToken(lexer, TokenKind.BRACE_L, position, position + 1);

          case 0x007c:
            // |
            return createToken(lexer, TokenKind.PIPE, position, position + 1);

          case 0x007d:
            // }
            return createToken(lexer, TokenKind.BRACE_R, position, position + 1);
          // StringValue

          case 0x0022:
            // "
            if (
              body.charCodeAt(position + 1) === 0x0022 &&
              body.charCodeAt(position + 2) === 0x0022
            ) {
              return readBlockString(lexer, position);
            }

            return readString(lexer, position);
        } // IntValue | FloatValue (Digit | -)

        if (isDigit(code) || code === 0x002d) {
          return readNumber(lexer, position, code);
        } // Name

        if (isNameStart(code)) {
          return readName(lexer, position);
        }

        throw syntaxError(
          lexer.source,
          position,
          code === 0x0027
            ? 'Unexpected single quote character (\'), did you mean to use a double quote (")?'
            : isUnicodeScalarValue(code) || isSupplementaryCodePoint(body, position)
            ? `Unexpected character: ${printCodePointAt(lexer, position)}.`
            : `Invalid character: ${printCodePointAt(lexer, position)}.`,
        );
      }

      return createToken(lexer, TokenKind.EOF, bodyLength, bodyLength);
    }
    /**
     * Reads a comment token from the source file.
     *
     * ```
     * Comment :: # CommentChar* [lookahead != CommentChar]
     *
     * CommentChar :: SourceCharacter but not LineTerminator
     * ```
     */

    function readComment(lexer, start) {
      const body = lexer.source.body;
      const bodyLength = body.length;
      let position = start + 1;

      while (position < bodyLength) {
        const code = body.charCodeAt(position); // LineTerminator (\n | \r)

        if (code === 0x000a || code === 0x000d) {
          break;
        } // SourceCharacter

        if (isUnicodeScalarValue(code)) {
          ++position;
        } else if (isSupplementaryCodePoint(body, position)) {
          position += 2;
        } else {
          break;
        }
      }

      return createToken(
        lexer,
        TokenKind.COMMENT,
        start,
        position,
        body.slice(start + 1, position),
      );
    }
    /**
     * Reads a number token from the source file, either a FloatValue or an IntValue
     * depending on whether a FractionalPart or ExponentPart is encountered.
     *
     * ```
     * IntValue :: IntegerPart [lookahead != {Digit, `.`, NameStart}]
     *
     * IntegerPart ::
     *   - NegativeSign? 0
     *   - NegativeSign? NonZeroDigit Digit*
     *
     * NegativeSign :: -
     *
     * NonZeroDigit :: Digit but not `0`
     *
     * FloatValue ::
     *   - IntegerPart FractionalPart ExponentPart [lookahead != {Digit, `.`, NameStart}]
     *   - IntegerPart FractionalPart [lookahead != {Digit, `.`, NameStart}]
     *   - IntegerPart ExponentPart [lookahead != {Digit, `.`, NameStart}]
     *
     * FractionalPart :: . Digit+
     *
     * ExponentPart :: ExponentIndicator Sign? Digit+
     *
     * ExponentIndicator :: one of `e` `E`
     *
     * Sign :: one of + -
     * ```
     */

    function readNumber(lexer, start, firstCode) {
      const body = lexer.source.body;
      let position = start;
      let code = firstCode;
      let isFloat = false; // NegativeSign (-)

      if (code === 0x002d) {
        code = body.charCodeAt(++position);
      } // Zero (0)

      if (code === 0x0030) {
        code = body.charCodeAt(++position);

        if (isDigit(code)) {
          throw syntaxError(
            lexer.source,
            position,
            `Invalid number, unexpected digit after 0: ${printCodePointAt(
          lexer,
          position,
        )}.`,
          );
        }
      } else {
        position = readDigits(lexer, position, code);
        code = body.charCodeAt(position);
      } // Full stop (.)

      if (code === 0x002e) {
        isFloat = true;
        code = body.charCodeAt(++position);
        position = readDigits(lexer, position, code);
        code = body.charCodeAt(position);
      } // E e

      if (code === 0x0045 || code === 0x0065) {
        isFloat = true;
        code = body.charCodeAt(++position); // + -

        if (code === 0x002b || code === 0x002d) {
          code = body.charCodeAt(++position);
        }

        position = readDigits(lexer, position, code);
        code = body.charCodeAt(position);
      } // Numbers cannot be followed by . or NameStart

      if (code === 0x002e || isNameStart(code)) {
        throw syntaxError(
          lexer.source,
          position,
          `Invalid number, expected digit but got: ${printCodePointAt(
        lexer,
        position,
      )}.`,
        );
      }

      return createToken(
        lexer,
        isFloat ? TokenKind.FLOAT : TokenKind.INT,
        start,
        position,
        body.slice(start, position),
      );
    }
    /**
     * Returns the new position in the source after reading one or more digits.
     */

    function readDigits(lexer, start, firstCode) {
      if (!isDigit(firstCode)) {
        throw syntaxError(
          lexer.source,
          start,
          `Invalid number, expected digit but got: ${printCodePointAt(
        lexer,
        start,
      )}.`,
        );
      }

      const body = lexer.source.body;
      let position = start + 1; // +1 to skip first firstCode

      while (isDigit(body.charCodeAt(position))) {
        ++position;
      }

      return position;
    }
    /**
     * Reads a single-quote string token from the source file.
     *
     * ```
     * StringValue ::
     *   - `""` [lookahead != `"`]
     *   - `"` StringCharacter+ `"`
     *
     * StringCharacter ::
     *   - SourceCharacter but not `"` or `\` or LineTerminator
     *   - `\u` EscapedUnicode
     *   - `\` EscapedCharacter
     *
     * EscapedUnicode ::
     *   - `{` HexDigit+ `}`
     *   - HexDigit HexDigit HexDigit HexDigit
     *
     * EscapedCharacter :: one of `"` `\` `/` `b` `f` `n` `r` `t`
     * ```
     */

    function readString(lexer, start) {
      const body = lexer.source.body;
      const bodyLength = body.length;
      let position = start + 1;
      let chunkStart = position;
      let value = '';

      while (position < bodyLength) {
        const code = body.charCodeAt(position); // Closing Quote (")

        if (code === 0x0022) {
          value += body.slice(chunkStart, position);
          return createToken(lexer, TokenKind.STRING, start, position + 1, value);
        } // Escape Sequence (\)

        if (code === 0x005c) {
          value += body.slice(chunkStart, position);
          const escape =
            body.charCodeAt(position + 1) === 0x0075 // u
              ? body.charCodeAt(position + 2) === 0x007b // {
                ? readEscapedUnicodeVariableWidth(lexer, position)
                : readEscapedUnicodeFixedWidth(lexer, position)
              : readEscapedCharacter(lexer, position);
          value += escape.value;
          position += escape.size;
          chunkStart = position;
          continue;
        } // LineTerminator (\n | \r)

        if (code === 0x000a || code === 0x000d) {
          break;
        } // SourceCharacter

        if (isUnicodeScalarValue(code)) {
          ++position;
        } else if (isSupplementaryCodePoint(body, position)) {
          position += 2;
        } else {
          throw syntaxError(
            lexer.source,
            position,
            `Invalid character within String: ${printCodePointAt(
          lexer,
          position,
        )}.`,
          );
        }
      }

      throw syntaxError(lexer.source, position, 'Unterminated string.');
    } // The string value and lexed size of an escape sequence.

    function readEscapedUnicodeVariableWidth(lexer, position) {
      const body = lexer.source.body;
      let point = 0;
      let size = 3; // Cannot be larger than 12 chars (\u{00000000}).

      while (size < 12) {
        const code = body.charCodeAt(position + size++); // Closing Brace (})

        if (code === 0x007d) {
          // Must be at least 5 chars (\u{0}) and encode a Unicode scalar value.
          if (size < 5 || !isUnicodeScalarValue(point)) {
            break;
          }

          return {
            value: String.fromCodePoint(point),
            size,
          };
        } // Append this hex digit to the code point.

        point = (point << 4) | readHexDigit(code);

        if (point < 0) {
          break;
        }
      }

      throw syntaxError(
        lexer.source,
        position,
        `Invalid Unicode escape sequence: "${body.slice(
      position,
      position + size,
    )}".`,
      );
    }

    function readEscapedUnicodeFixedWidth(lexer, position) {
      const body = lexer.source.body;
      const code = read16BitHexCode(body, position + 2);

      if (isUnicodeScalarValue(code)) {
        return {
          value: String.fromCodePoint(code),
          size: 6,
        };
      } // GraphQL allows JSON-style surrogate pair escape sequences, but only when
      // a valid pair is formed.

      if (isLeadingSurrogate(code)) {
        // \u
        if (
          body.charCodeAt(position + 6) === 0x005c &&
          body.charCodeAt(position + 7) === 0x0075
        ) {
          const trailingCode = read16BitHexCode(body, position + 8);

          if (isTrailingSurrogate(trailingCode)) {
            // JavaScript defines strings as a sequence of UTF-16 code units and
            // encodes Unicode code points above U+FFFF using a surrogate pair of
            // code units. Since this is a surrogate pair escape sequence, just
            // include both codes into the JavaScript string value. Had JavaScript
            // not been internally based on UTF-16, then this surrogate pair would
            // be decoded to retrieve the supplementary code point.
            return {
              value: String.fromCodePoint(code, trailingCode),
              size: 12,
            };
          }
        }
      }

      throw syntaxError(
        lexer.source,
        position,
        `Invalid Unicode escape sequence: "${body.slice(position, position + 6)}".`,
      );
    }
    /**
     * Reads four hexadecimal characters and returns the positive integer that 16bit
     * hexadecimal string represents. For example, "000f" will return 15, and "dead"
     * will return 57005.
     *
     * Returns a negative number if any char was not a valid hexadecimal digit.
     */

    function read16BitHexCode(body, position) {
      // readHexDigit() returns -1 on error. ORing a negative value with any other
      // value always produces a negative value.
      return (
        (readHexDigit(body.charCodeAt(position)) << 12) |
        (readHexDigit(body.charCodeAt(position + 1)) << 8) |
        (readHexDigit(body.charCodeAt(position + 2)) << 4) |
        readHexDigit(body.charCodeAt(position + 3))
      );
    }
    /**
     * Reads a hexadecimal character and returns its positive integer value (0-15).
     *
     * '0' becomes 0, '9' becomes 9
     * 'A' becomes 10, 'F' becomes 15
     * 'a' becomes 10, 'f' becomes 15
     *
     * Returns -1 if the provided character code was not a valid hexadecimal digit.
     *
     * HexDigit :: one of
     *   - `0` `1` `2` `3` `4` `5` `6` `7` `8` `9`
     *   - `A` `B` `C` `D` `E` `F`
     *   - `a` `b` `c` `d` `e` `f`
     */

    function readHexDigit(code) {
      return code >= 0x0030 && code <= 0x0039 // 0-9
        ? code - 0x0030
        : code >= 0x0041 && code <= 0x0046 // A-F
        ? code - 0x0037
        : code >= 0x0061 && code <= 0x0066 // a-f
        ? code - 0x0057
        : -1;
    }
    /**
     * | Escaped Character | Code Point | Character Name               |
     * | ----------------- | ---------- | ---------------------------- |
     * | `"`               | U+0022     | double quote                 |
     * | `\`               | U+005C     | reverse solidus (back slash) |
     * | `/`               | U+002F     | solidus (forward slash)      |
     * | `b`               | U+0008     | backspace                    |
     * | `f`               | U+000C     | form feed                    |
     * | `n`               | U+000A     | line feed (new line)         |
     * | `r`               | U+000D     | carriage return              |
     * | `t`               | U+0009     | horizontal tab               |
     */

    function readEscapedCharacter(lexer, position) {
      const body = lexer.source.body;
      const code = body.charCodeAt(position + 1);

      switch (code) {
        case 0x0022:
          // "
          return {
            value: '\u0022',
            size: 2,
          };

        case 0x005c:
          // \
          return {
            value: '\u005c',
            size: 2,
          };

        case 0x002f:
          // /
          return {
            value: '\u002f',
            size: 2,
          };

        case 0x0062:
          // b
          return {
            value: '\u0008',
            size: 2,
          };

        case 0x0066:
          // f
          return {
            value: '\u000c',
            size: 2,
          };

        case 0x006e:
          // n
          return {
            value: '\u000a',
            size: 2,
          };

        case 0x0072:
          // r
          return {
            value: '\u000d',
            size: 2,
          };

        case 0x0074:
          // t
          return {
            value: '\u0009',
            size: 2,
          };
      }

      throw syntaxError(
        lexer.source,
        position,
        `Invalid character escape sequence: "${body.slice(
      position,
      position + 2,
    )}".`,
      );
    }
    /**
     * Reads a block string token from the source file.
     *
     * ```
     * StringValue ::
     *   - `"""` BlockStringCharacter* `"""`
     *
     * BlockStringCharacter ::
     *   - SourceCharacter but not `"""` or `\"""`
     *   - `\"""`
     * ```
     */

    function readBlockString(lexer, start) {
      const body = lexer.source.body;
      const bodyLength = body.length;
      let lineStart = lexer.lineStart;
      let position = start + 3;
      let chunkStart = position;
      let currentLine = '';
      const blockLines = [];

      while (position < bodyLength) {
        const code = body.charCodeAt(position); // Closing Triple-Quote (""")

        if (
          code === 0x0022 &&
          body.charCodeAt(position + 1) === 0x0022 &&
          body.charCodeAt(position + 2) === 0x0022
        ) {
          currentLine += body.slice(chunkStart, position);
          blockLines.push(currentLine);
          const token = createToken(
            lexer,
            TokenKind.BLOCK_STRING,
            start,
            position + 3, // Return a string of the lines joined with U+000A.
            dedentBlockStringLines(blockLines).join('\n'),
          );
          lexer.line += blockLines.length - 1;
          lexer.lineStart = lineStart;
          return token;
        } // Escaped Triple-Quote (\""")

        if (
          code === 0x005c &&
          body.charCodeAt(position + 1) === 0x0022 &&
          body.charCodeAt(position + 2) === 0x0022 &&
          body.charCodeAt(position + 3) === 0x0022
        ) {
          currentLine += body.slice(chunkStart, position);
          chunkStart = position + 1; // skip only slash

          position += 4;
          continue;
        } // LineTerminator

        if (code === 0x000a || code === 0x000d) {
          currentLine += body.slice(chunkStart, position);
          blockLines.push(currentLine);

          if (code === 0x000d && body.charCodeAt(position + 1) === 0x000a) {
            position += 2;
          } else {
            ++position;
          }

          currentLine = '';
          chunkStart = position;
          lineStart = position;
          continue;
        } // SourceCharacter

        if (isUnicodeScalarValue(code)) {
          ++position;
        } else if (isSupplementaryCodePoint(body, position)) {
          position += 2;
        } else {
          throw syntaxError(
            lexer.source,
            position,
            `Invalid character within String: ${printCodePointAt(
          lexer,
          position,
        )}.`,
          );
        }
      }

      throw syntaxError(lexer.source, position, 'Unterminated string.');
    }
    /**
     * Reads an alphanumeric + underscore name from the source.
     *
     * ```
     * Name ::
     *   - NameStart NameContinue* [lookahead != NameContinue]
     * ```
     */

    function readName(lexer, start) {
      const body = lexer.source.body;
      const bodyLength = body.length;
      let position = start + 1;

      while (position < bodyLength) {
        const code = body.charCodeAt(position);

        if (isNameContinue(code)) {
          ++position;
        } else {
          break;
        }
      }

      return createToken(
        lexer,
        TokenKind.NAME,
        start,
        position,
        body.slice(start, position),
      );
    }

    /**
     * A replacement for instanceof which includes an error warning when multi-realm
     * constructors are detected.
     * See: https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production
     * See: https://webpack.js.org/guides/production/
     */

    const instanceOf =
      /* c8 ignore next 5 */
      // FIXME: https://github.com/graphql/graphql-js/issues/2317
      function instanceOf(value, constructor) {
            return value instanceof constructor;
          }
        ;

    /**
     * A representation of source input to GraphQL. The `name` and `locationOffset` parameters are
     * optional, but they are useful for clients who store GraphQL documents in source files.
     * For example, if the GraphQL input starts at line 40 in a file named `Foo.graphql`, it might
     * be useful for `name` to be `"Foo.graphql"` and location to be `{ line: 40, column: 1 }`.
     * The `line` and `column` properties in `locationOffset` are 1-indexed.
     */
    class Source {
      constructor(
        body,
        name = 'GraphQL request',
        locationOffset = {
          line: 1,
          column: 1,
        },
      ) {
        typeof body === 'string' ||
          devAssert(false, `Body must be a string. Received: ${inspect(body)}.`);
        this.body = body;
        this.name = name;
        this.locationOffset = locationOffset;
        this.locationOffset.line > 0 ||
          devAssert(
            false,
            'line in locationOffset is 1-indexed and must be positive.',
          );
        this.locationOffset.column > 0 ||
          devAssert(
            false,
            'column in locationOffset is 1-indexed and must be positive.',
          );
      }

      get [Symbol.toStringTag]() {
        return 'Source';
      }
    }
    /**
     * Test if the given value is a Source object.
     *
     * @internal
     */

    function isSource(source) {
      return instanceOf(source, Source);
    }

    /**
     * Configuration options to control parser behavior
     */

    /**
     * Given a GraphQL source, parses it into a Document.
     * Throws GraphQLError if a syntax error is encountered.
     */
    function parse(source, options) {
      const parser = new Parser(source, options);
      return parser.parseDocument();
    }
    /**
     * This class is exported only to assist people in implementing their own parsers
     * without duplicating too much code and should be used only as last resort for cases
     * such as experimental syntax or if certain features could not be contributed upstream.
     *
     * It is still part of the internal API and is versioned, so any changes to it are never
     * considered breaking changes. If you still need to support multiple versions of the
     * library, please use the `versionInfo` variable for version detection.
     *
     * @internal
     */

    class Parser {
      constructor(source, options) {
        const sourceObj = isSource(source) ? source : new Source(source);
        this._lexer = new Lexer(sourceObj);
        this._options = options;
      }
      /**
       * Converts a name lex token into a name parse node.
       */

      parseName() {
        const token = this.expectToken(TokenKind.NAME);
        return this.node(token, {
          kind: Kind.NAME,
          value: token.value,
        });
      } // Implements the parsing rules in the Document section.

      /**
       * Document : Definition+
       */

      parseDocument() {
        return this.node(this._lexer.token, {
          kind: Kind.DOCUMENT,
          definitions: this.many(
            TokenKind.SOF,
            this.parseDefinition,
            TokenKind.EOF,
          ),
        });
      }
      /**
       * Definition :
       *   - ExecutableDefinition
       *   - TypeSystemDefinition
       *   - TypeSystemExtension
       *
       * ExecutableDefinition :
       *   - OperationDefinition
       *   - FragmentDefinition
       *
       * TypeSystemDefinition :
       *   - SchemaDefinition
       *   - TypeDefinition
       *   - DirectiveDefinition
       *
       * TypeDefinition :
       *   - ScalarTypeDefinition
       *   - ObjectTypeDefinition
       *   - InterfaceTypeDefinition
       *   - UnionTypeDefinition
       *   - EnumTypeDefinition
       *   - InputObjectTypeDefinition
       */

      parseDefinition() {
        if (this.peek(TokenKind.BRACE_L)) {
          return this.parseOperationDefinition();
        } // Many definitions begin with a description and require a lookahead.

        const hasDescription = this.peekDescription();
        const keywordToken = hasDescription
          ? this._lexer.lookahead()
          : this._lexer.token;

        if (keywordToken.kind === TokenKind.NAME) {
          switch (keywordToken.value) {
            case 'schema':
              return this.parseSchemaDefinition();

            case 'scalar':
              return this.parseScalarTypeDefinition();

            case 'type':
              return this.parseObjectTypeDefinition();

            case 'interface':
              return this.parseInterfaceTypeDefinition();

            case 'union':
              return this.parseUnionTypeDefinition();

            case 'enum':
              return this.parseEnumTypeDefinition();

            case 'input':
              return this.parseInputObjectTypeDefinition();

            case 'directive':
              return this.parseDirectiveDefinition();
          }

          if (hasDescription) {
            throw syntaxError(
              this._lexer.source,
              this._lexer.token.start,
              'Unexpected description, descriptions are supported only on type definitions.',
            );
          }

          switch (keywordToken.value) {
            case 'query':
            case 'mutation':
            case 'subscription':
              return this.parseOperationDefinition();

            case 'fragment':
              return this.parseFragmentDefinition();

            case 'extend':
              return this.parseTypeSystemExtension();
          }
        }

        throw this.unexpected(keywordToken);
      } // Implements the parsing rules in the Operations section.

      /**
       * OperationDefinition :
       *  - SelectionSet
       *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
       */

      parseOperationDefinition() {
        const start = this._lexer.token;

        if (this.peek(TokenKind.BRACE_L)) {
          return this.node(start, {
            kind: Kind.OPERATION_DEFINITION,
            operation: OperationTypeNode.QUERY,
            name: undefined,
            variableDefinitions: [],
            directives: [],
            selectionSet: this.parseSelectionSet(),
          });
        }

        const operation = this.parseOperationType();
        let name;

        if (this.peek(TokenKind.NAME)) {
          name = this.parseName();
        }

        return this.node(start, {
          kind: Kind.OPERATION_DEFINITION,
          operation,
          name,
          variableDefinitions: this.parseVariableDefinitions(),
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet(),
        });
      }
      /**
       * OperationType : one of query mutation subscription
       */

      parseOperationType() {
        const operationToken = this.expectToken(TokenKind.NAME);

        switch (operationToken.value) {
          case 'query':
            return OperationTypeNode.QUERY;

          case 'mutation':
            return OperationTypeNode.MUTATION;

          case 'subscription':
            return OperationTypeNode.SUBSCRIPTION;
        }

        throw this.unexpected(operationToken);
      }
      /**
       * VariableDefinitions : ( VariableDefinition+ )
       */

      parseVariableDefinitions() {
        return this.optionalMany(
          TokenKind.PAREN_L,
          this.parseVariableDefinition,
          TokenKind.PAREN_R,
        );
      }
      /**
       * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
       */

      parseVariableDefinition() {
        return this.node(this._lexer.token, {
          kind: Kind.VARIABLE_DEFINITION,
          variable: this.parseVariable(),
          type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
          defaultValue: this.expectOptionalToken(TokenKind.EQUALS)
            ? this.parseConstValueLiteral()
            : undefined,
          directives: this.parseConstDirectives(),
        });
      }
      /**
       * Variable : $ Name
       */

      parseVariable() {
        const start = this._lexer.token;
        this.expectToken(TokenKind.DOLLAR);
        return this.node(start, {
          kind: Kind.VARIABLE,
          name: this.parseName(),
        });
      }
      /**
       * ```
       * SelectionSet : { Selection+ }
       * ```
       */

      parseSelectionSet() {
        return this.node(this._lexer.token, {
          kind: Kind.SELECTION_SET,
          selections: this.many(
            TokenKind.BRACE_L,
            this.parseSelection,
            TokenKind.BRACE_R,
          ),
        });
      }
      /**
       * Selection :
       *   - Field
       *   - FragmentSpread
       *   - InlineFragment
       */

      parseSelection() {
        return this.peek(TokenKind.SPREAD)
          ? this.parseFragment()
          : this.parseField();
      }
      /**
       * Field : Alias? Name Arguments? Directives? SelectionSet?
       *
       * Alias : Name :
       */

      parseField() {
        const start = this._lexer.token;
        const nameOrAlias = this.parseName();
        let alias;
        let name;

        if (this.expectOptionalToken(TokenKind.COLON)) {
          alias = nameOrAlias;
          name = this.parseName();
        } else {
          name = nameOrAlias;
        }

        return this.node(start, {
          kind: Kind.FIELD,
          alias,
          name,
          arguments: this.parseArguments(false),
          directives: this.parseDirectives(false),
          selectionSet: this.peek(TokenKind.BRACE_L)
            ? this.parseSelectionSet()
            : undefined,
        });
      }
      /**
       * Arguments[Const] : ( Argument[?Const]+ )
       */

      parseArguments(isConst) {
        const item = isConst ? this.parseConstArgument : this.parseArgument;
        return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
      }
      /**
       * Argument[Const] : Name : Value[?Const]
       */

      parseArgument(isConst = false) {
        const start = this._lexer.token;
        const name = this.parseName();
        this.expectToken(TokenKind.COLON);
        return this.node(start, {
          kind: Kind.ARGUMENT,
          name,
          value: this.parseValueLiteral(isConst),
        });
      }

      parseConstArgument() {
        return this.parseArgument(true);
      } // Implements the parsing rules in the Fragments section.

      /**
       * Corresponds to both FragmentSpread and InlineFragment in the spec.
       *
       * FragmentSpread : ... FragmentName Directives?
       *
       * InlineFragment : ... TypeCondition? Directives? SelectionSet
       */

      parseFragment() {
        const start = this._lexer.token;
        this.expectToken(TokenKind.SPREAD);
        const hasTypeCondition = this.expectOptionalKeyword('on');

        if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
          return this.node(start, {
            kind: Kind.FRAGMENT_SPREAD,
            name: this.parseFragmentName(),
            directives: this.parseDirectives(false),
          });
        }

        return this.node(start, {
          kind: Kind.INLINE_FRAGMENT,
          typeCondition: hasTypeCondition ? this.parseNamedType() : undefined,
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet(),
        });
      }
      /**
       * FragmentDefinition :
       *   - fragment FragmentName on TypeCondition Directives? SelectionSet
       *
       * TypeCondition : NamedType
       */

      parseFragmentDefinition() {
        var _this$_options;

        const start = this._lexer.token;
        this.expectKeyword('fragment'); // Legacy support for defining variables within fragments changes
        // the grammar of FragmentDefinition:
        //   - fragment FragmentName VariableDefinitions? on TypeCondition Directives? SelectionSet

        if (
          ((_this$_options = this._options) === null || _this$_options === void 0
            ? void 0
            : _this$_options.allowLegacyFragmentVariables) === true
        ) {
          return this.node(start, {
            kind: Kind.FRAGMENT_DEFINITION,
            name: this.parseFragmentName(),
            variableDefinitions: this.parseVariableDefinitions(),
            typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
            directives: this.parseDirectives(false),
            selectionSet: this.parseSelectionSet(),
          });
        }

        return this.node(start, {
          kind: Kind.FRAGMENT_DEFINITION,
          name: this.parseFragmentName(),
          typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet(),
        });
      }
      /**
       * FragmentName : Name but not `on`
       */

      parseFragmentName() {
        if (this._lexer.token.value === 'on') {
          throw this.unexpected();
        }

        return this.parseName();
      } // Implements the parsing rules in the Values section.

      /**
       * Value[Const] :
       *   - [~Const] Variable
       *   - IntValue
       *   - FloatValue
       *   - StringValue
       *   - BooleanValue
       *   - NullValue
       *   - EnumValue
       *   - ListValue[?Const]
       *   - ObjectValue[?Const]
       *
       * BooleanValue : one of `true` `false`
       *
       * NullValue : `null`
       *
       * EnumValue : Name but not `true`, `false` or `null`
       */

      parseValueLiteral(isConst) {
        const token = this._lexer.token;

        switch (token.kind) {
          case TokenKind.BRACKET_L:
            return this.parseList(isConst);

          case TokenKind.BRACE_L:
            return this.parseObject(isConst);

          case TokenKind.INT:
            this._lexer.advance();

            return this.node(token, {
              kind: Kind.INT,
              value: token.value,
            });

          case TokenKind.FLOAT:
            this._lexer.advance();

            return this.node(token, {
              kind: Kind.FLOAT,
              value: token.value,
            });

          case TokenKind.STRING:
          case TokenKind.BLOCK_STRING:
            return this.parseStringLiteral();

          case TokenKind.NAME:
            this._lexer.advance();

            switch (token.value) {
              case 'true':
                return this.node(token, {
                  kind: Kind.BOOLEAN,
                  value: true,
                });

              case 'false':
                return this.node(token, {
                  kind: Kind.BOOLEAN,
                  value: false,
                });

              case 'null':
                return this.node(token, {
                  kind: Kind.NULL,
                });

              default:
                return this.node(token, {
                  kind: Kind.ENUM,
                  value: token.value,
                });
            }

          case TokenKind.DOLLAR:
            if (isConst) {
              this.expectToken(TokenKind.DOLLAR);

              if (this._lexer.token.kind === TokenKind.NAME) {
                const varName = this._lexer.token.value;
                throw syntaxError(
                  this._lexer.source,
                  token.start,
                  `Unexpected variable "$${varName}" in constant value.`,
                );
              } else {
                throw this.unexpected(token);
              }
            }

            return this.parseVariable();

          default:
            throw this.unexpected();
        }
      }

      parseConstValueLiteral() {
        return this.parseValueLiteral(true);
      }

      parseStringLiteral() {
        const token = this._lexer.token;

        this._lexer.advance();

        return this.node(token, {
          kind: Kind.STRING,
          value: token.value,
          block: token.kind === TokenKind.BLOCK_STRING,
        });
      }
      /**
       * ListValue[Const] :
       *   - [ ]
       *   - [ Value[?Const]+ ]
       */

      parseList(isConst) {
        const item = () => this.parseValueLiteral(isConst);

        return this.node(this._lexer.token, {
          kind: Kind.LIST,
          values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R),
        });
      }
      /**
       * ```
       * ObjectValue[Const] :
       *   - { }
       *   - { ObjectField[?Const]+ }
       * ```
       */

      parseObject(isConst) {
        const item = () => this.parseObjectField(isConst);

        return this.node(this._lexer.token, {
          kind: Kind.OBJECT,
          fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R),
        });
      }
      /**
       * ObjectField[Const] : Name : Value[?Const]
       */

      parseObjectField(isConst) {
        const start = this._lexer.token;
        const name = this.parseName();
        this.expectToken(TokenKind.COLON);
        return this.node(start, {
          kind: Kind.OBJECT_FIELD,
          name,
          value: this.parseValueLiteral(isConst),
        });
      } // Implements the parsing rules in the Directives section.

      /**
       * Directives[Const] : Directive[?Const]+
       */

      parseDirectives(isConst) {
        const directives = [];

        while (this.peek(TokenKind.AT)) {
          directives.push(this.parseDirective(isConst));
        }

        return directives;
      }

      parseConstDirectives() {
        return this.parseDirectives(true);
      }
      /**
       * ```
       * Directive[Const] : @ Name Arguments[?Const]?
       * ```
       */

      parseDirective(isConst) {
        const start = this._lexer.token;
        this.expectToken(TokenKind.AT);
        return this.node(start, {
          kind: Kind.DIRECTIVE,
          name: this.parseName(),
          arguments: this.parseArguments(isConst),
        });
      } // Implements the parsing rules in the Types section.

      /**
       * Type :
       *   - NamedType
       *   - ListType
       *   - NonNullType
       */

      parseTypeReference() {
        const start = this._lexer.token;
        let type;

        if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
          const innerType = this.parseTypeReference();
          this.expectToken(TokenKind.BRACKET_R);
          type = this.node(start, {
            kind: Kind.LIST_TYPE,
            type: innerType,
          });
        } else {
          type = this.parseNamedType();
        }

        if (this.expectOptionalToken(TokenKind.BANG)) {
          return this.node(start, {
            kind: Kind.NON_NULL_TYPE,
            type,
          });
        }

        return type;
      }
      /**
       * NamedType : Name
       */

      parseNamedType() {
        return this.node(this._lexer.token, {
          kind: Kind.NAMED_TYPE,
          name: this.parseName(),
        });
      } // Implements the parsing rules in the Type Definition section.

      peekDescription() {
        return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
      }
      /**
       * Description : StringValue
       */

      parseDescription() {
        if (this.peekDescription()) {
          return this.parseStringLiteral();
        }
      }
      /**
       * ```
       * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
       * ```
       */

      parseSchemaDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword('schema');
        const directives = this.parseConstDirectives();
        const operationTypes = this.many(
          TokenKind.BRACE_L,
          this.parseOperationTypeDefinition,
          TokenKind.BRACE_R,
        );
        return this.node(start, {
          kind: Kind.SCHEMA_DEFINITION,
          description,
          directives,
          operationTypes,
        });
      }
      /**
       * OperationTypeDefinition : OperationType : NamedType
       */

      parseOperationTypeDefinition() {
        const start = this._lexer.token;
        const operation = this.parseOperationType();
        this.expectToken(TokenKind.COLON);
        const type = this.parseNamedType();
        return this.node(start, {
          kind: Kind.OPERATION_TYPE_DEFINITION,
          operation,
          type,
        });
      }
      /**
       * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
       */

      parseScalarTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword('scalar');
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        return this.node(start, {
          kind: Kind.SCALAR_TYPE_DEFINITION,
          description,
          name,
          directives,
        });
      }
      /**
       * ObjectTypeDefinition :
       *   Description?
       *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
       */

      parseObjectTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword('type');
        const name = this.parseName();
        const interfaces = this.parseImplementsInterfaces();
        const directives = this.parseConstDirectives();
        const fields = this.parseFieldsDefinition();
        return this.node(start, {
          kind: Kind.OBJECT_TYPE_DEFINITION,
          description,
          name,
          interfaces,
          directives,
          fields,
        });
      }
      /**
       * ImplementsInterfaces :
       *   - implements `&`? NamedType
       *   - ImplementsInterfaces & NamedType
       */

      parseImplementsInterfaces() {
        return this.expectOptionalKeyword('implements')
          ? this.delimitedMany(TokenKind.AMP, this.parseNamedType)
          : [];
      }
      /**
       * ```
       * FieldsDefinition : { FieldDefinition+ }
       * ```
       */

      parseFieldsDefinition() {
        return this.optionalMany(
          TokenKind.BRACE_L,
          this.parseFieldDefinition,
          TokenKind.BRACE_R,
        );
      }
      /**
       * FieldDefinition :
       *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
       */

      parseFieldDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        const name = this.parseName();
        const args = this.parseArgumentDefs();
        this.expectToken(TokenKind.COLON);
        const type = this.parseTypeReference();
        const directives = this.parseConstDirectives();
        return this.node(start, {
          kind: Kind.FIELD_DEFINITION,
          description,
          name,
          arguments: args,
          type,
          directives,
        });
      }
      /**
       * ArgumentsDefinition : ( InputValueDefinition+ )
       */

      parseArgumentDefs() {
        return this.optionalMany(
          TokenKind.PAREN_L,
          this.parseInputValueDef,
          TokenKind.PAREN_R,
        );
      }
      /**
       * InputValueDefinition :
       *   - Description? Name : Type DefaultValue? Directives[Const]?
       */

      parseInputValueDef() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        const name = this.parseName();
        this.expectToken(TokenKind.COLON);
        const type = this.parseTypeReference();
        let defaultValue;

        if (this.expectOptionalToken(TokenKind.EQUALS)) {
          defaultValue = this.parseConstValueLiteral();
        }

        const directives = this.parseConstDirectives();
        return this.node(start, {
          kind: Kind.INPUT_VALUE_DEFINITION,
          description,
          name,
          type,
          defaultValue,
          directives,
        });
      }
      /**
       * InterfaceTypeDefinition :
       *   - Description? interface Name Directives[Const]? FieldsDefinition?
       */

      parseInterfaceTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword('interface');
        const name = this.parseName();
        const interfaces = this.parseImplementsInterfaces();
        const directives = this.parseConstDirectives();
        const fields = this.parseFieldsDefinition();
        return this.node(start, {
          kind: Kind.INTERFACE_TYPE_DEFINITION,
          description,
          name,
          interfaces,
          directives,
          fields,
        });
      }
      /**
       * UnionTypeDefinition :
       *   - Description? union Name Directives[Const]? UnionMemberTypes?
       */

      parseUnionTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword('union');
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const types = this.parseUnionMemberTypes();
        return this.node(start, {
          kind: Kind.UNION_TYPE_DEFINITION,
          description,
          name,
          directives,
          types,
        });
      }
      /**
       * UnionMemberTypes :
       *   - = `|`? NamedType
       *   - UnionMemberTypes | NamedType
       */

      parseUnionMemberTypes() {
        return this.expectOptionalToken(TokenKind.EQUALS)
          ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType)
          : [];
      }
      /**
       * EnumTypeDefinition :
       *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
       */

      parseEnumTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword('enum');
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const values = this.parseEnumValuesDefinition();
        return this.node(start, {
          kind: Kind.ENUM_TYPE_DEFINITION,
          description,
          name,
          directives,
          values,
        });
      }
      /**
       * ```
       * EnumValuesDefinition : { EnumValueDefinition+ }
       * ```
       */

      parseEnumValuesDefinition() {
        return this.optionalMany(
          TokenKind.BRACE_L,
          this.parseEnumValueDefinition,
          TokenKind.BRACE_R,
        );
      }
      /**
       * EnumValueDefinition : Description? EnumValue Directives[Const]?
       */

      parseEnumValueDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        const name = this.parseEnumValueName();
        const directives = this.parseConstDirectives();
        return this.node(start, {
          kind: Kind.ENUM_VALUE_DEFINITION,
          description,
          name,
          directives,
        });
      }
      /**
       * EnumValue : Name but not `true`, `false` or `null`
       */

      parseEnumValueName() {
        if (
          this._lexer.token.value === 'true' ||
          this._lexer.token.value === 'false' ||
          this._lexer.token.value === 'null'
        ) {
          throw syntaxError(
            this._lexer.source,
            this._lexer.token.start,
            `${getTokenDesc(
          this._lexer.token,
        )} is reserved and cannot be used for an enum value.`,
          );
        }

        return this.parseName();
      }
      /**
       * InputObjectTypeDefinition :
       *   - Description? input Name Directives[Const]? InputFieldsDefinition?
       */

      parseInputObjectTypeDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword('input');
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const fields = this.parseInputFieldsDefinition();
        return this.node(start, {
          kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
          description,
          name,
          directives,
          fields,
        });
      }
      /**
       * ```
       * InputFieldsDefinition : { InputValueDefinition+ }
       * ```
       */

      parseInputFieldsDefinition() {
        return this.optionalMany(
          TokenKind.BRACE_L,
          this.parseInputValueDef,
          TokenKind.BRACE_R,
        );
      }
      /**
       * TypeSystemExtension :
       *   - SchemaExtension
       *   - TypeExtension
       *
       * TypeExtension :
       *   - ScalarTypeExtension
       *   - ObjectTypeExtension
       *   - InterfaceTypeExtension
       *   - UnionTypeExtension
       *   - EnumTypeExtension
       *   - InputObjectTypeDefinition
       */

      parseTypeSystemExtension() {
        const keywordToken = this._lexer.lookahead();

        if (keywordToken.kind === TokenKind.NAME) {
          switch (keywordToken.value) {
            case 'schema':
              return this.parseSchemaExtension();

            case 'scalar':
              return this.parseScalarTypeExtension();

            case 'type':
              return this.parseObjectTypeExtension();

            case 'interface':
              return this.parseInterfaceTypeExtension();

            case 'union':
              return this.parseUnionTypeExtension();

            case 'enum':
              return this.parseEnumTypeExtension();

            case 'input':
              return this.parseInputObjectTypeExtension();
          }
        }

        throw this.unexpected(keywordToken);
      }
      /**
       * ```
       * SchemaExtension :
       *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
       *  - extend schema Directives[Const]
       * ```
       */

      parseSchemaExtension() {
        const start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('schema');
        const directives = this.parseConstDirectives();
        const operationTypes = this.optionalMany(
          TokenKind.BRACE_L,
          this.parseOperationTypeDefinition,
          TokenKind.BRACE_R,
        );

        if (directives.length === 0 && operationTypes.length === 0) {
          throw this.unexpected();
        }

        return this.node(start, {
          kind: Kind.SCHEMA_EXTENSION,
          directives,
          operationTypes,
        });
      }
      /**
       * ScalarTypeExtension :
       *   - extend scalar Name Directives[Const]
       */

      parseScalarTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('scalar');
        const name = this.parseName();
        const directives = this.parseConstDirectives();

        if (directives.length === 0) {
          throw this.unexpected();
        }

        return this.node(start, {
          kind: Kind.SCALAR_TYPE_EXTENSION,
          name,
          directives,
        });
      }
      /**
       * ObjectTypeExtension :
       *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
       *  - extend type Name ImplementsInterfaces? Directives[Const]
       *  - extend type Name ImplementsInterfaces
       */

      parseObjectTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('type');
        const name = this.parseName();
        const interfaces = this.parseImplementsInterfaces();
        const directives = this.parseConstDirectives();
        const fields = this.parseFieldsDefinition();

        if (
          interfaces.length === 0 &&
          directives.length === 0 &&
          fields.length === 0
        ) {
          throw this.unexpected();
        }

        return this.node(start, {
          kind: Kind.OBJECT_TYPE_EXTENSION,
          name,
          interfaces,
          directives,
          fields,
        });
      }
      /**
       * InterfaceTypeExtension :
       *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
       *  - extend interface Name ImplementsInterfaces? Directives[Const]
       *  - extend interface Name ImplementsInterfaces
       */

      parseInterfaceTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('interface');
        const name = this.parseName();
        const interfaces = this.parseImplementsInterfaces();
        const directives = this.parseConstDirectives();
        const fields = this.parseFieldsDefinition();

        if (
          interfaces.length === 0 &&
          directives.length === 0 &&
          fields.length === 0
        ) {
          throw this.unexpected();
        }

        return this.node(start, {
          kind: Kind.INTERFACE_TYPE_EXTENSION,
          name,
          interfaces,
          directives,
          fields,
        });
      }
      /**
       * UnionTypeExtension :
       *   - extend union Name Directives[Const]? UnionMemberTypes
       *   - extend union Name Directives[Const]
       */

      parseUnionTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('union');
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const types = this.parseUnionMemberTypes();

        if (directives.length === 0 && types.length === 0) {
          throw this.unexpected();
        }

        return this.node(start, {
          kind: Kind.UNION_TYPE_EXTENSION,
          name,
          directives,
          types,
        });
      }
      /**
       * EnumTypeExtension :
       *   - extend enum Name Directives[Const]? EnumValuesDefinition
       *   - extend enum Name Directives[Const]
       */

      parseEnumTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('enum');
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const values = this.parseEnumValuesDefinition();

        if (directives.length === 0 && values.length === 0) {
          throw this.unexpected();
        }

        return this.node(start, {
          kind: Kind.ENUM_TYPE_EXTENSION,
          name,
          directives,
          values,
        });
      }
      /**
       * InputObjectTypeExtension :
       *   - extend input Name Directives[Const]? InputFieldsDefinition
       *   - extend input Name Directives[Const]
       */

      parseInputObjectTypeExtension() {
        const start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('input');
        const name = this.parseName();
        const directives = this.parseConstDirectives();
        const fields = this.parseInputFieldsDefinition();

        if (directives.length === 0 && fields.length === 0) {
          throw this.unexpected();
        }

        return this.node(start, {
          kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
          name,
          directives,
          fields,
        });
      }
      /**
       * ```
       * DirectiveDefinition :
       *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
       * ```
       */

      parseDirectiveDefinition() {
        const start = this._lexer.token;
        const description = this.parseDescription();
        this.expectKeyword('directive');
        this.expectToken(TokenKind.AT);
        const name = this.parseName();
        const args = this.parseArgumentDefs();
        const repeatable = this.expectOptionalKeyword('repeatable');
        this.expectKeyword('on');
        const locations = this.parseDirectiveLocations();
        return this.node(start, {
          kind: Kind.DIRECTIVE_DEFINITION,
          description,
          name,
          arguments: args,
          repeatable,
          locations,
        });
      }
      /**
       * DirectiveLocations :
       *   - `|`? DirectiveLocation
       *   - DirectiveLocations | DirectiveLocation
       */

      parseDirectiveLocations() {
        return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
      }
      /*
       * DirectiveLocation :
       *   - ExecutableDirectiveLocation
       *   - TypeSystemDirectiveLocation
       *
       * ExecutableDirectiveLocation : one of
       *   `QUERY`
       *   `MUTATION`
       *   `SUBSCRIPTION`
       *   `FIELD`
       *   `FRAGMENT_DEFINITION`
       *   `FRAGMENT_SPREAD`
       *   `INLINE_FRAGMENT`
       *
       * TypeSystemDirectiveLocation : one of
       *   `SCHEMA`
       *   `SCALAR`
       *   `OBJECT`
       *   `FIELD_DEFINITION`
       *   `ARGUMENT_DEFINITION`
       *   `INTERFACE`
       *   `UNION`
       *   `ENUM`
       *   `ENUM_VALUE`
       *   `INPUT_OBJECT`
       *   `INPUT_FIELD_DEFINITION`
       */

      parseDirectiveLocation() {
        const start = this._lexer.token;
        const name = this.parseName();

        if (Object.prototype.hasOwnProperty.call(DirectiveLocation, name.value)) {
          return name;
        }

        throw this.unexpected(start);
      } // Core parsing utility functions

      /**
       * Returns a node that, if configured to do so, sets a "loc" field as a
       * location object, used to identify the place in the source that created a
       * given parsed object.
       */

      node(startToken, node) {
        var _this$_options2;

        if (
          ((_this$_options2 = this._options) === null || _this$_options2 === void 0
            ? void 0
            : _this$_options2.noLocation) !== true
        ) {
          node.loc = new Location(
            startToken,
            this._lexer.lastToken,
            this._lexer.source,
          );
        }

        return node;
      }
      /**
       * Determines if the next token is of a given kind
       */

      peek(kind) {
        return this._lexer.token.kind === kind;
      }
      /**
       * If the next token is of the given kind, return that token after advancing the lexer.
       * Otherwise, do not change the parser state and throw an error.
       */

      expectToken(kind) {
        const token = this._lexer.token;

        if (token.kind === kind) {
          this._lexer.advance();

          return token;
        }

        throw syntaxError(
          this._lexer.source,
          token.start,
          `Expected ${getTokenKindDesc(kind)}, found ${getTokenDesc(token)}.`,
        );
      }
      /**
       * If the next token is of the given kind, return "true" after advancing the lexer.
       * Otherwise, do not change the parser state and return "false".
       */

      expectOptionalToken(kind) {
        const token = this._lexer.token;

        if (token.kind === kind) {
          this._lexer.advance();

          return true;
        }

        return false;
      }
      /**
       * If the next token is a given keyword, advance the lexer.
       * Otherwise, do not change the parser state and throw an error.
       */

      expectKeyword(value) {
        const token = this._lexer.token;

        if (token.kind === TokenKind.NAME && token.value === value) {
          this._lexer.advance();
        } else {
          throw syntaxError(
            this._lexer.source,
            token.start,
            `Expected "${value}", found ${getTokenDesc(token)}.`,
          );
        }
      }
      /**
       * If the next token is a given keyword, return "true" after advancing the lexer.
       * Otherwise, do not change the parser state and return "false".
       */

      expectOptionalKeyword(value) {
        const token = this._lexer.token;

        if (token.kind === TokenKind.NAME && token.value === value) {
          this._lexer.advance();

          return true;
        }

        return false;
      }
      /**
       * Helper function for creating an error when an unexpected lexed token is encountered.
       */

      unexpected(atToken) {
        const token =
          atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
        return syntaxError(
          this._lexer.source,
          token.start,
          `Unexpected ${getTokenDesc(token)}.`,
        );
      }
      /**
       * Returns a possibly empty list of parse nodes, determined by the parseFn.
       * This list begins with a lex token of openKind and ends with a lex token of closeKind.
       * Advances the parser to the next lex token after the closing token.
       */

      any(openKind, parseFn, closeKind) {
        this.expectToken(openKind);
        const nodes = [];

        while (!this.expectOptionalToken(closeKind)) {
          nodes.push(parseFn.call(this));
        }

        return nodes;
      }
      /**
       * Returns a list of parse nodes, determined by the parseFn.
       * It can be empty only if open token is missing otherwise it will always return non-empty list
       * that begins with a lex token of openKind and ends with a lex token of closeKind.
       * Advances the parser to the next lex token after the closing token.
       */

      optionalMany(openKind, parseFn, closeKind) {
        if (this.expectOptionalToken(openKind)) {
          const nodes = [];

          do {
            nodes.push(parseFn.call(this));
          } while (!this.expectOptionalToken(closeKind));

          return nodes;
        }

        return [];
      }
      /**
       * Returns a non-empty list of parse nodes, determined by the parseFn.
       * This list begins with a lex token of openKind and ends with a lex token of closeKind.
       * Advances the parser to the next lex token after the closing token.
       */

      many(openKind, parseFn, closeKind) {
        this.expectToken(openKind);
        const nodes = [];

        do {
          nodes.push(parseFn.call(this));
        } while (!this.expectOptionalToken(closeKind));

        return nodes;
      }
      /**
       * Returns a non-empty list of parse nodes, determined by the parseFn.
       * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
       * Advances the parser to the next lex token after last item in the list.
       */

      delimitedMany(delimiterKind, parseFn) {
        this.expectOptionalToken(delimiterKind);
        const nodes = [];

        do {
          nodes.push(parseFn.call(this));
        } while (this.expectOptionalToken(delimiterKind));

        return nodes;
      }
    }
    /**
     * A helper function to describe a token as a string for debugging.
     */

    function getTokenDesc(token) {
      const value = token.value;
      return getTokenKindDesc(token.kind) + (value != null ? ` "${value}"` : '');
    }
    /**
     * A helper function to describe a token kind as a string for debugging.
     */

    function getTokenKindDesc(kind) {
      return isPunctuatorTokenKind(kind) ? `"${kind}"` : kind;
    }

    function l$1(a, b) {
      b.tag = a;
      return b;
    }

    function m() {}

    function p$1(a) {
      return function (b) {
        var c = a.length;
        let d = !1,
          e = !1,
          f = !1,
          g = 0;
        b(
          l$1(0, [
            function (h) {
              if (h) {
                d = !0;
              } else if (e) {
                f = !0;
              } else {
                for (e = f = !0; f && !d; ) {
                  g < c ? ((h = a[g]), (g = (g + 1) | 0), (f = !1), b(l$1(1, [h]))) : ((d = !0), b(0));
                }
                e = !1;
              }
            },
          ])
        );
      };
    }

    function r() {}

    function t(a) {
      a(0);
    }

    function u$1(a) {
      let b = !1;
      a(
        l$1(0, [
          function (c) {
            c ? (b = !0) : b || a(0);
          },
        ])
      );
    }

    function x(a) {
      if (null === a || a[0] !== v) {
        return a;
      }
      if (0 !== (a = a[1])) {
        return [v, (a - 1) | 0];
      }
    }

    function z(a) {
      return function (b) {
        return function (c) {
          function d(b) {
            'number' == typeof b
              ? k &&
                ((k = !1),
                void 0 !== (b = e.shift())
                  ? ((b = a(x(b))), (k = !0), b(d))
                  : q
                  ? c(0)
                  : g || ((g = !0), f(0)))
              : b.tag
              ? k && (c(b), n ? (n = !1) : h(0))
              : ((h = b = b[0]), (n = !1), b(0));
          }
          let e = [],
            f = m,
            g = !1,
            h = m,
            k = !1,
            n = !1,
            q = !1;
          b(function (b) {
            'number' == typeof b
              ? q || ((q = !0), k || 0 !== e.length || c(0))
              : b.tag
              ? q || ((b = b[0]), (g = !1), k ? e.push(b) : ((b = a(b)), (k = !0), b(d)))
              : (f = b[0]);
          });
          c(
            l$1(0, [
              function (c) {
                if (c) {
                  if ((q || ((q = !0), f(1)), k)) {
                    return (k = !1), h(1);
                  }
                } else {
                  q || g || ((g = !0), f(0)), k && !n && ((n = !0), h(0));
                }
              },
            ])
          );
        };
      };
    }

    function B(a) {
      return a;
    }

    function C(a) {
      return a(0);
    }

    function D(a) {
      return function (b) {
        return function (c) {
          let e = m,
            f = !1,
            g = [],
            h = !1;
          b(function (b) {
            'number' == typeof b
              ? h || ((h = !0), 0 === g.length && c(0))
              : b.tag
              ? h ||
                ((f = !1),
                (function (a) {
                  function b(a) {
                    'number' == typeof a
                      ? 0 !== g.length &&
                        ((g = g.filter(d)),
                        (a = 0 === g.length),
                        h && a ? c(0) : !f && a && ((f = !0), e(0)))
                      : a.tag
                      ? 0 !== g.length && (c(l$1(1, [a[0]])), k(0))
                      : ((k = a = a[0]), (g = g.concat(a)), a(0));
                  }
                  function d(a) {
                    return a !== k;
                  }
                  let k = m;
                  1 === a.length ? a(b) : a.bind(null, b);
                })(a(b[0])),
                f || ((f = !0), e(0)))
              : (e = b[0]);
          });
          c(
            l$1(0, [
              function (a) {
                a
                  ? (h || ((h = !0), e(a)),
                    g.forEach(function (c) {
                      return c(a);
                    }),
                    (g = []))
                  : (f || h ? (f = !1) : ((f = !0), e(0)), g.forEach(C));
              },
            ])
          );
        };
      };
    }

    function E(a) {
      return a;
    }

    function H(a) {
      return function (b) {
        return function (c) {
          let d = !1;
          return b(function (e) {
            if ('number' == typeof e) {
              d || ((d = !0), c(e));
            } else if (e.tag) {
              d || (a(e[0]), c(e));
            } else {
              var g = e[0];
              c(
                l$1(0, [
                  function (a) {
                    if (!d) {
                      return a && (d = !0), g(a);
                    }
                  },
                ])
              );
            }
          });
        };
      };
    }

    function J$1(a) {
      a(0);
    }

    function K(a) {
      return function (b) {
        return function (c) {
          function d(a) {
            h &&
              ('number' == typeof a
                ? ((h = !1), n ? c(a) : f || ((f = !0), e(0)))
                : a.tag
                ? (c(a), k ? (k = !1) : g(0))
                : ((g = a = a[0]), (k = !1), a(0)));
          }
          let e = m,
            f = !1,
            g = m,
            h = !1,
            k = !1,
            n = !1;
          b(function (b) {
            'number' == typeof b
              ? n || ((n = !0), h || c(0))
              : b.tag
              ? n ||
                (h && (g(1), (g = m)), f ? (f = !1) : ((f = !0), e(0)), (b = a(b[0])), (h = !0), b(d))
              : (e = b[0]);
          });
          c(
            l$1(0, [
              function (a) {
                if (a) {
                  if ((n || ((n = !0), e(1)), h)) {
                    return (h = !1), g(1);
                  }
                } else {
                  n || f || ((f = !0), e(0)), h && !k && ((k = !0), g(0));
                }
              },
            ])
          );
        };
      };
    }

    function M(a) {
      return function (b) {
        return function (c) {
          let d = [],
            e = m;
          return b(function (b) {
            'number' == typeof b
              ? p$1(d)(c)
              : b.tag
              ? (d.length >= a && 0 < a && d.shift(), d.push(b[0]), e(0))
              : ((b = b[0]), 0 >= a ? (b(1), u$1(c)) : ((e = b), b(0)));
          });
        };
      };
    }

    function N(a) {
      return function (b) {
        let c = m,
          d = !1;
        b(function (e) {
          'number' == typeof e ? (d = !0) : e.tag ? d || (a(e[0]), c(0)) : ((c = e = e[0]), e(0));
        });
        return {
          unsubscribe: function () {
            if (!d) {
              return (d = !0), c(1);
            }
          },
        };
      };
    }

    function O() {}

    function concat$1(a) {
      return z(B)(p$1(a));
    }

    function filter$1(a) {
      return function (b) {
        return function (c) {
          let d = m;
          return b(function (b) {
            'number' == typeof b ? c(b) : b.tag ? (a(b[0]) ? c(b) : d(0)) : ((d = b[0]), c(b));
          });
        };
      };
    }

    function fromValue$1(a) {
      return function (b) {
        let c = !1;
        b(
          l$1(0, [
            function (d) {
              d ? (c = !0) : c || ((c = !0), b(l$1(1, [a])), b(0));
            },
          ])
        );
      };
    }

    function make$1(a) {
      return function (b) {
        let c = r,
          d = !1;
        c = a({
          next: function (a) {
            d || b(l$1(1, [a]));
          },
          complete: function () {
            d || ((d = !0), b(0));
          },
        });
        b(
          l$1(0, [
            function (a) {
              if (a && !d) {
                return (d = !0), c();
              }
            },
          ])
        );
      };
    }

    function makeSubject$1() {
      let a = [],
        b = !1;
      return {
        source: function (c) {
          function b(a) {
            return a !== c;
          }
          a = a.concat(c);
          c(
            l$1(0, [
              function (c) {
                c && (a = a.filter(b));
              },
            ])
          );
        },
        next: function (c) {
          b ||
            a.forEach(function (a) {
              a(l$1(1, [c]));
            });
        },
        complete: function () {
          b || ((b = !0), a.forEach(t));
        },
      };
    }

    function map$1(a) {
      return function (b) {
        return function (c) {
          return b(function (b) {
            b = 'number' == typeof b ? 0 : b.tag ? l$1(1, [a(b[0])]) : l$1(0, [b[0]]);
            c(b);
          });
        };
      };
    }

    function merge$1(a) {
      return D(E)(p$1(a));
    }

    function onEnd$1(a) {
      return function (b) {
        return function (c) {
          let d = !1;
          return b(function (b) {
            if ('number' == typeof b) {
              if (d) {
                return;
              }
              d = !0;
              c(b);
              return a();
            }
            if (b.tag) {
              d || c(b);
            } else {
              var e = b[0];
              c(
                l$1(0, [
                  function (c) {
                    if (!d) {
                      return c ? ((d = !0), e(c), a()) : e(c);
                    }
                  },
                ])
              );
            }
          });
        };
      };
    }

    function onStart$1(a) {
      return function (b) {
        return function (c) {
          return b(function (b) {
            'number' == typeof b ? c(b) : b.tag ? c(b) : (c(b), a());
          });
        };
      };
    }

    function publish$1(a) {
      return N(O)(a);
    }

    function scan$1(a, b) {
      return (function (a, b) {
        return function (c) {
          return function (d) {
            let e = b;
            return c(function (c) {
              'number' == typeof c
                ? (c = 0)
                : c.tag
                ? ((e = a(e, c[0])), (c = l$1(1, [e])))
                : (c = l$1(0, [c[0]]));
              d(c);
            });
          };
        };
      })(a, b);
    }

    function share$1(a) {
      function b(a) {
        'number' == typeof a
          ? (c.forEach(J$1), (c = []))
          : a.tag
          ? ((e = !1),
            c.forEach(function (b) {
              b(a);
            }))
          : (d = a[0]);
      }
      let c = [],
        d = m,
        e = !1;
      return function (f) {
        function g(a) {
          return a !== f;
        }
        c = c.concat(f);
        1 === c.length && a(b);
        f(
          l$1(0, [
            function (a) {
              if (a) {
                if (((c = c.filter(g)), 0 === c.length)) {
                  return d(1);
                }
              } else {
                e || ((e = !0), d(a));
              }
            },
          ])
        );
      };
    }

    function take$1(a) {
      return function (b) {
        return function (c) {
          let d = !1,
            e = 0,
            f = m;
          b(function (b) {
            'number' == typeof b
              ? d || ((d = !0), c(0))
              : b.tag
              ? e < a && !d && ((e = (e + 1) | 0), c(b), !d && e >= a && ((d = !0), c(0), f(1)))
              : ((b = b[0]), 0 >= a ? ((d = !0), c(0), b(1)) : (f = b));
          });
          c(
            l$1(0, [
              function (b) {
                if (!d) {
                  if (b) {
                    return (d = !0), f(1);
                  }
                  if (e < a) {
                    return f(0);
                  }
                }
              },
            ])
          );
        };
      };
    }

    function takeUntil$1(a) {
      return function (b) {
        return function (c) {
          function d(a) {
            'number' != typeof a && (a.tag ? ((e = !0), f(1), c(0)) : ((g = a = a[0]), a(0)));
          }
          let e = !1,
            f = m,
            g = m;
          b(function (b) {
            'number' == typeof b ? e || ((e = !0), g(1), c(0)) : b.tag ? e || c(b) : ((f = b[0]), a(d));
          });
          c(
            l$1(0, [
              function (a) {
                if (!e) {
                  return a ? ((e = !0), f(1), g(1)) : f(0);
                }
              },
            ])
          );
        };
      };
    }

    function toPromise$1(a) {
      return new Promise(function (b) {
        M(1)(a)(function (a) {
          if ('number' != typeof a) {
            if (a.tag) {
              b(a[0]);
            } else {
              a[0](0);
            }
          }
        });
      });
    }

    var v = [];
      'function' == typeof Symbol
          ? Symbol.observable || (Symbol.observable = Symbol('observable'))
          : '@@observable';

    function rehydrateGraphQlError(r) {
      if ("string" == typeof r) {
        return new GraphQLError(r);
      } else if ("object" == typeof r && r.message) {
        return new GraphQLError(r.message, r.nodes, r.source, r.positions, r.path, r, r.extensions || {});
      } else {
        return r;
      }
    }

    var o = function(e) {
      function CombinedError(r) {
        var t = r.networkError;
        var n = r.response;
        var a = (r.graphQLErrors || []).map(rehydrateGraphQlError);
        var o = function generateErrorMessage(e, r) {
          var t = "";
          if (void 0 !== e) {
            return t = "[Network] " + e.message;
          }
          if (void 0 !== r) {
            r.forEach((function(e) {
              t += "[GraphQL] " + e.message + "\n";
            }));
          }
          return t.trim();
        }(t, a);
        e.call(this, o);
        this.name = "CombinedError";
        this.message = o;
        this.graphQLErrors = a;
        this.networkError = t;
        this.response = n;
      }
      if (e) {
        CombinedError.__proto__ = e;
      }
      (CombinedError.prototype = Object.create(e && e.prototype)).constructor = CombinedError;
      CombinedError.prototype.toString = function toString() {
        return this.message;
      };
      return CombinedError;
    }(Error);

    function phash(e, r) {
      e |= 0;
      for (var t = 0, n = 0 | r.length; t < n; t++) {
        e = (e << 5) + e + r.charCodeAt(t);
      }
      return e;
    }

    function hash(e) {
      return phash(5381, e) >>> 0;
    }

    var i = new Set;

    var s = new WeakMap;

    function stringify(e) {
      if (null === e || i.has(e)) {
        return "null";
      } else if ("object" != typeof e) {
        return JSON.stringify(e) || "";
      } else if (e.toJSON) {
        return stringify(e.toJSON());
      } else if (Array.isArray(e)) {
        var r = "[";
        for (var t = 0, n = e.length; t < n; t++) {
          if (t > 0) {
            r += ",";
          }
          var a = stringify(e[t]);
          r += a.length > 0 ? a : "null";
        }
        return r += "]";
      }
      var o = Object.keys(e).sort();
      if (!o.length && e.constructor && e.constructor !== Object) {
        var u = s.get(e) || Math.random().toString(36).slice(2);
        s.set(e, u);
        return '{"__key":"' + u + '"}';
      }
      i.add(e);
      var f = "{";
      for (var c = 0, l = o.length; c < l; c++) {
        var h = o[c];
        var p = stringify(e[h]);
        if (p) {
          if (f.length > 1) {
            f += ",";
          }
          f += stringify(h) + ":" + p;
        }
      }
      i.delete(e);
      return f += "}";
    }

    function stringifyVariables(e) {
      i.clear();
      return stringify(e);
    }

    var u = /("{3}[\s\S]*"{3}|"(?:\\.|[^"])*")/g;

    var f = /([\s,]|#[^\n\r]+)+/g;

    function replaceOutsideStrings(e, r) {
      return r % 2 == 0 ? e.replace(f, " ").trim() : e;
    }

    function stringifyDocument(e) {
      var r = ("string" != typeof e ? e.loc && e.loc.source.body || print(e) : e).split(u).map(replaceOutsideStrings).join("");
      if ("string" != typeof e) {
        var t = "definitions" in e && getOperationName(e);
        if (t) {
          r = "# " + t + "\n" + r;
        }
        if (!e.loc) {
          e.loc = {
            start: 0,
            end: r.length,
            source: {
              body: r,
              name: "gql",
              locationOffset: {
                line: 1,
                column: 1
              }
            }
          };
        }
      }
      return r;
    }

    var c = new Map;

    function keyDocument(e) {
      var r;
      var n;
      if ("string" == typeof e) {
        r = hash(stringifyDocument(e));
        n = c.get(r) || parse(e, {
          noLocation: !0
        });
      } else {
        r = e.__key || hash(stringifyDocument(e));
        n = c.get(r) || e;
      }
      if (!n.loc) {
        stringifyDocument(n);
      }
      n.__key = r;
      c.set(r, n);
      return n;
    }

    function createRequest(e, r) {
      if (!r) {
        r = {};
      }
      var t = keyDocument(e);
      return {
        key: phash(t.__key, stringifyVariables(r)) >>> 0,
        query: t,
        variables: r
      };
    }

    function getOperationName(e) {
      for (var t = 0, n = e.definitions.length; t < n; t++) {
        var a = e.definitions[t];
        if (a.kind === Kind.OPERATION_DEFINITION && a.name) {
          return a.name.value;
        }
      }
    }

    function getOperationType(e) {
      for (var t = 0, n = e.definitions.length; t < n; t++) {
        var a = e.definitions[t];
        if (a.kind === Kind.OPERATION_DEFINITION) {
          return a.operation;
        }
      }
    }

    function _extends$1() {
      return (_extends$1 = Object.assign || function(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = arguments[r];
          for (var n in t) {
            if (Object.prototype.hasOwnProperty.call(t, n)) {
              e[n] = t[n];
            }
          }
        }
        return e;
      }).apply(this, arguments);
    }

    function makeResult(e, r, t) {
      if (!("data" in r) && !("errors" in r) || "path" in r) {
        throw new Error("No Content");
      }
      return {
        operation: e,
        data: r.data,
        error: Array.isArray(r.errors) ? new o({
          graphQLErrors: r.errors,
          response: t
        }) : void 0,
        extensions: "object" == typeof r.extensions && r.extensions || void 0,
        hasNext: !!r.hasNext
      };
    }

    function mergeResultPatch(e, r, t) {
      var n = _extends$1({}, e);
      n.hasNext = !!r.hasNext;
      if (!("path" in r)) {
        if ("data" in r) {
          n.data = r.data;
        }
        return n;
      }
      if (Array.isArray(r.errors)) {
        n.error = new o({
          graphQLErrors: n.error ? n.error.graphQLErrors.concat(r.errors) : r.errors,
          response: t
        });
      }
      var a = n.data = _extends$1({}, n.data);
      var i = 0;
      var s;
      while (i < r.path.length) {
        a = a[s = r.path[i++]] = Array.isArray(a[s]) ? [].concat(a[s]) : _extends$1({}, a[s]);
      }
      _extends$1(a, r.data);
      return n;
    }

    function makeErrorResult(e, r, t) {
      return {
        operation: e,
        data: void 0,
        error: new o({
          networkError: r,
          response: t
        }),
        extensions: void 0
      };
    }

    function shouldUseGet(e) {
      return "query" === e.kind && !!e.context.preferGetMethod;
    }

    function makeFetchBody(e) {
      return {
        query: print(e.query),
        operationName: getOperationName(e.query),
        variables: e.variables || void 0,
        extensions: void 0
      };
    }

    function makeFetchURL(e, r) {
      var t = shouldUseGet(e);
      var n = e.context.url;
      if (!t || !r) {
        return n;
      }
      var a = [];
      if (r.operationName) {
        a.push("operationName=" + encodeURIComponent(r.operationName));
      }
      if (r.query) {
        a.push("query=" + encodeURIComponent(r.query.replace(/#[^\n\r]+/g, " ").trim()));
      }
      if (r.variables) {
        a.push("variables=" + encodeURIComponent(stringifyVariables(r.variables)));
      }
      if (r.extensions) {
        a.push("extensions=" + encodeURIComponent(stringifyVariables(r.extensions)));
      }
      return n + "?" + a.join("&");
    }

    function makeFetchOptions(e, r) {
      var t = shouldUseGet(e);
      var n = "function" == typeof e.context.fetchOptions ? e.context.fetchOptions() : e.context.fetchOptions || {};
      return _extends$1({}, n, {
        body: !t && r ? JSON.stringify(r) : void 0,
        method: t ? "GET" : "POST",
        headers: t ? n.headers : _extends$1({}, {
          "content-type": "application/json"
        }, n.headers)
      });
    }

    var l = "undefined" != typeof Symbol ? Symbol.asyncIterator : null;

    var h = "undefined" != typeof TextDecoder ? new TextDecoder : null;

    var p = /content-type:[^\r\n]*application\/json/i;

    var d = /boundary="?([^=";]+)"?/i;

    function makeFetchSource(e, r, t) {
      var n = "manual" === t.redirect ? 400 : 300;
      var o = e.context.fetch;
      return make$1((function(a) {
        var i = a.next;
        var s = a.complete;
        var u = "undefined" != typeof AbortController ? new AbortController : null;
        if (u) {
          t.signal = u.signal;
        }
        var f = !1;
        function executeIncrementalFetch(e, r, t) {
          var n = t.headers && t.headers.get("Content-Type") || "";
          if (!/multipart\/mixed/i.test(n)) {
            return t.json().then((function(n) {
              var a = makeResult(r, n, t);
              f = !0;
              e(a);
            }));
          }
          var a = "---";
          var o = n.match(d);
          if (o) {
            a = "--" + o[1];
          }
          var i;
          var cancel = function() {};
          if (l && t[l]) {
            var s = t[l]();
            i = s.next.bind(s);
          } else if ("body" in t && t.body) {
            var u = t.body.getReader();
            cancel = u.cancel.bind(u);
            i = u.read.bind(u);
          } else {
            throw new TypeError("Streaming requests unsupported");
          }
          var c = "";
          var v = !0;
          var m = null;
          var g = null;
          return i().then((function next(n) {
            if (!n.done) {
              var o = function toString(e) {
                return "Buffer" === e.constructor.name ? e.toString() : h.decode(e);
              }(n.value);
              var s = o.indexOf(a);
              if (s > -1) {
                s += c.length;
              } else {
                s = c.indexOf(a);
              }
              c += o;
              while (s > -1) {
                var u = c.slice(0, s);
                var l = c.slice(s + a.length);
                if (v) {
                  v = !1;
                } else {
                  var d = u.indexOf("\r\n\r\n") + 4;
                  var y = u.slice(0, d);
                  var x = u.slice(d, u.lastIndexOf("\r\n"));
                  var b = void 0;
                  if (p.test(y)) {
                    try {
                      b = JSON.parse(x);
                      m = g = g ? mergeResultPatch(g, b, t) : makeResult(r, b, t);
                    } catch (e) {}
                  }
                  if ("--" === l.slice(0, 2) || b && !b.hasNext) {
                    if (!g) {
                      return e(makeResult(r, {}, t));
                    }
                    break;
                  }
                }
                s = (c = l).indexOf(a);
              }
            } else {
              f = !0;
            }
            if (m) {
              e(m);
              m = null;
            }
            if (!n.done && (!g || g.hasNext)) {
              return i().then(next);
            }
          })).finally(cancel);
        }
        var c = !1;
        var v = !1;
        var m;
        Promise.resolve().then((function() {
          if (c) {
            return;
          }
          return (o || fetch)(r, t);
        })).then((function(r) {
          if (!r) {
            return;
          }
          v = (m = r).status < 200 || m.status >= n;
          return executeIncrementalFetch(i, e, m);
        })).then(s).catch((function(r) {
          if (f) {
            throw r;
          }
          if ("AbortError" !== r.name) {
            var t = makeErrorResult(e, v ? new Error(m.statusText) : r, m);
            i(t);
            s();
          }
        }));
        return function() {
          c = !0;
          if (u) {
            u.abort();
          }
        };
      }));
    }

    function collectTypes(e, r) {
      if (Array.isArray(e)) {
        for (var n = 0; n < e.length; n++) {
          collectTypes(e[n], r);
        }
      } else if ("object" == typeof e && null !== e) {
        for (var t in e) {
          if ("__typename" === t && "string" == typeof e[t]) {
            r[e[t]] = 0;
          } else {
            collectTypes(e[t], r);
          }
        }
      }
      return r;
    }

    function collectTypesFromResponse(e) {
      return Object.keys(collectTypes(e, {}));
    }

    var formatNode = function(e) {
      if (e.selectionSet && !e.selectionSet.selections.some((function(e) {
        return e.kind === Kind.FIELD && "__typename" === e.name.value && !e.alias;
      }))) {
        return _extends$1({}, e, {
          selectionSet: _extends$1({}, e.selectionSet, {
            selections: e.selectionSet.selections.concat([ {
              kind: Kind.FIELD,
              name: {
                kind: Kind.NAME,
                value: "__typename"
              }
            } ])
          })
        });
      }
    };

    var Q = new Map;

    function formatDocument(r) {
      var n = keyDocument(r);
      var a = Q.get(n.__key);
      if (!a) {
        a = visit(n, {
          Field: formatNode,
          InlineFragment: formatNode
        });
        Object.defineProperty(a, "__key", {
          value: n.__key,
          enumerable: !1
        });
        Q.set(n.__key, a);
      }
      return a;
    }

    function maskTypename(e) {
      if (!e || "object" != typeof e) {
        return e;
      }
      return Object.keys(e).reduce((function(r, n) {
        var t = e[n];
        if ("__typename" === n) {
          Object.defineProperty(r, "__typename", {
            enumerable: !1,
            value: t
          });
        } else if (Array.isArray(t)) {
          r[n] = t.map(maskTypename);
        } else if (t && "object" == typeof t && "__typename" in t) {
          r[n] = maskTypename(t);
        } else {
          r[n] = t;
        }
        return r;
      }), Array.isArray(e) ? [] : {});
    }

    function withPromise(e) {
      e.toPromise = function() {
        return toPromise$1(take$1(1)(filter$1((function(e) {
          return !e.stale && !e.hasNext;
        }))(e)));
      };
      return e;
    }

    function makeOperation(e, r, n) {
      if (!n) {
        n = r.context;
      }
      return {
        key: r.key,
        query: r.query,
        variables: r.variables,
        kind: e,
        context: n
      };
    }

    function addMetadata(e, r) {
      return makeOperation(e.kind, e, _extends$1({}, e.context, {
        meta: _extends$1({}, e.context.meta, r)
      }));
    }

    function noop() {}

    function shouldSkip(e) {
      var r = e.kind;
      return "mutation" !== r && "query" !== r;
    }

    function cacheExchange(e) {
      var r = e.forward;
      var n = e.client;
      e.dispatchDebug;
      var a = new Map;
      var i = Object.create(null);
      function mapTypeNames(e) {
        var r = makeOperation(e.kind, e);
        r.query = formatDocument(e.query);
        return r;
      }
      function isOperationCached(e) {
        var r = e.context.requestPolicy;
        return "query" === e.kind && "network-only" !== r && ("cache-only" === r || a.has(e.key));
      }
      return function(e) {
        var u = share$1(e);
        var c = map$1((function(e) {
          var r = a.get(e.key);
          var i = _extends$1({}, r, {
            operation: addMetadata(e, {
              cacheOutcome: r ? "hit" : "miss"
            })
          });
          if ("cache-and-network" === e.context.requestPolicy) {
            i.stale = !0;
            reexecuteOperation(n, e);
          }
          return i;
        }))(filter$1((function(e) {
          return !shouldSkip(e) && isOperationCached(e);
        }))(u));
        var s = H((function(e) {
          var r = e.operation;
          if (!r) {
            return;
          }
          var o = collectTypesFromResponse(e.data).concat(r.context.additionalTypenames || []);
          if ("mutation" === e.operation.kind) {
            var u = new Set;
            for (var c = 0; c < o.length; c++) {
              var s = o[c];
              var f = i[s] || (i[s] = new Set);
              f.forEach((function(e) {
                u.add(e);
              }));
              f.clear();
            }
            u.forEach((function(e) {
              if (a.has(e)) {
                r = a.get(e).operation;
                a.delete(e);
                reexecuteOperation(n, r);
              }
            }));
          } else if ("query" === r.kind && e.data) {
            a.set(r.key, e);
            for (var p = 0; p < o.length; p++) {
              var l = o[p];
              (i[l] || (i[l] = new Set)).add(r.key);
            }
          }
        }))(r(filter$1((function(e) {
          return "query" !== e.kind || "cache-only" !== e.context.requestPolicy;
        }))(map$1((function(e) {
          return addMetadata(e, {
            cacheOutcome: "miss"
          });
        }))(merge$1([ map$1(mapTypeNames)(filter$1((function(e) {
          return !shouldSkip(e) && !isOperationCached(e);
        }))(u)), filter$1((function(e) {
          return shouldSkip(e);
        }))(u) ])))));
        return merge$1([ c, s ]);
      };
    }

    function reexecuteOperation(e, r) {
      return e.reexecuteOperation(makeOperation(r.kind, r, _extends$1({}, r.context, {
        requestPolicy: "network-only"
      })));
    }

    function dedupExchange(e) {
      var r = e.forward;
      e.dispatchDebug;
      var t = new Set;
      function filterIncomingOperation(e) {
        var r = e.key;
        var a = e.kind;
        if ("teardown" === a) {
          t.delete(r);
          return !0;
        }
        if ("query" !== a && "subscription" !== a) {
          return !0;
        }
        var o = t.has(r);
        t.add(r);
        return !o;
      }
      function afterOperationResult(e) {
        if (!e.hasNext) {
          t.delete(e.operation.key);
        }
      }
      return function(e) {
        var n = filter$1(filterIncomingOperation)(e);
        return H(afterOperationResult)(r(n));
      };
    }

    function fetchExchange(e) {
      var r = e.forward;
      e.dispatchDebug;
      return function(e) {
        var t = share$1(e);
        var a = D((function(e) {
          var r = e.key;
          var a = filter$1((function(e) {
            return "teardown" === e.kind && e.key === r;
          }))(t);
          var o = makeFetchBody(e);
          var i = makeFetchURL(e, o);
          var u = makeFetchOptions(e, o);
          return H((function(r) {
            !r.data ? r.error : void 0;
          }))(takeUntil$1(a)(makeFetchSource(e, i, u)));
        }))(filter$1((function(e) {
          return "query" === e.kind || "mutation" === e.kind;
        }))(t));
        var o = r(filter$1((function(e) {
          return "query" !== e.kind && "mutation" !== e.kind;
        }))(t));
        return merge$1([ a, o ]);
      };
    }

    function fallbackExchange(e) {
      e.dispatchDebug;
      return function(e) {
        return filter$1((function() {
          return !1;
        }))(H((function(e) {
          if ("teardown" !== e.kind && "production" !== "production") {
            var n = 'No exchange has handled operations of kind "' + e.kind + "\". Check whether you've added an exchange responsible for these operations.";
            console.warn(n);
          }
        }))(e));
      };
    }

    fallbackExchange({
      dispatchDebug: noop
    });

    function composeExchanges(e) {
      return function(r) {
        var n = r.client;
        r.dispatchDebug;
        return e.reduceRight((function(e, r) {
          return r({
            client: n,
            forward: e,
            dispatchDebug: function dispatchDebug$1(e) {
            }
          });
        }), r.forward);
      };
    }

    var J = [ dedupExchange, cacheExchange, fetchExchange ];

    var W = function Client(e) {
      var r = new Map;
      var n = new Map;
      var t = [];
      var a = makeSubject$1();
      var i = a.source;
      var u = a.next;
      var c = !1;
      function dispatchOperation(e) {
        c = !0;
        if (e) {
          u(e);
        }
        while (e = t.shift()) {
          u(e);
        }
        c = !1;
      }
      function makeResultSource(e) {
        var a = filter$1((function(r) {
          return r.operation.kind === e.kind && r.operation.key === e.key && (!r.operation.context._instance || r.operation.context._instance === e.context._instance);
        }))(y);
        if (f.maskTypename) {
          a = map$1((function(e) {
            return _extends$1({}, e, {
              data: maskTypename(e.data)
            });
          }))(a);
        }
        if ("mutation" === e.kind) {
          return take$1(1)(onStart$1((function() {
            return dispatchOperation(e);
          }))(a));
        }
        return share$1(onEnd$1((function() {
          r.delete(e.key);
          n.delete(e.key);
          for (var a = t.length - 1; a >= 0; a--) {
            if (t[a].key === e.key) {
              t.splice(a, 1);
            }
          }
          dispatchOperation(makeOperation("teardown", e, e.context));
        }))(H((function(n) {
          r.set(e.key, n);
        }))(K((function(r) {
          if ("query" !== e.kind || r.stale) {
            return fromValue$1(r);
          }
          return merge$1([ fromValue$1(r), map$1((function() {
            return _extends$1({}, r, {
              stale: !0
            });
          }))(take$1(1)(filter$1((function(r) {
            return "query" === r.kind && r.key === e.key && "cache-only" !== r.context.requestPolicy;
          }))(i))) ]);
        }))(takeUntil$1(filter$1((function(r) {
          return "teardown" === r.kind && r.key === e.key;
        }))(i))(a)))));
      }
      var s = this instanceof Client ? this : Object.create(Client.prototype);
      var f = _extends$1(s, {
        url: e.url,
        fetchOptions: e.fetchOptions,
        fetch: e.fetch,
        suspense: !!e.suspense,
        requestPolicy: e.requestPolicy || "cache-first",
        preferGetMethod: !!e.preferGetMethod,
        maskTypename: !!e.maskTypename,
        operations$: i,
        reexecuteOperation: function reexecuteOperation(e) {
          if ("mutation" === e.kind || n.has(e.key)) {
            t.push(e);
            if (!c) {
              Promise.resolve().then(dispatchOperation);
            }
          }
        },
        createOperationContext: function createOperationContext(e) {
          if (!e) {
            e = {};
          }
          return _extends$1({}, {
            _instance: void 0,
            url: f.url,
            fetchOptions: f.fetchOptions,
            fetch: f.fetch,
            preferGetMethod: f.preferGetMethod
          }, e, {
            suspense: e.suspense || !1 !== e.suspense && f.suspense,
            requestPolicy: e.requestPolicy || f.requestPolicy
          });
        },
        createRequestOperation: function createRequestOperation(e, r, n) {
          getOperationType(r.query);
          var a = f.createOperationContext(n);
          if ("mutation" === e) {
            a._instance = [];
          }
          return makeOperation(e, r, a);
        },
        executeRequestOperation: function executeRequestOperation(e) {
          if ("mutation" === e.kind) {
            return makeResultSource(e);
          }
          return make$1((function(t) {
            var a = n.get(e.key);
            if (!a) {
              n.set(e.key, a = makeResultSource(e));
            }
            var i = "cache-and-network" === e.context.requestPolicy || "network-only" === e.context.requestPolicy;
            return N(t.next)(onEnd$1(t.complete)(onStart$1((function() {
              var n = r.get(e.key);
              if ("subscription" === e.kind) {
                return dispatchOperation(e);
              } else if (i) {
                dispatchOperation(e);
              }
              if (null != n && n === r.get(e.key)) {
                t.next(i ? _extends$1({}, n, {
                  stale: !0
                }) : n);
              } else if (!i) {
                dispatchOperation(e);
              }
            }))(a))).unsubscribe;
          }));
        },
        executeQuery: function executeQuery(e, r) {
          var n = f.createRequestOperation("query", e, r);
          return f.executeRequestOperation(n);
        },
        executeSubscription: function executeSubscription(e, r) {
          var n = f.createRequestOperation("subscription", e, r);
          return f.executeRequestOperation(n);
        },
        executeMutation: function executeMutation(e, r) {
          var n = f.createRequestOperation("mutation", e, r);
          return f.executeRequestOperation(n);
        },
        query: function query(e, r, n) {
          if (!n || "boolean" != typeof n.suspense) {
            n = _extends$1({}, n, {
              suspense: !1
            });
          }
          return withPromise(f.executeQuery(createRequest(e, r), n));
        },
        readQuery: function readQuery(e, r, n) {
          var t = null;
          N((function(e) {
            t = e;
          }))(f.query(e, r, n)).unsubscribe();
          return t;
        },
        subscription: function subscription(e, r, n) {
          return f.executeSubscription(createRequest(e, r), n);
        },
        mutation: function mutation(e, r, n) {
          return withPromise(f.executeMutation(createRequest(e, r), n));
        }
      });
      var p = noop;
      var h = composeExchanges(void 0 !== e.exchanges ? e.exchanges : J);
      var y = share$1(h({
        client: f,
        dispatchDebug: p,
        forward: fallbackExchange({
          dispatchDebug: p
        })
      })(i));
      publish$1(y);
      return f;
    };

    function _extends() {
      return (_extends = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var r in n) {
            if (Object.prototype.hasOwnProperty.call(n, r)) {
              e[r] = n[r];
            }
          }
        }
        return e;
      }).apply(this, arguments);
    }

    function operationStore(n, i, o) {
      var u = {
        query: n,
        variables: i || null,
        context: o
      };
      var a = {
        stale: !1,
        fetching: !1,
        data: void 0,
        error: void 0,
        extensions: void 0
      };
      var c = writable(a);
      var s = !1;
      a.set = function set(n) {
        if (!n || n === a) {
          return;
        }
        s = !0;
        var i = !1;
        if ("query" in n || "variables" in n) {
          var o = createRequest(u.query, u.variables);
          var f = createRequest(n.query || u.query, n.variables || u.variables);
          if (o.key !== f.key) {
            i = !0;
            u.query = n.query || u.query;
            u.variables = n.variables || u.variables || null;
          }
        }
        if ("context" in n) {
          if (stringifyVariables(u.context) !== stringifyVariables(n.context)) {
            i = !0;
            u.context = n.context;
          }
        }
        for (var l in n) {
          if ("query" === l || "variables" === l || "context" === l) {
            continue;
          } else if ("fetching" === l) {
            a[l] = !!n[l];
          } else if (l in a) {
            a[l] = n[l];
          }
          i = !0;
        }
        a.stale = !!n.stale;
        s = !1;
        if (i) {
          c.set(a);
        }
      };
      a.update = function update(e) {
        a.set(e(a));
      };
      a.subscribe = function subscribe(e, t) {
        return c.subscribe(e, t);
      };
      a.reexecute = function(e) {
        u.context = _extends({}, e || u.context);
        c.set(a);
      };
      Object.keys(u).forEach((function(e) {
        Object.defineProperty(a, e, {
          configurable: !1,
          get: function() {
            return u[e];
          },
          set: function set(t) {
            u[e] = t;
            if (!s) {
              c.set(a);
            }
          }
        });
      }));
      return a;
    }

    function getClient() {
      return getContext("$$_urql");
    }

    function setClient(e) {
      setContext("$$_urql", e);
    }

    function initClient(e) {
      var t = new W(e);
      setClient(t);
      return t;
    }

    var g = {
      fetching: !1,
      stale: !1,
      error: void 0,
      data: void 0,
      extensions: void 0
    };

    function toSource(t) {
      return make$1((function(n) {
        var r;
        var i = {};
        return t.subscribe((function(t) {
          var o = createRequest(t.query, t.variables);
          if ((o.context = t.context) !== i || o.key !== r) {
            r = o.key;
            i = t.context;
            n.next(o);
          }
        }));
      }));
    }

    function query(e) {
      var t = getClient();
      var n = N((function(t) {
        e.set(t);
      }))(scan$1((function(e, t) {
        return _extends({}, e, t);
      }), g)(K((function(e) {
        if (e.context && e.context.pause) {
          return fromValue$1({
            fetching: !1,
            stale: !1
          });
        }
        return concat$1([ fromValue$1({
          fetching: !0,
          stale: !1
        }), map$1((function(e) {
          return _extends({}, {
            fetching: !1
          }, e, {
            stale: !!e.stale
          });
        }))(t.executeQuery(e, e.context)), fromValue$1({
          fetching: !1,
          stale: !1
        }) ]);
      }))(toSource(e))));
      onDestroy(n.unsubscribe);
      return e;
    }

    function clickOutside(node, handler) {
        const onClick = (event) => node &&
            !node.contains(event.target) &&
            !event.defaultPrevented &&
            handler();
        document.addEventListener("click", onClick, true);
        return {
            destroy() {
                document.removeEventListener("click", onClick, true);
            },
        };
    }

    /* src\components\SearchHistorys.svelte generated by Svelte v3.46.4 */

    const file$5 = "src\\components\\SearchHistorys.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let section0;
    	let t0;
    	let section0_class_value;
    	let t1;
    	let section1;
    	let t2;
    	let section1_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			section0 = element("section");
    			t0 = text("최근검색");
    			t1 = space();
    			section1 = element("section");
    			t2 = text("즐겨찾기");
    			attr_dev(section0, "class", section0_class_value = "" + (null_to_empty(/*currentTab*/ ctx[2] === "최근검색" && "selected") + " svelte-tkcq3v"));
    			add_location(section0, file$5, 7, 4, 212);
    			attr_dev(section1, "class", section1_class_value = "" + (null_to_empty(/*currentTab*/ ctx[2] === "즐겨찾기" && "selected") + " svelte-tkcq3v"));
    			add_location(section1, file$5, 13, 4, 358);
    			attr_dev(div0, "class", "head svelte-tkcq3v");
    			set_style(div0, "--h_height", /*headerHeight*/ ctx[1]);
    			add_location(div0, file$5, 6, 2, 154);
    			attr_dev(div1, "class", "wrapper svelte-tkcq3v");
    			set_style(div1, "--height", /*height*/ ctx[0]);
    			add_location(div1, file$5, 5, 0, 103);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, section0);
    			append_dev(section0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, section1);
    			append_dev(section1, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(section0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(section1, "click", /*click_handler_1*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currentTab*/ 4 && section0_class_value !== (section0_class_value = "" + (null_to_empty(/*currentTab*/ ctx[2] === "최근검색" && "selected") + " svelte-tkcq3v"))) {
    				attr_dev(section0, "class", section0_class_value);
    			}

    			if (dirty & /*currentTab*/ 4 && section1_class_value !== (section1_class_value = "" + (null_to_empty(/*currentTab*/ ctx[2] === "즐겨찾기" && "selected") + " svelte-tkcq3v"))) {
    				attr_dev(section1, "class", section1_class_value);
    			}

    			if (dirty & /*headerHeight*/ 2) {
    				set_style(div0, "--h_height", /*headerHeight*/ ctx[1]);
    			}

    			if (dirty & /*height*/ 1) {
    				set_style(div1, "--height", /*height*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchHistorys', slots, []);
    	let { height } = $$props;
    	let { headerHeight } = $$props;
    	let currentTab = "최근검색";
    	const writable_props = ['height', 'headerHeight'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchHistorys> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(2, currentTab = "최근검색");
    	const click_handler_1 = () => $$invalidate(2, currentTab = "즐겨찾기");

    	$$self.$$set = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('headerHeight' in $$props) $$invalidate(1, headerHeight = $$props.headerHeight);
    	};

    	$$self.$capture_state = () => ({ height, headerHeight, currentTab });

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('headerHeight' in $$props) $$invalidate(1, headerHeight = $$props.headerHeight);
    		if ('currentTab' in $$props) $$invalidate(2, currentTab = $$props.currentTab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [height, headerHeight, currentTab, click_handler, click_handler_1];
    }

    class SearchHistorys extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { height: 0, headerHeight: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchHistorys",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*height*/ ctx[0] === undefined && !('height' in props)) {
    			console.warn("<SearchHistorys> was created without expected prop 'height'");
    		}

    		if (/*headerHeight*/ ctx[1] === undefined && !('headerHeight' in props)) {
    			console.warn("<SearchHistorys> was created without expected prop 'headerHeight'");
    		}
    	}

    	get height() {
    		throw new Error("<SearchHistorys>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<SearchHistorys>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headerHeight() {
    		throw new Error("<SearchHistorys>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headerHeight(value) {
    		throw new Error("<SearchHistorys>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\pgSearch.svelte generated by Svelte v3.46.4 */

    const { console: console_1$1 } = globals;
    const file$4 = "src\\components\\pgSearch.svelte";

    // (28:2) {#if isClicked}
    function create_if_block$1(ctx) {
    	let searchhistorys;
    	let current;

    	searchhistorys = new SearchHistorys({
    			props: { headerHeight: "34px", height: "228px" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(searchhistorys.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchhistorys, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchhistorys.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchhistorys.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchhistorys, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(28:2) {#if isClicked}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let form;
    	let input;
    	let t;
    	let clickOutside_action;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*isClicked*/ ctx[4] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(input, "placeholder", "이름을 입력하세요");
    			set_style(input, "--height", /*height*/ ctx[1]);
    			attr_dev(input, "class", "svelte-10u2p4p");
    			add_location(input, file$4, 21, 2, 590);
    			set_style(form, "--width", /*width*/ ctx[3]);
    			set_style(form, "--c_height", /*containerHeight*/ ctx[2]);
    			attr_dev(form, "method", "get");
    			attr_dev(form, "class", "svelte-10u2p4p");
    			add_location(form, file$4, 15, 0, 417);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			set_input_value(input, /*value*/ ctx[0]);
    			append_dev(form, t);
    			if (if_block) if_block.m(form, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[6]),
    					listen_dev(input, "keydown", /*handleKeydown*/ ctx[5], false, false, false),
    					listen_dev(form, "click", /*click_handler*/ ctx[7], false, false, false),
    					action_destroyer(clickOutside_action = clickOutside.call(null, form, /*clickOutside_function*/ ctx[8]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*height*/ 2) {
    				set_style(input, "--height", /*height*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			if (/*isClicked*/ ctx[4]) {
    				if (if_block) {
    					if (dirty & /*isClicked*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(form, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*width*/ 8) {
    				set_style(form, "--width", /*width*/ ctx[3]);
    			}

    			if (!current || dirty & /*containerHeight*/ 4) {
    				set_style(form, "--c_height", /*containerHeight*/ ctx[2]);
    			}

    			if (clickOutside_action && is_function(clickOutside_action.update) && dirty & /*isClicked*/ 16) clickOutside_action.update.call(null, /*clickOutside_function*/ ctx[8]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PgSearch', slots, []);
    	let { height = "32px" } = $$props;
    	let { containerHeight = "48px" } = $$props;
    	let { width = "340px" } = $$props;
    	let isClicked = false;
    	let { value = "" } = $$props;

    	const handleKeydown = e => {
    		if (e.key === "enter") {
    			console.log("엔터");
    		}
    	};

    	const writable_props = ['height', 'containerHeight', 'width', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<PgSearch> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	const click_handler = () => $$invalidate(4, isClicked = true);
    	const clickOutside_function = () => $$invalidate(4, isClicked = false);

    	$$self.$$set = $$props => {
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('containerHeight' in $$props) $$invalidate(2, containerHeight = $$props.containerHeight);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		clickOutside,
    		SearchHistorys,
    		height,
    		containerHeight,
    		width,
    		isClicked,
    		value,
    		handleKeydown
    	});

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('containerHeight' in $$props) $$invalidate(2, containerHeight = $$props.containerHeight);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('isClicked' in $$props) $$invalidate(4, isClicked = $$props.isClicked);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		height,
    		containerHeight,
    		width,
    		isClicked,
    		handleKeydown,
    		input_input_handler,
    		click_handler,
    		clickOutside_function
    	];
    }

    class PgSearch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			height: 1,
    			containerHeight: 2,
    			width: 3,
    			value: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PgSearch",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get height() {
    		throw new Error("<PgSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<PgSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerHeight() {
    		throw new Error("<PgSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerHeight(value) {
    		throw new Error("<PgSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<PgSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<PgSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<PgSearch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<PgSearch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const PUBG_MUSTARD = "#c9760e";

    /* src\components\Header.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\components\\Header.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (10:4) {#each tabs as tab}
    function create_each_block$2(ctx) {
    	let li;
    	let t_value = /*tab*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "" + (null_to_empty(/*currentTab*/ ctx[1] === /*tab*/ ctx[2] && "selectedTab") + " svelte-zi48k5"));
    			add_location(li, file$3, 10, 6, 337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(10:4) {#each tabs as tab}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let ul;
    	let t;
    	let pgsearch;
    	let current;
    	let each_value = /*tabs*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	pgsearch = new PgSearch({ props: { value: "" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			create_component(pgsearch.$$.fragment);
    			attr_dev(ul, "class", "svelte-zi48k5");
    			add_location(ul, file$3, 7, 2, 251);
    			attr_dev(div, "class", "wrapper svelte-zi48k5");
    			set_style(div, "--background-color", PUBG_MUSTARD);
    			add_location(div, file$3, 6, 0, 184);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div, t);
    			mount_component(pgsearch, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currentTab, tabs*/ 3) {
    				each_value = /*tabs*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pgsearch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pgsearch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			destroy_component(pgsearch);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const tabs = ["홈", "랭킹", "커뮤니티"];
    	let currentTab = "홈";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ PgSearch, PUBG_MUSTARD, tabs, currentTab });

    	$$self.$inject_state = $$props => {
    		if ('currentTab' in $$props) $$invalidate(1, currentTab = $$props.currentTab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tabs, currentTab];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\HomeBanner.svelte generated by Svelte v3.46.4 */

    const file$2 = "src\\components\\HomeBanner.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-e15ice");
    			add_location(div, file$2, 2, 0, 31);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HomeBanner', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HomeBanner> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class HomeBanner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeBanner",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\LeaderBoard.svelte generated by Svelte v3.46.4 */

    const file$1 = "src\\components\\LeaderBoard.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (13:6) {#each platformList as platform}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*platform*/ ctx[9] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*platform*/ ctx[9];
    			option.value = option.__value;
    			add_location(option, file$1, 13, 8, 317);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(13:6) {#each platformList as platform}",
    		ctx
    	});

    	return block;
    }

    // (24:4) {#each matchTypes as matchType}
    function create_each_block$1(ctx) {
    	let button;
    	let t_value = /*matchType*/ ctx[6] + "";
    	let t;
    	let button_class_value;
    	let button_onclick_value;

    	function func() {
    		return /*func*/ ctx[5](/*matchType*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);

    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*selectedMatchType*/ ctx[1] === /*matchType*/ ctx[6]
    			? "selectedType"
    			: "matchType") + " svelte-15xkjb4"));

    			attr_dev(button, "onclick", button_onclick_value = func);
    			add_location(button, file$1, 24, 6, 577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*selectedMatchType*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*selectedMatchType*/ ctx[1] === /*matchType*/ ctx[6]
    			? "selectedType"
    			: "matchType") + " svelte-15xkjb4"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*selectedMatchType*/ 2 && button_onclick_value !== (button_onclick_value = func)) {
    				attr_dev(button, "onclick", button_onclick_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(24:4) {#each matchTypes as matchType}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let section0;
    	let select;
    	let t2;
    	let form;
    	let input;
    	let t3;
    	let span;
    	let t5;
    	let section1;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*platformList*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*matchTypes*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "리더보드";
    			t1 = space();
    			section0 = element("section");
    			select = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			form = element("form");
    			input = element("input");
    			t3 = space();
    			span = element("span");
    			span.textContent = "FPP";
    			t5 = space();
    			section1 = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h3, "class", "svelte-15xkjb4");
    			add_location(h3, file$1, 8, 2, 178);
    			attr_dev(select, "class", "svelte-15xkjb4");
    			if (/*selected*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[4].call(select));
    			add_location(select, file$1, 11, 4, 237);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-15xkjb4");
    			add_location(input, file$1, 17, 6, 441);
    			add_location(span, file$1, 18, 6, 474);
    			attr_dev(form, "method", "get");
    			attr_dev(form, "class", "checkBox svelte-15xkjb4");
    			add_location(form, file$1, 16, 4, 397);
    			attr_dev(section0, "class", "button_container svelte-15xkjb4");
    			add_location(section0, file$1, 10, 2, 197);
    			add_location(section1, file$1, 22, 2, 523);
    			add_location(div, file$1, 7, 0, 169);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, section0);
    			append_dev(section0, select);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select, null);
    			}

    			select_option(select, /*selected*/ ctx[0]);
    			append_dev(section0, t2);
    			append_dev(section0, form);
    			append_dev(form, input);
    			append_dev(form, t3);
    			append_dev(form, span);
    			append_dev(div, t5);
    			append_dev(div, section1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section1, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*platformList*/ 4) {
    				each_value_1 = /*platformList*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*selected, platformList*/ 5) {
    				select_option(select, /*selected*/ ctx[0]);
    			}

    			if (dirty & /*selectedMatchType, matchTypes*/ 10) {
    				each_value = /*matchTypes*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LeaderBoard', slots, []);
    	const platformList = ["Steam", "KAKAO"];
    	const matchTypes = ["경쟁전", "경쟁전 솔로"];
    	let selected = "Steam";
    	let selectedMatchType = "경쟁전";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LeaderBoard> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		selected = select_value(this);
    		$$invalidate(0, selected);
    		$$invalidate(2, platformList);
    	}

    	const func = matchType => $$invalidate(1, selectedMatchType = matchType);

    	$$self.$capture_state = () => ({
    		platformList,
    		matchTypes,
    		selected,
    		selectedMatchType
    	});

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('selectedMatchType' in $$props) $$invalidate(1, selectedMatchType = $$props.selectedMatchType);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selected,
    		selectedMatchType,
    		platformList,
    		matchTypes,
    		select_change_handler,
    		func
    	];
    }

    class LeaderBoard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LeaderBoard",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\index.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file = "src\\pages\\index.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (34:2) {:else}
    function create_else_block(ctx) {
    	let ul;
    	let each_value = /*$todos*/ ctx[0].data.pokemons.results;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file, 34, 4, 784);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$todos*/ 1) {
    				each_value = /*$todos*/ ctx[0].data.pokemons.results;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(34:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:25) 
    function create_if_block_1(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*$todos*/ ctx[0].error.message + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Oh no... ");
    			t1 = text(t1_value);
    			attr_dev(p, "class", "svelte-aehuqf");
    			add_location(p, file, 32, 4, 729);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$todos*/ 1 && t1_value !== (t1_value = /*$todos*/ ctx[0].error.message + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(32:25) ",
    		ctx
    	});

    	return block;
    }

    // (30:2) {#if $todos.fetching}
    function create_if_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading...";
    			attr_dev(p, "class", "svelte-aehuqf");
    			add_location(p, file, 30, 4, 679);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(30:2) {#if $todos.fetching}",
    		ctx
    	});

    	return block;
    }

    // (36:6) {#each $todos.data.pokemons.results as todo}
    function create_each_block(ctx) {
    	let li;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t_value = /*todo*/ ctx[2].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			img = element("img");
    			t = text(t_value);
    			if (!src_url_equal(img.src, img_src_value = /*todo*/ ctx[2].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*todo*/ ctx[2].name);
    			add_location(img, file, 36, 12, 854);
    			add_location(li, file, 36, 8, 850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, img);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$todos*/ 1 && !src_url_equal(img.src, img_src_value = /*todo*/ ctx[2].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*$todos*/ 1 && img_alt_value !== (img_alt_value = /*todo*/ ctx[2].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*$todos*/ 1 && t_value !== (t_value = /*todo*/ ctx[2].name + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(36:6) {#each $todos.data.pokemons.results as todo}",
    		ctx
    	});

    	return block;
    }

    // (42:2) <HomeBanner>
    function create_default_slot(ctx) {
    	let p;
    	let t1;
    	let h1;
    	let t3;
    	let span;
    	let t5;
    	let section;
    	let pgsearch;
    	let current;

    	pgsearch = new PgSearch({
    			props: {
    				width: "624px",
    				height: "50px",
    				containerHeight: "50px"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "안녕 우리는 베그 전적 검색 사이트를 만들고 있다.";
    			t1 = space();
    			h1 = element("h1");
    			h1.textContent = "pubg.gg";
    			t3 = space();
    			span = element("span");
    			span.textContent = "searching your history";
    			t5 = space();
    			section = element("section");
    			create_component(pgsearch.$$.fragment);
    			attr_dev(p, "class", "svelte-aehuqf");
    			add_location(p, file, 42, 4, 981);
    			attr_dev(h1, "class", "svelte-aehuqf");
    			add_location(h1, file, 43, 4, 1022);
    			add_location(span, file, 44, 4, 1044);
    			attr_dev(section, "class", "search_wrapper svelte-aehuqf");
    			add_location(section, file, 45, 4, 1085);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, span, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, section, anchor);
    			mount_component(pgsearch, section, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pgsearch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pgsearch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(section);
    			destroy_component(pgsearch);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(42:2) <HomeBanner>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t0;
    	let t1;
    	let main;
    	let t2;
    	let header;
    	let t3;
    	let homebanner;
    	let t4;
    	let section;
    	let leaderboard;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*$todos*/ ctx[0].fetching) return create_if_block;
    		if (/*$todos*/ ctx[0].error) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);
    	header = new Header({ $$inline: true });

    	homebanner = new HomeBanner({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	leaderboard = new LeaderBoard({ $$inline: true });

    	const block = {
    		c: function create() {
    			t0 = space();
    			t1 = space();
    			main = element("main");
    			if_block.c();
    			t2 = space();
    			create_component(header.$$.fragment);
    			t3 = space();
    			create_component(homebanner.$$.fragment);
    			t4 = space();
    			section = element("section");
    			create_component(leaderboard.$$.fragment);
    			document.title = "베그 전적검색";
    			attr_dev(section, "class", "main_contents svelte-aehuqf");
    			add_location(section, file, 49, 2, 1225);
    			attr_dev(main, "class", "svelte-aehuqf");
    			add_location(main, file, 28, 0, 642);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			if_block.m(main, null);
    			append_dev(main, t2);
    			mount_component(header, main, null);
    			append_dev(main, t3);
    			mount_component(homebanner, main, null);
    			append_dev(main, t4);
    			append_dev(main, section);
    			mount_component(leaderboard, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(main, t2);
    				}
    			}

    			const homebanner_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				homebanner_changes.$$scope = { dirty, ctx };
    			}

    			homebanner.$set(homebanner_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(homebanner.$$.fragment, local);
    			transition_in(leaderboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(homebanner.$$.fragment, local);
    			transition_out(leaderboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			if_block.d();
    			destroy_component(header);
    			destroy_component(homebanner);
    			destroy_component(leaderboard);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $todos;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pages', slots, []);

    	const todos = operationStore(`
  query{
  pokemons(limit:50){
    count
    next
    results{
      image
      name
    }
  }
}
  `);

    	validate_store(todos, 'todos');
    	component_subscribe($$self, todos, value => $$invalidate(0, $todos = value));
    	query(todos);
    	console.log(todos);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Pages> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		operationStore,
    		query,
    		Header,
    		HomeBanner,
    		LeaderBoard,
    		PgSearch,
    		todos,
    		$todos
    	});

    	return [$todos, todos];
    }

    class Pages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pages",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const routes = {
        "/": Pages,
    };

    /* src\App.svelte generated by Svelte v3.46.4 */

    function create_fragment(ctx) {
    	let router;
    	let current;
    	router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	initClient({
    		url: "https://graphql-pokeapi.graphcdn.app/"
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Router, routes, initClient });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            title: "이삼이 베그 전적검색",
        },
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
