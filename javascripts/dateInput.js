(function() {

	var fillNumber = function(number, max) {
		var result = ""
		for(var i = 0; i < (max - (""+number).length); i++) {
			result += "0"
		}
		return result + number
	}

	var handleInput = function(originalInput, type, elem, size, range, defaultValue, placeholder, moveTargets) {
		var updateOriginalInput = function() {
			originalInput.prop(type, elem.val())
			originalInput.val((new Date(originalInput.prop("year"), originalInput.prop("month") - 1, originalInput.prop("day"))).getTime())
		}

		var moveRight = function() {
			elem.addClass("set")
			if (moveTargets[1]) {
				moveTargets[1].focus()
				moveTargets[1][0].select()
			}
			updateOriginalInput()
		}

		var moveLeft = function() {
			elem.addClass("set")
			if (moveTargets[0]) {
				moveTargets[0].focus()
				moveTargets[0][0].select()
			}
			updateOriginalInput()
		}


		elem.keydown(function(e) {

			if (e.which === 37) {
				moveLeft()
				return false
			}

			if (e.which === 38) {
				if (elem.val() === placeholder) {
					elem.val(fillNumber(defaultValue, size))
				} else {
					var target = +elem.val() + 1
					if (target > range) {
						target = 1
					}
					elem.val(fillNumber(target, size))
				}
				e.preventDefault()
				updateOriginalInput()
			}

			if (e.which === 39) {
				moveRight()
				return false
			}

			if (e.which === 40) {
				if (elem.val() === placeholder) {
					elem.val(fillNumber(defaultValue, size))
				} else {
					var target = +elem.val() - 1
					if (target < 1) {
						target = range
					}
					elem.val(fillNumber(target, size))
				}
				e.preventDefault()
				updateOriginalInput()
			}

			if (e.which > 47 && e.which < 58) {
				var keyValue = e.which - 48
				if (elem.val() === placeholder || elem.hasClass("set")) {
					elem.removeClass("set")
					elem.val(fillNumber(keyValue, size))
					if ((keyValue * 10) > range) {
						moveRight()
						return false
					}
				} else {
					if ((""+(+elem.val())).length === size) {
						moveRight()
						return false
					} else {
						elem.val(fillNumber((""+(+elem.val())) + keyValue, size))
						if ((""+(+elem.val())).length === size) {
							moveRight()
							return false
						}
					}
				}
				e.preventDefault()
			}

			if (e.which === 8) {
				elem.val(placeholder)
				e.preventDefault()
			}

			e.target.select()
		})
	}

	var moveLeft = function(target) {
		return function(e) {
			if (e.which === 37) {
				target.focus()
				target[0].select()
				return false
			}
		}
	}

	var moveRight = function(target) {
		return function(e) {
			if (e.which === 39) {
				target[0].select()
				return false
			}
		}
	}

	var select = function(e) {
		return function(e) {
			e.target.select()
			return false
		}
	}

	$.fn.dateInput = function(selector) {
		return this.each(function() {
			var wrapper = $(this).hide().wrap("<div>").parent()
			wrapper.addClass($(this).attr("class"))

			var input = $("<div class=inputs>")
			var dayInput = $("<input value=dd class='dayInput input' maxlength=2>")
			var monthInput = $("<input value=mm class='monthInput input' maxlength=2>")
			var yearInput = $("<input value=yyyy class='yearInput input' maxlength=4>")

			input.on({
				click: function(e) {
					dayInput[0].select()
				}
			})

			dayInput.on("click", select())
			monthInput.on("click", select())
			yearInput.on("click", select())

			handleInput($(this), "day", dayInput, 2, 31, (new Date()).getDate(), "dd", [null, monthInput])
			handleInput($(this), "month", monthInput, 2, 12, (new Date()).getMonth() + 1, "mm", [dayInput, yearInput])
			handleInput($(this), "year", yearInput, 4, 9999, (new Date()).getFullYear(), "yyyy", [monthInput, null])

			monthInput.on("keydown", function() {
				if ($(this).val().length > 0 && $(this).val() !== "mm") {
					$(this).addClass("narrow")
				} else {
					$(this).removeClass("narrow")
				}
			})

			if ($(this).val()) {
				var date = (new Date(+$(this).val()))
				dayInput.val(fillNumber(date.getDate(), 2))
				monthInput.val(fillNumber(date.getMonth() + 1, 2))
				monthInput.addClass("narrow")
				yearInput.val(fillNumber(date.getFullYear(), 4))
			}

			$(this).prop({
				day: dayInput.val(),
				month: monthInput.val(),
				year: yearInput.val()
			})

			input.append([dayInput, "<div class=divider>", monthInput, "<div class=divider>", yearInput])
			wrapper.append(input)
		})
	}
})()
