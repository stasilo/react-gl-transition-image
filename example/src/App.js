import React from 'react';

import ReactGlTransitionImage, {
    glitchTransition,
    polkaTransition,
    noiseSwirlsTransition
} from 'react-gl-transition-image';

import { useInView } from 'react-intersection-observer';
import { Spring } from 'react-spring/renderprops';

import './index.css';

const GlFadeInImage = ({ src, textures, mask, transition }) => {
    const [ref, inView] = useInView({
        threshold: 0,
        triggerOnce: true
    });

    return (
        <div className="image">
            <Spring
                config={{
                    tension: 180,
                    friction: 35,
                    clamp: true
                }}
                to={{
                    fadeProgress: inView ? 1 : 0,
                    scale: inView ? 1 : 0.85
                }}
            >
                {animProps =>
                    <ReactGlTransitionImage
                        ref={ref}
                        src={src}

                        mask={mask}
                        textures={textures}
                        transition={transition}

                        progress={animProps.fadeProgress}
                        style={{
                            transform: `scale(${animProps.scale})`
                        }}
                    />
                }
            </Spring>
        </div>
    );
};

const App = () => {
    const cat2Src = '/img/cat2.png';
    const cat3Src = '/img/cat3.jpg';
    const maskSrc = '/img/mask.png';

    return (
        <>
            {[...Array(5)].map((_, i) =>
                <div
                    className="wrapper"
                    key={i}
                >
                    <h2>Default transition</h2>
                    <GlFadeInImage
                        src={cat2Src}
                    />

                    <h2>Image mask</h2>
                    <GlFadeInImage
                        src={cat3Src}
                        mask={maskSrc}
                    />

                    <h2>Glitch</h2>
                    <GlFadeInImage
                        src={cat2Src}
                        transition={glitchTransition}
                    />

                    <h2>Polka</h2>
                    <GlFadeInImage
                        src={cat3Src}
                        transition={polkaTransition}
                    />

                    <h2>Noise swirl</h2>
                    <GlFadeInImage
                        src={cat2Src}
                        transition={noiseSwirlsTransition}
                    />
                </div>
            )}
        </>
    );
}

export default App;
