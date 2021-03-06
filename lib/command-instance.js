'use strict';

/**
 * Module dependencies.
 */

var util = require('./util');

/**
 * Initialize a new `CommandInstance` instance.
 *
 * @param {String} name
 * @return {CommandInstance}
 * @api public
 */

function CommandInstance(options) {
  var self = this;
  options = options || {};

  this.command = options.command;
  this.commandObject = options.commandObject;
  this.args = options.args;
  this.commandWrapper = options.commandWrapper;
  this.callback = options.callback;
  this.downstream = options.downstream;

  this.session = this.commandWrapper.session;
  this.parent = this.session.parent;

  // Route stdout either through a piped
  // command, or the session's stdout.
  this.log = function () {
    var args = util.fixArgsForApply(arguments);
    if (self.downstream) {
      var fn = self.downstream.commandObject._fn || function () {};
      self.session.registerCommand();
      self.downstream.args.stdin = args;
      fn.call(self.downstream, self.downstream.args, function () {
        self.session.completeCommand();
      });
    } else {
      self.session.log.apply(self.session, args);
    }
  };

  this.prompt = function (a, b, c) {
    return self.session.prompt(a, b, c);
  };

  this.delimiter = function (a, b, c) {
    return self.session.delimiter(a, b, c);
  };

  this.help = function (a, b, c) {
    return self.session.help(a, b, c);
  };

  this.match = function (a, b, c) {
    return self.session.match(a, b, c);
  };

  return this;
}

module.exports = CommandInstance;
