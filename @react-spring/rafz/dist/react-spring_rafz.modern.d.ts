type NativeRaf = (cb: () => void) => void;
interface Timeout {
    time: number;
    handler: () => void;
    cancel: () => void;
}
type AnyFn = (...args: any[]) => any;
type VoidFn = (...args: any[]) => undefined | void;
type Throttled<T extends VoidFn> = T & {
    handler: T;
    cancel: () => void;
};
/**
 * This function updates animation state with the delta time.
 */
type FrameUpdateFn = (dt: number) => boolean | void;
/**
 * Return true to be called again next frame.
 */
type FrameFn = () => boolean | void;
interface Rafz {
    (update: FrameUpdateFn): void;
    /**
     * How should the frameLoop run, when we call .advance or naturally?
     */
    frameLoop: 'always' | 'demand';
    /**
     * Prevent a queued `raf(...)` or `raf.write(...)` call.
     */
    cancel: (fn: AnyFn) => void;
    /**
     * To avoid performance issues, all mutations are batched with this function.
     * If the update loop is dormant, it will be started when you call this.
     */
    write: (fn: FrameFn) => void;
    /**
     * Run a function before updates are flushed.
     */
    onStart: (fn: FrameFn) => void;
    /**
     * Run a function before writes are flushed.
     */
    onFrame: (fn: FrameFn) => void;
    /**
     * Run a function after writes are flushed.
     */
    onFinish: (fn: FrameFn) => void;
    /**
     * Run a function on the soonest frame after the given time has passed,
     * and before any updates on that particular frame.
     */
    setTimeout: (handler: () => void, ms: number) => Timeout;
    /**
     * Any function scheduled within the given callback is run immediately.
     * This escape hatch should only be used if you know what you're doing.
     */
    sync: (fn: () => void) => void;
    /**
     * Wrap a function so its execution is limited to once per frame. If called
     * more than once in a single frame, the last call's arguments are used.
     */
    throttle: <T extends VoidFn>(fn: T) => Throttled<T>;
    /**
     * Override the native `requestAnimationFrame` implementation.
     *
     * You must call this if your environment never defines
     * `window.requestAnimationFrame` for you.
     */
    use: <T extends NativeRaf>(impl: T) => T;
    /**
     * This is responsible for providing the current time,
     * which is used when calculating the elapsed time.
     *
     * It defaults to `performance.now` when it exists,
     * otherwise `Date.now` is used.
     */
    now: () => number;
    /**
     * For update batching in React. Does nothing by default.
     */
    batchedUpdates: (cb: () => void) => void;
    /**
     * The error handler used when a queued function throws.
     */
    catch: (error: Error) => void;
    /**
     * Manual advancement of the frameLoop, calls our update function
     * only if `.frameLoop === 'demand'`
     */
    advance: () => void;
}

/**
 * Schedule an update for next frame.
 * Your function can return `true` to repeat next frame.
 */
declare const raf: Rafz;
/** Tree-shakable state for testing purposes */
declare const __raf: {
    /** The number of pending tasks */
    count(): number;
    /** Whether there's a raf update loop running */
    isRunning(): boolean;
    /** Clear internal state. Never call from update loop! */
    clear(): void;
};

export { FrameFn, FrameUpdateFn, Rafz, Throttled, Timeout, __raf, raf };
