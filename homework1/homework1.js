"use strict";

var homework1 = function(){
var canvas;
var gl;

var program

var numVertices  = 120;
var texSize = 256;

var pointsArray = [];
var colorsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var activeTex = false;
var activeDir = false;
var activeSpot = false;
var norm = 50; //normalization factor for the vertices coordinates


// directional light
var dirLightPosition = vec4(3.0, 3.0, 0.0, 0.0 );
var dirLightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
var dirLightDiffuse = vec4(0.5, 0.5, 0.5, 1.0);
var dirLightSpecular = vec4(0.5, 0.5, 0.5, 1.0);

// spotlight
var spotLightPosition = vec4(-1.0, 1.0, -1.0, 1.0 );
var spotLightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
var spotLightDiffuse = vec4( 0.5, 0.5, 0.5, 1.0);
var spotLightSpecular = vec4( 0.5, 0.5, 0.5, 1.0);
var spotLightDirection = vec4(-1.5, 1.5, 1.5, 1.0 );
var cutOff = 10.0; // degree
var varCO = 2.0;   // degree

// material
var materialAmbient = vec4(0.5, 0.5, 0.5, 1.0);
var materialDiffuse = vec4(0.5, 0.5, 0.5, 1.0);
var materialSpecular = vec4(0.5, 0.5, 0.5, 1.0);
var materialShininess = 5.0;


var texCoord = [
    vec2(0,0),
    vec2(1,0),
    vec2(0,1),
    vec2(1,1),
]

//Describing vertices needed to build the object
var vertices = [
    vec4(-25/norm, -11/norm,  14/norm, 1.0),  //0
    vec4(-25/norm, -11/norm, -14/norm, 1.0),  //1
    vec4(-25/norm,  -1/norm, -14/norm, 1.0),  //2
    vec4(-25/norm,  11/norm,   4/norm, 1.0),  //3
    vec4(-25/norm,  11/norm,  14/norm, 1.0),  //4
    vec4( 25/norm,  11/norm,  14/norm, 1.0),  //5
    vec4( 25/norm,  11/norm,   4/norm, 1.0),  //6
    vec4( 25/norm,  -1/norm, -14/norm, 1.0),  //7
    vec4( 25/norm, -11/norm, -14/norm, 1.0),  //8
    vec4( 25/norm, -11/norm,  14/norm, 1.0),  //9
    vec4(-23/norm,  11/norm,  12/norm, 1.0),  //10
    vec4(-23/norm,  11/norm,   4/norm, 1.0),  //11
    vec4(-23/norm,  -1/norm, -14/norm, 1.0),  //12
    vec4(-23/norm,  -9/norm, -14/norm, 1.0),  //13
    vec4( 23/norm,  -9/norm, -14/norm, 1.0),  //14
    vec4( 23/norm,  -1/norm, -14/norm, 1.0),  //15
    vec4( 23/norm,  11/norm,   4/norm, 1.0),  //16
    vec4( 23/norm,  11/norm,  12/norm, 1.0),  //17
    vec4( 23/norm,  -9/norm,  12/norm, 1.0),  //18
    vec4(-23/norm,  -9/norm,  12/norm, 1.0),  //19

    //auxiliary vertices
    vec4(-25/norm,  11/norm,  12/norm, 1.0),  //20
    vec4(-25/norm,  -9/norm, -14/norm, 1.0),  //21
    vec4( 25/norm,  11/norm,  12/norm, 1.0),  //22
    vec4( 25/norm,  -9/norm, -14/norm, 1.0)   //23
];

//set of color used to draw the object
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 0.5 ),  // black
    vec4( 1.0, 0.0, 0.0, 0.5 ),  // red
    vec4( 1.0, 1.0, 0.0, 0.5 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 0.5 ),  // green
    vec4( 0.0, 0.0, 0.5, 0.5 ),  // blue
    vec4( 1.0, 0.0, 1.0, 0.5 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 0.5 ),  // white
    vec4( 0.0, 1.0, 1.0, 0.5 )   // cyan
];

