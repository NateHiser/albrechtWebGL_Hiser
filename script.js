var canvas = document.createElement('canvas');
canvas.width = (window.innerWidth*0.9)*2; // I multiply the canvas size by 2 and scale it down with CSS to effectively create a @2x graphic for my retina display
canvas.height = (window.innerHeight*0.9)*2;
document.body.appendChild(canvas);

var gl = canvas.getContext('webgl');

if (!gl) {
	console.log('WebGL not supported, falling back on experimental-webgl');
	gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
	alert('Your browser does not support WebGl');
}

var vertexShader = gl.createShader(gl.VERTEX_SHADER);

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
	precision mediump float;

	attribute vec3 vertPosition;
	attribute vec2 vertTexCoord;

	varying vec2 fragTextCoord;

	uniform mat4 mWorld;
	uniform mat4 mView;
	uniform mat4 mProj;

	void main() {
		fragTextCoord = vertTexCoord;

		gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
	}
`);
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
	return;
}

var framentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(framentShader, `
	precision mediump float;

	varying vec2 fragTextCoord;

	uniform sampler2D sampler;


	void main() {
		vec4 texel = texture2D(sampler, fragTextCoord);

		gl_FragColor = texel;
	}
`);
gl.compileShader(framentShader);

if (!gl.getShaderParameter(framentShader, gl.COMPILE_STATUS)) {
	console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(framentShader));
	return;
}

var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, framentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	console.error('ERROR linking program', gl.getProgramInfolog(program));
}

gl.validateProgram(program);
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
	console.error('ERROR validating program', gl.getProgramInfolog(program));
}

gl.useProgram(program);`.

var animate = function() {
		requestAnimationFrame(animate);
	}
	animate();

  var boxVertices = [
	-1.00,  1.00, -1.00,	 0.00,  0.00,
	-1.00,  1.00,  1.00,	 0.00,  1.00,
	 1.00,  1.00,  1.00,	 1.00,  1.00,
	 1.00,  1.00, -1.00,	 1.00,  0.00,

	-1.00,  1.00,  1.00,	 0.00,  0.00,
	-1.00, -1.00,  1.00,	 1.00,  0.00,
	-1.00, -1.00, -1.00,	 1.00,  1.00,
	-1.00,  1.00, -1.00,	 0.00,  1.00,

	 1.00,  1.00,  1.00,	 1.00,  1.00,
	 1.00, -1.00,  1.00,	 0.00,  1.00,
	 1.00, -1.00, -1.00,	 0.00,  0.00,
	 1.00,  1.00, -1.00,	 1.00,  0.00,

	 1.00,  1.00,  1.00,	 1.00,  1.00,
	 1.00, -1.00,  1.00,	 1.00,  0.00,
	-1.00, -1.00,  1.00,	 0.00,  0.00,
	-1.00,  1.00,  1.00,	 0.00,  1.00,

	 1.00,  1.00, -1.00,	 0.00,  0.00,
	 1.00, -1.00, -1.00,	 0.00,  1.00,
	-1.00, -1.00, -1.00,	 1.00,  1.00,
	-1.00,  1.00, -1.00,	 1.00,  0.00,

	-1.00, -1.00, -1.00,	 1.00,  1.00,
	-1.00, -1.00,  1.00,	 1.00,  0.00,
	 1.00, -1.00,  1.00,	 0.00,  0.00,
	 1.00, -1.00, -1.00,	 0.00,  1.00,
];

var boxIndices = [

	0, 1, 2,
	0, 2, 3,

	5, 4, 6,
	6, 4, 7,

	8, 9, 10,
	8, 10, 11,

	13, 12, 14,
	15, 14, 12,

	16, 17, 18,
	16, 18, 19,

	21, 20, 22,
	22, 20, 23
];

var boxVertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

var boxIndexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
