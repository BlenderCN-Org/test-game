/**
 * Camera module
 */
define(['app/math'],function(math)
{

	"use strict";
	
	/**
	 * World Y axis
	 */
	var WORLD_Y_AXIS = math.Vector3.createCopy([0,1,0]);
	
	/*************************************************************************
	 * Camera class
	 *************************************************************************/
	
	/**
	 * Constructor
	 * @param fovy
	 * @param aspect
	 * @param near
	 * @param far
	 * @returns {Camera}
	 */
	var Camera = function(fovy, aspect, near, far)
	{
		this._position = math.Vector3.createCopy([0,0,0]);
		this._direction = math.Vector3.createCopy([0,0,-1]);
		this._right = math.Vector3.create();
		this._up = WORLD_Y_AXIS;
		
		this._orientation = math.Quaternion.identity();
		this._forward = math.Vector3.createCopy([0,0,-1]);
		
		this.viewMatrix = null;
		this.projectionMatrix = math.Matrix4.perspective(fovy,aspect,near,far);
		
		// Caches
		this._nViewMatrix = math.Matrix4.create();
		this._translation = math.Vector3.create();
		this._quatRot = math.Quaternion.identity();
		this._quatRotV = math.Quaternion.identity();
		this._quatRotH = math.Quaternion.identity();
		this._positionDelta = math.Vector3.create();
		// End caches
		
		this._focus();
	};
	
	/**
	 * Focuses the camera to the target point
	 * @param position
	 * @param direction
	 * @param up
	 */
	Camera.prototype.lookAt = function(position, direction, up)
	{
		this._position = math.Vector3.createCopy(position);
		this._direction = math.Vector3.createCopy(direction);
		this._up = math.Vector3.createCopy(up);
		
		this._focus();
	};
	
	/**
	 * Moves the camera
	 * @param distance
	 */
	Camera.prototype.move = function(distance)
	{
		math.Vector3.scaleDest(this._forward, distance, this._positionDelta);
		math.Vector3.addAcc(this._position, this._positionDelta);
		
		this._computeViewMatrix();
	};
	
	/**
	 * Rotates the camera
	 * @param angleV
	 * @param angleH
	 */
	Camera.prototype.rotate = function(angleV, angleH)
	{
		// Calculate right direction
		math.Vector3.crossDest(this._forward,this._up,this._right);
		math.Vector3.normalizeAcc(this._right);
		
		// Calculate vertical rotation
		math.Quaternion.fromAxisAngleDest(this._right, angleV, this._quatRotV);
		math.Quaternion.normalizeAcc(this._quatRotV);
		
		// Calculate horizontal rotation
		math.Quaternion.fromAxisAngleDest(this._up, angleH, this._quatRotH);
		math.Quaternion.normalizeAcc(this._quatRotH);
		
		// Calculate global rotation
		math.Quaternion.multDest(this._quatRotH, this._quatRotV, this._quatRot);
		math.Quaternion.normalizeAcc(this._quatRot);
		
		// Calculate orientation
		math.Quaternion.multDest(this._quatRot, this._orientation, this._orientation);
		math.Quaternion.normalizeAcc(this._orientation);
		
		this._computeViewMatrix();
	};
	
	/**
	 * Sets up the camera with the target position to focus
	 */
	Camera.prototype._focus = function()
	{
		this.viewMatrix = math.Matrix4.lookAt(this._position, this._direction, this._up);
		
		this._orientation = math.Quaternion.fromMat4(this.viewMatrix);
		
		this._computeViewMatrix();
	};
	
	/**
	 * Computes the view matrix
	 */
	Camera.prototype._computeViewMatrix = function()
	{
		// Set orientation
		math.Matrix4.setOrientation(this.viewMatrix,this._orientation);
		
		// Set Translation
		math.Matrix4.negateDest(this.viewMatrix, this._nViewMatrix);
		math.Matrix4.multVec3Dest(this._position, this._nViewMatrix, this._translation);
		math.Matrix4.setTranslation(this.viewMatrix,this._translation);
		
		// OpenGL works in column-major order
		math.Matrix4.transposeAcc(this.viewMatrix);
		
		// Update view direction
		math.Matrix4.multVec3Dest(this._direction, this.viewMatrix, this._forward);
	};
	
	return{
		Camera : Camera
	};
});