import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { HardhatUserConfig, subtask } from "hardhat/config";
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from "hardhat/builtin-tasks/task-names";
import "@nomicfoundation/hardhat-toolbox";

// Keep the Remix-ready Solidity file at this workspace's root without asking
// Hardhat to walk node_modules (the default behavior when sources is ".").
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(async (_, hre) => {
  const sourceRoot = hre.config.paths.sources;
  const entries = await readdir(sourceRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sol"))
    .map((entry) => resolve(sourceRoot, entry.name));
});

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  paths: {
    sources: ".",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    ritual: {
      url: "https://rpc.ritualfoundation.org",
      chainId: 1979,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};

export default config;
