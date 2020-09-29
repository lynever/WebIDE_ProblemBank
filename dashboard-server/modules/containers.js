const spawn = require('child_process').spawn;

function run(cmd, param = null) {
        return new Promise(function (resolve, reject) {
                var command;
                command = spawn(cmd, param);
                var result = '';
                command.stdout.on('data', function (data) {
                        result += data.toString();
                });
                command.on('close', function (code) {
                        result = JSON.parse(result);
                        resolve(result);
                });
        });
}

function setUpContainer(name) {
        let docker = spawn("docker", ["start", name]);
        return docker;
}
function setDownContainer(name) {
        let docker = spawn("docker", ["stop", name]);
        return docker;
}

module.exports = { run, setUpContainer, setDownContainer };