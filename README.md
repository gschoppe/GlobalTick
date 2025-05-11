# GlobalTick
A requestAnimationFrame-based replacement for setTimeout and setInterval with better idle behavior

*Note: GlobalTick is not optimized for high-resolution timing tasks, such as music synchronization.*

## Problems with `setTimeout()` and `setInterval()`
1. The default timing functions are throttled for many reasons, often causing significant delays.
2. The maximum resolution (1ms) of the timeout or interval can significantly overtax CPUs
3. When an interval runs in a throttled state it builds up a backlog of calls to the callback function, which can fire all at once, when returning from a throttled state, often causing CPU issues or unnecessary resource heavy repeated logic calls.
4. Errors in timing accumulate over time with the traditional timing functions.

## How we improved on the original
1. Our timers are based on `RequestAnimationFrame`, which is less susceptible to idle throttling.
2. Timer events are fired before each redraw which, while technically less accurate, syncronizes changes to screen redraws, reducing unneccessary calculations.
3. Our intervals are recursively triggered, preventing a buildup of a back-log of interval cycles.
4. Our interval timing is recalculated each cycle from the original timestamp. this means that while individual intervals may be inaccurate, the inaccuracies will not compound over time.

## Usage

### Create a one second timeout

```javascript
const gt = new GlobalTick();
const handle = gt.setTimeout(()=>{
  console.log("Timeout Reached");
}, 1000);
```

### Cancel a timeout

```javascript
const gt = new GlobalTick();
gt.clearTimeout(handle);
```

### Create a one second interval

```javascript
const gt = new GlobalTick();
const handle = gt.setInterval(()=>{
  console.log("Interval Fired");
}, 1000);
```

### Cancel an interval

```javascript
const gt = new GlobalTick();
gt.clearInterval(handle);
```
