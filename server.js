const app = require("./backend/app");
var cluster = require("cluster");
var numCPUs = require("os").cpus().length;

var port = Number(process.env.PORT || 3000);

// If this is the master process, fork child process
if (cluster.isMaster) {
  // Fork based on the number of CPUs
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Check for the child's states and restart them if died
  cluster.on("exit", function(worker, code) {
    console.log("Worker " + worker.process.pid + " died with code " + code);
    server.close();
  });
  cluster.on("online", function(worker) {
    console.log("Worker " + worker.process.pid + " is ready!");
  });

  // node.js 0.6 compatibility
  cluster.on("death", function(worker, code) {
    console.log("Worker " + worker.process.pid + " died with code " + code);
    server.close();
  });
  cluster.on("uncaughtException", (worker, code) => {
    server.close();
  });
}
// We're in the child process. Start the HTTP server.
// Listen on the specified IP and port.
let server = app.listen(port, err => {
  if (err) return console.log("Connection failed...", err);
  console.log("Server #%d listening at %s", process.pid, port);
});
