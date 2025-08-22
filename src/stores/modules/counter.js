/**
 * 防抖函数
 * @param {Function} fn 要防抖执行的函数
 * @param {number} delay 延迟时间（毫秒）
 */
export function debounce(fn, delay) {
	let timer
	return function (...args) {
		const context = this
		clearTimeout(timer)
		timer = setTimeout(() => {
			fn.apply(context, args)
		}, delay)
	}
}