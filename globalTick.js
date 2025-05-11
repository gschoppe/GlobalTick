/**
 * A singleton class that replaces setTimeout and setInterval with more reliable timing.
 * @extends {EventTarget}
 */
export default class GlobalTick extends EventTarget {
  static instance;
  #intervals = {};
  #nextTick;
  #start;

  /**
   * @returns {GlobalTick} the singleton instance.
   */
  constructor() {
    if (GlobalTick.instance) {
      return GlobalTick.instance;
    }
    GlobalTick.instance = this;
    this.#start = performance.now();
    this.#tick();
  }

  /**
   * Alternative to setTimeout with more reliable timing.
   * @param {function} callback - The function to call.
   * @param {number} timeout - The timeout in milliseconds.
   * @returns {string} the handle for this timeout.
   */
  setTimeout(callback, timeout) {
    const uuid = crypto.randomUUID();
    this.#intervals[uuid] = {
      timeout,
      callback,
      lastRun: performance.now(),
      repeat: false
    };
    return uuid;
  }

  /**
   * Remove a timeout.
   * @param {string} uuid - The handle for the timeout.
   */
  clearTimeout(uuid) {
    delete this.#intervals[uuid];
  }

  /**
   * Alternative to setInterval with more reliable timing.
   * @param {function} callback - The function to call.
   * @param {number} interval - The interval in milliseconds.
   * @returns {string} the handle for this interval.
   */
  setInterval(callback, interval) {
    const uuid = crypto.randomUUID();
    this.#intervals[uuid] = {
      interval,
      callback,
      lastRun: performance.now(),
      repeat: true
    };
    return uuid;
  }

  /**
   * Remove an interval.
   * @param {string} uuid - The handle for the interval.
   */
  removeInterval(uuid) {
    delete this.#intervals[uuid];
  }

  #tick() {
    this.dispatchEvent(new CustomEvent("TICK", {detail: {
      elapsedTime: performance.now() - this.#start
    }}));

    for (const uuid in this.#intervals) {
      const interval = this.#intervals[uuid];
      if (performance.now() - interval.lastRun >= interval.interval) {
        interval.callback();
        interval.lastRun = performance.now();
        if (!interval.repeat) {
          delete this.#intervals[uuid];
        }
      }
    }

    if (window.requestAnimationFrame) {
      this.#nextTick = requestAnimationFrame(()=>{this.tick();});
    } else {
      this.#nextTick = setTimeout(()=>{this.tick();}, 1000/60);
    }
  }
}

window.GlobalTick = new GlobalTick;
