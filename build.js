const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const overpy = require("./overpy/out/overpy_standalone.js");

const args = process.argv.slice(2);
const version = args[0];

(async () => {
  autoGenerateIfNeeded();
  await overpy.readyPromise;
  await generateWorkshop("ow1em_main.opy", "ow1em.txt");
  await generateWorkshop("dev_main.opy", "dev.txt");
})();

function autoGenerateIfNeeded() {
  const dataPath = path.resolve(__dirname, 'constant-generator/data/constants.json');
  const rosterPath = path.resolve(__dirname, 'src/constants/hero_roster.opy');

  const dataMtime = fs.existsSync(dataPath) ? fs.statSync(dataPath).mtimeMs : 0;
  const rosterMtime = fs.existsSync(rosterPath) ? fs.statSync(rosterPath).mtimeMs : 0;

  if (dataMtime <= rosterMtime) return;

  console.log('Data has changed since last build, regenerating constants...');
  const result = spawnSync('node', ['generate.js'], {
    cwd: path.resolve(__dirname, 'constant-generator'),
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    console.error('Failed to generate constants, aborting build.');
    process.exit(1);
  }
}

// Expand #!include directives, resolving paths relative to each file's own directory.
// This is needed because overpy resolves all includes from a single root path.
function expandIncludes(content, baseDir, visitedFiles = new Set()) {
  content = content.replace(/^#!mainFile\s+.*$/gm, '');
  content = content.replace(/^#!include\s+"([^"]+)"\s*$/gm, (match, includePath) => {
    const fullPath = path.resolve(baseDir, includePath);
    if (visitedFiles.has(fullPath)) return '';
    visitedFiles.add(fullPath);
    const includedContent = fs.readFileSync(fullPath, 'utf8');
    return expandIncludes(includedContent, path.dirname(fullPath), visitedFiles);
  });
  return content;
}

async function generateWorkshop(mainFileName="main.opy", outputFileName="out.txt", srcDirectory="./src/", buildDirectory="./build/") {
  try {
    const mainFilePath = srcDirectory + mainFileName;
    const outputFilePath = buildDirectory + outputFileName;

    const mainFileText = fs.readFileSync(mainFilePath, 'utf8');
    let expandedText = expandIncludes(mainFileText, path.resolve(srcDirectory));
    expandedText = setVersionNumber(expandedText, version);
    // expandedText = addObfuscation(expandedText)

    const compiledText = (await overpy.compile(expandedText, "en-US", srcDirectory)).result;

    fs.mkdirSync(buildDirectory, { recursive: true });
    fs.writeFileSync(outputFilePath, compiledText);
    console.log(`Built ${outputFileName}`);
  } catch (err) {
    console.error(err);
  }
}

// Replace the existing GAMEMODE_VERSION definition (set by lobby files),
// or prepend it if not found.
function setVersionNumber(content, version) {
  const define = `#!define GAMEMODE_VERSION "${version}"`;
  if (/#!define GAMEMODE_VERSION/.test(content)) {
    return content.replace(/^#!define GAMEMODE_VERSION\s+.+$/m, define);
  }
  return define + '\n' + content;
}

function addObfuscation(content) {
  return `#!obfuscate noRuleFilling noConstantObfuscation noCopyProtection\n` + content;
}
