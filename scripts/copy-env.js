const fs = require("fs");
const path = require("path");

const baseEnvPath = path.resolve(__dirname, "../.env");
if (!fs.existsSync(baseEnvPath)) {
  console.error(".env dosyası kök dizinde bulunamadı!");
  process.exit(1);
}

const rootDirs = ["apps", "packages"];

rootDirs.forEach((rootDir) => {
  const fullPath = path.resolve(__dirname, "..", rootDir);
  if (!fs.existsSync(fullPath)) return;

  fs.readdirSync(fullPath).forEach((subdir) => {
    const subPath = path.join(fullPath, subdir);
    if (fs.lstatSync(subPath).isDirectory()) {
      const destEnv = path.join(subPath, ".env");
      fs.copyFileSync(baseEnvPath, destEnv);
      console.log(`.env copied to ${rootDir}/${subdir}`);
    }
  });
});
