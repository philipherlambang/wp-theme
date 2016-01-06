$(function () {

	'use strict';

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

});