var canvas = document.createElement('canvas');
canvas.width = (window.innerWidth*0.9)*2;
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

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);

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

gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);

var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');

gl.vertexAttribPointer(
	positionAttribLocation,
  3,
  gl.FLOAT,
  gl.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT,
  0
);

gl.enableVertexAttribArray(positionAttribLocation);

var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
gl.vertexAttribPointer(
	texCoordAttribLocation,
	2,
  gl.FLOAT,
  gl.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT,
  3 * Float32Array.BYTES_PER_ELEMENT
);
gl.enableVertexAttribArray(texCoordAttribLocation);

var boxTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, boxTexture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE,
              new Uint8Array([255, 255, 255]));

gl.useProgram(program);
var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

var worldMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();


mat4.identity(worldMatrix);
mat4.lookAt(viewMatrix, [0, 0, 6], [0, 0, 0], [0, 1, 0]);
mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);

gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);

var xRotationMatrix = mat4.create();
var yRotationMatrix = mat4.create();
var identityMatrix = mat4.create();
mat4.identity(identityMatrix);

var animate = function() {

	angle = performance.now() / 1000 / 6 * 2 * Math.PI;

	// Applies the transformations
	mat4.rotateY(yRotationMatrix, identityMatrix, angle);
	mat4.rotateX(xRotationMatrix, identityMatrix, angle / 4);
	mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);

	// Sends the updated matrix to the GPU
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

	// Actually performs the draw operation
	gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

	requestAnimationFrame(animate);
}
animate();
}());
