# react-gl-transition-image

> Lazy load & transition your React images with some WebGL goodieness  🖼️ 🎨🎉
> - Easy to use
> - Offers 7 different transitions out the box
> - Gives you the ability to easily port any transition from https://gl-transitions.com/.

## Install

```bash
npm install --save react-gl-transition-image
```

## Live demo


## Usage
`<ReactGlTransitionImage/>` in its most simple form accepts a `src` and `progress` prop. How the actual animation is handled is up to you, but I do recommend using the lovely [react-spring](https://www.react-spring.io/) library.


```jsx

// App.jsx

import GlFadeInImage from './GlFadeInImage';

const App = () => {
    const imgSrc = '/img/cat2.png';
    return (
        <div>
            <GlFadeInImage src={imgSrc} />
        </div>
    );
};

// GlFadeInImage.jsx

import React from 'react';
import ReactGlTransitionImage from 'react-gl-transition-image';

import { useInView } from 'react-intersection-observer';
import { Spring } from 'react-spring/renderprops';

import './index.css';

const GlFadeInImage = ({ src }) => {
    const [ref, inView] = useInView({
        threshold: 0,
        triggerOnce: true
    });

    return (
        <div className="image">
            <Spring
                config={{
                    tension: 180,
                    friction: 45,
                    clamp: true
                }}
                to={{ fadeProgress: inView ? 1 : 0 }}
            >
                {animProps =>
                    <ReactGlTransitionImage
                        ref={ref}
                        src={src}
                        progress={animProps.fadeProgress}
                    />
                }
            </Spring>
        </div>
    );
};
```

## License

MIT © [stasilo](https://github.com/stasilo)
