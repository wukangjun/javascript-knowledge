/*
 * @Author: wukangjun
 * @Date: 2020-09-13 21:43:10
 * @Description: write something
 */

module.exports = function selectBlock(
    descriptor,
    loaderContext,
    query,
    appendExtension
) {
    // template
    if (query.type === `template`) {
        if (appendExtension) {
            loaderContext.resourcePath += '.' + (descriptor.template.lang || 'html')
        }
        loaderContext.callback(
            null,
            descriptor.template.content,
            descriptor.template.map
        )
        return
    }

    // script
    if (query.type === `script`) {
        if (appendExtension) {
            loaderContext.resourcePath += '.' + (descriptor.script.lang || 'js')
        }
        loaderContext.callback(
            null,
            descriptor.script.content,
            descriptor.script.map
        )
        return
    }
}