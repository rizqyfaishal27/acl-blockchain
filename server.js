import Web3, { providers } from 'web3';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import io from 'socket.io';
import minimist from 'minimist';
import http from 'http';
import acl from './acl';

var argument = minimist(process.argv.slice(2));
var privateKey = argument.k;
var port = argument.p;

if(!privateKey) {
	console.log("Must include private key");
	process.exit();
}

if(!port) {
	console.log("Must include port");
	process.exit();
}

var app = express();

privateKey = "0x" + privateKey;

app.use('/', express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(morgan());



var web3 = new Web3(new providers.HttpProvider("http://localhost:7545"));
var account = web3.eth.accounts.privateKeyToAccount(privateKey);
console.log(account.address);
var aclApp = acl(privateKey, web3, account.address);

var server = http.createServer(app);
var ioSocket = io(server);


aclApp.getDeviceAddedEvent().then(event => {
	event.watch((error, data) => {
		console.log(data);
		ioSocket.send(JSON.stringify({
			event: data.event,
			args: data.args
		}))
	})
})

aclApp.getDeviceDeletedEvent().then(event => {
	event.watch((error, data) => {
		ioSocket.send(JSON.stringify({
			event: data.event,
			args: data.args
		}))
	})
})

aclApp.getDeviceAddedEvent().then(event => {
	event.watch((error, data) => {
		ioSocket.send(JSON.stringify({
			event: data.event,
			args: data.args
		}))
	})
})

aclApp.getAccessGrantedEvent().then(event => {
	event.watch((error, data) => {
		ioSocket.send(JSON.stringify({
			event: data.event,
			args: data.args
		}))
	})
})

aclApp.getRemoveAccessEvent().then(event => {
	event.watch((data) => {
		ioSocket.send(JSON.stringify({
			event: data.event,
			args: data.args
		}))
	})
})

app.post('/addDevice', (req, res) => {
	var deviceName = req.body.deviceName;
	var imageUrl = req.body.imageUrl;

	return aclApp.addDevice(deviceName, imageUrl)
		.then((receipt) => {
			res.json(receipt);
		})
})

app.post('/grantAccess', (req, res) => {
	var deviceId = +req.body.deviceId;
	var userTarget = req.body.userTarget;

	return aclApp.grantAccess(deviceId, userTarget)
		.then(receipt => {
			res.json(receipt);
		});
})


app.post('/removeAccess', (req, res) => {
	var deviceId = +req.body.deviceId;
	var userTarget = req.body.userTarget;

	return aclApp.removeAccess(deviceId, userTarget)
		.then(receipt => {
			res.json(receipt);
		});
})


app.post('/removeDevice', (req, res) => {
	var deviceId = +req.body.deviceId;
	return aclApp.deleteDevice(deviceId)
			.then(receipt => {
				res.json(receipt);
			});
})

app.get('/account', (req, res) => {
	res.json({ account: account })
})

app.get('/devices', (req, res) => {
	return Promise.all([
		aclApp.getAllGrantedDevices(),
		aclApp.getAllUserDevices()
	]).then(devices => {
		res.json({
			granted: devices[0],
			all: devices[1]
		})
	})
});

app.get('/device-permissions', (req, res) => {
	var deviceId = +req.query.deviceId;
	console.log(deviceId);
	return Promise.all([
		aclApp.getDeviceUserPermissions(deviceId),
		aclApp.getDeviceDetail(deviceId)
		]).then(results => {
			res.json({
				device: results[1],
				permissions: results[0]
			})
		})
})


server.listen(port, () => {	
	console.log("Server listening on port " + port);
})