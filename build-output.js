import { register } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";

register(StyleDictionary);

StyleDictionary.registerTransform({
  name: "name/iris",
  type: "name",
  transform: (token, options) => {
    const name = token.path
      .filter(
        (part) => !["Primitives/Light", "Primitives", "Light"].includes(part),
      )
      .join("-")
      .toLowerCase()
      .replace(/\//g, "-");

    return options.prefix ? `${options.prefix}-${name}` : name;
  },
});

const sd = new StyleDictionary({
  source: ["tokens/**/*.json"],
  preprocessors: ["tokens-studio"],
  platforms: {
    css: {
      transformGroup: "tokens-studio",
      prefix: "iris-color",
      transforms: ["name/iris", "color/rgb"],

      buildPath: "build/css/",
      files: [
        { destination: "iris-design-tokens.css", format: "css/variables" },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
