import { register } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";

register(StyleDictionary);

StyleDictionary.registerTransform({
  name: "name/iris",
  type: "name",
  transform: (token, options) => {
    const tokenType = token.$type || token.type;
    
    // Check if token is from Legacy collection
    const isLegacy = token.filePath && token.filePath.includes('Legacy');
    
    const name = token.path
      .filter(
        (part) => !["Primitives/Light", "Primitives", "Light"].includes(part),
      )
      .map(part => 
        part.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-')
          .toLowerCase()
      )
      .join("-")
      .replace(/\//g, "-");

    // Only include token type for certain types
    const includeType = ['color'].includes(tokenType);
    const nameWithType = includeType ? `${tokenType}-${name}` : name;
    
    // Add 'legacy' prefix for legacy tokens
    const nameWithLegacy = isLegacy ? `legacy-${nameWithType}` : nameWithType;
    
    return options.prefix ? `${options.prefix}-${nameWithLegacy}` : nameWithLegacy;
  },
});

const sd = new StyleDictionary({
  source: [
    "tokens/Primitives/Light.json",
    "tokens/Legacy/Light.json",
    "tokens/Semantic/Light.json",
  ],
  preprocessors: ["tokens-studio"],
  platforms: {
    css: {
      transformGroup: "tokens-studio",
      prefix: "iris",
      transforms: ["name/iris", "color/hex"],
      buildPath: "build/css/",
      files: [
        { destination: "iris-design-tokens.css", format: "css/variables" },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
