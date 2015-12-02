/**
 * @start feature Math
 * @assign Chase
 * @reviewedBy Grant
 * @todo
 * 	- add capability
 * 	- minus capability
 * 	- display the result
 */

/**
 * @name add
 * @require Math.minus
 * @start test
 * 	assert(add(1, 1) == 2, 'equal 2');
 * 	assert(add('a', 1) == undefined, 'equal undefined');
 * @end test
 * @description Add two numbers together
 * 
 * @todo
 *  + add numbers together
 *  - assert
 */
function add(a, b){
	return a + b;
}

function minus(a, b){
	return a - b;
}

/**
 * @end feature Math
 */