//variables for rotations and view
var z = 0;
var near = 0.3; 
var far = 3.0;
var radius = 2.0;
var theta = Math.PI; 
var phi = 0.0;
var dr = Math.PI/8; 

var  fovy = 60.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;
var directionalLoc, directionalLoc2;
var spotlighLoc, spotlighLoc2;

var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function deg_to_rad(d){
	var r;
	return r = d * Math.PI / 180.0;
}

function rad_to_deg(r){
	var d;
	return d = r * 180.0 / Math.PI;
}

//functions for coloring the object
function quad(a, b, c, d, e) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     normal = vec3(normal);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[e]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[e]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[e]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[e]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[e]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[e]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[3]);
}


function colorCube() {
    // bordi
    quad( 20, 4, 5, 22, 4);
    quad( 3, 20, 10, 11, 4);
    quad( 2, 3, 11, 12, 4);
    quad( 21, 2, 12, 13, 4);
    quad( 1, 21, 23, 8, 4);
    quad( 14, 15, 7, 23, 4);
    quad( 15, 16, 6, 7, 4);
    quad( 16, 17, 22, 6, 4);

    // interno
    quad( 19, 10, 17, 18, 1);  //dietro
    quad( 19, 18, 14, 13, 5);  //sotto
    quad( 19, 13, 12, 11, 2);  //fianco_dx2
    quad( 19, 12, 11, 10, 2);  //fianco_dx1
    quad( 18, 17, 16, 15, 3);  //fianco_sx1
    quad( 18, 16, 15, 14, 3);  //fianco_sx2

    // esterno
    quad( 0, 9, 5, 4, 4);  //dietro
    quad( 0, 1, 8, 9, 4);  //sotto
    quad( 0, 4, 3, 2, 4);  //fianco_dx1
    quad( 0, 3, 2, 1, 4);  //fianco_dx2
    quad( 9, 8, 7, 6, 4);  //fianco_sx1
    quad( 9, 7, 6, 5, 4);  //fianco_sx2

}


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    gl.viewport(0, 0, canvas.width, canvas.height);

    aspect =  canvas.width/canvas.height;

    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);


    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation( program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var textureId = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureId);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

    var spotAmbientProduct = mult(spotLightAmbient, materialAmbient);
    var spotDiffuseProduct = mult(spotLightDiffuse, materialDiffuse);
    var spotSpecularProduct = mult(spotLightSpecular, materialSpecular);

    var dirAmbientProduct = mult(dirLightAmbient, materialAmbient);
    var dirDiffuseProduct = mult(dirLightDiffuse, materialDiffuse);
    var dirSpecularProduct = mult(dirLightSpecular, materialSpecular);

    var ag_am = mult(dirAmbientProduct, materialAmbient);


