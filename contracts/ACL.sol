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

	uint public devicesCount;
	uint public permissionsCount;

	mapping (address => uint[]) public userDevices;
	mapping (uint => Device) public devices;
	mapping (address => uint[]) public devicePermissions;
	
				
	constructor() public {
		
	}

	function getUserDevices(address index) public view returns(uint[] memory) {
		return userDevices[index];
	}

	function getDevicePermissions(address index) public view returns(uint[] memory) {
		return devicePermissions[index];
	}
	

	function addDevice (string memory deviceName, string memory imageUrl) public returns(uint[] memory)  {
		devicesCount ++;
		devices[devicesCount] = Device(devicesCount, deviceName, imageUrl, msg.sender);
		userDevices[msg.sender].push(devicesCount);
		devicePermissions[msg.sender].push(devicesCount);
		deviceAdded(devicesCount, deviceName);
		return userDevices[msg.sender];
	}

	function deleteDevice (uint deviceId) public returns(uint[] memory){
		
		require (checkOwner(msg.sender, deviceId));

		(bool status, uint[] memory newArray) = deleteElementInArray(deviceId, userDevices[msg.sender]);

		require (status);

		userDevices[msg.sender] = newArray;

		(bool statusPermission, uint[] memory newArrayPermissions) = deleteElementInArray(deviceId, devicePermissions[msg.sender]);

		require (statusPermission);
		devicePermissions[msg.sender] = newArrayPermissions;

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

		deviceAddedPermission(deviceId, devices[deviceId].deviceName, userTarget);
		devicePermissions[userTarget].push(deviceId);
	}
	
	function getDevicesByUser() public returns(uint[] memory){
		return userDevices[msg.sender];
	}

	function getDevice(uint deviceId) public returns(Device memory){
		return devices[deviceId];
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

	function getCheckOwner (uint deviceId) public view returns(bool res)  {
		return checkOwner(msg.sender, deviceId);
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

