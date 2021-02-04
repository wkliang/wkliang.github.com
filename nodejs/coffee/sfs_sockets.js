// Generated by CoffeeScript 1.10.0
(function() {
  var children, healthCheck, i, j, numWorkers, port, ref, startPort;

  healthCheck = function(port, cb) {
    var c, gotAuth;
    c = net.connect(port, 'localhost');
    c.setEncoding("utf8");
    gotAuth = false;
    c.on('data', function(data) {
      var d, error, error1;
      d = null;
      try {
        d = JSON.parse(data);
      } catch (error1) {
        error = error1;
        c.end();
        console.error("Health check failed: bad initial response, " + data);
        return cb(false);
      }
      if (!gotAuth) {
        if (d.cmd === "PLSAUTH") {
          gotAuth = true;
          return c.write(JSON.stringify({
            cmd: "RING"
          }) + "\r\n");
        } else {
          c.end();
          console.error("Health check failed: bad initial response, " + data);
          return cb(false);
        }
      } else {
        c.end();
        console.info("Health check response", {
          res: d
        });
        return cb(true);
      }
    });
    c.on('error', function(e) {
      console.error("Health check failed: error connecting " + e);
      return cb(false);
    });
    return c.setTimeout(config.healthCheckTimeout, function() {
      return c.destroy();
    });
  };

  numWorkers = 2;

  startPort = 31337;

  children = [];

  for (i = j = 0, ref = numWorkers - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    port = startPort + i;
    children.push(child_monitor.spawnMonitoredChild('./lib/sfs_socket', "sfs_socket_" + port, healthCheck, {
      SFS_SOCKET_PORT: port,
      SFS_SOCKET_HOST: socketHost
    }));
  }

  process.on("SIGHUP", function() {
    console.log("Received SIGHUP, respawning children");
    return child_monitor.bounceChildren(children);
  });

}).call(this);