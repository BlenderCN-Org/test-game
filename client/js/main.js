require(['lib/domReady',
         'app/webgl',
         'app/math',
         'app/camera',
         'app/light',
         'app/render',
         'app/model',
         'app/importer',
         'app/input'],
		function (doc,webgl,math,camera,lighting,render,model,importer,input)
{

    "use strict";
    
    // Variables
    var canvas = null;
    var gl = null;
    
    var cam = null;
    var light = null;
    var renderer = null;
    
    var keyboard = null;
    var mouse = null;
    
    var cubeModel = null;
    var cubeInstance = null;
    
    function init()
    {
    	canvas = document.getElementById("glcanvas");
        
        gl = webgl.Util.getContext(canvas);
        webgl.Util.init(gl,canvas);
    };
    
    function setup()
    {
    	cam = new camera.Camera(45,canvas.width/canvas.height,0.1,100);
        cam.lookAt([0,0,5], [0,0,-1], [0,1,0]);
        
        light = new lighting.Light([0,0,-1]);
        
        renderer = new render.Renderer(gl);
        
        keyboard = new input.Keyboard();
        mouse = new input.Mouse(canvas, processMouse);
    };
    
    function loadModels()
    {
    	cubeModel = importer.Unity.load(gl,"model/Cube");
        cubeInstance = cubeModel.createInstance();
        
        renderer.addModel(cubeModel);
    };
    
    function processMouse(xDelta, yDelta)
    {
    	cam.rotate(yDelta * 0.001, xDelta * 0.001);
    };
    
    function processKeyboard()
    {
    	keyboard.process('W',function(){
			cam.move(0.1);
		});
		keyboard.process('S',function(){
			cam.move(-0.1);
		});
		
		keyboard.process('A',function(){
			cam.rotate(0, 0.01);
		});
		keyboard.process('D',function(){
			cam.rotate(0,-0.01);
		});
		
		keyboard.process('I',function(){
			cubeInstance.move(0.01);
		});
		keyboard.process('K',function(){
			cubeInstance.move(-0.01);
		});
		keyboard.process('J',function(){
			cubeInstance.rotate(-0.01);
		});
		keyboard.process('L',function(){
			cubeInstance.rotate(0.01);
		});
    };
    
    function gameLoop()
    {
    	webgl.Util.startRenderLoop(function()
    	{
    		processKeyboard();

    		renderer.draw(gl, cam, light);
    	});
    };

    init();
    
    setup();
    
    loadModels();
    
    gameLoop();
});
