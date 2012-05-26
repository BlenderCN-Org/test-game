/**
 * Models module
 */
define(['app/webgl',
        'app/math'], function(webgl,math)
{
	/**
	 * World Y axis
	 */
	var WORLD_Y_AXIS = math.Vector3.createCopy([0,1,0]);

	"use strict";

	/*************************************************************************
	 * SubMesh class
	 *************************************************************************/

	/**
	 * Constructor
	 */
	var SubMesh = function()
	{
		this.indexOffset = 0;
		this.indexLength = 0;
	};

	/*************************************************************************
	 * Mesh class
	 *************************************************************************/

	/**
	 * Constructor
	 */
	var Mesh = function()
	{
		this.textureUnit = null;
		this.submeshes = new Array();
	};

	/*************************************************************************
	 * Model class
	 *************************************************************************/

	/**
	 * Constructor
	 */
	var Model = function()
	{
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.meshes = new Array();
		this.instances = new Array();
		// TODO: Remove this using WebSockets sync calls
		this.binComplete = false;
		this.jsonComplete = false;
	};

	/**
	 * Sets the model vertex buffer
	 * @param gl
	 * @param vertexArray
	 */
	Model.prototype.setVertexBuffer = function(gl, vertexArray)
	{
		if (this.vertexBuffer == null)
		{
			this.vertexBuffer = webgl.Util.createVertexBuffer(gl, vertexArray);
		}
	};

	/**
	 * Sets the model index buffer
	 * @param gl
	 * @param indexArray
	 */
	Model.prototype.setIndexBuffer = function(gl, indexArray)
	{
		if (this.indexBuffer == null)
		{
			this.indexBuffer = webgl.Util.createIndexBuffer(gl, indexArray);
		}
	};

	/**
	 * Creates a new instance of the model
	 * @returns {Instance}
	 */
	Model.prototype.createInstance = function()
	{
		var newInstance = new Instance();
		
		this.instances.push(newInstance);
		
		return newInstance;
	};

	/*************************************************************************
	 * Model Instance class
	 *************************************************************************/
	
	/**
	 * Constructor
	 */
	var Instance = function()
	{
		this._position = math.Vector3.createCopy([0,0,0]);
		this._direction = math.Vector3.createCopy([0,0,-1]);
		this._up = WORLD_Y_AXIS;
		
		this._orientation = math.Quaternion.identity();
		this._forward = math.Vector3.createCopy([0,0,-1]);
		
		this.modelMatrix = math.Matrix4.identity();
		
		// Caches
		this._quatRot = math.Quaternion.identity();
		this._positionDelta = math.Vector3.create();
		// End caches
	};
	
	/**
	 * Public method to move the instance
	 * @param distance
	 */
	Instance.prototype.move = function(distance)
	{
		math.Vector3.scaleDest(this._forward, distance, this._positionDelta);
		math.Vector3.addAcc(this._position, this._positionDelta);
		
		this._updateModelMatrix();
	};
	
	/**
	 * Rotates the instance
	 * @param angle
	 */
	Instance.prototype.rotate = function(angle)
	{
		// Calculate horizontal rotation
		math.Quaternion.fromAxisAngleDest(this._up, angle, this._quatRot);
		math.Quaternion.normalizeAcc(this._quatRot);
		
		// Calculate orientation
		math.Quaternion.multDest(this._quatRot, this._orientation, this._orientation);
		math.Quaternion.normalizeAcc(this._orientation);
		
		this._updateModelMatrix();
	};
	
	/**
	 * Update the model matrix
	 */
	Instance.prototype._updateModelMatrix = function()
	{
		// Set orientation
		math.Matrix4.setOrientation(this.modelMatrix,this._orientation);
		
		// Update forward direction
		math.Matrix4.multVec3Dest(this._direction, this.modelMatrix, this._forward);
		
		// Set Position
		math.Matrix4.setTranslation(this.modelMatrix,this._position);
		
		// OpenGL works in column-major order
		math.Matrix4.transposeAcc(this.modelMatrix);
	};
	
	return {
		SubMesh : SubMesh,

		Mesh : Mesh,

		Model : Model,
		
		Instance : Instance
	};
});