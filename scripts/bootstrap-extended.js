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
		rules: 'required|alpha_space'
	}, {
		name: 'email',
		display: 'Email',
		rules: 'required|valid_email'
	}, {
		name: 'password',
		display: 'Password',
		rules: 'required|alpha_low_up_numeric|min_length[8]'
	}, {
		name: 'confirm-password',
		display: 'Confirm Password',
		rules: 'required|matches[password]'
	}], function(errors, event) {
		validatorResult(errors, event);
	});

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
		rules: 'required'
	}, {
		name: 'new-password',
		display: 'New Password',
		rules: 'required|alpha_low_up_numeric|min_length[8]'
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



	// Photoswipe
	pswpInit('.pswp-gallery');

	function pswpInit(gallerySelector) {

		var galleryElements = document.querySelectorAll(gallerySelector);
		var galleriesItems = [];

		for (i = 0; i < galleryElements.length; i++) {
			galleryElements[i].setAttribute('data-pswp-uid', i + 1);
			galleriesItems[i + 1] = pswpItemParse(galleryElements[i]);
			galleryElements[i].onclick = pswpItemClicked;
			pswpReorder(galleryElements[i]);
		}

		var hashData = pswpParseHash();
		if (hashData.pid && hashData.gid) {
			pswpOpen(hashData.pid,  galleryElements[hashData.gid - 1], true);
		}

		function pswpItemParse(el) {
			var thumbElements = el.childNodes,
			    numNodes = thumbElements.length,
			    index = 0,
			    items = [],
			    liEl,
			    linkEl,
			    size,
			    item;

			for (var i = 0; i < numNodes; i++) {

				liEl = thumbElements[i];

				if (liEl.nodeType !== 1) {
					continue;
				}

				if (index + 1 !== i) {
					index = index + 1;
				}

				liEl.dataset.lid = index;

				linkEl = liEl.children[0];

				size = linkEl.getAttribute('data-size').split('x');

				item = {
					src: linkEl.getAttribute('href'),
					title: linkEl.getAttribute('data-title'),
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
				};

				if (linkEl.children.length > 0) {
					item.msrc = linkEl.children[0].getAttribute('src');
				}
				item.el = liEl;
				items.push(item);
			}

			return items;
		}

		function pswpItemClicked(e) {
			e = e || window.event;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;

			var eTarget = e.target || e.srcElement;

			var clickedListItem = closest(eTarget, function(el) {
				return (el.tagName && el.tagName.toUpperCase() === 'LI');
			});

			if (!clickedListItem) {
				return;
			}

			var clickedGallery = clickedListItem.parentNode,
			    index = clickedListItem.dataset.lid;

			if (index >= 0) {
				pswpOpen(index, clickedGallery);
			}

			return false;
		}

		function closest(el, fn) {
			return el && ( fn(el) ? el : closest(el.parentNode, fn) );
		}

		function pswpOpen(index, galleryElement, fromURL) {
			var pswpElement = document.querySelectorAll('.pswp')[0],
			    gallery,
			    options,
			    items;

			items = galleriesItems[galleryElement.dataset.pswpUid];

			options = {
				galleryUID: galleryElement.getAttribute('data-pswp-uid'),
				getThumbBoundsFn: function(index) {
					var thumbnail = items[index].el.getElementsByTagName('img')[0],
					    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
					    rect = thumbnail.getBoundingClientRect();

					return {x : rect.left, y : rect.top + pageYScroll, w : rect.width};
				}
			};

			if (fromURL) {
				if (options.galleryPIDs) {
					for (i = 0; i < items.length; i++) {
						if (items[i].pid == index) {
							options.index = i;
							break;
						}
					}
				} else {
					options.index = parseInt(index, 10) - 1;
				  options.showAnimationDuration = 0;
				}
			} else {
				options.index = parseInt(index, 10);
			}

			if (isNaN(options.index)) {
				return;
			}

			options.shareEl = false;
			// options.modal = false;

			gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
			gallery.init();
		}

		function pswpParseHash() {
			var hash = window.location.hash.substring(1),
			params = {};

			if (hash.length < 5) {
				return params;
			}

			var vars = hash.split('&');
			for (var i = 0; i < vars.length; i++) {
				if (!vars[i]) {
					continue;
				}
				var pair = vars[i].split('=');
				if (pair.length < 2) {
					continue;
				}
				params[pair[0]] = pair[1];
			}

			if (params.gid) {
				params.gid = parseInt(params.gid, 10);
			}

			return params;
		}

		function pswpReorder(el) {

			var lis = el.getElementsByTagName('li');
			var lisa = [];
			var ulw = 0;

			var arr = [];
			for (i = 0; i < lis.length; i++) {
				arr.push(i);
			}
			// console.log('First', arr);

			var arrs = [];
			for (i = 0; i < arr.length; i+=10) {
				arrs.push(arr.slice(i, i+10));
			}
			// console.log('Second', arrs);

			for (i = 0; i < arrs.length; i++) {
				// console.log('Third', arrs[i]);

				for (n = 0; n < arrs[i].length; n++) {
					var num = arrs[i][n];
					var a = lis[num].children[0];
					var img = a.children[0];

					if (n == '0' || n == '1' || n == '8' || n =='9') {
						a.style.width = '152px';
					} else {
						a.style.width = '100px';
					}

					a.style.height = '100px';
					a.style.margin = '2px';

					if (n == '2' || n == '3' || n == '4' || n == '8' || n == '9') {
						lisa.push(lis[num]);
					} else {
						ulw = ulw + lis[num].offsetWidth;
					}
				}
			}
			el.style.width = ulw + 'px';
			// console.log('Fourth', lisa);

			$.each(lisa, function(i, v) {
				$(v).remove();
				$(el).append($(v));
			});

			$(el).find('img').load(function() {
				var img = this;
				var a = this.parentElement;

				if (img.width > img.height) {
					img.style.height = a.offsetHeight + 'px';
					if (img.offsetWidth < a.offsetWidth) {
						img.style.height = "";
						img.style.width = a.offsetWidth + 'px';
					}
				} else {
					img.style.width = '100%';
				}
			});
		}
	}

	/* Cropper */
	cropInit('.cropper', 270, 270, 480, 480);

	function cropInit(e, wv, hv, wr, hr) {
		var cropper = new CROP();

		cropper.init({
			container: e,
			image: 'images/default-user.png',
			width: wv,
			height: hv,
			mask: false,
			zoom: {
				steps: 0.01,
				min: 1,
				max: 3
			}
		});

		$('.cropper-command').on('click', '.cropper-import', function() {
			cropper.import();
		});

		$('.cropper-command').on('click', '.cropper-rotate', function() {
			cropper.rotate();
		});

		$('.cropper-command').on('click', '.cropper-crop', function() {
			console.log('Original Image : ', cropper.original());
			console.log('Cropped Image : ', cropper.crop(wr,hr,'png'));
			window.open(cropper.crop(wr,hr,'png').string, '_blank');
		});
	}

})();
