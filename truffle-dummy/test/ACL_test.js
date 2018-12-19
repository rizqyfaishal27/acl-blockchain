var ACL = artifacts.require('./ACL.sol');

contract("ACL", function(accounts) {
	var aclInstance;
	var userAddress = accounts[0];
	var userAddress2 = accounts[1];

	it("Device belum ada", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.devicesCount()
			})
			.then(function(count) {
				assert.equal(count, 0, "Device masih belum ada");
			})
	});

	it("User 1 menambah device baru", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.addDevice("Keyboard", "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=imgres&cd=&cad=rja&uact=8&ved=2ahUKEwiBp43C6qnfAhVXVH0KHZ2-DoYQjRx6BAgBEAU&url=http%3A%2F%2Fagung-ik.blogspot.com%2F2016%2F09%2Fcontoh-contoh-input-device-lengkap.html&psig=AOvVaw0JcwvqmzhPSTCcy3dfjD5b&ust=1545238066523572", { from: userAddress });
			})
			.then(function(receipt) {
				return ACL.deployed()
					.then(function(instance) {
						return instance.devicesCount();
					})
					.then(function(count) {
						assert.equal(count, 1, "Device tambah 1");
					})
			})

	});

	it("User 1 men-get device dengan id 1", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.devices(1);
			})
			.then(function(device) {
				assert.equal(device[0], 1, "device id match");
				assert.equal(device[1], "Keyboard", "Keyboard match");
				assert.equal(device[2], "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=imgres&cd=&cad=rja&uact=8&ved=2ahUKEwiBp43C6qnfAhVXVH0KHZ2-DoYQjRx6BAgBEAU&url=http%3A%2F%2Fagung-ik.blogspot.com%2F2016%2F09%2Fcontoh-contoh-input-device-lengkap.html&psig=AOvVaw0JcwvqmzhPSTCcy3dfjD5b&ust=1545238066523572", "Image url match");
				assert.equal(device[3], userAddress, "User address match");
			})
	})

	it("User 1 menambah device baru (device ke 2)", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.addDevice("HAPE", "https://www.google.comsasasasas/url?sa=i&rct=j&q=&esrc=s&source=imgres&cd=&cad=rja&uact=8&ved=2ahUKEwiBp43C6qnfAhVXVH0KHZ2-DoYQjRx6BAgBEAU&url=http%3A%2F%2Fagung-ik.blogspot.com%2F2016%2F09%2Fcontoh-contoh-input-device-lengkap.html&psig=AOvVaw0JcwvqmzhPSTCcy3dfjD5b&ust=1545238066523572", { from: userAddress });
			})
			.then(function(receipt) {
				return ACL.deployed()
					.then(function(instance) {
						return instance.devicesCount();
					})
					.then(function(count) {
						assert.equal(count, 2, "Device tambah 1");
					})
			})

	});

	it("User 1 men-get device dengan id 2", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.devices(2);
			})
			.then(function(device) {
				assert.equal(device[0], 2, "device id match");
				assert.equal(device[1], "HAPE", "Keyboard match");
				assert.equal(device[2], "https://www.google.comsasasasas/url?sa=i&rct=j&q=&esrc=s&source=imgres&cd=&cad=rja&uact=8&ved=2ahUKEwiBp43C6qnfAhVXVH0KHZ2-DoYQjRx6BAgBEAU&url=http%3A%2F%2Fagung-ik.blogspot.com%2F2016%2F09%2Fcontoh-contoh-input-device-lengkap.html&psig=AOvVaw0JcwvqmzhPSTCcy3dfjD5b&ust=1545238066523572", "Image url match");
				assert.equal(device[3], userAddress, "User address match");
			})
	});

	it("User 1 men-get semua devices", function() {
		return ACL.deployed()
			.then(function(instance) {
				aclInstance = instance;
				return instance.getUserDevices.call({ from: userAddress });
			})
			.then(function(devices) {
				return devices.map(function(device) {
					return aclInstance.devices.call(device)
				})
			})
			.then(function(devices) {
				return Promise.all(devices)
			})
			.then(function(devices) {
				var device1 = devices[0];
				var device2 = devices[1];

				assert.equal(device1[0], 1, "device id match");
				assert.equal(device1[1], "Keyboard", "Keyboard match");
				assert.equal(device1[2], "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=imgres&cd=&cad=rja&uact=8&ved=2ahUKEwiBp43C6qnfAhVXVH0KHZ2-DoYQjRx6BAgBEAU&url=http%3A%2F%2Fagung-ik.blogspot.com%2F2016%2F09%2Fcontoh-contoh-input-device-lengkap.html&psig=AOvVaw0JcwvqmzhPSTCcy3dfjD5b&ust=1545238066523572", "Image url match");
				assert.equal(device1[3], userAddress, "User address match");

				assert.equal(device2[0], 2, "device id match");
				assert.equal(device2[1], "HAPE", "Keyboard match");
				assert.equal(device2[2], "https://www.google.comsasasasas/url?sa=i&rct=j&q=&esrc=s&source=imgres&cd=&cad=rja&uact=8&ved=2ahUKEwiBp43C6qnfAhVXVH0KHZ2-DoYQjRx6BAgBEAU&url=http%3A%2F%2Fagung-ik.blogspot.com%2F2016%2F09%2Fcontoh-contoh-input-device-lengkap.html&psig=AOvVaw0JcwvqmzhPSTCcy3dfjD5b&ust=1545238066523572", "Image url match");
				assert.equal(device2[3], userAddress, "User address match");
			})
	})

	it("User 1 men-get permission device 1", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.checkPermission(1, { from: userAddress });
			})
			.then(function (permission) {
				assert.equal(permission, true, "permission tepat");
			})
	})

	it("User 2 menambah device baru", function() {
		return ACL.deployed()
			.then(function(instance) {
				aclInstance = instance;
				return instance.addDevice("Hape 22", "Url", { from: userAddress2 });
			})
			.then(function(receipt) {
				return aclInstance.devicesCount()
			})
			.then(function(count) {
				assert.equal(count, 3, "Count tepat");
			})
	})

	it("User 1 men-get permission device 3", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.checkPermission(3, { from: userAddress });
			})
			.then(function (permission) {
				assert.equal(permission, false, "permission tepat");
			})
	})

	it("User 1 menambah permission ke user 2 ke device 1", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.addPermission(1, userAddress2, { from: userAddress });
			})
			.then(function(receipt) {
				assert.notEqual(receipt, null);
			})
			.catch(function(error) {

			})
	})

	it("User 2 men-get permission device 1", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.checkPermission(1, { from: userAddress2 });
			})
			.then(function (permission) {
				assert.equal(permission, true, "permission tepat");
			})
	})


	it("User 1 men-delete device 2", function() {
		return ACL.deployed()
			.then(function(instance) {
				aclInstance = instance;
				return instance.deleteDevice(2, { from: userAddress })
			})
			.then(function(receipt) {
				assert.notEqual(receipt, null);
			})
	});

	it("Jumlah devices menjadi 2", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.devicesCount();
			})
			.then(function(count) {
				assert.equal(count, 2);
			})
	})

	
	it("User 1 men-delete device 1", function() {
		return ACL.deployed()
			.then(function(instance) {
				aclInstance = instance;
				return instance.deleteDevice(1, { from: userAddress })
			})
			.then(function(receipt) {
				assert.notEqual(receipt, null);
			})
	});

	it("Jumlah devices menjadi 1", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.devicesCount();
			})
			.then(function(count) {
				assert.equal(count, 1);
			})
	})

	it("User 2 permissions hanya berjumlah satu ke device 3", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.getDevicePermissions({ from: userAddress2 })
			})
			.then(function(permissions) {
				console.log(permissions);
				assert.equal(permissions.length, 1);
				// assert.equal(permissions[0].toNumber(), 1);

			})
	})

	it("User 1 permissions hanya berjumlah 0", function() {
		return ACL.deployed()
			.then(function(instance) {
				return instance.getDevicePermissions({ from: userAddress })
			})
			.then(function(permissions) {
				assert.equal(permissions.length, 0);
				// assert.equal(permissions[0].toNumber(), 1);
			})
	})

})

