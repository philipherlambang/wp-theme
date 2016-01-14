/* Bootstrap Extended */
// (function() {

	// Auto Hide and Show Nav When Scroll
	autoNavScroll('operate-fixed');
	autoNavScroll('search-fixed');
	autoNavScroll('result-fixed');

	// Add Chat Gap
	if (document.getElementsByClassName('group-chat-bubbles').length) {
		chatAddGap();
	}

	// Modal Reposition and Center
  $('.modal').on('show.bs.modal', modalReposition);
  $(window).on('resize', function() {
    $('.modal:visible').each(modalReposition);
  });

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

	function chatAddGap() {
		var chat = document.querySelector('ul');
		var bubbles = chat.querySelectorAll('li');
		var bubble, bubblePost, bubbleLastPost, bubblePerson, bubbleLastPerson, bubblePersonEl;
		for (var i = 0; i < bubbles.length; i++) {
			bubble = bubbles[i].children[0];
			bubblePost = bubble.classList[1];
			if (bubblePost == 'title') {
				continue;
			}
			if (bubblePost != bubbleLastPost) {
				bubble.className = bubble.className + ' gap';
				bubbleLastPost = bubblePost;
				bubblePerson = bubble.querySelector('.person');
				if (bubblePerson) {
					bubbleLastPerson = bubblePerson.innerText;
				}
			} else {
				if (bubbleLastPerson && bubblePost == 'left') {
					bubblePerson = bubble.querySelector('.person').innerText;
					if (bubblePerson != bubbleLastPerson) {
						bubble.className = bubble.className + ' gap';
					}
					if (bubblePerson == bubbleLastPerson) {
						bubblePersonEl = bubble.querySelector('.person');
						bubblePersonEl.className = bubblePersonEl.className + ' hide';
						// Delete Element
					}
				}
			}
		}
		window.scrollTo(0, document.body.scrollHeight);
	}

	function modalReposition() {
    var modal = $(this),
        dialog = modal.find('.modal-dialog');
    modal.css('display', 'block');
    dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
  }

	function datePicker(selector) {
  	var lastScrollPos;
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
			},
			onOpen: function() {
				lastScrollPos = $(window).scrollTop();
				$(selector).blur();
			},
			onClose: function() {
				$(window).scrollTop(lastScrollPos);
				$(selector).blur();
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


	if (typeof(FormValidator) == "function") {
		var validatorSignIn = new FormValidator('sign-in', [{
			name: 'email',
			display: 'Email',
			rules: 'required|valid_email'
		}, {
			name: 'password',
			display: 'Sandi',
			rules: 'required|alpha_numeric|min_length[8]'
		}], function(errors, event) {
			validatorResult(errors, event);
		});

		var validatorSignUp = new FormValidator('sign-up', [{
			name: 'full-name',
			display: 'Nama Lengkap',
			rules: 'required|alpha_space'
		}, {
			name: 'email',
			display: 'Email',
			rules: 'required|valid_email'
		}, {
			name: 'password',
			display: 'Sandi',
			rules: 'required|alpha_low_up_numeric|min_length[8]'
		}, {
			name: 'confirm-password',
			display: 'Konfirmasi Sandi',
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
			display: 'Sandi Saat Ini',
			rules: 'required'
		}, {
			name: 'new-password',
			display: 'Sandi Baru',
			rules: 'required|alpha_low_up_numeric|min_length[8]'
		}, {
			name: 'confirm-new-password',
			display: 'Konfirmasi Sandi Baru',
			rules: 'required|matches[new-password]'
		}], function(errors, event) {
			validatorResult(errors, event);
		});
	}

	function validatorResult(errors, event) {
		$(event.target).find('.error-message').remove();

		if (errors.length > 0) {
			$(errors[0].element).focus().closest('.form-group').append('<p class="error-message">' + errors[0].message + '</p>');
		} else {
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

	$.each($('.edit-mode .current-indicator, .edit-mode .expire-indicator'), function() {
		stateIndicator(this);
	});

	$('.group-card').on('click', '.imgs-inline .btn-minus', function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
	});

	$('.group-btn').on('click', '.btn-apply', function(e) {
		e.preventDefault();
		$('.btn-apply').attr('disabled', 'disabled').text('Applied').prepend('<span class="icon ion-ios-checkmark-empty"></span>');
	});

	$('.group-card, .card-potrait').on('change', 'form', function() {
		var form = $(this);
		var action = form.attr('action');
		var parameters = form.serializeArray();

		if (action && parameters) {
			var request = $.ajax({
			    type: 'POST',
			    url: action,
			    data: parameters,
			    dataType: 'json'
			});

			request.done(function(data, status, xhr) {
				console.log('Done : ', data, status, xhr);
			});

			request.fail(function(xhr, status, error) {
				console.log('Fail : ', xhr, status, error);
			});
		}
	});

	$('.group-media-space').on('click', '.title .btn', function(e) {
		e.preventDefault();
		$(this).closest('.item').remove();
	});

	function currentDisplay(selector) {
		var thruDate = $(selector).closest('.edit-mode').find('.date-thru').closest('.form-group');
		if (selector.checked) {
			$(selector).next().val('Y');
			thruDate.css('display', 'none').find('input:last-child').val('');
			thruDate.find('.date-thru').pickadate().pickadate('picker').clear();
		} else {
			$(selector).next().val('N');
			thruDate.css('display', 'block');
		}
	}

	function stateIndicator(selector) {
		var thruDate = $(selector).closest('.edit-mode').find('.date-thru').closest('.form-group');
		if (selector.value == 'Y') {
			$(selector).prev().attr('checked', 'checked');
			thruDate.css('display', 'none');
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


	// Other Manipulation
	$('body').on('click', 'main', function(e) {
		var navbarToggle = $('.navbar').find('.navbar-toggle');
		if (navbarToggle.length && !navbarToggle.hasClass('collapsed')) {
			navbarToggle.click();
			e.preventDefault();
		}
	});

	if ($('.navbar-form.form-base').length) {
		var section   = $('<div class="section"></div>');
		var navId     = $('<div class="navbar-id search search-fixed search-fixed-down"></div>');
		var navDef    = $('<div class="navbar-default"></div>');
		var search    = $('.navbar-form').clone().removeClass('form-base').addClass('form-move');
		var searchNav = navId.append($(navDef).append(search));

		$('main').prepend(section.append(searchNav));
	}

	// Photoswipe
	pswpInit('.pswp-gallery');
	function pswpInit(gallerySelector) {

		var galleryElements = document.querySelectorAll(gallerySelector);
		var galleriesItems = [];

		for (i = 0; i < galleryElements.length; i++) {
			galleryElements[i].setAttribute('data-pswp-uid', i + 1);
			galleriesItems[i + 1] = pswpItemParse(galleryElements[i]);
			galleryElements[i].onclick = pswpItemClicked;
			if (galleryElements[i].dataset.reorder === 'true') {
				pswpReorder(galleryElements[i]);
			}
		}

		var hashData = pswpParseHash();
		if (hashData.pid && hashData.gid) {
			pswpOpen(hashData.pid,  galleryElements[hashData.gid - 1], true);
		}

		function pswpItemParse(el) {
			var thumbElements = el.childNodes,
			    numNodes = thumbElements.length,
			    index = -1,
			    items = [],
			    liEl,
			    linkEl,
			    linkElChild,
			    linkElChildLen,
			    size,
			    item;

			for (var i = 0; i < numNodes; i++) {

				liEl = thumbElements[i];

				if (liEl.nodeType !== 1) {
					continue;
				}

				index = index + 1;

				liEl.dataset.lid = index;

				linkEl = liEl.children[0];

				if (linkEl.dataset.pswp) {
					index = index - 1;
					continue;
				}

				size = linkEl.getAttribute('data-size').split('x');

				item = {
					src: linkEl.getAttribute('href'),
					title: linkEl.getAttribute('data-title'),
					w: parseInt(size[0], 10),
					h: parseInt(size[1], 10)
				};

				linkElChild = linkEl.children;
				linkElChildLen = linkEl.children.length;

				if (linkElChildLen > 0 && linkElChild[0].tagName == 'IMG') {
					item.msrc = linkElChild[0].getAttribute('src');
				}

				if (linkElChildLen > 1 && linkElChild[1].tagName == 'FIGURE') {
					item.description = linkElChild[1].innerHTML;
				}

				if (linkElChildLen > 2) {
					var data; item.actions = [];
					for (var l = 2; l < linkElChildLen; l++) {
						if (linkElChild[l].tagName == 'SPAN') {
							data = linkElChild[l].dataset;
							item.actions.push({ href: data.href, title: data.title });
						}
					}
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

			var target = closest(eTarget, function(el) {
				if (el.dataset) {
					return (el.dataset.pswp);
				}
			});

			if (target) {
				if (target.dataset.pswp) {
					window.location.href = target.href;
				}
			} else {
				if (index >= 0) {
					pswpOpen(index, clickedGallery);
				}
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
				},
				addCaptionHTMLFn: function(item, captionEl, isFake) {
					var captionContent = captionEl.children[0];
					if (item.description) {
						captionContent.innerHTML = '<h5>' + item.title +  '</h5><p> ' + item.description + '</p>';
						if (item.actions && item.actions.length) {
							captionContent.innerHTML = captionContent.innerHTML + '<div class="row"></div>';
							for (var i = 0; i < item.actions.length; i++) {
								captionContent.querySelector('.row').innerHTML = captionContent.querySelector('.row').innerHTML + '<a href="' + item.actions[i].href + '" class="col-xs-' + 12 / item.actions.length + '">' + item.actions[i].title + '</a>';
							}
						}
						return false;
					}
					captionContent.innerHTML = '<h5>' + item.title + '</h5>';
					return true;
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

			// options.bgOpacity = 0.92;
			options.timeToIdle = 0;
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

	// Crop
	if ($('.crop-acts').length) {
		var console = window.console || { log: function () {} };
		var $image = $('#image');
		var $dataX = $('#dataX');
		var $dataY = $('#dataY');
		var $dataHeight = $('#dataHeight');
		var $dataWidth = $('#dataWidth');
		var $dataRotate = $('#dataRotate');
		var $dataScaleX = $('#dataScaleX');
		var $dataScaleY = $('#dataScaleY');
		var options = {
					viewMode: 1,
					dragMode: 'move',
					aspectRatio: parseInt($image.data('aspect-ratio')),
					guides: false,
					highlight: false,
					// autoCropArea: 1,
					cropBoxMovable: false,
					cropBoxResizable: false,
					toggleDragModeOnDblclick: false,
					crop: function (e) {
						$dataX.val(Math.round(e.x));
						$dataY.val(Math.round(e.y));
						$dataHeight.val(Math.round(e.height));
						$dataWidth.val(Math.round(e.width));
						$dataRotate.val(e.rotate);
						$dataScaleX.val(e.scaleX);
						$dataScaleY.val(e.scaleY);
					}
				};

		// Cropper
		$image.on({
			'build.cropper': function (e) {
				// console.log(e.type);
			},
			'built.cropper': function (e) {
				// console.log(e.type);
			},
			'cropstart.cropper': function (e) {
				// console.log(e.type, e.action);
			},
			'cropmove.cropper': function (e) {
				// console.log(e.type, e.action);
			},
			'cropend.cropper': function (e) {
				// console.log(e.type, e.action);
			},
			'crop.cropper': function (e) {
				// console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
			},
			'zoom.cropper': function (e) {
				// console.log(e.type, e.ratio);
			}
		}).cropper(options);

		$('.btn-rotate, .btn-crop').addClass('btn-none');

		// Buttons
		if (!$.isFunction(document.createElement('canvas').getContext)) {
			$('button[data-method="getCroppedCanvas"]').prop('disabled', true);
		}

		if (typeof document.createElement('cropper').style.transition === 'undefined') {
			$('button[data-method="rotate"]').prop('disabled', true);
			$('button[data-method="scale"]').prop('disabled', true);
		}

		// Methods
		$('.crop-acts').on('click', '[data-method]', function () {
			var $this = $(this);
			var data = $this.data();
			var $target;
			var result;

			if ($this.prop('disabled') || $this.hasClass('disabled')) {
				return;
			}

			if ($image.data('cropper') && data.method) {
				data = $.extend({}, data); // Clone a new one

				if (typeof data.target !== 'undefined') {
					$target = $(data.target);

					if (typeof data.option === 'undefined') {
						try {
							data.option = JSON.parse($target.val());
						} catch (e) {
							// console.log(e.message);
						}
					}
				}

				result = $image.cropper(data.method, data.option, data.secondOption);

				switch (data.method) {
					case 'scaleX':
					case 'scaleY':
						$(this).data('option', -data.option);
						break;

					case 'getCroppedCanvas':
						if (result) {
							// console.log(result, result.toDataURL());
							// window.open(result.toDataURL(), '_blank');
							cropIt(data, result);
						}
						break;
				}

				if ($.isPlainObject(result) && $target) {
					try {
						$target.val(JSON.stringify(result));
					} catch (e) {
						// console.log(e.message);
					}
				}

			}
		});

		// Import image
		var $inputImage = $('#inputImage');
		var URL = window.URL || window.webkitURL;
		var blobURL, dataURL;

		if (URL) {
			$inputImage.change(function() {
				var files = this.files;
				var file;
				var opts = {};

				if (!$image.data('cropper')) {
					return;
				}

				if (files && files.length) {
					file = files[0];

					if (/^image\/\w+$/.test(file.type)) {
						cropSet(file);
						loadImage.parseMetaData(file, function(data) {
							if (data.exif && data.exif.get('Orientation') > 1) {
								opts.orientation = data.exif.get('Orientation');
								loadImage(file, function(canvas) {
									dataURL = canvas.toDataURL();
									$image.one('built.cropper', function () {
										URL.revokeObjectURL(dataURL);
									}).cropper('reset').cropper('replace', dataURL);
									$inputImage.val('');
								}, opts);
							} else {
								blobURL = URL.createObjectURL(file);
								$image.one('built.cropper', function () {
									URL.revokeObjectURL(blobURL);
								}).cropper('reset').cropper('replace', blobURL);
								$inputImage.val('');
							}
						});
					} else {
						window.alert('Please choose an image file.');
					}
				}
			});
		} else {
			$inputImage.prop('disabled', true).parent().addClass('disabled');
		}
	}

	function cropSet(file) {
		$('.btn-rotate, .btn-crop').removeClass('btn-none');

		var opts = $('.btn-crop').data('option');
		var name = file.name;
		// var fileName = name.substr(0, name.lastIndexOf('.'));

		// opts.fileName = fileName == 'image' ? guid() : fileName;
		opts.fileName = guid();
		opts.type = name.split('.').pop();
		$('.btn-crop').data('option', opts);
	}

	function cropIt(data, canvas) {
		$('.btn-crop').addClass('disabled');
		$('.btn-disable').click();
		$('.btn-upload, .btn-rotate').addClass('btn-none');

		if (data.formOption) {
			var inputs = $('#' + data.formOption).serializeArray();
			for (var i = 0; i < inputs.length; i++) {
				data.option[inputs[i].name] = inputs[i].value;
			}
		}

		var paramMap = {};
		paramMap = data.option;
		paramMap.fileName = localStorage.pdid + '_' + paramMap.fileName;
		paramMap.string = canvas.toDataURL();
		console.log(paramMap);
		window.open(paramMap.string, '_blank');
	}

	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	// Masonry
	if (document.getElementsByClassName('grid').length) {
		var grid = $('.grid').masonry({
			itemSelector: '.grid-item',
			gutter: 0
		});

		grid.imagesLoaded().progress( function() {
			grid.masonry('layout');
		});
	}

// })();
