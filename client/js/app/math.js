/**
 * Math module.
 * 
 * Names convention:
 * - <operation>:		Returns and object.
 * - <operationAcc>:	Performs an operation and stores the result in the first
 * 						parameter.
 * - <operationDest>:	Performs an operation and stores the result in the third
 * 						parameter, or second if it has only two parameters.
 * - <setOperation>:	Performs an operation and stores the result in the first
 * 						parameter.
 */
define(function()
{

	"use strict";
	
	/*************************************************************************
	 * Vector3 class
	 *************************************************************************/
	
	/**
	 * Vector3 object
	 */
	var Vector3 = {};
	
	/**
	 * Creates an empty Vector 3
	 * @returns {Float32Array}
	 */
	Vector3.create = function()
	{
		return new Float32Array(3);
	};
	
	/**
	 * Creates a Vector 3 with initial values
	 * @param vec
	 * @returns {Float32Array}
	 */
	Vector3.createCopy = function(vec)
	{
		var result = new Float32Array(3);

		result[0] = vec[0];
		result[1] = vec[1];
		result[2] = vec[2];

	    return result;
	};
	
	/**
	 * Adds two vectors and accumulates the result in the first vector
	 * @param acc
	 * @param vec
	 * @returns {Float32Array}
	 */
	Vector3.addAcc = function(acc, vec)
	{
		acc[0] += vec[0];
        acc[1] += vec[1];
        acc[2] += vec[2];
	};
	
	/**
	 * Scales a Vector3 by a scalar.
	 * Stores the result in the third parameter
	 * @param vec
	 * @param val
	 * @param dest
	 * @returns
	 */
	Vector3.scaleDest = function (vec, val, dest)
	{
	    dest[0] = vec[0] * val;
	    dest[1] = vec[1] * val;
	    dest[2] = vec[2] * val;
	};
	
	/**
	 * Normalizes a Vector3
	 * @param vec
	 */
	Vector3.normalizeAcc = function (vec)
	{
	    var x = vec[0], y = vec[1], z = vec[2],
	        len = Math.sqrt(x * x + y * y + z * z);

	    if (!len) {
	        vec[0] = 0;
	        vec[1] = 0;
	        vec[2] = 0;
	    } else if (len === 1) {
	        vec[0] = x;
	        vec[1] = y;
	        vec[2] = z;
	    }

	    len = 1 / len;
	    vec[0] = x * len;
	    vec[1] = y * len;
	    vec[2] = z * len;
	};
	
	/**
	 * Calculates the cross product of two vectors.
	 * Stores the result in the third parameter.
	 * @param vec
	 * @param vec2
	 * @param dest
	 */
	Vector3.crossDest = function (vec, vec2, dest)
	{
	    var x = vec[0], y = vec[1], z = vec[2],
	        x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];

	    dest[0] = y * z2 - z * y2;
	    dest[1] = z * x2 - x * z2;
	    dest[2] = x * y2 - y * x2;
	};
	
	/*************************************************************************
	 * Quaternion class
	 *************************************************************************/
	
	/**
	 * Are more efficient than rotation Matrix for:
	 * - Storage requirements:
	 * 		Method				Storage
	 * 		Rotation matrix			9
	 * 		Quaternion				4
	 * 		Angle/axis				3*
	 * 
	 * - Rotation chaining operations:
	 * 		Method				# multiplies	# add/subtracts	total operations
	 * 		Rotation matrices		27					18				45
	 * 		Quaternions				16					12				28
	 *
	 */ 

	/**
	 * 
	 * Some useful (normalized) quaternions:
	 * -------------------------------------------------------------------------------
	 * w			x			y			z			Description
	 * 1			0			0			0			Identity quaternion, no rotation
	 * 0			1			0			0			180° turn around X axis
	 * 0			0			1			0			180° turn around Y axis
	 * 0			0			0			1			180° turn around Z axis
	 * sqrt(0.5)	sqrt(0.5)	0			0			90° rotation around X axis
	 * sqrt(0.5)	0			sqrt(0.5)	0			90° rotation around Y axis
	 * sqrt(0.5)	0			0			sqrt(0.5)	90° rotation around Z axis
	 * sqrt(0.5)	-sqrt(0.5)	0			0			-90° rotation around X axis
	 * sqrt(0.5)	0			-sqrt(0.5)	0			-90° rotation around Y axis
	 * sqrt(0.5)	0			0			-sqrt(0.5)	-90° rotation around Z axis
	 * ----------------------------------------------------------------------------------
	 */
	
	/**
	 * Quaternion object
	 */
	var Quaternion = {};
	
	/**
	 * Creates a Quaternion (w, x, y, z)
	 * @returns {Float32Array}
	 */
	Quaternion.create = function()
	{
	    return new Float32Array(4);
	};
	
	/**
	 * Creates a Quaternion (w, x, y, z) with initial values
	 * @param quat
	 * @returns {Float32Array}
	 */
	Quaternion.createCopy = function(quat)
	{
		var newQuat = new Float32Array(4);

		newQuat[0] = quat[0];	// w
		newQuat[1] = quat[1];	// x
		newQuat[2] = quat[2];	// y
		newQuat[3] = quat[3];	// z

	    return newQuat;
	};
	
	/**
	 * Creates an identity Quaternion (w, x, y, z)
	 * @returns {Float32Array}
	 */
	Quaternion.identity = function()
	{
		var result = new Float32Array(4);

		result[0] = 1;	// w
		result[1] = 0;	// x
		result[2] = 0;	// y
		result[3] = 0;	// z

	    return result;
	};
	
	/**
	 * Creates a quaternion from an axis and an angle.
	 * Stores the result in the third parameter
	 * @param axis
	 * @param angle
	 * @param dest
	 * @returns {Float32Array}
	 */
	Quaternion.fromAxisAngleDest = function(axis, angle, dest)
	{
		var x = axis[0], y = axis[1], z=axis[2];
		
		var halfAngle = 0.5 * angle;
		var s = Math.sin(halfAngle);
		
		dest[0] = Math.cos(halfAngle);
		dest[1] = s * x;
		dest[2] = s * y;
		dest[3] = s * z;
	};
	
	/**
	 * Retrieves the length of a quaternion
	 * @param quat
	 * @returns
	 */
	Quaternion.length = function(quat)
	{
		 var w = quat[0], x = quat[1], y = quat[2], z = quat[3];
		 return Math.sqrt(w*w + x*x + y*y + z*z);
	};
	
	/**
	 * Normalizes a quaternion
	 * @param quat
	 */
	Quaternion.normalizeAcc = function(quat)
	{
		var w = quat[0], x = quat[1], y = quat[2], z = quat[3];
		
		var length =  Math.sqrt(w*w + x*x + y*y + z*z);
		length = 1 / length;
		
		quat[0] = w * length;
		quat[1] = x * length;
	    quat[2] = y * length;
	    quat[3] = z * length;
	};
	
	/**
	 * Multiplies two quaternions and stores the result in the last quaternion
	 * @param q1
	 * @param q2
	 */
	Quaternion.multDest = function (q1, q2, dest)
	{
	    var w1 = q1[0], x1 = q1[1], y1 = q1[2], z1 = q1[3],
	        w2 = q2[0], x2 = q2[1], y2 = q2[2], z2 = q2[3];
	    
	    dest[0] = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
	    dest[1] = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
	    dest[2] = w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2;
	    dest[3] = w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2;
	};
	
	/**
	 * Creates a Matrix4 from a quaternion
	 * @param quat
	 * @returns
	 */
	Quaternion.toMat4 = function (quat)
	{
	    var result = Matrix4.create();

	    var w = quat[0], x = quat[1], y = quat[2], z = quat[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,

	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    result[0] = 1 - (yy + zz);
	    result[1] = xy + wz;
	    result[2] = xz - wy;
	    result[3] = 0;

	    result[4] = xy - wz;
	    result[5] = 1 - (xx + zz);
	    result[6] = yz + wx;
	    result[7] = 0;

	    result[8] = xz + wy;
	    result[9] = yz - wx;
	    result[10] = 1 - (xx + yy);
	    result[11] = 0;

	    result[12] = 0;
	    result[13] = 0;
	    result[14] = 0;
	    result[15] = 1;

	    return result;
	};
	
	/**
	 * Utility function for copy the sign
	 */
	function copySign( a, b )
	{

		return b < 0 ? -Math.abs( a ) : Math.abs( a );

	}
	
	/**
	 * Creates a quaternion from a Matrix4
	 * @param mat
	 * @returns
	 */
	Quaternion.fromMat4 = function(mat)
	{
		var q = Quaternion.create();
		
		var m0 = mat[0], m1 = mat[1], m2 = mat[2],
			m4 = mat[4], m5 = mat[5], m6 = mat[6],
			m8 = mat[8], m9 = mat[9], m10 = mat[10];

		var absQ = Math.pow( Matrix4.determinant(mat), 1.0 / 3.0 );
		 q[0] = Math.sqrt( Math.max( 0, absQ + m0 + m5 + m10 ) ) / 2;
		 q[1] = Math.sqrt( Math.max( 0, absQ + m0 - m5 - m10 ) ) / 2;
		 q[2] = Math.sqrt( Math.max( 0, absQ - m0 + m5 - m10 ) ) / 2;
		 q[3] = Math.sqrt( Math.max( 0, absQ - m0 - m5 + m10 ) ) / 2;
		 q[1] = copySign( q[1], ( m6 - m9 ) );
		 q[2] = copySign( q[2], ( m8 - m2 ) );
		 q[3] = copySign( q[3], ( m1 - m4 ) );

		Quaternion.normalizeAcc(q);

		return q;
	};
	
	/*************************************************************************
	 * Matrix4 class
	 *************************************************************************/
	/**
	 * OpenGL Model View matrix order is column major:
	 * 
	 * 0 4  8 12
	 * 1 5  9 13
	 * 2 6 10 14
	 * 3 7 11 15
	 * 
	 * left(x-axis): 	 0,  1,  2
	 * up(y-axis):	 	 4,  5,  6
	 * forward(z-axis):	 8,  9, 10
	 * translation: 	12, 13, 14
	 * 
	 * A matrix stored in an unidimensional array is as follows:
	 * m0  m1  m2  m3 m4  m5  m6  m7 m8  m9  m10 m11 m12 m13 m14 m15
	 * 
	 * We can think of it as a two-dimensional matrix as follows:
	 * m0 m4 m8  m12
	 * m1 m5 m9  m13
	 * m2 m6 m10 m14
	 * m3 m7 m11 m15
	 * 
	 * So the view axis and translation are:
	 * left(x-axis): 	 m0,  m1,  m2
	 * up(y-axis):	 	 m4,  m5,  m6
	 * forward(z-axis):	 m8,  m9,  m10
	 * translation: 	 m12, m13, m14
	 */
	
	/**
	 * Rotation matrix are more efficient than quaternions for:
	 * - Vector rotating operations:
	 * 		Method				# multiplies	# add/subtracts	# sin/cos	total operations
	 * 		Rotation matrix				9				6			0				15
	 * 		Quaternions					18				12			0				30
	 * 		Angle/axis					23				16			2				41
	 */
	
	/**
	 * Matrix4 object
	 */
	var Matrix4 = {};
	
	/**
	 * Creates a Matrix 4x4
	 * @returns
	 */
	Matrix4.create = function()
	{
		return new Float32Array(16);
	};
	
	/**
	 * Creates a perspective matrix
	 * @param fovy
	 * @param aspect
	 * @param near
	 * @param far
	 * @returns
	 */
	Matrix4.perspective = function(fovy, aspect, near, far)
	{
		var top = near * Math.tan(fovy * Math.PI / 360.0);
        var right = top * aspect;
		
		return Matrix4.frustum(-right, right, -top, top, near, far);
	};
	
	/**
	 * Creates a frustum matrix
	 * @param left
	 * @param right
	 * @param bottom
	 * @param top
	 * @param near
	 * @param far
	 * @returns
	 */
	Matrix4.frustum = function (left, right, bottom, top, near, far)
	{
	    var result = Matrix4.create();
	    
	    var rl = (right - left);
	    var tb = (top - bottom);
	    var fn = (far - near);
	    
	    result[0] = (near * 2) / rl;
	    result[1] = 0;
	    result[2] = 0;
	    result[3] = 0;
	    result[4] = 0;
	    result[5] = (near * 2) / tb;
	    result[6] = 0;
	    result[7] = 0;
	    result[8] = (right + left) / rl;
	    result[9] = (top + bottom) / tb;
	    result[10] = -(far + near) / fn;
	    result[11] = -1;
	    result[12] = 0;
	    result[13] = 0;
	    result[14] = -(far * near * 2) / fn;
	    result[15] = 0;
	    
	    return result;
	};
	
	/**
	 * Creates an identity Matrix 4x4
	 * @returns
	 */
	Matrix4.identity = function()
	{
		var result = Matrix4.create();
		
	    result[0] = 1;
	    result[1] = 0;
	    result[2] = 0;
	    result[3] = 0;
	    result[4] = 0;
	    result[5] = 1;
	    result[6] = 0;
	    result[7] = 0;
	    result[8] = 0;
	    result[9] = 0;
	    result[10] = 1;
	    result[11] = 0;
	    result[12] = 0;
	    result[13] = 0;
	    result[14] = 0;
	    result[15] = 1;
	    
	    return result;
	};
	
	/**
	 * Negates a Matrix4
	 * Stores the result in the second parameter
	 * @param mat
	 * @param dest
	 * @returns
	 */
	Matrix4.negateDest = function(mat, dest)
	{
		for(var i=0; i<16; i++)
		{
			dest[i] = -mat[i];
		}
	};
	
	/**
	 * Multiplies a Matrix4 by a Vector3. Thus, rotates a vector by a matrix.
	 * Stores the result in the third parameter.
	 * @param vec
	 * @param mat
	 * @returns
	 */
	Matrix4.multVec3Dest = function (vec, mat, dest)
	{
	    var x = vec[0], y = vec[1], z = vec[2];

	    dest[0] = mat[0] * x + mat[1] * y + mat[2] * z + mat[3];
	    dest[1] = mat[4] * x + mat[5] * y + mat[6] * z + mat[7];
	    dest[2] = mat[8] * x + mat[9] * y + mat[10] * z + mat[11];
	};
	
	/**
	 * Retrieves a view matrix from 3 vectors.
	 * @param position: position of the camera.
	 * @param direction: direction towards the camera is pointing.
	 * @param up: up vector of the camera.
	 * @returns
	 */
	Matrix4.lookAt = function (position, direction, up)
	{
	    var dest = Matrix4.create();

	    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
	        positionx = position[0],
	        positiony = position[1],
	        positionz = position[2],
	        upx = up[0],
	        upy = up[1],
	        upz = up[2],
	        directionx = direction[0],
	        directiony = direction[1],
	        directionz = direction[2];

	    if (positionx === directionx && positiony === directiony && positionz === directionz) {
	        return Matrix4.identity();
	    }

	    //vec3.direction(position, direction, z);
	    z0 = positionx - direction[0];
	    z1 = positiony - direction[1];
	    z2 = positionz - direction[2];

	    // normalize (no check needed for 0 because of early return)
	    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;

	    //vec3.normalize(vec3.cross(up, z, x));
	    x0 = upy * z2 - upz * z1;
	    x1 = upz * z0 - upx * z2;
	    x2 = upx * z1 - upy * z0;
	    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	    if (!len) {
	        x0 = 0;
	        x1 = 0;
	        x2 = 0;
	    } else {
	        len = 1 / len;
	        x0 *= len;
	        x1 *= len;
	        x2 *= len;
	    }

	    //vec3.normalize(vec3.cross(z, x, y));
	    y0 = z1 * x2 - z2 * x1;
	    y1 = z2 * x0 - z0 * x2;
	    y2 = z0 * x1 - z1 * x0;

	    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	    if (!len) {
	        y0 = 0;
	        y1 = 0;
	        y2 = 0;
	    } else {
	        len = 1 / len;
	        y0 *= len;
	        y1 *= len;
	        y2 *= len;
	    }

	    dest[0] = x0;
	    dest[1] = y0;
	    dest[2] = z0;
	    dest[3] = 0;
	    dest[4] = x1;
	    dest[5] = y1;
	    dest[6] = z1;
	    dest[7] = 0;
	    dest[8] = x2;
	    dest[9] = y2;
	    dest[10] = z2;
	    dest[11] = 0;
	    dest[12] = -(x0 * positionx + x1 * positiony + x2 * positionz);
	    dest[13] = -(y0 * positionx + y1 * positiony + y2 * positionz);
	    dest[14] = -(z0 * positionx + z1 * positiony + z2 * positionz);
	    dest[15] = 1;

	    return dest;
	};
	
	/**
	 * Sets the translation of a Matrix4 from a Vector3
	 * @param mat
	 * @param vec
	 */
	Matrix4.setTranslation = function(mat, vec)
	{
		mat[3] = vec[0];
		mat[7] = vec[1];
		mat[11] = vec[2];
	};
	
	/**
	 * Sets the orientation of a Matrix4 from a Quaternion
	 * @param mat
	 * @param quat
	 */
	Matrix4.setOrientation = function (mat, quat)
	{
	    var w = quat[0], x = quat[1], y = quat[2], z = quat[3],
	        x2 = x + x,
	        y2 = y + y,
	        z2 = z + z,

	        xx = x * x2,
	        xy = x * y2,
	        xz = x * z2,
	        yy = y * y2,
	        yz = y * z2,
	        zz = z * z2,
	        wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;

	    mat[0] = 1 - (yy + zz);
	    mat[1] = xy + wz;
	    mat[2] = xz - wy;
	    mat[3] = 0;

	    mat[4] = xy - wz;
	    mat[5] = 1 - (xx + zz);
	    mat[6] = yz + wx;
	    mat[7] = 0;

	    mat[8] = xz + wy;
	    mat[9] = yz - wx;
	    mat[10] = 1 - (xx + yy);
	    mat[11] = 0;

	    mat[12] = 0;
	    mat[13] = 0;
	    mat[14] = 0;
	    mat[15] = 1;
	};
	
	/**
	 * Calculates the determinant of a Matrix
	 * @param mat
	 * @returns {Number}
	 */
	Matrix4.determinant = function (mat)
	{
	    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
	        a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
	        a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
	        a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

	    return (a30 * a21 * a12 * a03 - a20 * a31 * a12 * a03 - a30 * a11 * a22 * a03 + a10 * a31 * a22 * a03 +
	            a20 * a11 * a32 * a03 - a10 * a21 * a32 * a03 - a30 * a21 * a02 * a13 + a20 * a31 * a02 * a13 +
	            a30 * a01 * a22 * a13 - a00 * a31 * a22 * a13 - a20 * a01 * a32 * a13 + a00 * a21 * a32 * a13 +
	            a30 * a11 * a02 * a23 - a10 * a31 * a02 * a23 - a30 * a01 * a12 * a23 + a00 * a31 * a12 * a23 +
	            a10 * a01 * a32 * a23 - a00 * a11 * a32 * a23 - a20 * a11 * a02 * a33 + a10 * a21 * a02 * a33 +
	            a20 * a01 * a12 * a33 - a00 * a21 * a12 * a33 - a10 * a01 * a22 * a33 + a00 * a11 * a22 * a33);
	};
	
	/**
	 * Transposes the specified Matrix
	 * @param mat
	 */
	Matrix4.transposeAcc = function (mat)
	{
		var a01 = mat[1], a02 = mat[2], a03 = mat[3],
        a12 = mat[6], a13 = mat[7],
        a23 = mat[11];

		mat[1] = mat[4];
		mat[2] = mat[8];
		mat[3] = mat[12];
		mat[4] = a01;
		mat[6] = mat[9];
		mat[7] = mat[13];
		mat[8] = a02;
		mat[9] = a12;
		mat[11] = mat[14];
		mat[12] = a03;
		mat[13] = a13;
		mat[14] = a23;
	};
	
	return {
		Vector3 : Vector3,
		
		Quaternion : Quaternion,
		
		Matrix4 : Matrix4
	};
});