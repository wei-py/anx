#!/usr/bin/env node
import { jsx, jsxs } from "react/jsx-runtime";
import { useInput, Box, Text, render } from "ink";
import { useState } from "react";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
function Menu({ items, onSelect, onBack }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  useInput((input, key) => {
    if (input === "j" || key.downArrow) {
      setSelectedIndex((prev) => (prev + 1) % items.length);
    } else if (input === "k" || key.upArrow) {
      setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    } else if (key.return) {
      onSelect(selectedIndex);
    } else if (input === "b" && onBack) {
      onBack();
    }
  });
  return /* @__PURE__ */ jsx(Box, { flexDirection: "column", children: items.map((item, index) => /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsxs(Text, { color: index === selectedIndex ? "green" : void 0, children: [
    index === selectedIndex ? "> " : "  ",
    item
  ] }) }, index)) });
}
function Input({
  label,
  placeholder = "",
  defaultValue = "",
  isPassword = false,
  onSubmit,
  onBack
}) {
  const [value, setValue] = useState(defaultValue);
  const [cursorPosition, setCursorPosition] = useState(defaultValue.length);
  useInput((input, key) => {
    if (key.return) {
      onSubmit(value);
    } else if (input === "b" && key.ctrl && onBack) {
      onBack();
    } else if (key.backspace || key.delete) {
      if (cursorPosition > 0) {
        setValue((prev) => prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition));
        setCursorPosition((prev) => prev - 1);
      }
    } else if (key.leftArrow) {
      setCursorPosition((prev) => Math.max(0, prev - 1));
    } else if (key.rightArrow) {
      setCursorPosition((prev) => Math.min(value.length, prev + 1));
    } else if (!key.ctrl && !key.meta && input) {
      setValue((prev) => prev.slice(0, cursorPosition) + input + prev.slice(cursorPosition));
      setCursorPosition((prev) => prev + input.length);
    }
  });
  const displayValue = isPassword ? "*".repeat(value.length) : value;
  const displayWithCursor = displayValue.slice(0, cursorPosition) + "█" + displayValue.slice(cursorPosition);
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", children: [
    /* @__PURE__ */ jsx(Text, { children: label }),
    /* @__PURE__ */ jsxs(Box, { children: [
      /* @__PURE__ */ jsx(Text, { color: "green", children: "> " }),
      /* @__PURE__ */ jsx(Text, { children: value ? displayWithCursor : /* @__PURE__ */ jsxs(Text, { dimColor: true, children: [
        placeholder,
        "█"
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsx(Text, { dimColor: true, children: "Enter 确认 | Ctrl+B 返回" }) })
  ] });
}
function MultiSelect({ label, items, onSubmit, onBack }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selections, setSelections] = useState(items);
  useInput((input, key) => {
    if (input === "j" || key.downArrow) {
      setSelectedIndex((prev) => (prev + 1) % selections.length);
    } else if (input === "k" || key.upArrow) {
      setSelectedIndex((prev) => (prev - 1 + selections.length) % selections.length);
    } else if (input === " ") {
      setSelections(
        (prev) => prev.map(
          (item, index) => index === selectedIndex ? { ...item, selected: !item.selected } : item
        )
      );
    } else if (key.return) {
      onSubmit(selections);
    } else if (input === "b" && onBack) {
      onBack();
    }
  });
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", children: [
    /* @__PURE__ */ jsx(Text, { children: label }),
    /* @__PURE__ */ jsx(Box, { flexDirection: "column", marginTop: 1, children: selections.map((item, index) => /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsxs(Text, { color: index === selectedIndex ? "green" : void 0, children: [
      index === selectedIndex ? "> " : "  ",
      "[",
      item.selected ? "x" : " ",
      "] ",
      item.name
    ] }) }, item.id)) })
  ] });
}
function ProjectInfoDisplay({ info, onConfirm, onBack }) {
  useInput((input, key) => {
    if (key.return) {
      onConfirm();
    } else if (input === "b" && onBack) {
      onBack();
    }
  });
  const moduleList = info.modules.slice(0, 5).join(", ");
  const moreModules = info.modules.length > 5 ? ` 等 ${info.modules.length} 个模块` : "";
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", children: [
    /* @__PURE__ */ jsx(Text, { bold: true, children: "项目信息" }),
    /* @__PURE__ */ jsx(Box, { flexDirection: "column", marginTop: 1, marginLeft: 2, children: /* @__PURE__ */ jsxs(Box, { borderStyle: "round", flexDirection: "column", paddingX: 2, paddingY: 1, children: [
      /* @__PURE__ */ jsxs(Text, { children: [
        "应用名称: ",
        /* @__PURE__ */ jsx(Text, { color: "green", children: info.name })
      ] }),
      /* @__PURE__ */ jsxs(Text, { children: [
        "应用ID: ",
        /* @__PURE__ */ jsx(Text, { color: "green", children: info.id })
      ] }),
      /* @__PURE__ */ jsxs(Text, { children: [
        "版本: ",
        /* @__PURE__ */ jsxs(Text, { color: "green", children: [
          info.versionName,
          " (",
          info.versionCode,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Text, { children: [
        "模块: ",
        /* @__PURE__ */ jsxs(Text, { color: "green", children: [
          moduleList,
          moreModules
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsx(Text, { dimColor: true, children: "Enter 继续 | b 返回" }) })
  ] });
}
function normalizePath(inputPath) {
  if (process.platform === "win32" && /^\/[a-zA-Z]\//.test(inputPath)) {
    const driveLetter = inputPath[1].toUpperCase();
    return `${driveLetter}:${inputPath.slice(2).replace(/\//g, "\\")}`;
  }
  return path.resolve(inputPath);
}
async function parseProject(hbuilderxPath) {
  const normalizedPath = normalizePath(hbuilderxPath);
  const outputPath = path.join(normalizedPath, "unpackage", "resources", "app-android");
  if (!await fs.pathExists(outputPath)) {
    throw new Error(`找不到 HBuilderX 产物目录: ${outputPath}`);
  }
  const manifestPath = await findManifest(outputPath);
  if (!manifestPath) {
    throw new Error("找不到 manifest.json 文件");
  }
  const manifestContent = await fs.readFile(manifestPath, "utf-8");
  const manifest = JSON.parse(manifestContent);
  const modules = manifest["app-android"]?.distribute?.modules ? Object.keys(manifest["app-android"].distribute.modules) : [];
  const icons = manifest["app-android"]?.distribute?.icons || {};
  return {
    id: manifest.id,
    name: manifest.name,
    versionName: manifest.version.name,
    versionCode: manifest.version.code,
    modules,
    icons
  };
}
async function findManifest(basePath) {
  const directPath = path.join(basePath, "manifest.json");
  if (await fs.pathExists(directPath)) {
    return directPath;
  }
  const entries = await fs.readdir(basePath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith("__UNI__")) {
      const wwwManifest = path.join(basePath, entry.name, "www", "manifest.json");
      if (await fs.pathExists(wwwManifest)) {
        return wwwManifest;
      }
    }
  }
  return null;
}
const requiredDependencies = [
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
  'implementation "org.jetbrains.kotlin:kotlin-reflect:2.2.0"'
];
const adDependencies = {
  huawei: [
    'implementation "com.huawei.hms:ads-lite:13.4.66.300"'
  ],
  csj: [
    'implementation "com.pangle.cn:ads-sdk:6.3.0.0"'
  ],
  gdt: [
    'implementation "com.qq.e.union:union:4.610.1460"'
  ],
  ks: [
    'implementation "com.github.nicehcy:KSAdSDK:3.3.68.2"'
  ],
  baidu: [
    'implementation "com.baidu.mobads:sdk:9.37"'
  ],
  sigmob: [
    'implementation "com.sigmob.windad:sdk:4.18.0"'
  ],
  unity: [
    'implementation "com.unity3d.ads:unity-ads:4.12.4"'
  ],
  vungle: [
    'implementation "com.vungle:publisher-sdk-android:7.4.2"'
  ],
  mintegral: [
    'implementation "com.mintegral.msdk:mtgdownloads:16.8.41"'
  ],
  ironsource: [
    'implementation "com.ironsource.sdk:mediationsdk:8.4.0"'
  ]
};
const moduleDependencies = {
  "uni-payment": [
    'implementation "com.alipay.sdk:alipaysdk-android:15.8.17"',
    'implementation "com.tencent.mm.opensdk:wechat-sdk-android:6.8.0"'
  ],
  "uni-location": [
    'implementation "com.tencent.map.geolocation:TencentLocationSdk-openplatform:7.5.4.3"'
  ],
  "uni-map": [
    'implementation "com.tencent.map:tencent-map-vector-sdk:5.6.0"',
    'implementation "com.tencent.map:sdk-utilities:1.0.9"'
  ],
  "uni-push": [
    'implementation "com.getui:gtc-dcloud:3.2.16.7"',
    `implementation("com.getui:gtsdk:3.3.7.0"){ exclude(group: 'com.getui') }`
  ],
  "uni-camera": [
    'implementation "androidx.camera:camera-core:1.4.1"',
    'implementation "androidx.camera:camera-camera2:1.4.1"',
    'implementation "androidx.camera:camera-lifecycle:1.4.1"',
    'implementation "androidx.camera:camera-view:1.4.1"'
  ],
  "uni-video": [
    'implementation "com.google.android.exoplayer:exoplayer-core:2.18.0"'
  ],
  "uni-scanCode": [
    'implementation "com.google.mlkit:barcode-scanning:17.2.0"'
  ],
  "uni-canvas": [
    // canvas 组件依赖
  ],
  "uni-ad": [
    // 广告模块基础依赖
  ],
  "uni-live-player": [
    'implementation "com.qiniu:qplayer2-core:1.5.0"',
    'implementation "com.qiniu:happy-dns:1.0.0"'
  ],
  "uni-live-pusher": [
    'implementation "com.qiniu:qplayer2-core:1.5.0"'
  ]
};
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
const SDK_TEMPLATE_PATH = path.resolve(__dirname$1, "../../Android-uni-app-x-SDK@14196-4.87/uniappxnativepackage");
async function generateProject(config) {
  if (!config.projectInfo) {
    throw new Error("项目信息不存在");
  }
  const { projectInfo, packageName, signing, adDependencies: selectedAds, hbuilderxPath } = config;
  const outputDir = path.resolve(process.cwd(), projectInfo.id);
  if (!await fs.pathExists(SDK_TEMPLATE_PATH)) {
    throw new Error(`找不到 SDK 模板: ${SDK_TEMPLATE_PATH}`);
  }
  await fs.copy(SDK_TEMPLATE_PATH, outputDir, {
    filter: (src) => {
      const basename = path.basename(src);
      return basename !== ".DS_Store" && basename !== ".git";
    }
  });
  const hbuilderxOutputPath = path.join(hbuilderxPath, "unpackage", "resources", "app-android");
  const wwwSourceDir = await findWwwDir(hbuilderxOutputPath);
  if (wwwSourceDir) {
    const wwwTargetDir = path.join(outputDir, "uniappx", "src", "main", "assets", "apps", projectInfo.id, "www");
    await fs.ensureDir(path.dirname(wwwTargetDir));
    await fs.copy(wwwSourceDir, wwwTargetDir);
  }
  await updateBuildGradle(outputDir, config);
  await updateStringsXml(outputDir, projectInfo.name);
  await copyIcons(hbuilderxOutputPath, outputDir, projectInfo.icons);
  await updateSettingsGradle(outputDir, projectInfo.id);
}
async function findWwwDir(basePath) {
  const entries = await fs.readdir(basePath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith("__UNI__")) {
      const wwwDir = path.join(basePath, entry.name, "www");
      if (await fs.pathExists(wwwDir)) {
        return wwwDir;
      }
    }
  }
  return null;
}
async function updateBuildGradle(outputDir, config) {
  const buildGradlePath = path.join(outputDir, "app", "build.gradle");
  let content = await fs.readFile(buildGradlePath, "utf-8");
  const { projectInfo, packageName, signing, adDependencies: selectedAds } = config;
  content = content.replace(
    /applicationId\s+"[^"]+"/,
    `applicationId "${packageName}"`
  );
  content = content.replace(
    /versionCode\s+\d+/,
    `versionCode ${projectInfo.versionCode}`
  );
  content = content.replace(
    /versionName\s+"[^"]+"/,
    `versionName "${projectInfo.versionName}"`
  );
  if (signing.keystorePath) {
    const signingConfig = `
    signingConfigs {
        release {
            storeFile file("${signing.keystorePath}")
            storePassword "${signing.keystorePassword}"
            keyAlias "${signing.keyAlias}"
            keyPassword "${signing.keyPassword}"
        }
    }
`;
    content = content.replace(
      /(android\s*\{)/,
      `$1
${signingConfig}`
    );
    content = content.replace(
      /(buildTypes\s*\{\s*release\s*\{)/,
      `$1
            signingConfig signingConfigs.release`
    );
  }
  const dependencies = [...requiredDependencies];
  for (const module of projectInfo.modules) {
    const moduleDeps = moduleDependencies[module];
    if (moduleDeps) {
      dependencies.push(...moduleDeps);
    }
  }
  for (const ad of selectedAds) {
    if (ad.selected) {
      const adDeps = adDependencies[ad.id];
      if (adDeps) {
        dependencies.push(...adDeps);
      }
    }
  }
  const uniqueDeps = [...new Set(dependencies)];
  const depsString = uniqueDeps.map((dep) => `    ${dep}`).join("\n");
  content = content.replace(
    /(dependencies\s*\{)/,
    `$1
${depsString}
`
  );
  await fs.writeFile(buildGradlePath, content);
}
async function updateStringsXml(outputDir, appName) {
  const stringsXmlPath = path.join(outputDir, "app", "src", "main", "res", "values", "strings.xml");
  let content = await fs.readFile(stringsXmlPath, "utf-8");
  content = content.replace(
    /<string name="app_name">[^<]+<\/string>/,
    `<string name="app_name">${appName}</string>`
  );
  await fs.writeFile(stringsXmlPath, content);
}
async function copyIcons(sourcePath, outputDir, icons) {
  const iconDensityMap = {
    hdpi: "mipmap-hdpi",
    xhdpi: "mipmap-xhdpi",
    xxhdpi: "mipmap-xxhdpi",
    xxxhdpi: "mipmap-xxxhdpi"
  };
  for (const [density, iconPath] of Object.entries(icons)) {
    const targetDensity = iconDensityMap[density];
    if (targetDensity) {
      const sourceIconPath = await findIconFile(sourcePath, iconPath);
      if (sourceIconPath) {
        const targetDir = path.join(outputDir, "app", "src", "main", "res", targetDensity);
        await fs.ensureDir(targetDir);
        await fs.copy(sourceIconPath, path.join(targetDir, "ic_launcher.png"));
      }
    }
  }
}
async function findIconFile(basePath, iconPath) {
  const entries = await fs.readdir(basePath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith("__UNI__")) {
      const fullIconPath = path.join(basePath, entry.name, iconPath);
      if (await fs.pathExists(fullIconPath)) {
        return fullIconPath;
      }
    }
  }
  return null;
}
async function updateSettingsGradle(outputDir, projectId) {
  const settingsGradlePath = path.join(outputDir, "settings.gradle");
  let content = await fs.readFile(settingsGradlePath, "utf-8");
  content = content.replace(
    /rootProject\.name\s*=\s*"[^"]+"/,
    `rootProject.name = "${projectId}"`
  );
  await fs.writeFile(settingsGradlePath, content);
}
const initialAdDependencies = [
  { id: "huawei", name: "华为广告", selected: false },
  { id: "csj", name: "穿山甲广告", selected: false },
  { id: "gdt", name: "优量汇广告", selected: false },
  { id: "ks", name: "快手广告", selected: false },
  { id: "baidu", name: "百度广告", selected: false },
  { id: "sigmob", name: "Sigmob广告", selected: false },
  { id: "unity", name: "Unity广告", selected: false },
  { id: "vungle", name: "Vungle广告", selected: false },
  { id: "mintegral", name: "Mintegral广告", selected: false },
  { id: "ironsource", name: "IronSource广告", selected: false }
];
const initialConfig = {
  hbuilderxPath: "",
  projectInfo: null,
  packageName: "",
  adDependencies: initialAdDependencies,
  signing: {
    keystorePath: "",
    keystorePassword: "",
    keyAlias: "",
    keyPassword: ""
  }
};
function App() {
  const [step, setStep] = useState("menu");
  const [config, setConfig] = useState(initialConfig);
  const [error, setError] = useState("");
  const [signingStep, setSigningStep] = useState(0);
  const handleMenuSelect = (index) => {
    if (index === 0) {
      setStep("input-path");
    } else if (index === 1) {
      setStep("input-path");
    } else {
      process.exit(0);
    }
  };
  const handlePathSubmit = async (path2) => {
    setError("");
    try {
      const projectInfo = await parseProject(path2);
      setConfig((prev) => ({
        ...prev,
        hbuilderxPath: path2,
        projectInfo,
        packageName: `com.example.${projectInfo.id.toLowerCase().replace(/__/g, "").replace(/_/g, "")}`
      }));
      setStep("project-info");
    } catch (err) {
      setError(err instanceof Error ? err.message : "解析项目失败");
    }
  };
  const handleProjectInfoConfirm = () => {
    setStep("input-package");
  };
  const handlePackageSubmit = (packageName) => {
    setConfig((prev) => ({ ...prev, packageName }));
    setStep("select-ads");
  };
  const handleAdsSelect = (ads) => {
    setConfig((prev) => ({ ...prev, adDependencies: ads }));
    setStep("input-signing");
    setSigningStep(0);
  };
  const handleSigningInput = (value) => {
    const fields = ["keystorePath", "keystorePassword", "keyAlias", "keyPassword"];
    setConfig((prev) => ({
      ...prev,
      signing: { ...prev.signing, [fields[signingStep]]: value }
    }));
    if (signingStep < 3) {
      setSigningStep(signingStep + 1);
    } else {
      setStep("confirm");
    }
  };
  const handleConfirm = async (index) => {
    if (index === 0) {
      setStep("generating");
      try {
        await generateProject(config);
        setStep("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : "生成项目失败");
        setStep("confirm");
      }
    } else if (index === 1) {
      setStep("input-path");
    } else {
      process.exit(0);
    }
  };
  const handleBack = () => {
    const stepOrder = [
      "menu",
      "input-path",
      "project-info",
      "input-package",
      "select-ads",
      "input-signing",
      "confirm"
    ];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      if (step === "input-signing" && signingStep > 0) {
        setSigningStep(signingStep - 1);
      } else {
        setStep(stepOrder[currentIndex - 1]);
      }
    }
  };
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", padding: 1, children: [
    /* @__PURE__ */ jsx(Box, { marginBottom: 1, children: /* @__PURE__ */ jsx(Text, { bold: true, color: "cyan", children: "┌─────────────────────────────────────────┐" }) }),
    /* @__PURE__ */ jsx(Box, { marginBottom: 1, children: /* @__PURE__ */ jsx(Text, { bold: true, color: "cyan", children: "│  ANX - uni-app-x Android 离线打包工具   │" }) }),
    /* @__PURE__ */ jsx(Box, { marginBottom: 1, children: /* @__PURE__ */ jsx(Text, { bold: true, color: "cyan", children: "└─────────────────────────────────────────┘" }) }),
    error && /* @__PURE__ */ jsx(Box, { marginBottom: 1, children: /* @__PURE__ */ jsxs(Text, { color: "red", children: [
      "错误: ",
      error
    ] }) }),
    step === "menu" && /* @__PURE__ */ jsx(
      Menu,
      {
        items: ["创建新项目", "从现有项目更新", "退出"],
        onSelect: handleMenuSelect
      }
    ),
    step === "input-path" && /* @__PURE__ */ jsx(
      Input,
      {
        label: "请输入 HBuilderX 项目路径",
        placeholder: "/path/to/your/uniapp-project",
        onSubmit: handlePathSubmit,
        onBack: handleBack
      }
    ),
    step === "project-info" && config.projectInfo && /* @__PURE__ */ jsx(
      ProjectInfoDisplay,
      {
        info: config.projectInfo,
        onConfirm: handleProjectInfoConfirm,
        onBack: handleBack
      }
    ),
    step === "input-package" && /* @__PURE__ */ jsx(
      Input,
      {
        label: "请输入包名 (applicationId)",
        defaultValue: config.packageName,
        onSubmit: handlePackageSubmit,
        onBack: handleBack
      }
    ),
    step === "select-ads" && /* @__PURE__ */ jsx(
      MultiSelect,
      {
        label: "选择广告依赖（空格选择，jk 上下移动，Enter 确认）",
        items: config.adDependencies,
        onSubmit: handleAdsSelect,
        onBack: handleBack
      }
    ),
    step === "input-signing" && /* @__PURE__ */ jsx(
      Input,
      {
        label: signingStep === 0 ? "keystore 路径" : signingStep === 1 ? "keystore 密码" : signingStep === 2 ? "key 别名" : "key 密码",
        isPassword: signingStep === 1 || signingStep === 3,
        onSubmit: handleSigningInput,
        onBack: handleBack
      }
    ),
    step === "confirm" && /* @__PURE__ */ jsx(
      Menu,
      {
        items: ["确认生成", "返回修改", "取消"],
        onSelect: handleConfirm,
        onBack: handleBack
      }
    ),
    step === "generating" && /* @__PURE__ */ jsx(Text, { color: "yellow", children: "正在生成项目..." }),
    step === "done" && /* @__PURE__ */ jsxs(Box, { flexDirection: "column", children: [
      /* @__PURE__ */ jsxs(Text, { color: "green", children: [
        "✓ 项目已生成到: ./",
        config.projectInfo?.id
      ] }),
      /* @__PURE__ */ jsx(Text, { dimColor: true, children: "按任意键退出" })
    ] }),
    /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsx(Text, { dimColor: true, children: "操作: jk 上下 | 空格 多选 | Enter 确认 | b 返回" }) })
  ] });
}
render(/* @__PURE__ */ jsx(App, {}));
//# sourceMappingURL=index.js.map
