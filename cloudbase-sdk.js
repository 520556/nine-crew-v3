(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cloudbase = factory());
}(this, (function() {
  'use strict';

  function init(options) {
    if (!options || !options.env) {
      throw new Error('环境 ID env 不能为空');
    }
    
    var env = options.env;
    var timeout = options.timeout || 15000;
    
    function getDatabase() {
      return {
        collection: function(name) {
          return {
            add: function(data) {
              return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://' + env + '.service.tcloudbase.com/database/' + name, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.timeout = timeout;
                
                xhr.onload = function() {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                      var result = JSON.parse(xhr.responseText);
                      resolve(result);
                    } catch(e) {
                      reject(new Error('返回数据格式错误'));
                    }
                  } else {
                    reject(new Error('请求失败: ' + xhr.status));
                  }
                };
                
                xhr.onerror = function() {
                  reject(new Error('网络错误'));
                };
                
                xhr.ontimeout = function() {
                  reject(new Error('请求超时'));
                };
                
                xhr.send(JSON.stringify(data));
              });
            }
          };
        }
      };
    }
    
    return {
      database: getDatabase,
      auth: function() {
        return {
          signInWithCustomToken: function() {
            return Promise.resolve();
          }
        };
      }
    };
  }

  return {
    init: init
  };
})));