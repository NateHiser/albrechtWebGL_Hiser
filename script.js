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

gl.shaderSource(vertexShader, `
	// GLSL Code will go here
`);
