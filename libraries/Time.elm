-- Library for working with time. Type `Time` represents some number of milliseconds.
module Time where

import Native.Time as T

-- Type alias to make it clearer when you are working with time values.
-- Using the `Time` constants instead of raw numbers is very highly recommended.
type Time = Float

-- Units of time, making it easier to specify things like a
-- half-second `(500 * milliseconds)` without remembering Elm&rsquo;s
-- underlying units of time.
millisecond : Time
millisecond = 1

second : Time
second = 1000 * millisecond

minute : Time
minute = 60 * second

hour : Time
hour = 60 * minute

inMilliseconds : Time -> Float
inMilliseconds t = t

inSeconds : Time -> Float
inSeconds t = t / second

inMinutes : Time -> Float
inMinutes t = t / minute

inHours : Time -> Float
inHours t = t / hour

-- Takes desired number of frames per second (fps). The resulting signal
-- gives a sequence of time deltas as quickly as possible until it reaches
-- the desired FPS. A time delta is the time between the last frame and the
-- current frame.
fps : Number a -> Signal Time

-- Same as the fps function, but you can turn it on and off. Allows you
-- to do brief animations based on user input without major inefficiencies.
-- The first time delta after a pause is always zero, no matter how long
-- the pause was. This way summing the deltas will actually give the amount
-- of time that the output signal has been running.
fpsWhen : Number a -> Signal Bool -> Signal Time

-- Takes a time interval t. The resulting signal is the current time,
-- updated every t.
every : Time -> Signal Time

-- Takes a time `t` and any signal. The resulting boolean signal
-- is true for time `t` after every event on the input signal.
-- So ``(second `since` Mouse.clicks)`` would result in a signal
-- that is true for one second after each mouse click and false
-- otherwise.
since : Time -> Signal a -> Signal Bool

-- Add a timestamp to any signal. Timestamps increase monotonically. Each
-- timestamp is related to a specfic event, so `Mouse.x` and `Mouse.y` will
-- always have the same timestamp because they both rely on the same
-- underlying event.
timestamp : Signal a -> Signal (Time, a)

-- Delay a signal by a certain amount of time. So `(delay second Mouse.clicks)`
-- will update one second later than any mouse click.
delay : Time -> Signal a -> Signal a
