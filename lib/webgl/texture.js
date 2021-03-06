// Generated by CoffeeScript 1.3.3
var Cubemap, Framebuffer, Texture, Texture2D,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Framebuffer = require('framebuffer').Framebuffer;

Texture = (function() {
  var bound, ids;

  bound = [];

  ids = 0;

  function Texture() {
    this.handle = this.gl.createTexture();
    this.id = ids++;
    this.unit = null;
  }

  Texture.prototype.bind = function(unit) {
    if (unit == null) {
      unit = 0;
    }
    this.unit = unit;
    if (bound[unit] !== this.id) {
      this.gl.activeTexture(this.gl.TEXTURE0 + unit);
      this.gl.bindTexture(this.target, this.handle);
      bound[unit] = this.id;
    }
    return this;
  };

  Texture.prototype.unbind = function(unit) {
    if (unit == null) {
      unit = this.unit;
    }
    if (unit && bound[unit] === this.id) {
      this.gl.activeTexture(this.gl.TEXTURE0 + unit);
      this.gl.bindTexture(this.target, null);
      bound[unit] = null;
    }
    return this;
  };

  Texture.prototype.mipmap = function() {
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
    this.gl.generateMipmap(this.target);
    return this;
  };

  Texture.prototype.mipmapNearest = function() {
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
    this.gl.generateMipmap(this.target);
    return this;
  };

  Texture.prototype.linear = function() {
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    return this;
  };

  Texture.prototype.nearest = function() {
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    return this;
  };

  Texture.prototype.clampToEdge = function() {
    this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    return this;
  };

  Texture.prototype.repeat = function() {
    this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    return this;
  };

  Texture.prototype.anisotropy = function() {
    var ext, max;
    ext = this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
    if (ext) {
      max = this.gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      this.gl.texParameterf(this.target, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
    }
    return this;
  };

  return Texture;

})();

exports.Texture2D = Texture2D = (function(_super) {

  __extends(Texture2D, _super);

  function Texture2D(gl, _arg) {
    var _ref, _ref1, _ref2, _ref3;
    this.gl = gl;
    _ref = _arg != null ? _arg : {}, this.channels = _ref.channels, this.format = _ref.format, this.type = _ref.type;
    Texture2D.__super__.constructor.call(this);
    if ((_ref1 = this.channels) == null) {
      this.channels = this.gl.RGBA;
    }
    if ((_ref2 = this.format) == null) {
      this.format = this.gl.RGBA;
    }
    if ((_ref3 = this.type) == null) {
      this.type = this.gl.UNSIGNED_BYTE;
    }
    this.target = this.gl.TEXTURE_2D;
  }

  Texture2D.prototype.upload = function(image) {
    this.uploadImage(image);
    return this;
  };

  Texture2D.prototype.uploadImage = function(image) {
    this.width = image.width;
    this.height = image.height;
    this.gl.texImage2D(this.target, 0, this.channels, this.format, this.type, image);
    return this;
  };

  Texture2D.prototype.uploadData = function(data, width, height) {
    this.width = width;
    this.height = height;
    this.gl.texImage2D(this.target, 0, this.channels, width, height, 0, this.format, this.type, data);
    return this;
  };

  Texture2D.prototype.setSize = function(width, height) {
    this.width = width;
    this.height = height;
    this.gl.texImage2D(this.target, 0, this.channels, width, height, 0, this.format, this.type, null);
    return this;
  };

  Texture2D.prototype.read = function(dst) {
    if (dst == null) {
      dst = new Uint8Array(this.width * this.height * 4);
    }
    if (this.fbo) {
      this.fbo.bind();
    } else {
      this.fbo = new Framebuffer(this.gl).bind().color(this);
    }
    this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, dst);
    this.fbo.unbind();
    return dst;
  };

  Texture2D.prototype.toPNG = function() {
    var canvas, ctx, data, i, imgdata, result, url, _i, _ref;
    canvas = document.createElement('canvas');
    canvas.height = this.height;
    canvas.width = this.width;
    ctx = canvas.getContext('2d');
    imgdata = ctx.createImageData(this.width, this.height);
    imgdata.data.set(this.read(), 0);
    ctx.putImageData(imgdata, 0, 0);
    url = canvas.toDataURL('image/png');
    data = atob(url.split(',')[1]);
    result = new Uint8Array(data.length);
    for (i = _i = 0, _ref = data.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      result[i] = data.charCodeAt(i);
    }
    return result;
  };

  return Texture2D;

})(Texture);

exports.Cubemap = Cubemap = (function(_super) {

  __extends(Cubemap, _super);

  function Cubemap(gl) {
    this.gl = gl;
    Cubemap.__super__.constructor.call(this);
    this.target = this.gl.TEXTURE_CUBE_MAP;
    this.up = this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
    this.down = this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y;
    this.right = this.gl.TEXTURE_CUBE_MAP_POSITIVE_X;
    this.left = this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
    this.back = this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
    this.front = this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
  }

  Cubemap.prototype.uploadSide = function(name, image) {
    return this.gl.texImage2D(this.gl['TEXTURE_CUBE_MAP_' + name], 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
  };

  Cubemap.prototype.upload = function(folder, ext) {
    if (ext == null) {
      ext = 'jpg';
    }
    this.uploadSide('POSITIVE_Y', folder.get("up." + ext));
    this.uploadSide('NEGATIVE_Y', folder.get("down." + ext));
    this.uploadSide('POSITIVE_X', folder.get("right." + ext));
    this.uploadSide('NEGATIVE_X', folder.get("left." + ext));
    this.uploadSide('POSITIVE_Z', folder.get("front." + ext));
    this.uploadSide('NEGATIVE_Z', folder.get("back." + ext));
    return this;
  };

  Cubemap.prototype.setSize = function(size) {
    this.size = size;
    this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, this.gl.RGBA, this.size, this.size, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, this.gl.RGBA, this.size, this.size, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, this.gl.RGBA, this.size, this.size, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, this.gl.RGBA, this.size, this.size, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, this.gl.RGBA, this.size, this.size, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, this.gl.RGBA, this.size, this.size, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    return this;
  };

  return Cubemap;

})(Texture);
