/**
 * Importer module to import models
 */
define(['app/webgl',
        'app/model'],
		function(webgl,m)
{
	/*************************************************************************
	 * Unity model importer class
	 *************************************************************************/
	
	/**
	 * Model importer object
	 */
	var Unity = {};
	
	/**
	 * Loads a model and returns it by the callback
	 * @param gl
	 * @param url
	 * @returns
	 */
	Unity.load = function(gl, url)
	{
		var model = new m.Model();
		
		var binaryData = null;
		var jsonData = null;
		
		// Load the binary portion of the model
        var vertXhr = new XMLHttpRequest();
        vertXhr.open('GET', url + ".bin", true);
        vertXhr.responseType = "arraybuffer";
        vertXhr.onload = function() {
        	binaryData = this.response;
            Unity._parseBinary(gl,binaryData,model);
            model.binComplete = true;
        };
        vertXhr.send(null);

        // Load the json portion of the model
        var jsonXhr = new XMLHttpRequest();
        jsonXhr.open('GET', url + ".json", true);
        jsonXhr.onload = function() {
        	jsonData = JSON.parse(this.responseText);
        	Unity._parseJSON(gl,jsonData,model);
        	model.jsonComplete = true;
        };
        jsonXhr.send(null);
        
        return model;
	};
	
	/**
	 * Parses the Binary portion of the model
	 * @param gl
	 * @param binaryData
	 * @param model
	 */
	Unity._parseBinary = function(gl, binaryData, model)
	{
		var header = new Uint32Array(binaryData, 0, 4);
		var vertexArray = new Float32Array(binaryData,header[0],header[1]);
		var indexArray = new Uint16Array(binaryData,header[2],header[3]);
		
		model.setVertexBuffer(gl,vertexArray);
		model.setIndexBuffer(gl,indexArray);
	};
	
	/**
	 * Parses the JSON portion of the model.
	 * The JSON structure is the following:
	 * 
	 * {
	 * "meshes": [$meshes: { 
     *     {
     *      "defaultTexture": "$it.defaultTexture$",
     *      "submeshes": [$it.subMeshes: {
     *             { 
     *              "indexOffset": $it.indexOffset$,
     *              "indexLength": $it.indexLength$
     *             },
     *         }$]
     *      },
     *   }$]
     * }
     * 
	 * @param gl
	 * @param jsonData
	 * @param model
	 */
	Unity._parseJSON = function(gl, jsonData, model)
	{
		var i,j;
		for (i in jsonData.meshes)
		{
			var jsonMesh = jsonData.meshes[i];
			
			var mesh = new m.Mesh();
			mesh.textureUnit = webgl.Util.loadTexture(gl, jsonMesh.defaultTexture);
			
			for(j in jsonMesh.submeshes)
			{
				var jsonSubMesh = jsonMesh.submeshes[j];
				
				var submesh = new m.SubMesh();
				submesh.indexOffset = jsonSubMesh.indexOffset;
				submesh.indexLength = jsonSubMesh.indexLength;
				
				mesh.submeshes.push(submesh);
			}
			
			model.meshes.push(mesh);
		}
	};
	
	return {
		Unity : Unity
	};
});