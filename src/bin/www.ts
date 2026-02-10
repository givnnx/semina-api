#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "../app";
import debugModule from "debug";
import http from "http";
import db from "../app/db";

const debug = debugModule("be-semina:server");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");

app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

// bila terjadi error saat connect ke mongdb maka akan tampil error diterminal
db.on("error", function (err) {
  console.log("connection error: tidak bisa tersambung ke mongodb");
});
/**
 * Listen on provided port, on all network interfaces.
 */

import { connectToDb } from "../app/db";

/**
 * Listen on provided port, on all network interfaces.
 */

const startServer = async () => {
  try {
    await connectToDb();
    server.listen(port, () => {
      console.log("server run port :" + port);
    });
    server.on("error", onError);
    server.on("listening", onListening);
  } catch (err) {
    console.log("Failed to connect to DB", err);
  }
};

startServer();

/**
 * Normalize a port into a number, string, or false.
 */

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): number | string | boolean {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  debug("Listening on " + bind);
}
