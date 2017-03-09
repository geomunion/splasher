var load = (function() {

    function addEventListener(element, event, listener) {
	if (false && element.addEventListener) {
	    element.addEventListener(event, listener, false);
	}
	else if(false && element.readyState) { // IE8
	    element.onreadystatechange = function() {
		if (this.readyState == 'complete' || this.readyState == 'loaded') {
		    listener.call(this);
		}
	    }
	} else {
            element['on'+event] = listener;
	}
    };

  function _res(tag) {
    return function(url, cb) {
	return {
	    'tag' : tag,
	    'url' : url,
	    'callback' : cb
	};
    };
  };

  return {
    css: _res('link'),
    js: _res('script'),
    img: _res('img'),
    load : function(res, cb) {
//*
        var element = document.createElement(res.tag);
        var parent = 'body';
        var attr = 'src';

        // Important success and error for the promise

	addEventListener(element, 'load', function() {
	    res.callback(res.url, true);
	});
	
	addEventListener(element, 'error', function() {
	    res.callback(res.url, false);
	});

        // Inject into document to kick off loading

        // Need to set different attributes depending on tag type
        switch(res.tag) {
          case 'script':
            element.async = true;
            break;
          case 'link':
            element.type = 'text/css';
            element.rel = 'stylesheet';
            attr = 'href';
            parent = 'head';
        }
        element[attr] = res.url;
        document[parent].appendChild(element);
	// document.getElementsByTagName("head")[0].appendChild(element);
	//console.log("load : " + res.url );
//*
    }
  };
})();

var splash = function(){
    var ovrl = null, stat = null, prog = null, detail = null;
    var count = 0, total = 0, success = true;
    var stage = {count:0, total:0};
    var queue = [];

    function init() {
	ovrl = document.getElementById('overlay');
	stat = document.getElementById('progstat');
	prog = document.getElementById('progress');
	detail = document.getElementById('progdetail');

	prog.style.width = "0%";
	stat.innerHTML = "Loading "+ "...";
    };

    function updateStatus(url, ok){
	count += 1;
	success = success && ok;
	console.log("update : " + url + " - " + ok);

	var perc = ((100/total*count) << 0) +"%";
	prog.style.width = perc;
	stat.innerHTML = "Loading "+ perc;
	detail.innerHTML = '( ' + count + ' / ' + total +  ' )';// url;
    };

    function updateStage() {
	stage.count += 1;
	if (stage.count == stage.total) {
	    stat.innerHTML = "Loading "+ 'done.';
	    finish();
	}
    }

    function finish() {
	console.log("finished with:" + success);
	if (success) {
	    ovrl.style.opacity =  0;
	    setTimeout(function(){
		detail.innerHTML = '';
	    }, 150);
	    setTimeout(function(){
		ovrl.style.display = "none";
	    }, 600);
	} else {
	    ovrl.style.opacity =  0.5;
	    detail.style.color = '#f00';
	    detail.innerHTML = 'error while loading files';
	    setTimeout(function(){
		ovrl.style.display = "none";
	    }, 2500);
	}
    };

    return {
	init : function(){ init() },
	load : function(resource, cb){
		total += resource.length;
		stage.total +=1;
		var block = {
		    count : 0,
		    total : resource.length,
		    update : function (url, ok) {
			block.count += 1;
			if (block.count == block.total) {
			    console.log('block finished');
			    if (cb) cb();
			    updateStage();
			}
			updateStatus(url, ok);
		    }
		};
		for (var i=0; i<resource.length; i++) {
		    resource[i].callback = block.update;
		    load.load(resource[i]);
		}
	    return this;
	}

    };
}();

// module.exports = load();

//    var font = new FontFaceObserver('FontAwesome');
//    font.load("\uf287\uf142\uf0fc", 15000).then(function () {
//      console.log('font has loaded.');
