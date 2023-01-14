import { join as p_join } from "path";
import fs from "fs-extra";
import { exec, spawn, execSync } from "child_process";

let problemRoot = p_join(__dirname, "..", "problem");
let sourcePath = p_join(problemRoot, "source.cpp");
let tmpPath = p_join(problemRoot, "tmp");
let buildPath = p_join(tmpPath, "build");
let settingsPath = p_join(problemRoot, "settings");
let inputPath = p_join(settingsPath, "problemInputType.txt");
let testcasesPath = p_join(problemRoot, "testcases");

fs.ensureDirSync(problemRoot);
fs.ensureDirSync(settingsPath);
fs.ensureDirSync(tmpPath);

let inputTemplate = fs.readFileSync(inputPath);

function build() {
  console.log(`clang++ -o ${buildPath} ${sourcePath}`);
  return new Promise<void>((resolve, reject) => {
    exec(`clang++ -o ${buildPath} ${sourcePath}`, (error, stdout, stderr) => {
      if (error) {
        console.error("ERROR", error);
      }
      if (stderr) {
        console.error("STDERR", stderr);
      }
      if (stdout) {
        console.log("STDOUT", stdout);
      }
      resolve();
    });
  });
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randStr(length: number, characters: string) {
  var result = "";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getRandomTestcases() {
  let out = inputTemplate.toString();
  while (out.includes("{")) {
    let nextOpener = out.indexOf("{");
    let nextCloser = out.indexOf("}");

    let randomRequestRaw = out.slice(nextOpener, nextCloser + 1).toString();
    let randomRequest = randomRequestRaw.replace("{", "").replace("}", "");

    let splitByCom = randomRequest.split(",");

    switch (splitByCom[0]) {
      case "RandInt":
        out = out.replace(
          randomRequestRaw,
          randInt(parseInt(splitByCom[1]), parseInt(splitByCom[2])).toString()
        );
        break;
      case "RandDou":
        let dotdot = Math.pow(10, parseInt(splitByCom[3]));
        out = out.replace(
          randomRequestRaw,
          (
            randInt(
              parseInt(splitByCom[1]) * dotdot,
              parseInt(splitByCom[2]) * dotdot
            ) / dotdot
          ).toString()
        );
        break;
      case "RandStr":
        out = out.replace(
          randomRequestRaw,
          randStr(
            randInt(parseInt(splitByCom[1]), parseInt(splitByCom[2])),
            splitByCom[3]
          )
        );
        break;
      default:
        console.log(`Cannot find ${splitByCom[0]}`, randomRequestRaw);
        process.exit(1);
    }
  }

  return out;
}

function makeTC(i: number) {
  return new Promise<void>((resolve, reject) => {
    let input = getRandomTestcases();

    let child = spawn(buildPath);
    if (child.stdin.writable && !child.killed) {
      child.stdin.write(input + "\n");
    }
    let output = "";
    child.stdout.on("data", (c) => {
      output += c.toString();
    });
    child.on("exit", () => {
      fs.writeFileSync(p_join(testcasesPath, `${i}.in`), input);
      fs.writeFileSync(p_join(testcasesPath, `${i}.out`), output);
      resolve();
    });
  });
}

async function main() {
  console.log("Removing old testcases...");
  fs.ensureDirSync(testcasesPath);
  execSync(`rm -rd ${testcasesPath}`);
  fs.ensureDirSync(testcasesPath);
  console.log("Removing old testcases done!");
  console.log("Building...");
  await build();
  console.log("Build Done!");

  for (let i = 1; i <= 100; i++) {
    console.log(`Making testcase... (${i} / 100)`);
    await makeTC(i);
  }
  console.log("Zipping...");
  execSync(
    `cd ${testcasesPath} && zip -r ${p_join(problemRoot, "testcases.zip")} ./*`
  );
}

main();
