import chalk from "chalk";

export const startLoader = () => {
  const P = ["\\", "|", "/", "-"];
  let x = 0;
  return setInterval(() => {
    process.stdout.write(`\r${chalk.cyan(P[x++ % P.length])} ${chalk.white("Installing dependencies... ")}`);
  }, 100);
};