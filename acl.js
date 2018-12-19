import contract from 'truffle-contract';

var ACLArtifact = require('./truffle-dummy/build/contracts/ACL.json');
var ACL = contract(ACLArtifact);

var app = (privateKey, web3, account) => {
	return {
		addDevice: (deviceName, imageUrl) => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			return ACL.deployed()
				.then(instance => {
					return instance.addDevice(deviceName, imageUrl, { from: account, gas: 30000000 });
				})
				.then(receipt => receipt)
				.catch(error => {
					console.log(error);
				})
		},
		getDeviceAddedEvent: () => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			return ACL.deployed()
				.then(instance => {
					return instance.deviceAdded();
				})
		},

		grantAccess: (deviceId, userTarget) => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			return ACL.deployed()
				.then(instance => {
					return instance.addPermission(deviceId, userTarget, { from: account, gas: 30000000 });
				})
				.then(receipt => receipt)
		},
		getAccessGrantedEvent: () => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			return ACL.deployed()
				.then(instance => {
					return instance.deviceAddedPermission()
				})
		},

		removeAccess: (deviceId, userTarget) => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			return ACL.deployed()
				.then(instance => {
					return instance.removePermissionFromDevice(deviceId, userTarget, { from: account, gas: 5000000 });
				})
				.then(receipt => receipt);
		},

		getRemoveAccessEvent: () => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			return ACL.deployed()
				.then(instance => {
					return instance.removePermission();
				})
		},
		deviceOwner: (deviceId) => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			return ACL.deployed()
				.then(instance => {
					return instance.getDeviceOwner(deviceId);
				})
				.then(address => address);
		},
		checkAccess: (deviceId) => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			return ACL.deployed()
				.then(instance => {
					return instance.checkPermission(deviceId, { from: account, gas: 30000000});
				})
				.then(permission => permission);
		},
		deleteDevice: (deviceId) => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			return ACL.deployed()
				.then(instance => {
					return instance.deleteDevice(deviceId, { from: account, gas: 3000000});
				})
				.then(receipt => receipt);
		},
		getDeviceDeletedEvent: () => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			return ACL.deployed()
				.then(instance => {
					return instance.deviceDeleted();
				})
		},
		getAllUserDevices: () => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			var aclInstace = null;
			return ACL.deployed()
				.then(instance => {
					aclInstace = instance;
					return instance.getUserDevices({ from: account, gas: 3000000 });
				})
				.then(devices => {
					return devices.map(device => {
						return aclInstace.devices(device)
					})
				})
				.then(devices => {
					return Promise.all(devices);
				})
				.then(devices => {
					return devices;
				})
		},
		getAllGrantedDevices: () => {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			var aclInstace = null;
			return ACL.deployed()
				.then(instance => {
					aclInstace = instance;
					return instance.getDevicePermissions({ from: account, gas: 3000000 })
				})
				.then(devices => {
					return devices.map(device => {
						return aclInstace.devices(device)
					})
				})
				.then(devices => {
					return Promise.all(devices);
				})
				.then(devices => {
					return devices;
				})

		},
		getDeviceUserPermissions: function(deviceId) {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			var aclInstace = null;
			return ACL.deployed()
				.then(instance => {
					aclInstace = instance;
					return instance.getDeviceUserPermissions(deviceId, { from: account, gas: 300000 })
				})
				.then(addresses => {
					return addresses;
				})
		},
		getDeviceDetail: function(deviceId) {
			ACL.setProvider(web3.currentProvider);
			if (typeof ACL.currentProvider.sendAsync !== "function") {
			  	ACL.currentProvider.sendAsync = function() {
				    return ACL.currentProvider.send.apply(
				      ACL.currentProvider, arguments
				    );
			  	};
			}
			var aclInstace = null;
			return ACL.deployed()
				.then(instance => {
					aclInstace = instance;
					return instance.devices(deviceId, { from: account, gas: 300000 })
				})
				.then(device => {
					return device;
				})
		}
	}
}

export default app;