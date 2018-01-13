/**
 * Use JSX compiled code without React.
 * Adapted from https://stackoverflow.com/questions/30430982/can-i-use-jsx-without-react-to-inline-html-in-script
 */

const React = { // eslint-disable-line no-unused-vars
	createElement: function (tag, attrs) {
			var element = document.createElement(tag)

			for (let name in attrs) {
					if (name && attrs.hasOwnProperty(name)) {
							let value = attrs[name]
							if (value === true) {
									element.setAttribute(name, name)
							} else if (value !== false && value !== null) {
									element.setAttribute(name, value.toString())
							}
					}
			}
			for (let i = 2; i < arguments.length; i++) {
					let child = arguments[i]
					element.appendChild(
							child.nodeType == null ? // eslint-disable-line eqeqeq
									document.createTextNode(child.toString()) : child)
			}
			return element
	}
}