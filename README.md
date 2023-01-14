# Testcase_maker

## Usage

### 1. Build

```sh
yarn install
npx tsc
```

### 2. Setup answer code

Write your answer code to `problem/source.cpp`

### 3. Write input template

Write input template to `problem/settings/problemInputType.txt`

```
{RandInt,1,1000}
{RandInt,1,1000} {RandInt,1,1000} {RandInt,1,1000}
{RandDou,1,1000,2} {RandDou,1,1000,2}
{RandStr,10,10,abcdefghijklmnopqrstuvwxyz}
```

### 4. Run generator

```sh
node dist/index.js
```

### 5. Done!

Your test cases were zipped to `problem/testcases.zip`!