// buttons for viewing parameters
    document.getElementById("Button1").onclick = function(){near   *= 1.1; far *= 1.1; z += 1; document.getElementById("varZ").innerHTML = z;};
    document.getElementById("Button2").onclick = function(){near   *= 0.9; far *= 0.9; z -= 1; document.getElementById("varZ").innerHTML = z;};
    document.getElementById("Button3").onclick = function(){radius *= 1.1; document.getElementById("varR").innerHTML = radius.toFixed(2);}; //2.0
    document.getElementById("Button4").onclick = function(){radius *= (10.0/11.0); document.getElementById("varR").innerHTML = radius.toFixed(2);}; //0.5
    document.getElementById("ButtonThe+").onclick = function(){theta  += dr; var t=theta/Math.PI; document.getElementById("varT").innerHTML = t.toFixed(2);};
    document.getElementById("ButtonThe-").onclick = function(){theta  -= dr; var t=theta/Math.PI; document.getElementById("varT").innerHTML = t.toFixed(2);};
    document.getElementById("ButtonPhi+").onclick = function(){phi    += dr; var p=phi/Math.PI; document.getElementById("varP").innerHTML = p.toFixed(2);};
    document.getElementById("ButtonPhi-").onclick = function(){phi    -= dr; var p=phi/Math.PI; document.getElementById("varP").innerHTML = p.toFixed(2) ;};

    document.getElementById("co+").onclick = function(){cutOff += varCO; document.getElementById("varCO").innerHTML = cutOff;};
    document.getElementById("co-").onclick = function(){cutOff -= varCO; document.getElementById("varCO").innerHTML = cutOff;};

    // Texture switcher
    var texSwitch = document.getElementById("ButtonTex");
    texSwitch.addEventListener("click",function(){
        if(texSwitch.textContent == "Texture ON"){
            texSwitch.textContent = "Texture OFF";
            activeTex = true;
        }
        else{
            texSwitch.textContent = "Texture ON";
            activeTex = false;
        }
    });

    // Directional light switcher
    var dirSwitch = document.getElementById("ButtonDir");
    dirSwitch.addEventListener("click",function(){
        if(dirSwitch.textContent == "Directional ON"){
            dirSwitch.textContent = "Directional OFF";
            activeDir = true;
        }
        else{
            dirSwitch.textContent = "Directional ON";
            activeDir = false;
        }
    });

    // Spotlight switcher
    var spotSwitch = document.getElementById("ButtonSpot");
    spotSwitch.addEventListener("click",function(){
        if(spotSwitch.textContent == "Spotlight ON"){
            spotSwitch.textContent = "Spotlight OFF";
            activeSpot = true;
        }
        else{
            spotSwitch.textContent = "Spotlight ON";
            activeSpot = false;
        }
    });
	
	//Inizialization of button values
    document.getElementById("varZ").innerHTML  = z.toFixed(2);
    document.getElementById("varR").innerHTML  = radius.toFixed(2);
    document.getElementById("varT").innerHTML  = (theta/Math.PI).toFixed(2);
    document.getElementById("varP").innerHTML  = (phi/Math.PI).toFixed(2);
    document.getElementById("varCO").innerHTML = cutOff;

    // Spotlight
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotAmbientProduct"), spotAmbientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotDiffuseProduct"), spotDiffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotSpecularProduct"), spotSpecularProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotLightPosition"), spotLightPosition);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotLightPosition2"), spotLightPosition);
    gl.uniform4fv(gl.getUniformLocation(program, "uSpotLightDirection"), spotLightDirection);
    
    // Directional light
    gl.uniform4fv(gl.getUniformLocation(program, "uDirAmbientProduct"), dirAmbientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDirDiffuseProduct"), dirDiffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDirAmbientProduct2"), dirAmbientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDirDiffuseProduct2"), dirDiffuseProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDirSpecularProduct"), dirSpecularProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDirLightPosition"), dirLightPosition);
    gl.uniform4fv(gl.getUniformLocation(program, "uDirLightPosition2"), dirLightPosition);

    gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);
    gl.uniform1f(gl.getUniformLocation(program, "uShininess2"), materialShininess);

    gl.uniform4fv(gl.getUniformLocation(program,"ag_am"),flatten(ag_am));

    directionalLoc = gl.getUniformLocation(program, "dirFlag");
    spotlighLoc = gl.getUniformLocation(program, "spotFlag");

    directionalLoc2 = gl.getUniformLocation(program, "dirFlag2");
    spotlighLoc2 = gl.getUniformLocation(program, "spotFlag2");
	
	
	//Implementation of the texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, texSize, texSize, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    render();
}


var render = function(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
		
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    gl.uniform1f(gl.getUniformLocation(program,"textureFlag"), activeTex);

    gl.uniform1f(gl.getUniformLocation(program, "uCutOff"), Math.cos(deg_to_rad(cutOff)));

    gl.uniform1f(directionalLoc, activeDir);
    gl.uniform1f(spotlighLoc, activeSpot);
    gl.uniform1f(directionalLoc2, activeDir);
    gl.uniform1f(spotlighLoc2, activeSpot);

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);
    requestAnimationFrame(render);
}



}
homework1();
