/**
 * Light module
 */
define(['app/math'],
		function(math)
{

	"use strict";
	
	/*************************************************************************
	 * Light class
	 *************************************************************************/
	
	/**
	 * Constructor
	 * @param direction
	 */
	var Light = function(direction)
	{
		this.direction = math.Vector3.createCopy(direction);
	};
		
	return{
		Light : Light
	};
});