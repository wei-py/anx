// 必须依赖 (19个基础依赖)
export const requiredDependencies = [
  'implementation "androidx.core:core-ktx:1.10.1"',
  'implementation "androidx.recyclerview:recyclerview:1.3.2"',
  'implementation "androidx.appcompat:appcompat:1.6.1"',
  'implementation "androidx.exifinterface:exifinterface:1.3.6"',
  'implementation "androidx.localbroadcastmanager:localbroadcastmanager:1.0.0@aar"',
  'implementation "androidx.constraintlayout:constraintlayout:2.1.4"',
  'implementation "androidx.webkit:webkit:1.6.0"',
  'implementation "com.google.android.material:material:1.4.0"',
  'implementation "androidx.viewpager2:viewpager2:1.1.0-beta02"',
  'implementation "com.alibaba:fastjson:1.2.83"',
  'implementation "com.facebook.fresco:fresco:3.4.0"',
  'implementation "com.facebook.fresco:middleware:3.4.0"',
  'implementation "com.facebook.fresco:animated-gif:3.4.0"',
  'implementation "com.facebook.fresco:webpsupport:3.4.0"',
  'implementation "com.facebook.fresco:animated-webp:3.4.0"',
  'implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4"',
  'implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4"',
  'implementation "org.jetbrains.kotlin:kotlin-stdlib:2.2.0"',
  'implementation "org.jetbrains.kotlin:kotlin-reflect:2.2.0"',
]

// 广告依赖映射
export const adDependencies: Record<string, string[]> = {
  huawei: [
    'implementation "com.huawei.hms:ads-lite:13.4.66.300"',
  ],
  csj: [
    'implementation "com.pangle.cn:ads-sdk:6.3.0.0"',
  ],
  gdt: [
    'implementation "com.qq.e.union:union:4.610.1460"',
  ],
  ks: [
    'implementation "com.github.nicehcy:KSAdSDK:3.3.68.2"',
  ],
  baidu: [
    'implementation "com.baidu.mobads:sdk:9.37"',
  ],
  sigmob: [
    'implementation "com.sigmob.windad:sdk:4.18.0"',
  ],
  unity: [
    'implementation "com.unity3d.ads:unity-ads:4.12.4"',
  ],
  vungle: [
    'implementation "com.vungle:publisher-sdk-android:7.4.2"',
  ],
  mintegral: [
    'implementation "com.mintegral.msdk:mtgdownloads:16.8.41"',
  ],
  ironsource: [
    'implementation "com.ironsource.sdk:mediationsdk:8.4.0"',
  ],
}

// 模块依赖映射
export const moduleDependencies: Record<string, string[]> = {
  'uni-payment': [
    'implementation "com.alipay.sdk:alipaysdk-android:15.8.17"',
    'implementation "com.tencent.mm.opensdk:wechat-sdk-android:6.8.0"',
  ],
  'uni-location': [
    'implementation "com.tencent.map.geolocation:TencentLocationSdk-openplatform:7.5.4.3"',
  ],
  'uni-map': [
    'implementation "com.tencent.map:tencent-map-vector-sdk:5.6.0"',
    'implementation "com.tencent.map:sdk-utilities:1.0.9"',
  ],
  'uni-push': [
    'implementation "com.getui:gtc-dcloud:3.2.16.7"',
    'implementation("com.getui:gtsdk:3.3.7.0"){ exclude(group: \'com.getui\') }',
  ],
  'uni-camera': [
    'implementation "androidx.camera:camera-core:1.4.1"',
    'implementation "androidx.camera:camera-camera2:1.4.1"',
    'implementation "androidx.camera:camera-lifecycle:1.4.1"',
    'implementation "androidx.camera:camera-view:1.4.1"',
  ],
  'uni-video': [
    'implementation "com.google.android.exoplayer:exoplayer-core:2.18.0"',
  ],
  'uni-scanCode': [
    'implementation "com.google.mlkit:barcode-scanning:17.2.0"',
  ],
  'uni-canvas': [
    // canvas 组件依赖
  ],
  'uni-ad': [
    // 广告模块基础依赖
  ],
  'uni-live-player': [
    'implementation "com.qiniu:qplayer2-core:1.5.0"',
    'implementation "com.qiniu:happy-dns:1.0.0"',
  ],
  'uni-live-pusher': [
    'implementation "com.qiniu:qplayer2-core:1.5.0"',
  ],
}
