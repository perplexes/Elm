copy /B ^
 Guid.js+^
 foreign\JavaScript.js+^
 foreign\JSON.js+^
 Value.js+^
 List.js+^
 Maybe.js+^
 Either.js+^
 Char.js+^
 Graphics\Color.js+^
 Graphics\Collage.js+^
 Graphics\Element.js+^
 Text.js+^
 Graphics\Render.js+^
 runtime\Signal.js+^
 runtime\Dispatcher.js+^
 Signal\HTTP.js+^
 Signal\Input.js+^
 Signal\Keyboard.js+^
 Signal\Mouse.js+^
 Signal\Random.js+^
 Signal\Time.js+^
 Signal\Window.js+^
 Date.js+^
 Prelude.js+^
 Signal\Touch.js+^
 Dict.js+^
 Set.js+^
 Automaton.js ^
  ..\elm-mini.js

cd ..\elm

copy /B ..\elm-mini.js elm-runtime-0.7.1.js
