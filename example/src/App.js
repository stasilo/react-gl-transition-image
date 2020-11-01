import React from 'react';

import ReactGlTransitionImage, {
    glitchTransition,
    polkaTransition,
    noiseSwirlsTransition
} from 'react-gl-transition-image';

import { useInView } from 'react-intersection-observer';
import { Spring } from 'react-spring/renderprops';

import './index.css';

const cat2 = '/img/cat2.png';
const cat3 = '/img/cat3.jpg';
const mask = '/img/mask.png';

const GlFadeInImage = ({ src, textures = [], mask = null, transition, transitionAlpha = false }) => {
    const [ref, inView] = useInView({
        // rootMargin: '0px 0px 0px 0px',
        threshold: 0,
        triggerOnce: true
    });

    const mapRange = (inMin, inMax, outMin, outMax, v) =>
        (v - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

    return (
        <Spring
            to={{ progress: inView ? 1 : 0 }}

            config={{
                tension: 180,
                friction: 35,
                clamp: true
            }}
        >
            {animProps =>
                <ReactGlTransitionImage
                    className="FadeInImage"
                    ref={ref}
                    src={src}

                    mask={mask}
                    textures={textures}

                    transition={transition}
                    transitionAlpha={transitionAlpha}

                    progress={animProps.progress}
                    style={{
                        transform: `scale(${mapRange(0, 1, 0.85, 1, animProps.progress)})`,
                    }}
                />
            }
        </Spring>
    );
};

const App = () => {
    return (
        <>
            <GlFadeInImage
                src={cat2}
            />
            <GlFadeInImage
                src={cat3}
                mask={mask}
            />
            <GlFadeInImage
                src={cat2}
                transition={glitchTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={polkaTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={noiseSwirlsTransition}
            />


            <GlFadeInImage
                src={cat2}
            />
            <GlFadeInImage
                src={cat3}
                mask={mask}
            />
            <GlFadeInImage
                src={cat2}
                transition={glitchTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={polkaTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={noiseSwirlsTransition}
            />


            <GlFadeInImage
                src={cat2}
            />
            <GlFadeInImage
                src={cat3}
                mask={mask}
            />
            <GlFadeInImage
                src={cat2}
                transition={glitchTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={polkaTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={noiseSwirlsTransition}
            />



            <GlFadeInImage
                src={cat2}
            />
            <GlFadeInImage
                src={cat3}
                mask={mask}
            />
            <GlFadeInImage
                src={cat2}
                transition={glitchTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={polkaTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={noiseSwirlsTransition}
            />


            <GlFadeInImage
                src={cat2}
            />
            <GlFadeInImage
                src={cat3}
                mask={mask}
            />
            <GlFadeInImage
                src={cat2}
                transition={glitchTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={polkaTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={noiseSwirlsTransition}
            />


            <GlFadeInImage
                src={cat2}
            />
            <GlFadeInImage
                src={cat3}
                mask={mask}
            />
            <GlFadeInImage
                src={cat2}
                transition={glitchTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={polkaTransition}
            />
            <GlFadeInImage
                src={cat2}
                transition={noiseSwirlsTransition}
            />
        </>
    );
}


export default App;
