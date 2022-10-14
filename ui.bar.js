define(['jquery', 'jquery-ui'], ($) => {
	let directions = {top: 'up', bottom: 'down', left: 'left', right: 'right'}

	let css = `\t.BarWrapper,.Ui.Bar{box-sizing:border-box}\n\t.Ui.Bar{min-height:25px;min-width:25px;display:flex;flex-direction:row}\n\t.Ui.Bar[data-position=left],.Ui.Bar[data-position=right]{flex-direction:column}\n\t.Ui.Bar>*{flex-grow:0;flex-shrink:0}\n\t.Ui.Bar>.Spacer{flex-grow:1;flex-shrink:1}`
	$('head').append($(`<style>${css}</style>`))

	function CssValue (e, name, value) {
		if (typeof value === 'undefined') {
			value = e.css(name).replace(/px$/, '')
			return value.includes('.') ? parseFloat(value) : parseInt(value)
		}
		e.css(name, value+'px')
	}

	function Height (e, h) {return CssValue(e, 'height', h)}
	function Width (e, w) {return CssValue(e, 'width', w)}

	$.extend({
		CssValue: CssValue,
		Height: Height,
		Width: Width
	})

	return $.widget('Ui.Bar', {
		options: {
			//autohide: true,
			effect: 'slide',
			//overlay: true,
			position: 'top',
			width: 50,
			height: 0,

			hidden: null,
			shown: null
		},
		_create: function () {
			this._parent = this.element.parent()
			$(this._parent).on('resized', (event, size) => {this._Position()})

			Object.keys(this.element.data()).forEach(key => {
				if (Object.keys(this.options).includes(key)) {
					this.options[key] = this.element.data(key)
				}
			})

			this.element.css('position', 'absolute')
			this.options.height = /^(top|bottom)$/i.test(this.options.position) ? Height(this.element) : Width(this.element)
			this._Wrap()

			let observer = new ResizeObserver((entries) => {entries.forEach(entry => {$(entry.target).triggerHandler('resized', entry.contentRect)})})
			observer.observe(this._parent[0])
		},
		_Position: function () {
			this._Size()
			//this.element.css('position', this._wrapper == null ? 'absolute' : 'absolute')
			if (this.options.position == 'top') {
				if (this._wrapper != null) {
					CssValue(this._wrapper, 'top', this._parent.offset().top+(Height(this._parent)-this._parent.height())/2-1)
					CssValue(this._wrapper, 'left', this._parent.offset().left+CssValue(this._parent, 'border-left-width')-1)
					CssValue(this.element, 'top', 0)
					CssValue(this.element, 'left', 0)
				} else {
					CssValue(this.element, 'top', this._parent.offset().top+(Height(this._parent)-this._parent.height())/2-1)
					CssValue(this.element, 'left', this._parent.offset().left+CssValue(this._parent, 'border-left-width')-1)
				}
			}
			if (this.options.position == 'bottom') {
				if (this._wrapper != null) {
					CssValue(this._wrapper, 'top', this._parent.offset().top+this._parent.height()-Height(this._wrapper)+(Height(this._parent)-this._parent.height())/2+1)
					CssValue(this._wrapper, 'left', this._parent.offset().left+CssValue(this._parent, 'border-left-width')-1)
					CssValue(this.element, 'top', Height(this._wrapper)-Height(this.element))
					CssValue(this.element, 'left', 0)
				} else {
					CssValue(this.element, 'top', this._parent.offset().top+Height(this._parent)-Height(this.element))
					CssValue(this._wrapper, 'left', this._parent.offset().left+CssValue(this._parent, 'border-left-width')-1)
				}
			}
			if (this.options.position == 'left') {
				if (this._wrapper != null) {
					CssValue(this._wrapper, 'top', this._parent.offset().top+(Height(this._parent)-this._parent.height())/2-1)
					CssValue(this._wrapper, 'left', this._parent.offset().left+CssValue(this._parent, 'border-left-width')-1)
					CssValue(this.element, 'top', 0)
					CssValue(this.element, 'left', 0)
				} else {
					CssValue(this.element, 'top', this._parent.offset().top)
					CssValue(this.element, 'left', this._parent.offset().left)
				}
			}
			if (this.options.position == 'right') {
				if (this._wrapper != null) {
					CssValue(this._wrapper, 'top', this._parent.offset().top+(Height(this._parent)-this._parent.height())/2-1)
					CssValue(this._wrapper, 'left', this._parent.offset().left+this._parent.width()-Width(this._wrapper)+CssValue(this._parent, 'border-left-width'))
					CssValue(this.element, 'top', 0)
					CssValue(this.element, 'left', this.options.width-Width(this.element))
				} else {
					CssValue(this.element, 'top', this._parent.offset().top)
					CssValue(this.element, 'left', this._parent.offset().left+Width(this._parent)-Width(this.element))
				}
			}
		},
		_Size: function () {
			if (this.options.position == 'top') {
				if (this._wrapper != null) {
					Height(this._wrapper, this.options.width)
					this._wrapper.width(this._parent.width()+1)
				}
				this.element.width(this._parent.width()+1)
				Height(this.element, this.options.height)
			}
			if (this.options.position == 'bottom') {
				if (this._wrapper != null) {
					Height(this._wrapper, this.options.width)
					Width(this._wrapper, this._parent.width()+1)
				}
				Width(this.element, this._parent.width()+1)
				Height(this.element, this.options.height)
			}
			if (this.options.position == 'left') {
				if (this._wrapper != null) {
					Height(this._wrapper, this._parent.height()+1)
					Width(this._wrapper, this.options.width)
				}
				Width(this.element, this.options.height)
				Height(this.element, this._parent.height()+1)
			}
			if (this.options.position == 'right') {
				if (this._wrapper != null) {
					Height(this._wrapper, this._parent.height()+1)
					Width(this._wrapper, this.options.width)
				}
				Width(this.element, this.options.height)
				Height(this.element, this._parent.height()+1)
			}

		},
		_setOption: function (key, value) {
			if (this.IsShown() && (key == 'position' || key == 'overlay' || key == 'width')) {
				return this.Hide(() => {
					this._setOption(key, value)
					this.Show()
				})
			}

			this._super(key, value)

			if (key == 'autohide') {
				if (value) {this._Wrap()}
				else {this._Unwrap()}
			}
			if (key == 'position') {
				$(this.element).attr('data-position', this.options.position)
				if (this._wrapper != null) {
					$(this._wrapper).attr('data-position', this.options.position)
				}
				this._Position()
			}
			if (key == 'width') {
				if (this._wrapper != null) {
					if (/^(top|bottom)$/i.test(this.options.position)) {
						Height(this._wrapper, this.options.width)
					} else {
						Width(this._wrapper, this.options.width)
					}
				}
				this._Position()
			}
		},
		_Unwrap: function () {
			if (this._wrapper != null) {
				this.element.unwrap()
				this._wrapper = null
				this._Position()
				this.Show()
			}
		},
		_Wrap: function () {
			if (this._wrapper == null) {
				this.element.wrap(`<div class="BarWrapper" data-position="${this.options.position}">`)
				this._wrapper = this.element.parent()
				this._wrapper.css('position', 'absolute')
				let $this = this
				let Show = () => {
					$this.Show()
					$this.element.one('mouseleave', () => {
						$this._wrapper.one('mouseleave', () => {
							$this.Hide()
							$this._wrapper.one('mouseover', Show)
						})
					})
				}
				this._wrapper.one('mouseover', Show)
				this._Position()
				this.Hide()
			}
		},
		_wrapper: null,
		Hide: function (...args) {
			if (this.IsShown()) {
				let cb = args[args.length-1] instanceof Function ? args.pop() : () => {}
				let effect = args.length > 0 ? args.shift() : this.options.effect

				//if (this.options.overlay === false) {
				//	CssValue(this._parent, `padding-${this.options.position}`, CssValue(this._parent, `padding-${this.options.position}`)-this.options.height)
				//}
				this._hide(this.element, {effect: effect, direction: directions[this.options.position]}, () => {
					this._trigger('hidden')
					cb()
				})
			}
		},
		IsShown: function () {
			return this.element.css('display') != 'none'
		},
		Show: function (...args) {
			let cb = args[args.length-1] instanceof Function ? args.pop() : () => {}
			let effect = args.length > 0 ? args.shift() : this.options.effect

			//if (this.element.css('display') == 'none' && this.options.overlay === false) {
			//	CssValue(this._parent, `padding-${this.options.position}`, CssValue(this._parent, `padding-${this.options.position}`)+this.options.height)
			//}
			this._show(this.element, {effect: effect, direction: directions[this.options.position]}, () => {
				this._trigger('shown')
				cb()
			})
		}
	})




})
