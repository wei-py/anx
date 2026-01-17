@file:Suppress("UNCHECKED_CAST", "USELESS_CAST", "INAPPLICABLE_JVM_NAME", "UNUSED_ANONYMOUS_PARAMETER", "NAME_SHADOWING", "UNNECESSARY_NOT_NULL_ASSERTION")
package uni.UNIHelloUniAppX
import io.dcloud.uniapp.*
import io.dcloud.uniapp.extapi.*
import io.dcloud.uniapp.framework.*
import io.dcloud.uniapp.runtime.*
import io.dcloud.uniapp.vue.*
import io.dcloud.uniapp.vue.shared.*
import io.dcloud.unicloud.*
import io.dcloud.uts.*
import io.dcloud.uts.Map
import io.dcloud.uts.Set
import io.dcloud.uts.UTSAndroid
import kotlin.properties.Delegates
import io.dcloud.uniapp.extapi.closeDialogPage as uni_closeDialogPage
open class GenPagesAPIGetUniVerifyManagerFullWebviewPage : BasePage {
    constructor(__ins: ComponentInternalInstance, __renderer: String?) : super(__ins, __renderer) {
        onLoad(fun(_: OnLoadOptions) {
            stat_instance.onLoad(this)
        }
        , __ins)
        onPageShow(fun() {
            stat_instance.onShow(this)
        }
        , __ins)
        onPageHide(fun() {
            stat_instance.onHide(this)
        }
        , __ins)
        onUnload(fun() {
            stat_instance.onUnload(this)
        }
        , __ins)
        onLoad(fun(options: OnLoadOptions) {
            this.url = options["url"] as String
            this.title = options["title"] as String
            this.animationType = options["animationType"] as String
        }
        , __ins)
    }
    @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
    override fun `$render`(): Any? {
        val _ctx = this
        val _cache = this.`$`.renderCache
        return _cE("view", _uM("class" to "background"), _uA(
            _cE("view", _uM("class" to "container"), _uA(
                _cE("view", _uM("class" to "nav"), _uA(
                    _cE("view", _uM("class" to "left_content"), _uA(
                        _cE("text", _uM("class" to "left_icon", "onClick" to fun(){
                            _ctx.onBack()
                        }
                        ), _tD(_ctx.backIcon), 9, _uA(
                            "onClick"
                        ))
                    )),
                    _cE("view", _uM("class" to "title_content"), _uA(
                        _cE("text", _uM("class" to "title"), _tD(_ctx.title), 1)
                    ))
                )),
                _cE("web-view", _uM("class" to "web_container", "src" to _ctx.url), null, 8, _uA(
                    "src"
                ))
            ))
        ))
    }
    open var url: String by `$data`
    open var title: String by `$data`
    open var animationType: String by `$data`
    open var backIcon: String by `$data`
    @Suppress("USELESS_CAST")
    override fun data(): Map<String, Any?> {
        return _uM("url" to "", "title" to "", "animationType" to "slide-out-bottom", "backIcon" to "\ue601")
    }
    open var onBack = ::gen_onBack_fn
    open fun gen_onBack_fn() {
        uni_closeDialogPage(CloseDialogPageOptions(dialogPage = this.`$page`, animationType = this.animationType, success = fun(res) {
            console.log("closeThisDialog success", res)
        }
        , fail = fun(err) {
            console.log("closeThisDialog fail", err)
        }
        ))
    }
    companion object {
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(
                styles0
            ), _uA(
                GenApp.styles
            ))
        }
        val styles0: Map<String, Map<String, Map<String, Any>>>
            get() {
                return _uM("background" to _pS(_uM("backgroundColor" to "#007aff", "width" to "100%", "height" to "100%")), "nav" to _pS(_uM("height" to 45, "width" to "100%", "position" to "relative", "flexDirection" to "row", "justifyContent" to "space-between")), "left_content" to _pS(_uM("justifyContent" to "center", "alignItems" to "center", "width" to 40, "height" to "100%")), "left_icon" to _pS(_uM("color" to "#FFFFFF", "top" to 5, "height" to "100%", "fontFamily" to "uni-icon", "fontSize" to 26)), "title_content" to _pS(_uM("position" to "absolute", "height" to "100%", "top" to 0, "bottom" to 0, "left" to 45, "right" to 45, "flexDirection" to "row", "justifyContent" to "center", "alignItems" to "center")), "title" to _pS(_uM("color" to "#FFFFFF", "fontSize" to 17)), "container" to _pS(_uM("paddingTop" to CSS_VAR_STATUS_BAR_HEIGHT, "width" to "100%", "position" to "absolute", "height" to "100%")), "web_container" to _pS(_uM("backgroundColor" to "#f1f1f1", "paddingTop" to 10, "flexGrow" to 1, "flexShrink" to 1, "flexBasis" to "0%", "width" to "100%")))
            }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
