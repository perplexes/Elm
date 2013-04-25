
var Value = function(){

  var eq = function(x,y) {
    if (typeof x === "object") {
	if (x.hasOwnProperty('_')) {
	    for (var i in x) { if (x[i] != y[i]) return false; }
	    for (var i in y) { if (x[i] != y[i]) return false; }
	    return true;
	}
	if (x === y) return true;
	if (x.length !== y.length) return false;
	for (var i = x.length; i--; ) {
	    if (!eq(x[i],y[i])) return false;
	}
	return true;
    }
    return x === y;
  };

  var Tuple = function() {
      var len = arguments.length;
      var arr = new Array(len+1);
      arr[0] = "Tuple" + arguments.length;
      for (var i = len; i--; ) {
	  arr[i+1] = arguments[i];
      }
      return arr;
  };

  var listToArray = function(list) {
      var arr = [];
      while (list[0] === "Cons") {
        arr.push(list[1]);
	list = list[2];
      }
      return arr;
  };

  function makeSpaces(s) {
    if (s.length == 0) { return s; }
    var arr = s.split('');
    if (arr[0] == ' ') { arr[0] = "&nbsp;" }
    for (var i = arr.length; --i; ) {
      if (arr[i][0] == ' ' && arr[i-1] == ' ') {
        arr[i-1] = arr[i-1] + arr[i];
        arr[i] = '';
      }
    }
    for (var i = arr.length; i--; ) {
      if (arr[i].length > 1 && arr[i][0] == ' ') {
        var spaces = arr[i].split('');
        for (var j = spaces.length - 2; j >= 0; j -= 2) {
          spaces[j] = '&nbsp;';
        }
        arr[i] = spaces.join('');
      }
    }
    arr = arr.join('');
    if (arr[arr.length-1] === " ") {
	return arr.slice(0,-1) + '&nbsp;';
    }
    return arr;
  }

  function properEscape(str) {
    if (str.length == 0) return str;
    str = str //.replace(/&/g,  "&#38;")
             .replace(/"/g, /*"*/  "&#34;")
             .replace(/'/g, /*'*/  "&#39;")
             .replace(/</g,  "&#60;")
             .replace(/>/g,  "&#62;")
             .replace(/\n/g, "<br/>");
    var arr = str.split('<br/>');
    for (var i = arr.length; i--; ) {
	arr[i] = makeSpaces(arr[i]);
    }
    return arr.join('<br/>');
  }

  var toText = function(elmList) {
    if (typeof elmList === "string") return properEscape(elmList);
    var a = [];
    while (elmList[0] === "Cons") {
      a.push(elmList[1]);
      elmList = elmList[2];
    }
    return properEscape(a.join(''));
  };

  function getTextSize(w,h,txt) {
    var t = document.createElement('div');
    t.innerHTML = txt;
    t.style.textAlign = 'left';
    if (w > 0) { t.style.width  = w + "px"; }

    t.style.visibility = "hidden";
    t.style.styleFloat = "left";
    t.style.cssFloat   = "left";

    document.body.appendChild(t);
    var cStyle = window.getComputedStyle(t,null);
    var realW = cStyle.getPropertyValue("width").slice(0,-2) - 0;
    var realH = cStyle.getPropertyValue("height").slice(0,-2) - 0;
    document.body.removeChild(t);
    //delete t;
    return [Math.ceil(realW),Math.ceil(Math.max(h,realH))];
  }

  function getSize(e) {
    var t = e.cloneNode(true);

    t.style.visibility = "hidden";
    t.style.styleFloat = "left";
    t.style.cssFloat   = "left";

    document.body.appendChild(t);
    var w = t.offsetWidth;
    var h = t.offsetHeight;
    document.body.removeChild(t);
    //delete t;
    return [w,h];
  }

  function getExcess(e) {
    var t = e.cloneNode(true);

    t.style.visibility = "hidden";
    t.style.styleFloat = "left";
    t.style.cssFloat   = "left";

    document.body.appendChild(t);
    var ow = t.offsetWidth;
    var oh = t.offsetHeight;
    var cStyle = window.getComputedStyle(t,null);
    var w = cStyle.getPropertyValue("width").slice(0,-2) - 0;
    var h = cStyle.getPropertyValue("height").slice(0,-2) - 0;
    document.body.removeChild(t);
    //delete t;
    return [ow-w,oh-h];
  }


  function groupForms(forms) {
    forms = Elm.JavaScript.castListToJSArray(forms);
    var groups = [];
    var arr = [];
    for (var i = forms.length; i--; ) {
	var f = forms[i];
	switch(f[4][0]) {
	case "FElement":
	    if (arr.length > 0) {
		groups.push(arr);
		arr = [];
	    }
	    groups.push(f);
	    break;
	default:
	    arr.push(f);
	}
    }
    if (arr.length > 0) groups.push(arr);
    return groups;
  }

  var toString = function(v) {
    if (typeof v === "function") {
	return "<function>";
    } else if (typeof v === "boolean") {
	return v ? "True" : "False";
    } else if (typeof v === "number") {
	return v+"";
    } else if (typeof v === "string" && v.length < 2) {
	return "'"+v+"'";
    } else if (typeof v === "object" && v.hasOwnProperty('_')) {
	var output = []
	for (var k in v) {
          if (k == '_') continue;
          for (var i = v[k].length; i--; ) {
            output.push(k + " = " + toString(v[k][i]));
	  }
	}
	if (output.length === 0) return "{}";
	return "{ " + output.join(", ") + " }";
    } else if (v[0]) {
	if (v[0].substring && v[0].substring(0,5) === "Tuple") {
	    var output = new Array(v.length-1);
	    for (var i = v.length; --i; ) { output[i-1] = toString(v[i]); }
	    return "(" + output.join(",") + ")";
	} else if (v[0] === "Cons") {
	    var start = (typeof v[1] === "string") ? '"' : "[";
	    var  end  = (typeof v[1] === "string") ? '"' : "]";
	    var  div  = (typeof v[1] === "string") ?  "" : ",";
	    var   f   = (typeof v[1] === "string") ? function(x){return x} : toString;
	    var output = start + f(v[1]);
	    v = v[2];
	    while (true) {
		if (v[0] === "Cons") {
		    output += div + f(v[1]);
		    v = v[2];
		} else {
		    return output + end;
		}
	    }
	} else if (v[0] === "Nil") {
	    return "[]";
	} else if (v[0] === "JSON") {
	    return "(JSON.fromList " + toString(Elm.JSON.toList(v)) + ")";
	} else if (v[0] === "RBNode" || v[0] === "RBEmpty") {
	    function cons(k){ return function(v) { return function(acc) { return ["Cons",["Tuple2",k,v],acc]; }; }; }
	    var list = Elm.Dict.foldr(cons)(["Nil"])(v);
	    var name = "Dict";
	    if (list[0] === "Cons" && list[1][2][0] === "Tuple0") {
		name = "Set";
		list = Elm.List.map(function(x) { return x[1]; })(list);
	    }
	    return "(" + name + ".fromList " + toString(list) + ")";
	} else {
	    var output = "";
	    for (var i = v.length; --i; ) { output = ' ' + toString(v[i]) + output; }
	    output = v[0] + output;
	    return (v.length > 1) ? "(" + output + ")" : output;
	}
    }
    return v+"";
  };
  var show = function(v) { return str(toString(v)); };
  var append = function(xs,ys) {
    if (typeof xs === "string" && typeof ys === "string") {
	return xs.concat(ys);
    }
    if (xs[0] === "Nil") {
	return ys;
    }
    var root = ["Cons", xs[1], ["Nil"]];
    var curr = root;
    xs = xs[2];
    while (xs[0]==="Cons") {
	curr[2] = ["Cons", xs[1], ["Nil"]];
	xs = xs[2];
	curr = curr[2];
    }
    curr[2] = ys;
    return root;
  };

  var str = function(s) {
    var out = ["Nil"];
    for (var i = s.length; i--; ) {
      out = ["Cons", s[i], out];
    }
    return out;
  };

  function wrap(elem) {
      var p = Value.getSize(elem);
      return ["Element", Guid.guid(), ["EHtml",elem],
	      p[0], p[1], 1, ["Nothing"], ["Nothing"]];
  }
  var addListener = function() {
      if(document.addEventListener) {
	  return function(element, event, handler) {
	      element.addEventListener(event, handler, false);
	  };
      } else {
	  return function(element, event, handler) {
	      element.attachEvent('on' + event, handler);
	  };
      }
  }();

  return {eq:eq,
	  str:str,
	  show:show,
	  Tuple:Tuple,
	  append:append,
	  listToArray:listToArray,
	  toText : toText,
	  properEscape : properEscape,
	  getTextSize : getTextSize,
	  getSize : getSize,
	  getExcess : getExcess,
	  groupForms : groupForms,
	  wrap : wrap,
	  addListener : addListener
       };
}();
