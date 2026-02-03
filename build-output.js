import { register } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";

// will register them on StyleDictionary object
// that is installed as a dependency of this package.
register(StyleDictionary);

const sd = new StyleDictionary({
  source: ["tokens/**/*.json"],
  preprocessors: ["tokens-studio"], // <-- since 0.16.0 this must be explicit
  platforms: {
    js: {
      transformGroup: "tokens-studio", // <-- apply the tokens-studio transformGroup to apply all transforms
      prefix: "iris-color",
      transforms: ["name/kebab", "color/rgb"], // Use the custom transform
      buildPath: "build/js/",
      files: [
        {
          format: "javascript/esm",
          destination: "colors.js",
          options: {
            minify: true,
          },
        },
      ],
    },
    css: {
      transformGroup: "tokens-studio", // <-- apply the tokens-studio transformGroup to apply all transforms
      prefix: "iris-color",
      transforms: ["name/kebab", "color/rgb"], // Use the custom transform
      buildPath: "build/css/",
      files: [
        {
          destination: "iris-design-tokens.css",
          format: "css/variables",
        },
      ],
    },
    android: {
      transformGroup: "android",
      buildPath: "build/android/",
      files: [
        {
          destination: "colors.xml",
          format: "android/colors",
        },
      ],
    },
    "ios-swift": {
      transformGroup: "ios-swift",
      buildPath: "build/ios-swift/",
      files: [
        {
          destination: "StyleDictionary+Class.swift",
          format: "ios-swift/class.swift",
          options: {
            className: "StyleDictionaryClass",
          },
        },
        {
          destination: "StyleDictionary+Enum.swift",
          format: "ios-swift/enum.swift",
          options: {
            className: "StyleDictionaryEnum",
          },
        },
        {
          destination: "StyleDictionary+Struct.swift",
          format: "ios-swift/any.swift",
          options: {
            className: "StyleDictionaryStruct",
            imports: "SwiftUI",
            objectType: "struct",
            accessControl: "internal",
          },
        },
      ],
    },
    "ios-swift-separate-enums": {
      transformGroup: "ios-swift-separate",
      buildPath: "build/ios-swift/",
      files: [
        {
          destination: "StyleDictionaryColor.swift",
          format: "ios-swift/enum.swift",
          options: {
            className: "StyleDictionaryColor",
          },
          filter: {
            type: "color",
          },
        },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
