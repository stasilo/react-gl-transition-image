import React from 'react';

import ReactGlTransitionImage, {
    glitchTransition,
    polkaTransition,
    noiseSwirlsTransition,
    blurTransition,
    waterTransition,
} from 'react-gl-transition-image';

import { useInView } from 'react-intersection-observer';
import { Spring } from 'react-spring/renderprops';

import './index.css';

import cat2Src from './assets/img/cat2.png';
import cat3Src from './assets/img/cat3.jpg';
import maskSrc from './assets/img/mask.png';

const GlFadeInImage = ({ src, textures, mask, transition }) => {
    const [ref, inView] = useInView({
        threshold: 0,
        triggerOnce: true
    });

    const [assetsLoaded, setAssetsLoaded] = React.useState(false);
    const onAssetsLoaded = React.useCallback(() => setAssetsLoaded(true), [setAssetsLoaded]);

    const active = inView && assetsLoaded;

    return (
        <div className="image">
            <Spring
                config={{
                    tension: 180,
                    friction: 45,
                    clamp: true
                }}
                to={{
                    fadeProgress: active ? 1 : 0,
                    scale: active ? 1 : 0.9,
                    yPos: active ? 0 : 80
                }}
            >
                {animProps =>
                    <ReactGlTransitionImage
                        ref={ref}
                        src={src}
                        onAssetsLoaded={onAssetsLoaded}

                        mask={mask}
                        textures={textures}
                        transition={transition}

                        progress={animProps.fadeProgress}
                        style={{
                            transform: `scale(${animProps.scale}) translate3d(0, ${animProps.yPos}px, 0)`
                        }}
                    />
                }
            </Spring>
        </div>
    );
};

const App = () => {
    return (
        <>
            {[...Array(2)].map((_, i) =>
                <div
                    className="wrapper"
                    key={i}
                >
                    <h2>Default transition</h2>
                    <GlFadeInImage
                        src={cat2Src}
                    />

                    <h2>Water</h2>
                    <GlFadeInImage
                        src={cat3Src}
                        transition={waterTransition}
                    />

                    <h2>Blur</h2>
                    <GlFadeInImage
                        src={cat3Src}
                        transition={blurTransition}
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
