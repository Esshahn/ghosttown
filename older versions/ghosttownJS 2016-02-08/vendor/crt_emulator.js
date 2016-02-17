'use strict'

/*
By Dave Eggleston (frutbunn)  http://frutbunn.tk  frutbunn@gmail.com

A CRT emulator for CODEF/CANVAS! Version: 0.3a

This work is licensed under the Creative Commons Attribution 4.0 International License. 
To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
*/

var crtEmulator = function() {

	// PRIVATE PROPERTIES:

    var that = this;

    var VERSION = ".3a";
    var Z_INDEX = "1000";

	var gl = null;
	var ctx2d = null; // alternative 2d canvas context, if no WebGL support

	var state = {
        enabled: false,

        title: null,

		prgCRT: null,

        shaderVariables: {
            aVertexPosition: null,
            iGlobalTime: null,
            iResolution: null,
            iShowScanlines: null,
            iBlurSample: null,
            iLight: null,
            iCurvature: null,
            iGamma: null,
            iContrast: null,
            iSaturation: null,
            iBrightness: null,
            iFullScreen: null,
        },

        userVariables: null,
        userTextures: null,

		texture: null,

		sourceCanvas: null,               

        sourceSize: {
            width: null,
            height: null
        },

        showScanlines: null,

        offScreen: {
            framebuffer: null,
            texture: null,
            renderbuffer: null
        },

        switches: {
            gaussian: null,
            scanlines: null,
            light: null,
            curvature: null,
            showFPS: null,
            horizontalAspectRatio: null,
            resizeScanlinesOffThreshold: null
        },

        blurSample: null,

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

    // SHADERS:

    var fragmentShader = "\
#ifdef GL_ES\n\
    precision highp float;\n\
#endif\n\
\n\
uniform vec3 iResolution;\n\
uniform float iGlobalTime;\n\
\n\
uniform sampler2D iChannel0;\n\
\n\
uniform float iShowScanlines;\n\
uniform float iBlurSample;\n\
uniform float iLight;\n\
\n\
uniform bool iCurvature;\n\
uniform bool iFullScreen;\n\
\n\
uniform float iGamma;\n\
uniform float iContrast;\n\
uniform float iSaturation;\n\
uniform float iBrightness;\n\
\n\
// post effects colour correct routine by Dave Hostkins on Shadertoy.\n\
vec3 postEffects(in vec3 rgb, in vec2 xy) {\n\
    rgb = pow(rgb, vec3(iGamma));\n\
    rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb*iBrightness)), rgb*iBrightness, iSaturation), iContrast);\n\
\n\
    return rgb;\n\
}\n\
\n\
// Sigma 1. Size 3\n\
vec3 gaussian(in vec2 uv) {\n\
    float b = iBlurSample / (iResolution.x / iResolution.y);\n\
\n\
    uv+= .5;\n\
\n\
    vec3 col = texture2D(iChannel0, vec2(uv.x - b/iResolution.x, uv.y - b/iResolution.y) ).rgb * 0.077847;\n\
    col += texture2D(iChannel0, vec2(uv.x - b/iResolution.x, uv.y) ).rgb * 0.123317;\n\
    col += texture2D(iChannel0, vec2(uv.x - b/iResolution.x, uv.y + b/iResolution.y) ).rgb * 0.077847;\n\
\n\
    col += texture2D(iChannel0, vec2(uv.x, uv.y - b/iResolution.y) ).rgb * 0.123317;\n\
    col += texture2D(iChannel0, vec2(uv.x, uv.y) ).rgb * 0.195346;\n\
    col += texture2D(iChannel0, vec2(uv.x, uv.y + b/iResolution.y) ).rgb * 0.123317;\n\
\n\
    col += texture2D(iChannel0, vec2(uv.x + b/iResolution.x, uv.y - b/iResolution.y) ).rgb * 0.077847;\n\
    col += texture2D(iChannel0, vec2(uv.x + b/iResolution.x, uv.y) ).rgb * 0.123317;\n\
    col += texture2D(iChannel0, vec2(uv.x + b/iResolution.x, uv.y + b/iResolution.y) ).rgb * 0.077847;\n\
\n\
    return col;\n\
}\n\
\n\
void main() {\n\
    vec2 st = (gl_FragCoord.xy / iResolution.xy) - vec2(.5);\n\
\n\
    // Curvature/light\n\
    float d = length(st*.5 * st*.5);\n\
    vec2 uv = st*d + st*.935;\n\
\n\
    if (! iCurvature) uv = st;\n\
\n\
    // CRT color blur\n\
    vec3 color = gaussian(uv);\n\
\n\
    // Light\n\
    float l = 1. - min(1., d*iLight);\n\
    color *= l;\n\
\n\
    // Scanlines\n\
    float y = uv.y; // change this to st.y for non-curved scanlines.\n\
\n\
    float s = 1. - smoothstep(360., 1440., iResolution.y) + 1.;\n\
    float j = cos(y*iResolution.y*s)*.1; // values between .01 to .25 are ok.\n\
    color = abs(iShowScanlines-1.)*color + iShowScanlines*(color - color*j);\n\
    color *= 1. + ( .02 + ceil(mod( (st.x+.5)*iResolution.x, 3.) ) * (.995-1.02) )*iShowScanlines;\n\
\n\
    // Border mask\n\
    if (iCurvature) {\n\
        float m = max(0.0, 1. - 2.*max(abs(uv.x), abs(uv.y) ) );\n\
        m = min(m*200., 1.);\n\
        color *= m;\n\
    }\n\
\n\
    // Color correction\n\
    color = postEffects(color, st);\n\
\n\
    gl_FragColor = vec4(max(vec3(.0), min(vec3(1.), color)), 1.);\n\
}\n\
";

    var vertexShader = 
"\
    attribute vec2 aVertexPosition;\n\
\n\
    void main(void) {\n\
        gl_Position = vec4(aVertexPosition, 0.0, 1.0);\n\
    }\n\
"

	// PRIVATE METHODS:

    function isEnabled() {
        if (! state.enabled)
            throw new Error("crtEmulator.init has not been called yet, you must call 'init' before you can call other methods!");
    }

    function hasWebGL() {
	if (gl == null) return false;
	else return true;
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
                return node[elements[i]]();
            }

        }

        return null;
    }

    function isThisACanvasElement(node) {
        var r = false;
        try {
            if (node.tagName == "CANVAS")
                r = true; 
        } catch(e) {};

        return r;
    }

    function getRandomString() {
        function hashBKDR(str) {
            var SEED = 31;
    
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
        position.id = createNewElementID("crt-emulator-position");

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
        bar1.className = bar2.className = bar3.className = bar4.className = 'crt-emulator';

        bar1.style.zIndex = bar2.style.zIndex = bar3.style.zIndex = bar4.style.zIndex = Z_INDEX;

        var position = document.getElementById(state.responsiveCanvas.elementID.position);
        position.appendChild(bar1);
        position.appendChild(bar2);
        position.appendChild(bar3);
        position.appendChild(bar4);
    }

    function autoGaussian(size) {
        size = Math.abs(size);
        if (size>10) size = 10;

        return size;
    }

    function resize() {
        var canvas = state.responsiveCanvas.canvas.mainCanvas;
        var elm = document.getElementById(state.responsiveCanvas.elementID.position);

        var availableWidth = (elm.clientWidth > state.sourceSize.width ? state.sourceSize.width : elm.offsetWidth) - canvas.clientLeft*2;
        var availableHeight = state.sourceSize.height;

        var scale = Number(state.sourceSize.height) / Number(state.sourceSize.width);

        // Calculate correct aspect ratio:
        var newWidth = availableWidth;
        var newHeight = Math.floor(newWidth*scale);

        if (newHeight > availableHeight) {
            newWidth = (1 / scale) * availableHeight;
            newHeight = availableHeight;
        }

        if (newWidth<state.sourceSize.width*state.switches.resizeScanlinesOffThreshold)
            showScanlines(false);
        else 
            showScanlines(true);

        // Set gaussian blur automatically depending on size:
        var blur1 = newWidth / state.sourceSize.width;
        var blur2 = newHeight / state.sourceSize.height;
        state.blurSample = autoGaussian((blur1 + blur2) *.65);

	    if (hasWebGL()) {
        	canvas.width = newWidth;
        	canvas.height = newHeight;
        }
	
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
        var availableWidth = window.innerWidth;
        var availableHeight = window.innerHeight;

        if (window.innerWidth < state.sourceSize.width*state.switches.resizeScanlinesOffThreshold || window.innerHeight < state.sourceSize.height*state.switches.resizeScanlinesOffThreshold)
            showScanlines(false);
        else
            showScanlines(true);

        var top = 0, left = 0;

        var bar1 = state.responsiveCanvas.canvas.bar1;
        var bar2 = state.responsiveCanvas.canvas.bar2;
        var bar3 = state.responsiveCanvas.canvas.bar3;
        var bar4 = state.responsiveCanvas.canvas.bar4;

        var canvas = state.responsiveCanvas.canvas.mainCanvas;

        var scale = Number(state.sourceSize.height) / Number(state.sourceSize.width);

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

        if (state.switches.horizontalAspectRatio == false) {
            newWidth = availableWidth;
            left = 0;
        }

        // Set gaussian blur automatically depending on size:
        var blur1 = newWidth / state.sourceSize.width;
        var blur2 = newHeight / state.sourceSize.height;
        state.blurSample = autoGaussian((blur1 + blur2) *.75);

        // Set canvas position
        canvas.style.position = "fixed";
        canvas.style.left = left + "px";
        canvas.style.top = top + "px";

        // Set canvas size:
	    if (hasWebGL()) {
        	canvas.width = newWidth;
        	canvas.height = newHeight;
	    }
        
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

    function showScanlines(x) {
        if (x)
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

	function initShaders(fragmentShaderID) {

		// Animation shaders:
    	state.prgCRT = gl.createProgram();

        state.shaders.vxShader = getShader(vertexShader, "x-shader/x-vertex");
    	gl.attachShader(state.prgCRT, state.shaders.vxShader);
    
        if (fragmentShaderID)
    	   state.shaders.fgShader = getShader(fragmentShaderID);
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

		state.shaderVariables.aVertexPosition = gl.getAttribLocation(state.prgCRT, "aVertexPosition");

		state.shaderVariables.iGlobalTime = gl.getUniformLocation(state.prgCRT, "iGlobalTime");
		state.shaderVariables.iResolution = gl.getUniformLocation(state.prgCRT, "iResolution");

        state.shaderVariables.iShowScanlines = gl.getUniformLocation(state.prgCRT, "iShowScanlines");
        state.shaderVariables.iBlurSample = gl.getUniformLocation(state.prgCRT, "iBlurSample");
        state.shaderVariables.iLight = gl.getUniformLocation(state.prgCRT, "iLight");
        state.shaderVariables.iCurvature = gl.getUniformLocation(state.prgCRT, "iCurvature");

        state.shaderVariables.iGamma = gl.getUniformLocation(state.prgCRT, "iGamma");
        state.shaderVariables.iContrast = gl.getUniformLocation(state.prgCRT, "iContrast");
        state.shaderVariables.iSaturation = gl.getUniformLocation(state.prgCRT, "iSaturation");
        state.shaderVariables.iBrightness = gl.getUniformLocation(state.prgCRT, "iBrightness");

        state.shaderVariables.iFullScreen = gl.getUniformLocation(state.prgCRT, "iFullScreen");

		return true;
	}

    function replaceFragmentShader(fragmentShaderID) {
        isEnabled();

        gl.useProgram(null);

        gl.detachShader(state.prgCRT, state.shaders.fgShader);
        gl.deleteShader(state.shaders.fgShader);

        gl.detachShader(state.prgCRT, state.shaders.vxShader);
        gl.deleteShader(state.shaders.vxShader);

        clearAllUserUniforms();

        initShaders(fragmentShaderID);
    }

	function getGLContext(canvas) {
    	var ctx = null;
        
    	var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    	for (var i = 0; i < names.length; ++i) {
        	try {ctx = canvas.getContext(names[i]);}catch(e) {}
        	if (ctx) break;
    	}

        return ctx;
	}

    function createFramebuffer(width, height) {
        state.sourceCanvas = null;

        var framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        var renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        state.offScreen.framebuffer = framebuffer;
        state.offScreen.texture = texture;
        state.offScreen.renderbuffer = renderbuffer;
    }

	function init(source, locationID, width, height, dontUseWebGL, fragmentShaderID) {

        // Do not allow init to be called more than once.
        if (state.enabled)
            throw new Error("crtEmulator.init has already been called. You can only call 'init' once.");

        if (String(source).toUpperCase() == 'FRAMEBUFFER') {
            // Framebuffer

            width = width || 640;
            height = height || 360;

            state.sourceCanvas = null;

        } else if (isThisACanvasElement(source)) {
            // Canvas

            width = width || source.width;
            height = height || source.height;

            state.sourceCanvas = source;

        } else if (source && source.hasOwnProperty('canvas') && isThisACanvasElement(source.canvas)) {
            // CODEF

            state.sourceCanvas = source.canvas;

            width = width || state.sourceCanvas.width;
            height = height || state.sourceCanvas.height;

        } else {
            throw new Error("crtEmulator.init 'source' argument should be a canvas element on the DOM, or a CODEF canvas object.");
        }

        // Create the canvas WebGL will render CRT to
        var  canvas = document.createElement("CANVAS");
        if (! canvas ) {
            console.warn("Unable to create a canvas element, bailing out.");
            return false;
        }
        canvas.className = 'crt-emulator';
        canvas.width = width;
        canvas.height = height;

        // Append displayed canvas to DOM - will place at supplied argument locationID, or if not supplied, appened
        // to bottom of document.
        if (locationID)
    	   document.getElementById(locationID).appendChild(canvas);
        else
    	   document.body.appendChild(canvas);

        // Create gl context from canvas - if this fails, will fallback to displaying on a 2d canvas context instead.
        if (dontUseWebGL)
            gl = null;
        else
            gl = getGLContext(canvas);

	    // If no WebGL support, then fall back to displaying on a 2d canvas.
        if (gl == null) {

            // If user requested a WebGL framebuffer, but no WebGL, fail here.
            if (state.sourceCanvas == null) {
                console.warn("Unable to create WebGL framebuffer, as this browser does not support WebGL, bailing out.");
                return false;
            }

            if ( (ctx2d=canvas.getContext("2d")) == null) {
                console.warn("Unable to create 2D canvas context, bailing out.");
                return false;
            }

        } else {
            // Will use WebGL to render
            initBuffers();
            initShaders(fragmentShaderID);
	
            if (state.sourceCanvas == null) createFramebuffer(width, height);
        }
       
        // Store base size of framebuffer/canvas source - we need this to calculate aspect ratio when resizing
        state.sourceSize.width = width;
        state.sourceSize.height = height;

        state.userVariables = [];
        state.userTextures = [];

        state.blurSample = 1.5; // Will be set to correct value when resize() is called below...

        state.currentFPS = 0;

        state.showScanlines = 1.;
        state.switches.scanlines = true;
        state.switches.light = 3;
        state.switches.curvature = true;
        state.switches.showFPS = false;
        state.switches.horizontalAspectRatio = true;
        state.switches.resizeScanlinesOffThreshold = 1;

        state.color.gamma = 1;
        state.color.contrast = 1;
        state.color.saturation = 1;
        state.color.brightness = 1;

        state.responsiveCanvas.canvas.mainCanvas = canvas;
        createPositionDiv(canvas);
        createBarCanvases();

        resize();
        window.addEventListener("resize", windowResized);
        addMulitpleEventListeners(document, ['fullscreenchange', 'MSFullscreenChange', 'webkitfullscreenchange', 'mozfullscreenchange', 'ofullscreenchange'], fullscreenTriggered);

        state.enabled = true;
        return true;
	}

    // User uniform object
    function UserUniform(name, type) {
        this.variableName = name;
        this.variableType = type;
        this.variableValue = null;
    }
    UserUniform.prototype = UserUniform;
    UserUniform.prototype.constructor = UserUniform;

    var UNIFORM_TYPE = Object.freeze({
        "float": "uniform1f", "vec2": "uniform2fv", "vec3": "uniform3fv", "bool": "uniform1i", "int": "uniform1i" 
    });

    function clearAllUserUniforms() {
        isEnabled();

        state.userVariables = [];
    }

    function updateAllUserUniforms() {
        var prg = state.prgCRT;

        for(var i in state.userVariables) {
            var userUniform = state.userVariables[i];
            var location = gl.getUniformLocation(prg, userUniform.variableName);
    
            var type = UNIFORM_TYPE[userUniform.variableType];

            try {
                gl[type](location, userUniform.variableValue); 
            } catch(e) {
                console.warn("crtEmulator.updateAllUserUniforms: Unable to set user uniform '"
                 + userUniform.variableName + "' to '" + userUniform.variableValue + "'.");
            }

        }

    }

    function addUserUniform(name, type) {
        isEnabled();

        if (typeof UNIFORM_TYPE[type] === 'undefined')
            throw new Error("User uniforms do not support datatype '" + type + "'.");

        var userUniform = new UserUniform(name, type);
        state.userVariables[name] = userUniform;
    }

    function setUserUniformValue(name, value) {
        isEnabled();

        var userUniform = state.userVariables[name];

        if (typeof userUniform === 'undefined') 
            throw new Error("There is no user uniform called '" + name + "' defined.");

        userUniform.variableValue = value;
    }

    function getUserUniformValue(name) {
        isEnabled();

        var userUniform = state.userVariables[name];

        if (typeof userUniform === 'undefined')
            throw new Error("There is no user uniform called '" + name + "' defined.");
   
        return userUniform.variableValue;   
    }

    function UserTexture(uniformName, sampler2D) {
        this.textureName = uniformName;
        this.textureSampler2D = sampler2D;
        this.texture = null;
        this.loaded = false;
        this.canvas = null;
    }
    UserTexture.prototype = UserTexture;
    UserTexture.prototype.constructor = UserTexture;

    function clearAllUserTextures() {
        for(var i in state.userTextures) {
            var userTexture = state.userTextures[i];

            gl.deleteTexture(userTexture.texture);
        }

        state.userTextures = [];
    }

    function updateAllUserTextures() {
        var prg = state.prgCRT;

        for(var i in state.userTextures) {
            var obj = state.userTextures[i];
                
            gl.activeTexture(gl.TEXTURE0 + obj.textureSampler2D);
            gl.bindTexture(gl.TEXTURE_2D, obj.texture);

            if (obj.canvas) {
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, obj.canvas);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            }

            var location = gl.getUniformLocation(prg, obj.textureName);
            gl.uniform1i(location, obj.textureSampler2D);
        }
    }

    function getTexture(uniformName) {
        isEnabled();

        return state.userTextures[uniformName].texture;
    }

    function haveAllTextureImagesLoadedYet() {
        isEnabled();

        for(var i in state.userTextures) {
            var userTexture = state.userTextures[i];

            if (!userTexture.loaded)
                return false;
        }

        return true;
    }

    function useTexture(uniformName, sampler2D, texture) {
        isEnabled();

        var obj = new UserTexture(uniformName, sampler2D);

        if (texture.hasOwnProperty("toString") && texture.toString() == '[object WebGLTexture]') {
            obj.texture = texture;
            obj.loaded = true;  

            state.userTextures[uniformName] = obj;

            return true;
        }

        return false;
    }

    function createNewTexture(uniformName, sampler2D, minFilter, magFilter, wrapS, wrapT) {
        minFilter = minFilter || gl.LINEAR;
        magFilter = magFilter || gl.LINEAR;
        wrapS = wrapS || gl.CLAMP_TO_EDGE;
        wrapT = wrapT || gl.CLAMP_TO_EDGE;

        var obj = new UserTexture(uniformName, sampler2D);
        var newTexture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, newTexture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0,255]));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);

        gl.bindTexture(gl.TEXTURE_2D, null);

        obj.texture = newTexture;

        state.userTextures[uniformName] = obj;

        return obj;    
    }

    function dontTryAndCreateTextureIfNoWebGL() {
        if (! hasWebGL()) {
            console.warn("Cannot create texture as no WebGL support in browser.");

            return false;
        }

        return true;
    }

    function useCanvasAsTexture(uniformName, sampler2D, canvas, minFilter, magFilter, wrapS, wrapT) {
        isEnabled();

        if (! dontTryAndCreateTextureIfNoWebGL()) return false;
        if (! isThisACanvasElement(canvas)) return false;

        var obj = createNewTexture(uniformName, sampler2D, minFilter, magFilter, wrapS, wrapT);
        obj.loaded = true;
        obj.canvas = canvas;

        return true;
    }

    function useCodefCanvasAsTexture(uniformName, sampler2D, codefCanvas, minFilter, magFilter, wrapS, wrapT) {
        if (codefCanvas && codefCanvas.hasOwnProperty('canvas') && isThisACanvasElement(codefCanvas.canvas))
            return useCanvasAsTexture(uniformName, sampler2D, codefCanvas.canvas, minFilter, magFilter, wrapS, wrapT);

        return false;
    }

    function useCanvasSnapshotAsTexture(uniformName, sampler2D, canvas, minFilter, magFilter, wrapS, wrapT) {
        isEnabled();

        if (! dontTryAndCreateTextureIfNoWebGL()) return false;
        if (! isThisACanvasElement(canvas)) return false;

        var obj = createNewTexture(uniformName, sampler2D, minFilter, magFilter, wrapS, wrapT);
        obj.loaded = true;

        gl.bindTexture(gl.TEXTURE_2D, obj.texture);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.bindTexture(gl.TEXTURE_2D, null);

        return true;
    }

    function useCodefCanvasSnapshotAsTexture(uniformName, sampler2D, codefCanvas, minFilter, magFilter, wrapS, wrapT) {
        if (codefCanvas && codefCanvas.hasOwnProperty('canvas') && isThisACanvasElement(codefCanvas.canvas))
            return useCanvasSnapshotAsTexture(uniformName, sampler2D, codefCanvas.canvas, minFilter, magFilter, wrapS, wrapT);
    
        return false;
    }

    function loadImageAsTexture(uniformName, sampler2D, url, minFilter, magFilter, wrapS, wrapT) {
        isEnabled();

        if (! dontTryAndCreateTextureIfNoWebGL()) return false;

        var obj = createNewTexture(uniformName, sampler2D, minFilter, magFilter, wrapS, wrapT);


        // Load in image
        var image = new Image();
        image.src = url;
        image.addEventListener('load', function() {
            gl.bindTexture(gl.TEXTURE_2D, obj.texture);

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

            gl.bindTexture(gl.TEXTURE_2D, null);

            obj.loaded = true;
        });


        return true;
    }

    function setGaussian(size) {
        if (size !== null) {
            size = Math.abs(size);
            if (size>10) 
                size = 10;
        }

        state.switches.gaussian = size;
    }

    function setScanlines(x) {
        isEnabled();

        if (x) state.switches.scanlines = true;
        else state.switches.scanlines = false;
    }

    function showFPS(x) {
        isEnabled();

        if (x) {
            state.title = document.title;
            state.switches.showFPS = true;
        } else {
            document.title = state.title;
            state.switches.showFPS = false;
        }
    }

    function setCurvature(x) {
        isEnabled();

        if (x) state.switches.curvature = true;
        else state.switches.curvature = false;
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

    function horizontalAspectRatio(x) {
        isEnabled();

        if (x) state.switches.horizontalAspectRatio = true;
        else state.switches.horizontalAspectRatio = false;
    }

    function changeMinimumDisplayedSize(width, height) {
        isEnabled();

        state.sourceSize.width = width;
        state.sourceSize.height = height;

        resize();
    }

    function resizeScanlinesOffThreshold(x) {
        isEnabled();

        x = Number(Math.abs(x));

        if (x<.1) x = .1;
        if (x>1.) x = 1.;

        state.switches.resizeScanlinesOffThreshold = x;

        resize();
    }

	function draw() {
        isEnabled();

	    var canvas = null;

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


	   // If no WebGL support, render as 2d canvas:
	   if (!hasWebGL()) {
		  ctx2d.drawImage(state.sourceCanvas, 0, 0);

		  return;
	   }

	   // Render using WebGL

    	//gl.enable(gl.DEPTH_TEST);
    	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    	gl.useProgram(state.prgCRT);

        canvas = state.responsiveCanvas.canvas.mainCanvas;

    	gl.uniform1f(state.shaderVariables.iGlobalTime, currentTime);
        gl.uniform3fv(state.shaderVariables.iResolution, [canvas.width, canvas.height, 0.]);

        gl.uniform1f(state.shaderVariables.iShowScanlines, state.showScanlines && state.switches.scanlines);
        gl.uniform1f(state.shaderVariables.iLight, state.switches.light);
        gl.uniform1i(state.shaderVariables.iCurvature, Number(state.switches.curvature));

        if (state.switches.gaussian !== null) gl.uniform1f(state.shaderVariables.iBlurSample, state.switches.gaussian);
        else gl.uniform1f(state.shaderVariables.iBlurSample, state.blurSample);

        var fullscreenMode = getVendorSpecificElement(document, ['fullscreenElement', 'msFullscreenElement'
         , 'webkitFullscreenElement', 'mozFullScreenElement', 'oFullscreenElement']);
        if (fullscreenMode)
            gl.uniform1i(state.shaderVariables.iFullScreen, Number(1));
        else
            gl.uniform1i(state.shaderVariables.iFullScreen, Number(0));
        
        gl.uniform1f(state.shaderVariables.iGamma, state.color.gamma);
        gl.uniform1f(state.shaderVariables.iContrast, state.color.contrast);
        gl.uniform1f(state.shaderVariables.iSaturation, state.color.saturation);
        gl.uniform1f(state.shaderVariables.iBrightness, state.color.brightness);

        updateAllUserUniforms();

		gl.bindBuffer(gl.ARRAY_BUFFER, state.squareVertexBuffer);
		gl.vertexAttribPointer(state.shaderVariables.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(state.shaderVariables.aVertexPosition);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.squareIndexBuffer);

		gl.activeTexture(gl.TEXTURE0);

        if (state.sourceCanvas !== null) {
            gl.bindTexture(gl.TEXTURE_2D, state.texture);

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, state.sourceCanvas);  
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);          
        } else {
            gl.bindTexture(gl.TEXTURE_2D, state.offScreen.texture);
        }
        gl.uniform1i(state.prgCRT.iChannel0, 0);

        updateAllUserTextures();

		gl.viewport(0,0, canvas.width, canvas.height);
		gl.drawElements(gl.TRIANGLES, state.indices.length, gl.UNSIGNED_SHORT, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
        gl.useProgram(null);
	}

    function toggleFullScreen() {
        var elm = document.getElementById(state.responsiveCanvas.elementID.position);

        if (getVendorSpecificElement(document, ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement']) )
            callVendorSpecificElement(document, ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen']);
        else 
            callVendorSpecificElement(elm, ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen']);
    }

    function getGLcontext() {
        return gl;
    }

    function getFramebuffer() {
        return state.offScreen.framebuffer;
    }

    // This function is from StackOverflow:
    // http://stackoverflow.com/questions/11871077/proper-way-to-detect-webgl-support
    function webgl_detect(return_context)
    {
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
            context = false;

            for(var i=0;i<4;i++) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter == "function") {
                        // WebGL is enabled
                        if (return_context) {
                            // return WebGL object if the function's argument is present
                            return {name:names[i], gl:context};
                        }
                        // else, return just true
                        return true;
                    }
                } catch(e) {}
            }

            // WebGL is supported, but disabled
        return false;
    }

    // WebGL not supported
    return false;
    }


	// API:

    return {
        // Commands:
        init: init,

        updateFrame: draw,
        draw: draw,

        replaceFragmentShader: replaceFragmentShader,

        toggleFullScreen: toggleFullScreen,

        changeMinimumDisplayedSize: changeMinimumDisplayedSize,

        // WebGL:
        get gl() { return getGLcontext(); },
        get framebuffer() { return getFramebuffer(); },
        get browserHasWebGL() { return webgl_detect(); },

        // State:
        get version() { return getVersion(); },
        get fps() { return getFPS(); },
        get stillLoadingTextures() { return haveAllTextureImagesLoadedYet(); },

        // Color correction:
        set gamma(x) { setGamma(x); },
        set contrast(x) { setContrast(x); },
        set saturation(x) { setSaturation(x); },
        set brightness(x) { setBrightness(x); },

        set gaussian(x) { setGaussian(x); },

        set horizontalAspectRatio(x) { horizontalAspectRatio(x); },

        get gamma() { return state.color.gamma; },
        get contrast() { return state.color.contrast; },
        get saturation() { return state.color.saturation; },
        get brightness() { return state.color.brightness; },

        get gaussian() { return state.switches.gaussian; },

        get horizontalAspectRatio() { return state.switches.noHorizontalAspectRatio; },

        // Switches:
        set curvature(x) { setCurvature(x); },
        set scanlines(x) { setScanlines(x); },
        set light(x) { setLight(x); },
        set showFPS(x) { showFPS(x); },
        set resizeScanlinesOffThreshold(x) {resizeScanlinesOffThreshold(x); },

        get curvature() { return state.switches.curvature; },
        get scanlines() { return state.switches.scanlines; },
        get light() { return state.switches.light; },
        get showFPS() { return state.switches.showFPS; },
        get resizeScanlinesOffThreshold() { return state.switches.resizeScanlinesOffThreshold; },

        // User uniforms:
        newUniform: addUserUniform,
        setUniform: setUserUniformValue,
        getUniform: getUserUniformValue,

        // User Textures:
        clearAllTextures: clearAllUserTextures,
        getTexture: getTexture,

        newTextureFromExisting: useTexture,

        newTextureFromURL: loadImageAsTexture,
        newTextureFromCanvasSnapshot: useCanvasSnapshotAsTexture,
        newTextureFromCodefSnapshot: useCodefCanvasSnapshotAsTexture,

        newTextureFromCanvas: useCanvasAsTexture,
        newTextureFromCodef: useCodefCanvasAsTexture
    };
}();