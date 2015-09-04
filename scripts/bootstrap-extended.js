/* Bootstrap Extended */

(function() {

	// Auto Hide and Show Nav When Scroll
	autoNavScroll('operate-fixed');

	// Autosize Texarea
	if (document.getElementsByClassName('auto-size').length) {
		$('.auto-size').textareaAutoSize();
	}

	// Date Pickers
	if (document.getElementsByClassName('date-picker').length) {
		datePicker('.date-picker');
	}
	$.each(document.getElementsByClassName('form-vary'), function() {
		var that = $(this), dateFrom = that.find('.date-from'), dateThru = that.find('.date-thru');
		if (dateFrom.length && dateThru.length) {
			datePicker(dateFrom);
			datePicker(dateThru);
			dateFromThru(dateFrom, dateThru);
		}
	});

	/*! Functions */
	function autoNavScroll(className) {
		var didScroll;
		var lastScrollTop = 0;
		var delta = 5;
		var navbarHeight = $('.' + className).outerHeight();

		$(window).scroll(function(event){
			didScroll = true;
		});

		setInterval(function() {
			if (didScroll) {
				// Has Scrolled
				var st = $(this).scrollTop();

				// Make sure they scroll more than delta
				if (Math.abs(lastScrollTop - st) <= delta)
					return;

				// If they scrolled down and are past the navbar, add class .nav-up.
				// This is necessary so you never see what is "behind" the navbar.
				if (st > lastScrollTop && st > navbarHeight) {
					// Scroll Down
					$('.' + className).removeClass(className + '-down').addClass(className + '-up');
				} else {
					// Scroll Up
					if(st + $(window).height() < $(document).height()) {
						$('.' + className).removeClass(className + '-up').addClass(className + '-down');
					}
				}

				lastScrollTop = st;

				didScroll = false;
			}
		}, 250);
	}

	function datePicker(selector) {
		$(selector).pickadate({
			format: 'd mmmm yyyy',
			formatSubmit: 'yyyy-mm-dd',
			today: '',
			hiddenName: true,
			selectYears: 70,
			selectMonths: true,
			min: [1945,7,17],
			max: true,
			onRender: function() {
				var hld = $(this.$holder),
						hdr = hld[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0],
						slc = $([hdr.childNodes[0], hdr.childNodes[1]]);
				slc.wrap('<label class="select"></label>');
			}
		});
	}

	function dateFromThru(dateFrom, dateThru) {
		var fromPkdt = dateFrom.pickadate(),
				fromPckr = fromPkdt.pickadate('picker');

		var thruPkdt = dateThru.pickadate(),
				thruPckr = thruPkdt.pickadate('picker');

		if ( fromPckr.get('value') ) {
			thruPckr.set('min', fromPckr.get('select'));
		}
		if ( thruPckr.get('value') ) {
			fromPckr.set('max', thruPckr.get('select'));
		}

		fromPckr.on('set', function(e) {
			if ( e.select ) {
				thruPckr.set('min', fromPckr.get('select'));
			} else if ( 'clear' in e ) {
				thruPckr.set('min', false);
			}
		});
		thruPckr.on('set', function(e) {
			if ( e.select ) {
				fromPckr.set('max', thruPckr.get('select'));
			} else if ( 'clear' in e ) {
				fromPckr.set('max', false);
			}
		});
	}



	var validatorSignIn = new FormValidator('sign-in', [{
		name: 'email',
		display: 'Email',
		rules: 'required|valid_email'
	}, {
		name: 'password',
		display: 'Password',
		rules: 'required|alpha_numeric|min_length[8]'
	}], function(errors, event) {
		validatorResult(errors, event);
	});

	var validatorSignUp = new FormValidator('sign-up', [{
		name: 'full-name',
		display: 'Full Name',
		rules: 'required|callback_alpha_space'
	}, {
		name: 'email',
		display: 'Email',
		rules: 'required|valid_email'
	}, {
		name: 'password',
		display: 'Password',
		rules: 'required|callback_alpha_numeric_strong|min_length[8]'
	}, {
		name: 'confirm-password',
		display: 'Confirm Password',
		rules: 'required|matches[password]'
	}], function(errors, event) {
		validatorResult(errors, event);
	});

	validatorSignUp.registerCallback('alpha_space', function(value) {
		console.log((/^[A-Za-z ]+$/).test(value));
		if ((/^[A-Za-z ]+$/).test(value)) {
			return true;
		}
		return false;
	}).setMessage('alpha_space', 'The %s field must only contain alphabetical characters.');

	validatorSignUp.registerCallback('alpha_numeric_strong', function(value) {
		if ((/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/).test(value)) {
			return true;
		}
		return false;
	}).setMessage('alpha_numeric_strong', 'The %s field must contain number, lowercase and uppercase letter.');

	var validatorForgotPassword = new FormValidator('forgot-password', [{
		name: 'email',
		display: 'Email',
		rules: 'required|valid_email'
	}], function(errors, event) {
		validatorResult(errors, event);
	});

	var validatorChangePassword = new FormValidator('change-password', [{
		name: 'current-password',
		display: 'Current Password',
		rules: 'required|alpha_numeric|min_length[8]'
	}, {
		name: 'new-password',
		display: 'New Password',
		rules: 'required|alpha_numeric|min_length[8]'
	}, {
		name: 'verify-new-password',
		display: 'Verify New Password',
		rules: 'required|matches[new-password]'
	}], function(errors, event) {
		validatorResult(errors, event);
	});

	function validatorResult(errors, event) {
		$(event.target).find('.error-message').remove();

		if (errors.length > 0) {
			$(errors[0].element).focus().closest('.form-group').append('<p class="error-message">' + errors[0].message + '</p>');
		} else {
			console.log('Hooray No Error');
			event.preventDefault();
		}
	}



	/*! Form Edit DOM Manipulations */
	$('.acts-mode').on('click', 'a', function() {

		var that      = $(this),
				modes     = that.closest('ul'),
				actsMode  = modes.find('.acts-mode'),
				baseMode  = modes.find('.base-mode'),
				editModes = modes.find('.edit-mode');

		$.each(document.getElementsByClassName('check'), function() { if (this.hasAttribute('style')) { this.click(); } });

		if (that.hasClass('plus')) {

			var clonedItem = baseMode.clone().insertBefore(baseMode);
			clonedItem.removeClass('base-mode').addClass('edit-mode').find('input[type=text], textarea, select').filter(':visible:first').focus();
			reinitItem(clonedItem);
			actsMode.find('a').css('display', 'none').end().find('a:last-child').css('display', 'inline-block');

		} else if (that.hasClass('minus')) {

			editModes.find('.form-delete a').css('display', 'block');
			actsMode.find('a').css('display', 'none').end().find('a:last-child').css('display', 'inline-block');

		} else {

			editModes.find('.form-delete a').removeAttr('style');
			actsMode.find('a').removeAttr('style');

		}
	});

	$('.group-card').on('click', '.edit-mode .minus', function() {
		$(this).closest('.edit-mode').remove();
	});

	$('.group-card').on('click', '.edit-mode .current, .edit-mode .expire', function() {
		currentDisplay(this);
	});

	$.each($('.edit-mode .current, .edit-mode .expire'), function() {
		currentDisplay(this);
	});

	$('.group-card').on('click', '.imgs-inline .btn-minus', function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
	});

	$('.group-btn').on('click', '.btn-apply', function(e) {
		e.preventDefault();
		$('.btn-apply').attr('disabled', 'disabled').text('Applied').prepend('<span class="icon ion-ios-checkmark-empty"></span>');
	});

	function currentDisplay(selector) {
		var thruDate = $(selector).closest('.edit-mode').find('.date-thru').closest('.form-group');
		if (selector.checked) {
			thruDate.css('display', 'none');
		} else {
			thruDate.css('display', 'block');
		}
	}

	function reinitItem(selector) {
		var slctr = $(selector),
				ta = slctr.find('.auto-size'),
				df = slctr.find('.date-from'),
				dt = slctr.find('.date-thru');

		if (ta.length) {
			$(ta).textareaAutoSize();
		}

		if (df.length && dt.length) {
			datePicker(df);
			datePicker(dt);
			dateFromThru(df, dt);
		}
	}

	$('body').on('click', 'main', function() {
		var navbarToggle = $('.navbar').find('.navbar-toggle');
		if (!navbarToggle.hasClass('collapsed')) {
			navbarToggle.click();
		}
	});

	$.each(document.getElementsByClassName('rp'), function() {
		this.innerHTML = 'Rp. ' + this.innerHTML.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	});

	// On Evaluate
	// Photoswipe
	pswpInit('.pswp-gallery');

	function pswpInit(gallerySelector) {

		// parse slide data (url, title, size ...) from DOM elements
		// (children of gallerySelector)
		var parseThumbnailElements = function(el) {
			var thumbElements = el.childNodes,
			    numNodes = thumbElements.length,
			    items = [],
			    figureEl,
			    linkEl,
			    size,
			    item;

			for(var i = 0; i < numNodes; i++) {

				figureEl = thumbElements[i]; // <figure> element

				// include only element nodes
				if(figureEl.nodeType !== 1) {
					continue;
				}

				linkEl = figureEl.children[0]; // <a> element

				size = linkEl.getAttribute('data-size').split('x');

				// create slide object
				item = {
					src: linkEl.getAttribute('href'),
					title: linkEl.getAttribute('data-title'),
					// msrc: linkEl.style.backgroundImage.slice(4, -1),
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
				};



				if(linkEl.children.length > 0) {
					// <img> thumbnail element, retrieving thumbnail url
					item.msrc = linkEl.children[0].getAttribute('src');
				}

				item.el = figureEl; // save link to element for getThumbBoundsFn
				items.push(item);
			}

			return items;
		};

		// find nearest parent element
		var closest = function closest(el, fn) {
			return el && ( fn(el) ? el : closest(el.parentNode, fn) );
		};

		// triggers when user clicks on thumbnail
		var onThumbnailsClick = function(e) {
			e = e || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;

			var eTarget = e.target || e.srcElement;

			// find root element of slide
			var clickedListItem = closest(eTarget, function(el) {
				return (el.tagName && el.tagName.toUpperCase() === 'LI');
			});

			if(!clickedListItem) {
				return;
			}

			// find index of clicked item by looping through all child nodes
			// alternatively, you may define index via data- attribute
			var clickedGallery = clickedListItem.parentNode,
			    childNodes = clickedListItem.parentNode.childNodes,
			    numChildNodes = childNodes.length,
			    nodeIndex = 0,
			    index;

			for (var i = 0; i < numChildNodes; i++) {
				if(childNodes[i].nodeType !== 1) {
					continue;
				}

				if(childNodes[i] === clickedListItem) {
					index = nodeIndex;
					break;
				}
				nodeIndex++;
			}



			if(index >= 0) {
				// open PhotoSwipe if valid index found
				openPhotoSwipe( index, clickedGallery );
			}
			return false;
		};

		// parse picture index and gallery index from URL (#&pid=1&gid=2)
		var photoswipeParseHash = function() {
			var hash = window.location.hash.substring(1),
			params = {};

			if(hash.length < 5) {
				return params;
			}

			var vars = hash.split('&');
			for (var i = 0; i < vars.length; i++) {
				if(!vars[i]) {
					continue;
				}
				var pair = vars[i].split('=');
				if(pair.length < 2) {
					continue;
				}
				params[pair[0]] = pair[1];
			}

			if(params.gid) {
				params.gid = parseInt(params.gid, 10);
			}

			return params;
		};

		var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
			var pswpElement = document.querySelectorAll('.pswp')[0],
			    gallery,
			    options,
			    items;

			items = parseThumbnailElements(galleryElement);

			// define options (if needed)
			options = {

				// define gallery index (for URL)
				galleryUID: galleryElement.getAttribute('data-pswp-uid'),

				getThumbBoundsFn: function(index) {
					// See Options -> getThumbBoundsFn section of documentation for more info
					var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
						pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
						rect = thumbnail.getBoundingClientRect();

					return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
				}

			};

			// PhotoSwipe opened from URL
			if(fromURL) {
				if(options.galleryPIDs) {
					// parse real index when custom PIDs are used
					// http://photoswipe.com/documentation/faq.html#custom-pid-in-url
					for(var j = 0; j < items.length; j++) {
						if(items[j].pid == index) {
							options.index = j;
							break;
						}
					}
				} else {
					// in URL indexes start from 1
					options.index = parseInt(index, 10) - 1;
				}
			} else {
				options.index = parseInt(index, 10);
			}

			// exit if index not found
			if( isNaN(options.index) ) {
				return;
			}

			if(disableAnimation) {
				options.showAnimationDuration = 0;
			}

			// Pass data to PhotoSwipe and initialize it
			gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
			gallery.init();
		};

		// loop through all gallery elements and bind events
		var galleryElements = document.querySelectorAll( gallerySelector );

		for(var i = 0, l = galleryElements.length; i < l; i++) {
			galleryElements[i].setAttribute('data-pswp-uid', i+1);
			galleryElements[i].onclick = onThumbnailsClick;
		}

		// Parse URL and open gallery if it contains #&pid=3&gid=1
		var hashData = photoswipeParseHash();
		if(hashData.pid && hashData.gid) {
			openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
		}

		// Additional
		var itemsList = galleryElements[0].getElementsByTagName('li');
		galleryElements[0].style.width = (itemsList.length / 2 * 80) + 'px';
	}

})();
