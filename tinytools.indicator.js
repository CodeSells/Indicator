/*!
	Indicator 1.0.2 - 2014-05-15
	jQuery Indicator
	(c) 2014, http://tinytools.codesells.com
	license: http://www.opensource.org/licenses/mit-license.php
*/

; (function ($, document, window) {
	var indicator = 'indicator';
	var nubHeight;
	var halfNubHeight;
	var rotateSizeCorrection;

	if ($.indicator) {
		return;
	}

	publicMethod = $.fn[indicator] = $[indicator] = function (options) {
		var settings = options;

		return this.each(function (i, obj) {
			initializeIndicator(obj, settings);
		});
	};

	function setSettings(options) {
		var settings = $.extend({
			initializing: true,
			height: false,
			steps: false,
			step: 0, 
			firstStepDistance: 0,
			lastStepDistance: 0,
			moveDuration: 1000,

			//Events:
			onStepChanged: false
		}, options);

		return settings;
	}

	function getSettings(internalElement) {
		return internalElement.closest('.Indicator').data('settings');
	}

	function initializeIndicator(obj, settings) {
		var setting = setSettings({});
		settings = $.extend(setting, settings);

		if (settings.height == false && $(obj).height() < setting.firstStepDistance + settings.lastStepDistance + 1)
			settings.height = setting.firstStepDistance + settings.lastStepDistance + 100;

		if (settings.steps == false)
			settings.steps = 100;
		else if (settings.steps < 1)
			settings.steps = 1;

		$(obj).addClass("Indicator");

		var content = '<div class="Nub">';
		content += '</div>';

		$(obj).append(content);
		$(obj).data("settings", settings);

		if (settings.height != false)
			$(obj).css('height', settings.height);

		var nubObj = $(obj).children(".Nub");
		nubHeight = nubObj.outerHeight();
		halfNubHeight = nubHeight * Math.sqrt(2) / 2;
		rotateSizeCorrection = (2 * halfNubHeight - nubHeight) / 2;

		nubObj.css('transition', 'top ' + settings.moveDuration / 1000 + 's');

		settings.initializing = undefined;
		$(obj).data("settings", settings);

		changeStep($(obj), settings.step);
	}

	function calculateStepPosition(element, step) 
	{
		var currentHeight = $(element).height();
		var currentSetting = getSettings($(element));
		currentHeight -= currentSetting.firstStepDistance + currentSetting.lastStepDistance + 2 * halfNubHeight;

		return currentHeight < 1 || currentSetting.steps == 1 ? 
			0 : step * currentHeight / (currentSetting.steps - 1) + currentSetting.firstStepDistance + rotateSizeCorrection;
	}

	function changeStep(element, newStep) {
		var currentSetting = getSettings($(element));

		if ($(element).hasClass('Indicator')) {

			if (currentSetting.initializing == undefined) {
				movingStep = Math.min(Math.max(0, newStep), currentSetting.steps);
				currentSetting.step = movingStep;

				$(element).children(".Nub").css('top', calculateStepPosition(element, movingStep) + 'px');

				$(element).data("settings", currentSetting);
				trigger(currentSetting.onStepChanged, movingStep, element);
			}
		}
	}

	publicMethod.getSettings = function (internalElement) {
		return internalElement.closest('.Indicator').data('settings');
	}

	publicMethod.next = function (element) {
		changeStep(element, getSettings($(element)).step + 1);
	}

	publicMethod.previous = function (element) {
		changeStep(element, getSettings($(element)).step - 1);
	}

	publicMethod.first = function (element) {
		changeStep(element, 0);
	}

	publicMethod.last = function (element) {
		changeStep(element, getSettings($(element)).steps - 1);
	}

	publicMethod.goTo = function (element, newStep) {
		changeStep(element, newStep);
	}

	publicMethod.stepChanged = function (step, caller) {
		trigger(getSettings(caller).onStepChanged, step, caller);
	}

	function trigger(callback, value, caller) {
		if ($.isFunction(callback)) {
			callback.call(undefined, value, caller);
		}
	}
}(jQuery, document, window));