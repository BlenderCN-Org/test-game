/**
 * Renderization module
 */
define(['app/webgl'],function(webgl)
{

	"use strict";
	
	/*************************************************************************
	 * Renderer class
	 *************************************************************************/
	
	/**
	 * Vertex Shader
	 */
	var VertexShader = [ 
						"attribute vec3 vertexPosition;",
						"attribute vec2 vertexTexCoord;",
						"attribute vec3 vertexNormal;",
						
						"uniform mat4 modelMatrix;",
						"uniform mat4 viewMatrix;",
						"uniform mat4 projectionMatrix;",
						
						"uniform vec3 lightDirection;",
						
						"varying vec2 texCoord;",
						"varying vec3 diffuseLight;",
						
						"void main(void) {",
						" texCoord = vertexTexCoord;",
						
						" float lightIntensity = dot(normalize(vertexNormal), lightDirection);",
						" diffuseLight = vec3(max(lightIntensity, 0.0) * 0.5 + 0.5);",
						
						" gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1.0);",
						"}"
	          ].join("\n");

	/**
	 * Frament Shader
	 */
	var FragmentShader = [
						"uniform sampler2D textureUnit;",
						
						"varying vec2 texCoord;",
						"varying vec3 diffuseLight;",
						
						"void main(void) {",
						" gl_FragColor = texture2D(textureUnit, texCoord) * vec4(diffuseLight,1);",
						"}"
	          ].join("\n");	
	/**
	 * Constructor
	 */
	var Renderer = function (gl)
	{
		this.models = new Array();
		
		// Vertex Stride = position (3 floats) + texCoord (2 floats) + normal (3 floats) =
		//				= 8 * 4 (bytes to store a float) = 32 bytes
		this.vertexStride = 32;
		
		this.shader = webgl.Util.createShaderProgram(gl, VertexShader, FragmentShader, 
						["vertexPosition", "vertexTexCoord", "vertexNormal"],
						["modelMatrix", "viewMatrix", "projectionMatrix",
						 "lightDirection", "textureUnit"]);
	};
	
	/**
	 * Adds a model to the render model queue
	 */
	Renderer.prototype.addModel = function(model)
	{
		this.models.push(model);
	};
	
	/**
	 * Draws a model
	 * @param gl
	 * @param model
	 */
	Renderer.prototype._drawModel = function (gl, model)
	{
		var i, j, k, instance, mesh, submesh;

		gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);

		for(i in model.instances)
		{
			instance = model.instances[i];
			
			gl.uniformMatrix4fv(this.shader.uniform.modelMatrix, false, instance.modelMatrix);
			
			for (j in model.meshes)
			{
				mesh = model.meshes[j];

				gl.bindTexture(gl.TEXTURE_2D, mesh.textureUnit);

				for (k in mesh.submeshes)
				{
					submesh = mesh.submeshes[k];
					gl.drawElements(gl.TRIANGLES, submesh.indexLength,
							gl.UNSIGNED_SHORT, submesh.indexOffset * 2);
				}
			}
		}
	};
	
	/**
	 * Draws the models
	 * @param gl
	 * @param camera
	 * @param light
	 */
	Renderer.prototype.draw = function(gl, camera, light)
	{
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.useProgram(this.shader);
		
		for(var i in this.models)
		{
			var model = this.models[i];
            
            if (!model.binComplete || !model.jsonComplete)
        	{
        		return;
        	}
			
			gl.uniformMatrix4fv(this.shader.uniform.viewMatrix, false, camera.viewMatrix);
	        gl.uniformMatrix4fv(this.shader.uniform.projectionMatrix, false, camera.projectionMatrix);
	        gl.uniform3fv(this.shader.uniform.lightDirection, light.direction);
	        
	        gl.activeTexture(gl.TEXTURE0);
	        gl.uniform1i(this.shader.uniform.textureUnit, 0);

	        gl.enableVertexAttribArray(this.shader.attribute.vertexPosition);
	        gl.enableVertexAttribArray(this.shader.attribute.vertexTexCoord);
	        gl.enableVertexAttribArray(this.shader.attribute.vertexNormal);
	        
	        gl.vertexAttribPointer(this.shader.attribute.vertexPosition, 3,
	        		gl.FLOAT, false, this.vertexStride, 0);
	        gl.vertexAttribPointer(this.shader.attribute.vertexTexCoord, 2,
	        		gl.FLOAT, false, this.vertexStride, 12);
	        gl.vertexAttribPointer(this.shader.attribute.vertexNormal, 3,
	        		gl.FLOAT, false, this.vertexStride, 20);
	        
	        this._drawModel(gl, model);
		}
	};
	
	return{
		Renderer : Renderer
	};
});