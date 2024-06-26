
(function() {

	"use strict";

	var	$body = document.querySelector('body');

	// Methods/polyfills.

		// classList | (c) @remy | github.com/remy/polyfills | rem.mit-license.org
			!function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}function n(t,n,i){Object.defineProperty?Object.defineProperty(t,n,{get:i}):t.__defineGetter__(n,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,e=i.push,s=i.splice,o=i.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();

		// canUse
			window.canUse=function(p){if(!window._canUse)window._canUse=document.createElement("div");var e=window._canUse.style,up=p.charAt(0).toUpperCase()+p.slice(1);return p in e||"Moz"+up in e||"Webkit"+up in e||"O"+up in e||"ms"+up in e};

		// window.addEventListener
			(function(){if("addEventListener"in window)return;window.addEventListener=function(type,f){window.attachEvent("on"+type,f)}})();

	// Play initial animations on page load.
		window.addEventListener('load', function() {
			window.setTimeout(function() {
				$body.classList.remove('is-preload');
			}, 100);
		});

	// Function to be executed when the DOM is fully loaded
		document.addEventListener('DOMContentLoaded', function() {
			// Decode button event listener
			document.getElementById('encodedUrl').addEventListener('keypress', function(event) {
				if (event.key === 'Enter') {
					event.preventDefault();
					decodeUrl();
				}
			});

			document.getElementById('decodeButton').addEventListener('click', function() {
				decodeUrl();
			});
	
			// Copy button event listener
			document.getElementById('copyButton').addEventListener('click', function() {
				copyUrl();
			});
		});

	// Slideshow Background.
		(function() {

			// Settings.
				var settings = {

					// Images (in the format of 'url': 'alignment').
						images: {
							'images/bg01.jpg': 'center',
							'images/bg02.jpg': 'center',
							'images/bg03.jpg': 'center'
						},

					// Delay.
						delay: 6000

				};

			// Vars.
				var	pos = 0, lastPos = 0,
					$wrapper, $bgs = [], $bg,
					k, v;

			// Create BG wrapper, BGs.
				$wrapper = document.createElement('div');
					$wrapper.id = 'bg';
					$body.appendChild($wrapper);

				for (k in settings.images) {

					// Create BG.
						$bg = document.createElement('div');
							$bg.style.backgroundImage = 'url("' + k + '")';
							$bg.style.backgroundPosition = settings.images[k];
							$wrapper.appendChild($bg);

					// Add it to array.
						$bgs.push($bg);

				}

			// Main loop.
				$bgs[pos].classList.add('visible');
				$bgs[pos].classList.add('top');

				// Bail if we only have a single BG or the client doesn't support transitions.
					if ($bgs.length == 1
					||	!canUse('transition'))
						return;

				window.setInterval(function() {

					lastPos = pos;
					pos++;

					// Wrap to beginning if necessary.
						if (pos >= $bgs.length)
							pos = 0;

					// Swap top images.
						$bgs[lastPos].classList.remove('top');
						$bgs[pos].classList.add('visible');
						$bgs[pos].classList.add('top');

					// Hide last image after a short delay.
						window.setTimeout(function() {
							$bgs[lastPos].classList.remove('visible');
						}, settings.delay / 2);

				}, settings.delay);

		})();

	// Function to check if a URL is safe	
		function isSafeUrl(url) {
			if (!url.startsWith('https://')) {
				alert('The URL is not secure. Only HTTPS URLs are allowed.');
				return false;
			}


			return true;
		}

	// Button functions
		function decodeUrl() {
			var encodedUrl = document.getElementById('encodedUrl').value.trim();
			var decodedUrlBox = document.getElementById('decodedUrl');

			var a = document.createElement('a');
			a.href = encodedUrl;
			var params = new URLSearchParams(a.search);
			var innerUrl = params.get('url')
			var urlToDecode = innerUrl || encodedUrl;
    		var decodedUrl = decodeURIComponent(urlToDecode);

			if (decodedUrl && decodedUrl.trim() !== ''){
				if (isSafeUrl(decodedUrl)){
					decodedUrlBox.textContent = decodedUrl;
					decodedUrlBox.href = decodedUrl;
					decodedUrlBox.classList.remove('inactive-link');
				} else {
					decodedUrlBox.textContent = 'The URL is not secure or not whitelisted.';
					decodedUrlBox.classList.add('inactive-link');
				}
			} else {
				decodedUrlBox.textContent = 'No URL to decode';
				decodedUrlBox.classList.add('inactive-link');
			}
		}

		function copyUrl() {
			var decodedUrl = document.getElementById('decodedUrl').textContent;
			navigator.clipboard.writeText(decodedUrl).then(function() {
				showCopyStatus('Copied to clipboard!', 'success');
			}, function(err) {
				showCopyStatus('Failed to copy text.', 'error');
        		console.error('Could not copy text: ', err);
			});
		}

		function showCopyStatus(message, status) {
			var copyStatus = document.getElementById('copyStatus');
			copyStatus.textContent = message;
			copyStatus.style.display = 'block';
			
			// Hide the message after 2 seconds
			setTimeout(function() {
				copyStatus.style.display = 'none';
			}, 2000);
		}

})();