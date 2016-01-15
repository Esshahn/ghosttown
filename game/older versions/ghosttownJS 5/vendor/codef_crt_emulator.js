'use strict'

/*
By Dave Eggleston (frutbunn)  http://frutbunn.tk  frutbunn@gmail.com

A CRT emulator for CODEF Version 0.9!

NOTE: *** DOES NOT SUPPORT PADDING AND OTHER SUCH HTML NONESENSE! ***


This work is licensed under the Creative Commons Attribution 4.0 International License. 
To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/.

(If you need a different copyright to the above one for your project, then please message/email me and I'll duel license it.)
*/


var codefCRTemulator = function() {

	// PRIVATE PROPERTIES:

    var that = this;

    const VERSION = .9;

    const Z_INDEX = "1000";

	var canvas = null;
	var gl = null;

	var state = {
        enabled: false,

        title: null,

		prgCRT: null,
		texture: null,

		sourceCanvas: null,               

        showScanlines: null,

        switches: {
        scanlines: null,
        blurSample: null,
        light: null,
        curvature: null,
        showFPS: null,
        },

		startTime: null,
		fps: 0,
		deltaTime: 0,
		previousTime: 0,
        currentFPS: 0,

		squareVertexBuffer: null,
		squareIndexBuffer: null,

		vertices: [
        	-1.0,1.0,
        	-1.0,-1.0,
        	1.0,-1.0,
        	1.0,1.0],

		indices: [3,2,1,3,1,0],

        responsiveCanvas: {
            elementID: {
                position: null,
            },

            canvas: {
                mainCanvas: null, 
                bar1: null,
                bar2: null,
                bar3: null,
                bar4: null
            }
        },

        shaders: {
            vxShader: null,
            fgShader: null
        },

        color: {
            gamma: null,
            contrast: null,
            saturation: null,
            brightness: null
        }

	}

    var fragmentShader = "\
#ifdef GL_ES \n\
    precision highp float; \n\
#endif \n\
\n\
uniform vec3 iResolution; \n\
uniform float iGlobalTime; \n\
\n\
uniform sampler2D iChannel0; \n\
\n\
uniform float iShowScanlines; \n\
uniform float iBlurSample; \n\
uniform float iLight; \n\
uniform bool iCurvature; \n\
\n\
uniform float iGamma; \n\
uniform float iContrast; \n\
uniform float iSaturation; \n\
uniform float iBrightness; \n\
\n\
// post effects colour correct routine by Dave Hostkins on Shadertoy. \n\
vec3 postEffects(in vec3 rgb, in vec2 xy) { \n\
    rgb = pow(rgb, vec3(iGamma)); \n\
    rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb*iBrightness)), rgb*iBrightness, iSaturation), iContrast); \n\
\n\
    return rgb; \n\
} \n\
\n\
// Sigma 1. Size 3 \n\
vec3 gaussian(in vec2 uv) { \n\
    float b = iBlurSample / (iResolution.x / iResolution.y); \n\
\n\
    uv+= .5; \n\
\n\
    vec3 col = texture2D(iChannel0, vec2(uv.x - b/iResolution.x, uv.y - b/iResolution.y) ).rgb * 0.077847; \n\
    col += texture2D(iChannel0, vec2(uv.x - b/iResolution.x, uv.y) ).rgb * 0.123317; \n\
    col += texture2D(iChannel0, vec2(uv.x - b/iResolution.x, uv.y + b/iResolution.y) ).rgb * 0.077847; \n\
\n\
    col += texture2D(iChannel0, vec2(uv.x, uv.y - b/iResolution.y) ).rgb * 0.123317; \n\
    col += texture2D(iChannel0, vec2(uv.x, uv.y) ).rgb * 0.195346; \n\
    col += texture2D(iChannel0, vec2(uv.x, uv.y + b/iResolution.y) ).rgb * 0.123317; \n\
\n\
    col += texture2D(iChannel0, vec2(uv.x + b/iResolution.x, uv.y - b/iResolution.y) ).rgb * 0.077847; \n\
    col += texture2D(iChannel0, vec2(uv.x + b/iResolution.x, uv.y) ).rgb * 0.123317; \n\
    col += texture2D(iChannel0, vec2(uv.x + b/iResolution.x, uv.y + b/iResolution.y) ).rgb * 0.077847; \n\
\n\
    return col; \n\
} \n\
\n\
void main() { \n\
    vec2 st = (gl_FragCoord.xy / iResolution.xy) - vec2(.5); \n\
\n\
    // Curvature/light \n\
    float d = length(st*.5 * st*.5); \n\
    vec2 uv = st*d + st*.94; \n\
    if (! iCurvature) uv = st; \n\
\n\
    // CRT color blur \n\
    vec3 color = gaussian(uv); \n\
\n\
    // Light \n\
    float l = 1. - min(1., d*iLight); \n\
    color *= l; \n\
\n\
    // Raster lines \n\
    color *= 1. + ( .025 + (floor(mod(gl_FragCoord.x, 2.) ) * (.985-1.025) ) )*iShowScanlines; \n\
    color *= 1. + (-.25 + (floor(mod(gl_FragCoord.y, 2.) ) * (1.25-.75) ) )*iShowScanlines; \n\
\n\
    // Color correction \n\
    color = postEffects(color, uv); \n\
\n\
    // Border mask \n\
    if (iCurvature) { \n\
        float m = max(0.0, 1. - 2.*max(abs(uv.x), abs(uv.y) ) ); \n\
        m = min(m*200., 1.); \n\
        color *= m; \n\
    } \n\
\n\
    gl_FragColor = vec4(min(vec3(1.), color), 1.); \n\
} \n\
"

    var vertexShader = 
"\
    attribute vec2 aVertexPosition; \n\
\n\
    void main(void) { \n\
        gl_Position = vec4(aVertexPosition, 0.0, 1.0); \n\
    } \n\
"

	// PRIVATE METHODS:

    function isEnabled() {
        if (! state.enabled)
            throw new Error("codefCRTemulator.setup has not been called yet, you must call 'setup' before you can call other methods!");
    }

    function addMulitpleEventListeners(node, events, func) {
        for (var i in events)
            node.addEventListener(events[i], func);
    }

    function getVendorSpecificElement(node, elements) {
        for(var i in elements)
            if (typeof node[elements[i]] !== 'undefined')
                return node[elements[i]];

        return undefined;
    }

    function setVendorSpecificElement(value, node, elements) {
        for(var i in elements)
            if (typeof node[elements[i]] !== 'undefined') {
                node[elements[i]] = value;

                return true;
            }

        return false;
    }

    function callVendorSpecificElement(node, elements) {
        for(var i in elements) {
            if (typeof node[elements[i]] !== 'undefined') {
                node[elements[i]]();

                return true;
            }

        }
        return false;
    }

    function isThisACanvasElement(node) {
        var r = false;
        try {
            if (node.tagName == "CANVAS")
                r = true; 
        } catch(e) {};

        return r;
    }

    // TODO: THIS NEEDS TO BE REPLACED...
    function getRandomString() {

        function hashBKDR(str) {
            const SEED = 31;
    
            var h=0;
            for(var i=0; i<str.length; i++)
                h = ( SEED*h + str.charCodeAt(i) ) >>> 0;
    
            return (("00000000" + h.toString(16)).substr(-8)).toUpperCase();
        }

        var number = +new Date(); 
        number += (Math.random() * number) + number;
        number = Math.floor(number).toString();
        number = hashBKDR(number);

        return number;
    }

    function createNewElementID(prefix) {
        return prefix + "-" + getRandomString();
    }

    function createPositionDiv(canvas) {
        var position = document.createElement("div");
        position.id = createNewElementID("codef-crt-emulator-position");

        var parent = canvas.parentNode;
        parent.insertBefore(position, canvas);
        position.appendChild(canvas);

        state.responsiveCanvas.elementID.position = position.id;
    }

    function createBarCanvases() {
        var bar1 = document.createElement("CANVAS");
        var bar2 = document.createElement("CANVAS");
        var bar3 = document.createElement("CANVAS");
        var bar4 = document.createElement("CANVAS");

        state.responsiveCanvas.canvas.bar1 = bar1;
        state.responsiveCanvas.canvas.bar2 = bar2;
        state.responsiveCanvas.canvas.bar3 = bar3;
        state.responsiveCanvas.canvas.bar4 = bar4;

        bar1.width = bar2.width = bar3.width = bar4.width = 16;
        bar1.height = bar2.height = bar3.height = bar4.height = 16;
        bar1.style.display = bar2.style.display = bar3.style.display = bar4.style.display = 'none';
        bar1.style.position = bar2.style.position = bar3.style.position = bar4.style.position = 'fixed';
        bar1.style.left = bar2.style.left = bar3.style.left = bar4.style.left = '0px';
        bar1.style.top = bar2.style.top = bar3.style.top = bar4.style.top = '0px';
        bar1.style.width = bar2.style.width = bar3.style.width = bar4.style.width = '0px';
        bar1.style.height = bar2.style.height = bar3.style.height = bar4.style.height = '0px';
        bar1.className = bar2.className = bar3.className = bar4.className = 'codef-crt-emulator';

        bar1.style.zIndex = bar2.style.zIndex = bar3.style.zIndex = bar4.style.zIndex = Z_INDEX;

        var position = document.getElementById(state.responsiveCanvas.elementID.position);
        position.appendChild(bar1);
        position.appendChild(bar2);
        position.appendChild(bar3);
        position.appendChild(bar4);
    }

    function initializeCanvas(canvas) {
        state.responsiveCanvas.canvas.mainCanvas = canvas;

        createPositionDiv(canvas);
        createBarCanvases();
    }

    function resize() {
        var canvas = state.responsiveCanvas.canvas.mainCanvas;

        var elm = document.getElementById(state.responsiveCanvas.elementID.position);
        var availableWidth = (elm.clientWidth > canvas.width ? canvas.width : elm.offsetWidth) - canvas.clientLeft*2;
        var availableHeight = canvas.height;

        var scale = Number(canvas.height) / Number(canvas.width);

        // Calculate correct aspect ratio:
        var newWidth = availableWidth;
        var newHeight = Math.floor(newWidth*scale);

        if (newHeight > availableHeight) {
            newWidth = (1 / scale) * availableHeight;
            newHeight = availableHeight;
        }

        if (newWidth<canvas.width) showScanlines(false);
        else showScanlines(true);

        canvas.style.width = newWidth + "px";
        canvas.style.height = newHeight + "px";
    }

    function restore() {
        state.responsiveCanvas.canvas.bar1.style.display = state.responsiveCanvas.canvas.bar2.style.display = state.responsiveCanvas.canvas.bar3.style.display = state.responsiveCanvas.canvas.bar4.style.display = "none";

        var canvas = state.responsiveCanvas.canvas.mainCanvas;
        canvas.style.position = "";
        canvas.style.left = "";
        canvas.style.top = "";

        resize();
    }

    function zoom() {
        const SCALING_FACTOR = 2;

        var availableWidth = window.innerWidth;
        var availableHeight = window.innerHeight;

        var unusedHeight = 0;
        var unusedWidth = 0;

        if (state.switches.scanlines) {
            unusedHeight = Math.floor(availableHeight % (state.responsiveCanvas.canvas.mainCanvas.height/SCALING_FACTOR) );
            availableHeight -= unusedHeight;

            unusedWidth = Math.floor(availableWidth % (state.responsiveCanvas.canvas.mainCanvas.width/SCALING_FACTOR) );
            availableWidth -= unusedWidth;
        }

        if (window.innerWidth < state.responsiveCanvas.canvas.mainCanvas.width || window.innerHeight < state.responsiveCanvas.canvas.mainCanvas.height) {
            availableWidth = window.innerWidth;
            availableHeight = window.innerHeight;
            unusedWidth = unusedHeight = 0;

            showScanlines(false);
        } else {
            showScanlines(true);
        }

        var top = 0, left = 0;

        var bar1 = state.responsiveCanvas.canvas.bar1;
        var bar2 = state.responsiveCanvas.canvas.bar2;
        var bar3 = state.responsiveCanvas.canvas.bar3;
        var bar4 = state.responsiveCanvas.canvas.bar4;

        var canvas = state.responsiveCanvas.canvas.mainCanvas;

        var scale = Number(canvas.height) / Number(canvas.width);

        // Calculate correct aspect ratio:
        var newWidth = availableWidth;
        var newHeight = Math.floor(newWidth*scale);

        if (newHeight > availableHeight) {
            newWidth = Math.ceil( (1 / scale) * availableHeight);
            newHeight = availableHeight;
        }
        if (newWidth < availableWidth) {
            left = Math.ceil( (availableWidth-newWidth) / 2);
        }
        if (newHeight < availableHeight) {
            top = Math.ceil( (availableHeight-newHeight) / 2);
        }

        top+= unusedHeight/2;
        left+= unusedWidth/2;

        top -= canvas.clientTop;
        left -= canvas.clientLeft;

        canvas.style.position = "fixed";
        canvas.style.left = left + "px";
        canvas.style.top = top + "px";
        canvas.style.width = newWidth + "px";
        canvas.style.height = newHeight + "px";
        canvas.style.zIndex = Z_INDEX;

        bar1.style.left = bar2.style.left = "0px";
        bar1.style.width = bar2.style.width = window.innerWidth + "px";
        bar1.style.top = "0px";
        bar2.style.top = Math.ceil(top + newHeight + canvas.clientTop) + "px";
        bar1.style.height = bar2.style.height = Math.ceil(top + canvas.clientTop) + "px";
        bar1.style.display = bar2.style.display = "";

        bar3.style.top = bar4.style.top = "0px";
        bar3.style.height = bar4.style.height = window.innerHeight + "px";
        bar3.style.left = "0px";
        bar4.style.left = Math.ceil(left + newWidth + canvas.clientLeft) + "px";
        bar3.style.width = bar4.style.width = Math.ceil(left + canvas.clientLeft) + "px";
        bar3.style.display = bar4.style.display = "";
    }

    function showScanlines(b) {
        if (b)
            state.showScanlines = 1.;
        else
            state.showScanlines = 0.;
    }

    function windowResized(e) {
        if (getVendorSpecificElement(document, ['fullscreenElement', 'msFullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'oFullscreenElement']) )
            zoom();
        else
            resize();
    }

    function fullscreenTriggered(e) {
        if (getVendorSpecificElement(document, ['fullscreenElement', 'msFullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'oFullscreenElement']) ) 
            zoom();
        else 
            restore();
    }

    function setupResponsiveCanvas(sourceCanvas) {
        if (isThisACanvasElement(sourceCanvas) )
            initializeCanvas(sourceCanvas);
        else if (isThisACanvasElement(sourceCanvas.canvas) )
            initializeCanvas(sourceCanvas.canvas);
        else
            throw new Error("'codefCanvas' should be a canvas or a CODEF canvas object.");

        resize();

        window.addEventListener("resize", windowResized);
        addMulitpleEventListeners(document, ['fullscreenchange', 'MSFullscreenChange', 'webkitfullscreenchange', 'mozfullscreenchange', 'ofullscreenchange'], fullscreenTriggered);

        return true;
    }

	function initBuffers() {
    	state.squareVertexBuffer = gl.createBuffer();
    	gl.bindBuffer(gl.ARRAY_BUFFER, state.squareVertexBuffer);
    	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(state.vertices), gl.STATIC_DRAW);
    	gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
    	state.squareIndexBuffer = gl.createBuffer();
    	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.squareIndexBuffer);
    	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(state.indices), gl.STATIC_DRAW);
    	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}

	function getShader(id, type) {
        var str = "";

        if (! type) {
            var script = document.getElementById(id);

            if (!script)
                return null;

            type = script.type;

            var k = script.firstChild;
            while (k) {
                if (k.nodeType == 3) {
                    str += k.textContent;
                }

                k = k.nextSibling;
            }

        } else {
            str = id;
        }

        var shader;
        if (type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

	function initShaders(newFragmentShaderID) {

		// Animation shaders:
    	state.prgCRT = gl.createProgram();

        state.shaders.vxShader = getShader(vertexShader, "x-shader/x-vertex");
    	gl.attachShader(state.prgCRT, state.shaders.vxShader);
    
        if (newFragmentShaderID)
    	   state.shaders.fgShader = getShader(newFragmentShaderID);
        else
    	   state.shaders.fgShader = getShader(fragmentShader, "x-shader/x-fragment");
        
        gl.attachShader(state.prgCRT, state.shaders.fgShader);
    	gl.linkProgram(state.prgCRT);
    
    	if (!gl.getProgramParameter(state.prgCRT, gl.LINK_STATUS)) {
        	alert("Could not initialise Animation shaders");
    	}

		state.prgCRT.iChannel0 = gl.getUniformLocation(state.prgCRT, "iChannel0");
    
    	state.texture = gl.createTexture();
    	gl.bindTexture(gl.TEXTURE_2D, state.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

		state.prgCRT.aVertexPosition = gl.getAttribLocation(state.prgCRT, "aVertexPosition");

		state.prgCRT.iGlobalTime = gl.getUniformLocation(state.prgCRT, "iGlobalTime");
		state.prgCRT.iResolution = gl.getUniformLocation(state.prgCRT, "iResolution");

        state.prgCRT.iShowScanlines = gl.getUniformLocation(state.prgCRT, "iShowScanlines");
        state.prgCRT.iBlurSample = gl.getUniformLocation(state.prgCRT, "iBlurSample");
        state.prgCRT.iLight = gl.getUniformLocation(state.prgCRT, "iLight");
        state.prgCRT.iCurvature = gl.getUniformLocation(state.prgCRT, "iCurvature");

        state.prgCRT.iGamma = gl.getUniformLocation(state.prgCRT, "iGamma");
        state.prgCRT.iContrast = gl.getUniformLocation(state.prgCRT, "iContrast");
        state.prgCRT.iSaturation = gl.getUniformLocation(state.prgCRT, "iSaturation");
        state.prgCRT.iBrightness = gl.getUniformLocation(state.prgCRT, "iBrightness");

		return true;
	}

    function useNewFragmentShader(newFragmentShaderID) {
        isEnabled();

        gl.useProgram(null);

        gl.detachShader(state.prgCRT, state.shaders.fgShader);
        gl.deleteShader(state.shaders.fgShader);

        gl.detachShader(state.prgCRT, state.shaders.vxShader);
        gl.deleteShader(state.shaders.vxShader);

        initShaders(newFragmentShaderID);
    }

	function getGLContext(canvas) {
    	var ctx = null;
        
    	var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    	for (var i = 0; i < names.length; ++i) {
        	try {ctx = canvas.getContext(names[i]);}catch(e) {}
        	if (ctx) break;
    	}

    	if (ctx == null) {
        	alert("Could not initialise WebGL.");
        	return null;
    	} else {return ctx;}
	}

	function setup(sourceCanvas, locationID) {

        // Test for CODEF canvas
        if (isThisACanvasElement(sourceCanvas.canvas) )
            sourceCanvas = sourceCanvas.canvas;
        // If not, test if raw canvas supplied
        else if (! isThisACanvasElement(sourceCanvas) )
            // If not, then throw error
            throw new Error("'sourceCanvas' argument should be a canvas element on the DOM, or a CODEF canvas object.");

		if (! (canvas = document.createElement("CANVAS")) ) {
			alert("Could not create a canvas - bailing out now!");
            throw new Error("Unable to create a new canvas element...");
    	}
        canvas.className = 'codef-crt-emulator';
    	canvas.width = sourceCanvas.width;
    	canvas.height = sourceCanvas.height;
    
    	if (locationID)
    		document.getElementById(locationID).appendChild(canvas);
    	else
    		document.body.appendChild(canvas);

        state.currentFPS = 0;

    	state.sourceCanvas = sourceCanvas;
        state.showScanlines = 1.;
        state.switches.blurSample = 1.5;
        state.switches.scanlines = true;
        state.switches.light = 6;
        state.switches.curvature = true;
        state.switches.showFPS = false;

        state.color.gamma = 1.;
        state.color.contrast = 1.;
        state.color.saturation = 1.;
        state.color.brightness = 1.;

    	gl = getGLContext(canvas);
    	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    	initBuffers();
    	initShaders();

        setupResponsiveCanvas(canvas);

        state.enabled = true;

		return canvas;
	}

    function setScanlines(b) {
        isEnabled();

        if (b) state.switches.scanlines = true;
        else state.switches.scanlines = false;
    }

    function showFPS(b) {
        isEnabled();

        if (b) {
            state.title = document.title;
            state.switches.showFPS = true;
        } else {
            document.title = state.title;
            state.switches.showFPS = false;
        }
    }

    function setCurvature(b) {
        isEnabled();

        if (b) state.switches.curvature = true;
        else state.switches.curvature = false;
    }

    function setGaussian(size) {
        isEnabled();

        size = Math.abs(size);
        if (size>10) size = 10;

        state.switches.blurSample = size;
    }

    function setLight(level) {
        isEnabled();

        state.switches.light = Math.abs(level);
    }

    function clampColorValue(level) {
        isEnabled();

        level = Math.abs(level);

        if (level<.01) level=.01;
        if (level>5.) level=5.;

        return level;
    }

    function setGamma(level) {
        isEnabled();

        level = clampColorValue(level);
        state.color.gamma = level;
    }

    function setContrast(level) {
        isEnabled();

        level = clampColorValue(level);
        state.color.contrast = level;
    }

    function setSaturation(level) {
        isEnabled();

        level = clampColorValue(level);
        state.color.saturation = level;
    }

    function setBrightness(level) {
        isEnabled();

        level = clampColorValue(level);
        state.color.brightness = level;
    }

    function getVersion() {
        return VERSION;
    }

    function getFPS() {
        isEnabled();

        return state.currentFPS;
    }

	function draw() {
        isEnabled();

		if (state.startTime === null) state.startTime = +new Date();

		var currentTime = ( (+new Date() ) - state.startTime) / 1000;
		state.deltaTime -= currentTime-state.previousTime;
    	if (state.deltaTime<=0) {
            state.currentFPS = state.fps;

            if (state.switches.showFPS) document.title = state.currentFPS + " FPS";

        	state.deltaTime = 1;
        	state.fps = 0;
    	}
    	state.previousTime = currentTime;
    	state.fps++;

    	//gl.enable(gl.DEPTH_TEST);
    	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    	gl.useProgram(state.prgCRT);

    	gl.uniform1f(state.prgCRT.iGlobalTime, currentTime);
		gl.uniform3fv(state.prgCRT.iResolution, [canvas.width, canvas.height, 0.]);

        gl.uniform1f(state.prgCRT.iShowScanlines, state.showScanlines && state.switches.scanlines);
        gl.uniform1f(state.prgCRT.iBlurSample, state.switches.blurSample);
        gl.uniform1f(state.prgCRT.iLight, state.switches.light);
        gl.uniform1i(state.prgCRT.iCurvature, Number(state.switches.curvature));

        gl.uniform1f(state.prgCRT.iGamma, state.color.gamma);
        gl.uniform1f(state.prgCRT.iContrast, state.color.contrast);
        gl.uniform1f(state.prgCRT.iSaturation, state.color.saturation);
        gl.uniform1f(state.prgCRT.iBrightness, state.color.brightness);

		gl.bindBuffer(gl.ARRAY_BUFFER, state.squareVertexBuffer);
		gl.vertexAttribPointer(state.prgCRT.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(state.prgCRT.aVertexPosition);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.squareIndexBuffer);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, state.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, state.sourceCanvas);
		gl.uniform1i(state.prgCRT.iChannel0, 0);

		gl.viewport(0,0, canvas.width, canvas.height);
		gl.drawElements(gl.TRIANGLES, state.indices.length, gl.UNSIGNED_SHORT, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
        gl.useProgram(null);
	}

    function toggleFullScreen(elmID) {
        var elm = document.getElementById(elmID);

        if (getVendorSpecificElement(document, ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement']) )
            callVendorSpecificElement(document, ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen']);
        else 
            callVendorSpecificElement(elm, ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen']);
    }

	// API:

    return {
        set: {
            fragmentShader: useNewFragmentShader,

            gamma: setGamma,
            contrast: setContrast,
            saturation: setSaturation,
            brightness: setBrightness,

            curvature: setCurvature,
            scanlines: setScanlines,

            light: setLight,
            gaussian: setGaussian,

            showFPS: showFPS
        },

        get: {
            version: getVersion,
            fps: getFPS
        },

        toggleFullScreen: toggleFullScreen,

        setup: setup,
        draw: draw
    };
}();
