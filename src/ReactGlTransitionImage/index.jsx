import React from 'react';
import PropTypes from 'prop-types';

import _regl from 'regl';
import useResizeObserver from 'use-resize-observer';

import blobbyTransition from '../transitions/blobby.glsl';
import maskTransition from '../transitions/mask.glsl';

const ReactGlTransitionImage = React.forwardRef((props, ref) => {
    const {
        className,
        src,
        progress,
        onAssetsLoaded,
        style,
        transition,
        transitionAlpha,
        textures,
        mask,
    } = props;

    const transitionSrc = mask
        ? maskTransition
        : transition;

    const textureUrls = React.useMemo(() => (
        mask
            ? [...textures, mask]
            : textures
    ), [mask, textures]);

    const reglInstance = React.useRef(null);
    const canvasRef = React.useRef(null);

    const [reglReady, setReglReady] = React.useState(false);
    const [renderCalls, setRenderCalls] = React.useState(null);
    const [imageData, setImageData] = React.useState({
        image: null,
        textures: [],
    });

    const dimRef = React.useRef(null);
    const wrapDimensions = useResizeObserver({ ref: dimRef });

    const seed = React.useMemo(() => Math.random() * 1000, []);

    // load image & optional texture data

    React.useEffect(() => {
        (async () => {
            const mainImagePromise = new Promise((resolve) => {
                const image = new Image();
                image.onload = () => {
                    resolve(image);
                };

                image.src = src;
            });

            let texturePromises = [];
            if (textureUrls.length > 0) {
                texturePromises = textureUrls.map((texture) => new Promise((resolve) => {
                    const textureImage = new Image();
                    textureImage.onload = () => {
                        resolve(textureImage);
                    };

                    textureImage.src = texture;
                }));
            }

            const [image, ...textureData] = await Promise.all([
                mainImagePromise,
                ...texturePromises,
            ]);

            setImageData({
                image,
                textures: textureData,
            });

            onAssetsLoaded();
        })();
    }, [src, textureUrls, onAssetsLoaded]);

    // construct regl instance (& webgl context) once progress > 0
    // (otherwise, having many images, we'll hit the max amount of simultaneous gl contexts)

    React.useEffect(() => {
        if (reglReady || !imageData.image
            || progress === 0 || progress >= 1) {
            return;
        }

        const gl = canvasRef.current.getContext('webgl', {
            alpha: true,
            antialias: true,
            stencil: false,
            preserveDrawingBuffer: false,
        });

        reglInstance.current = _regl({ gl });
        setReglReady(true);
    }, [reglReady, imageData, progress]);

    // construct regl draw calls

    React.useEffect(() => {
        if (!reglReady || !imageData.image) {
            return;
        }

        const regl = reglInstance.current;

        const imageTexture = regl.texture({
            data: imageData.image,
            flipY: true,
        });

        const formattedTextures = imageData.textures
            .reduce((texObj, texture, i) => ({
                ...texObj,
                [`textures[${i}]`]: regl.texture({
                    data: texture,
                    flipY: true,
                }),
            }), {});

        const textureResolutions = imageData.textures
            .reduce((resObj, texture, i) => ({
                ...resObj,
                [`textureResolutions[${i}]`]: [
                    texture.width,
                    texture.height,
                ],
            }), {});

        const drawImage = regl({
            frag: `
                precision highp float;

                uniform sampler2D image;
                uniform vec2 resolution;
                uniform vec2 imageResolution;
                uniform float progress, seed;

                ${imageData.textures.length > 0 ? `
                    uniform sampler2D textures[${imageData.textures.length}];
                    uniform vec2 textureResolutions[${imageData.textures.length}];
                ` : ''}

                varying vec2 uv;

                // draw image using "background-size: cover"-ish fill
                // https://gist.github.com/statico/df64c5d167362ecf7b34fca0b1459a44
                vec2 convertToCoverUvs(vec2 uv, vec2 imageRes) {
                    vec2 s = resolution; // screen
                    vec2 i = imageRes; // image

                    float rs = s.x / s.y;
                    float ri = i.x / i.y;

                    vec2 new = rs < ri
                        ? vec2(i.x * s.y / i.y, s.y)
                        : vec2(s.x, i.y * s.x / i.x);

                    vec2 offset = rs < ri
                        ? vec2((new.x - s.x) / 2.0, 0.0) / new
                        : vec2(0.0, (new.y - s.y) / 2.0) / new;

                    vec2 uw = uv * s / new + offset;

                    return uw;
                }

                vec4 getFromColor(vec2 st) {
                    return vec4(0.);
                }

                vec4 getToColor(vec2 uv) {
                    vec2 uw = convertToCoverUvs(uv, imageResolution);
                    return texture2D(image, uw);
                }

                ${transitionSrc}

                void main () {
                    gl_FragColor = transition(uv);
                    ${transitionAlpha ? 'gl_FragColor.a = progress;' : ''}
                }
            `,
            vert: `
                precision highp float;

                attribute vec2 position;
                uniform vec2 resolution;
                varying vec2 uv;

                void main () {
                    uv = 1. - position;
                    gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
                }
            `,
            attributes: {
                position: [
                    -2, 0,
                    0, -2,
                    2, 2,
                ],
            },
            uniforms: {
                progress: regl.prop('progress'),
                resolution: regl.prop('resolution'),
                seed,
                image: imageTexture,
                imageResolution: [
                    imageData.image.width,
                    imageData.image.height,
                ],
                ...textureResolutions,
                ...formattedTextures,
            },
            // https://stackoverflow.com/questions/45066688/blending-anti-aliased-circles-with-regl/45071910#45071910
            blend: {
                enable: true,
                func: {
                    srcRGB: 'src alpha',
                    srcAlpha: 'src alpha',
                    dstRGB: 'one minus src alpha',
                    dstAlpha: 'one minus src alpha',
                },
            },
            depth: { enable: false },
            count: 3,
        });

        setRenderCalls({ drawImage });
    }, [reglReady, imageData, seed, transitionAlpha, transitionSrc]);

    // render

    React.useEffect(() => {
        if (!reglReady || !renderCalls || progress === 0) {
            return;
        }

        const regl = reglInstance.current;

        regl.clear({
            color: [0, 0, 0, 0],
            depth: 1,
        });

        renderCalls.drawImage({
            progress,
            resolution: [
                wrapDimensions.width,
                wrapDimensions.height,
            ],
        });

        if (regl && progress >= 1) {
            regl.destroy();
            reglInstance.current = null;
            setReglReady(false);
        }
    }, [reglReady, renderCalls, progress, wrapDimensions]);

    // styles

    const wrapperStyles = {
        position: 'relative',
        width: '100%',
        height: '100%',
        ...style,
    };

    const canvasWrapperStyles = {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
    };

    const regularBgStyles = {
        position: 'absolute',
        top: '0',
        left: '0',

        width: '100%',
        height: '100%',

        backgroundImage: `url('${src}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div
            className={className}
            style={wrapperStyles}
            ref={dimRef}
        >
            {progress <= 1 && (
                <div
                    ref={ref}
                    style={canvasWrapperStyles}
                >
                    <canvas
                        ref={canvasRef}
                        width={wrapDimensions.width}
                        height={wrapDimensions.height}
                    />
                </div>
            )}
            {progress >= 1 && (
                <div
                    style={regularBgStyles}
                />
            )}
        </div>
    );
});

ReactGlTransitionImage.propTypes = {
    src: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    onAssetsLoaded: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.string),
    transition: PropTypes.string,
    transitionAlpha: PropTypes.bool,
    textures: PropTypes.arrayOf(PropTypes.string),
    mask: PropTypes.string,
};

ReactGlTransitionImage.defaultProps = {
    className: '',
    style: {},
    onAssetsLoaded: () => {},
    transition: blobbyTransition,
    transitionAlpha: false,
    textures: [],
    mask: null,
};

export default ReactGlTransitionImage;
