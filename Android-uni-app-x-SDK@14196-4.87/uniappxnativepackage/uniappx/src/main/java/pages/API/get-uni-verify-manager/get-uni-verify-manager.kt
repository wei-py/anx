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
import io.dcloud.uniapp.extapi.getAppBaseInfo as uni_getAppBaseInfo
import io.dcloud.uniapp.extapi.getUniVerifyManager as uni_getUniVerifyManager
import io.dcloud.uniapp.extapi.openDialogPage as uni_openDialogPage
import io.dcloud.uniapp.extapi.showModal as uni_showModal
open class GenPagesAPIGetUniVerifyManagerGetUniVerifyManager : BasePage {
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
        onLoad(fun(_: OnLoadOptions) {
            this.uniVerifyManager = uni_getUniVerifyManager()
            this.preLogin(fun(){})
        }
        , __ins)
    }
    @Suppress("UNUSED_PARAMETER", "UNUSED_VARIABLE")
    override fun `$render`(): Any? {
        val _ctx = this
        val _cache = this.`$`.renderCache
        val _component_page_head = resolveEasyComponent("page-head", GenComponentsPageHeadPageHeadClass)
        return _cE("view", null, _uA(
            _cV(_component_page_head, _uM("title" to _ctx.title), null, 8, _uA(
                "title"
            )),
            _cE("view", _uM("class" to "uni-padding-wrap uni-common-mt"), _uA(
                _cE("view", _uM("class" to "uni-btn-v uni-common-mt"), _uA(
                    _cE("button", _uM("type" to "default", "onClick" to fun(){
                        _ctx.verify(false)
                    }
                    ), "一键登录（半屏）", 8, _uA(
                        "onClick"
                    ))
                )),
                _cE("view", _uM("class" to "uni-btn-v uni-common-mt"), _uA(
                    _cE("button", _uM("type" to "default", "onClick" to fun(){
                        _ctx.verify(true)
                    }
                    ), "一键登录（全屏）", 8, _uA(
                        "onClick"
                    ))
                )),
                _cE("view", _uM("class" to "uni-btn-v uni-common-mt"), _uA(
                    _cE("button", _uM("type" to "default", "onClick" to fun(){
                        _ctx.customLoginIn()
                    }
                    ), "一键登录（自定义页面）", 8, _uA(
                        "onClick"
                    ))
                ))
            ))
        ))
    }
    open var title: String by `$data`
    open var uniVerifyManager: UniVerifyManager? by `$data`
    open var phone: String by `$data`
    open var slogan: String by `$data`
    open var privacyName: String by `$data`
    open var privacyUrl: String by `$data`
    @Suppress("USELESS_CAST")
    override fun data(): Map<String, Any?> {
        return _uM("title" to "一键登录", "uniVerifyManager" to null as UniVerifyManager?, "phone" to "", "slogan" to "", "privacyName" to "", "privacyUrl" to "")
    }
    open var customLoginIn = ::gen_customLoginIn_fn
    open fun gen_customLoginIn_fn() {
        if ("production" === "production" && "__UNI__HelloUniAppX" === uni_getAppBaseInfo(null).appId) {
            uni_showModal(ShowModalOptions(title = "提示", content = "一键登录为收费功能，当前环境暂不支持。请在HBuilderX中新建Hello uni-app x项目真机运行体验！", showCancel = false))
            return
        }
        val isPreLoginValid = this.uniVerifyManager?.isPreLoginValid() ?: false
        if (isPreLoginValid) {
            this.pushCustomPage()
        } else {
            this.preLogin(fun(){
                this.pushCustomPage()
            }
            )
        }
    }
    open var pushCustomPage = ::gen_pushCustomPage_fn
    open fun gen_pushCustomPage_fn() {
        val url = "/pages/API/get-uni-verify-manager/uni-verify-custom-page?phone=" + this.phone + "&slogan=" + this.slogan + "&name=" + this.privacyName + "&link=" + this.privacyUrl
        uni_openDialogPage(OpenDialogPageOptions(url = url, animationType = "slide-in-bottom", success = fun(res) {
            console.log("成功打开自定义登录页面")
        }
        , fail = fun(err) {
            console.log(err)
        }
        ))
    }
    open var verify = ::gen_verify_fn
    open fun gen_verify_fn(fullScreen: Boolean) {
        if ("production" === "production" && "__UNI__HelloUniAppX" === uni_getAppBaseInfo(null).appId) {
            uni_showModal(ShowModalOptions(title = "提示", content = "一键登录为收费功能，当前环境暂不支持。请在HBuilderX中新建Hello uni-app x项目真机运行体验！", showCancel = false))
            return
        }
        val isPreLoginValid = this.uniVerifyManager?.isPreLoginValid() ?: false
        if (isPreLoginValid) {
            this.login(fullScreen)
        } else {
            this.preLogin(fun(){
                this.login(fullScreen)
            }
            )
        }
    }
    open var preLogin = ::gen_preLogin_fn
    open fun gen_preLogin_fn(callback: (() -> Unit)) {
        this.uniVerifyManager?.preLogin(UniVerifyManagerPreLoginOptions(success = fun(res){
            this.phone = res.number
            this.slogan = res.slogan
            this.privacyName = res.privacyName
            this.privacyUrl = res.privacyUrl
            console.log("pre login success")
            callback()
        }
        , fail = fun(err){
            console.error("pre login fail => " + JSON.stringify(err))
            val hasCauseMessage = (err.cause?.cause?.message ?: "").length > 0
            uni_showModal(ShowModalOptions(title = "预登录失败", content = if (hasCauseMessage) {
                JSON.parseObject(err.cause?.cause?.message ?: "")?.getString("errorDesc")
            } else {
                err.errMsg
            }
            , showCancel = false))
        }
        ))
    }
    open var login = ::gen_login_fn
    open fun gen_login_fn(fullScreen: Boolean) {
        this.uniVerifyManager?.login(UniVerifyManagerLoginOptions(uniVerifyStyle = UniVerifyManagerLoginStyle(fullScreen = fullScreen, loginBtnText = "一键登录", logoPath = "/static/logo.png"), success = fun(res){
            console.log("login success => " + JSON.stringify(res))
            this.takePhoneNumber(res.accessToken, res.openId)
        }
        , fail = fun(err){
            console.error("login fail => " + err)
            val hasCauseMessage = (err.cause?.cause?.message ?: "").length > 0
            uni_showModal(ShowModalOptions(title = "登录失败", content = if (hasCauseMessage) {
                JSON.parseObject(err.cause?.cause?.message ?: "")?.getString("errorDesc")
            } else {
                err.errMsg
            }
            , showCancel = false))
        }
        ))
    }
    open var takePhoneNumber = ::gen_takePhoneNumber_fn
    open fun gen_takePhoneNumber_fn(accessToken: String, openId: String) {
        uniCloud.callFunction(UniCloudCallFunctionOptions(name = "univerify", data = object : UTSJSONObject() {
            var access_token = accessToken
            var openid = openId
        })).then(fun(res){
            this.uniVerifyManager?.close()
            setTimeout(fun(){
                uni_showModal(ShowModalOptions(title = "取号成功", content = res.result.getJSON("res")?.getString("phoneNumber"), showCancel = false))
            }
            , 100)
        }
        ).`catch`(fun(err){
            console.error(JSON.stringify(err))
            this.uniVerifyManager?.close()
            setTimeout(fun(){
                uni_showModal(ShowModalOptions(title = "取号失败", content = (err as UTSError).message, showCancel = false))
            }
            , 100)
        }
        )
    }
    companion object {
        val styles: Map<String, Map<String, Map<String, Any>>> by lazy {
            _nCS(_uA(), _uA(
                GenApp.styles
            ))
        }
        var inheritAttrs = true
        var inject: Map<String, Map<String, Any?>> = _uM()
        var emits: Map<String, Any?> = _uM()
        var props = _nP(_uM())
        var propsNeedCastKeys: UTSArray<String> = _uA()
        var components: Map<String, CreateVueComponent> = _uM()
    }
}
