pragma experimental ABIEncoderV2;

/**
 * The ACL contract does this and that...
 */
contract ACL {

	struct Device {
		uint deviceId;
		string deviceName;
		string imageUrl;
		address defaultOwner;
	}

	event deviceAdded (uint deviceId, string deviceName);
	event deviceDeleted (uint deviceId, string deviceName);
	event deviceCheckedPermission(uint deviceId, string deviceName, address user);
	event deviceAddedPermission(uint deviceId, string deviceName, address user);
	event getDevices(address user);
	event removePermission(uint deviceId, address userTarget);
	

	uint public devicesCount;
	uint public permissionsCount;

	mapping (address => uint[]) public userDevices;
	mapping (uint => Device) public devices;
	mapping (address => uint[]) public devicePermissions;
	mapping (uint => address[]) public deviceUserPermissions;
	mapping (uint => uint) public deviceUserPermissionsCount;
	
	
				
	constructor() public {
		
	}

	function getUserDevices() public view returns(uint[] memory) {
		return userDevices[msg.sender];
	}

	function getDevicePermissions() public view returns(uint[] memory) {
		return devicePermissions[msg.sender];
	}

	function getDeviceUserPermissions(uint deviceId) public view returns(address[] memory) {
		return deviceUserPermissions[deviceId];
	}


	function addDevice (string memory deviceName, string memory imageUrl) public returns(uint[] memory)  {
		devicesCount ++;
		devices[devicesCount] = Device(devicesCount, deviceName, imageUrl, msg.sender);
		userDevices[msg.sender].push(devicesCount);
		devicePermissions[msg.sender].push(devicesCount);

		deviceUserPermissions[devicesCount].push(msg.sender);

		deviceUserPermissionsCount[devicesCount] ++;
		deviceAdded(devicesCount, deviceName);
		return userDevices[msg.sender];
	}

	function deleteDevice (uint deviceId) public returns(uint[] memory){
		
		require (checkOwner(msg.sender, deviceId));

		(bool status, uint[] memory newArray) = deleteElementInArray(deviceId, userDevices[msg.sender]);

		require (status);

		userDevices[msg.sender] = newArray;

		for(uint i = 0; i < deviceUserPermissionsCount[deviceId];i++) {
			address temp = deviceUserPermissions[deviceId][i];

			(bool statusPermission, uint[] memory newArrayPermissions) = deleteElementInArray(deviceId, devicePermissions[temp]);

			if(statusPermission == true) {
				devicePermissions[temp] = newArrayPermissions;
				deviceUserPermissionsCount[deviceId] --;
			}

		}

		delete deviceUserPermissions[deviceId];
		delete deviceUserPermissionsCount[deviceId];

		deviceDeleted(deviceId, devices[deviceId].deviceName);

		delete devices[deviceId];
		devicesCount --;
		
		return userDevices[msg.sender];
	}
	
	function checkPermission (uint deviceId) public view returns(bool) {
		return checkPermission(msg.sender, deviceId);
	}

	function addPermission (uint deviceId, address userTarget) public {
		
		require (checkOwner(msg.sender, deviceId));

		devicePermissions[userTarget].push(deviceId);
		deviceUserPermissions[deviceId].push(userTarget);
		deviceUserPermissionsCount[deviceId] ++;

		deviceAddedPermission(deviceId, devices[deviceId].deviceName, userTarget);
	}
	
	function getDevicesByUser() public returns(uint[] memory){
		return userDevices[msg.sender];
	}

	function getDevice(uint deviceId) public returns(Device memory){
		return devices[deviceId];
	}

	function removePermissionFromDevice (uint deviceId, address userTarget) returns(bool res) {
		
		require (checkOwner(msg.sender, deviceId));

		(bool statusPermission, uint[] memory newArrayPermissions) = deleteElementInArray(deviceId, devicePermissions[userTarget]);
		
		require (statusPermission);
		deviceUserPermissionsCount[deviceId] --;

		(bool statusPermission2, address[] memory newDeviceUserPermissions) = deleteElementInArrayAddress(userTarget, deviceUserPermissions[deviceId]);


		require (statusPermission2);

		deviceUserPermissions[deviceId] = newDeviceUserPermissions;
		
		devicePermissions[msg.sender] = newArrayPermissions;

		removePermission(deviceId, userTarget);
	}
	
	
	function checkPermission(address user, uint deviceId) internal returns(bool){
		uint[] memory devPers= devicePermissions[user];
		for(uint i = 0;i < devPers.length; i++) {
			uint temp = devPers[i];
			if(temp == deviceId) {
				return true;
			}
		}
		return false;
	}
	
	function checkOwner (address user, uint deviceId) internal returns(bool) {
		return devices[deviceId].defaultOwner == user;
	}

	function getDeviceOwner(uint deviceId) public view returns(address) {
		return devices[deviceId].defaultOwner;
	}
	

	function deleteElementInArrayAddress(address element, address[] storage arr) internal returns(bool, address[] memory) {
		for(uint i = 0;i<arr.length;i++) {
			if(element == arr[i]) {
				for(uint j = i;i<arr.length-1;i++) {
					arr[j] = arr[j+1];
				}
				arr.length --;
				return (true, arr);
			}
		}
		return (false, arr);
	}

	function deleteElementInArray(uint element, uint[] storage arr) internal returns(bool, uint[] memory) {
		for(uint i = 0;i<arr.length;i++) {
			if(element == arr[i]) {
				for(uint j = i;i<arr.length-1;i++) {
					arr[j] = arr[j+1];
				}
				arr.length --;
				return (true, arr);
			}
		}
		return (false, arr);
	}
	
}

