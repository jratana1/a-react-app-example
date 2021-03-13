import React, { Component } from 'react';
import moment from 'moment';
import ExampleComponent from './ExampleComponent'
import TestComponent from './TestComponent'
import Breathe from './breathe'
import { Home } from './breathe'
import {useSpring, animated, interpolate, config} from 'react-spring'
// Add your code own within the return statement

const Fade = () => {
  const props = useSpring({config: config.molasses, reset: true, opacity: 1, from: {opacity: 0}});
  return (<animated.h1 style={props}>I will fade in</animated.h1>)
}

const AniText = ()=> {
  const { o, xyz, color } = useSpring({
    from: { o: 0, xyz: [0, 0, 0], color: 'red' },
    o: 1,
    xyz: [10, 20, 5],
    color: 'green'
  });

  return (<animated.div
    style={{
        // If you can, use plain animated values like always, ...
        // You would do that in all cases where values "just fit"
        color,
        // Unless you need to interpolate them
        background: o.interpolate(o => `rgba(210, 57, 77, ${o})`),
        // Which works with arrays as well
        transform: xyz.interpolate((x, y, z) => `translate3d(${x}px, ${y}px, ${z}px)`),
        // If you want to combine multiple values use the "interpolate" helper
        border: interpolate([o, color], (o, c) => `${o * 10}px solid ${c}`),
        // You can also form ranges, even chain multiple interpolations
        padding: o.interpolate({ range: [0, 0.5, 1], output: [0, 0, 10] }).interpolate(o => `${o}%`),
        // Interpolating strings (like up-front) through ranges is allowed ...
        borderColor: o.interpolate({ range: [0, 1], output: ['red', '#ffaabb'] }),
        // There's also a shortcut for plain, optionless ranges ...
        opacity: o.interpolate([0.1, 0.2, 0.6, 1], [1, 0.1, 0.5, 1])
    }}
  >
    {o.interpolate(n => n.toFixed(2)) /* innerText interpolation ... */}

  </animated.div>)

}

class App extends Component {

  render() {

    return (
      <div className="App">
        <header className="App-header">
          {moment().format('MMMM Do YYYY, hh:mm:ss a')}
          
        </header>
        <Fade />
        <p className="App-intro">
          In React apps, we write JSX - it looks like HTML, and uses a lot of HTML syntax.
          JSX lets us include JavaScript functions right along with the HTML, and also
          allows us to add in components, which are separate, self-contained chunks of JSX.
        </p>
        <Breathe />
        <ExampleComponent />
        <Fade />
      </div>
    );
  }
}

export default App;

import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import './styles.css'

const cards = [
  'https://upload.wikimedia.org/wikipedia/en/f/f5/RWS_Tarot_08_Strength.jpg',
  'https://upload.wikimedia.org/wikipedia/en/5/53/RWS_Tarot_16_Tower.jpg',
  'https://upload.wikimedia.org/wikipedia/en/9/9b/RWS_Tarot_07_Chariot.jpg',
  'https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg',
  'https://upload.wikimedia.org/wikipedia/en/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg',
  'https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg'
]

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function Deck() {
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  const [props, set] = useSprings(cards.length, i => ({ ...to(i), from: from(i) })) // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
    if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    set(i => {
      if (index !== i) return // We're only interested in changing spring-data for the current spring
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    if (!down && gone.size === cards.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
  })
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return props.map(({ x, y, rot, scale }, i) => (
    <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
      <animated.div {...bind(i)} style={{ transform: interpolate([rot, scale], trans), backgroundImage: `url(${cards[i]})` }} />
    </animated.div>
  ))
}

render(<Deck />, document.getElementById('root'))