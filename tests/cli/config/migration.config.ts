export const TYPE_MIGRATE = "migrate";
export const TYPE_ROLLBACK = "rollback";

export const DIALECT_PG = "pg";
export const DIALECT_MYSQL = "mysql";
export const DIALECT_SQLITE = "sqlite";
export const DIALECTS = [
  DIALECT_PG,
  DIALECT_MYSQL,
  DIALECT_SQLITE,
];

export const decoder = new TextDecoder();

export const runner = async (dialect: string, type: any[]) => {
  const r = Deno.run({
    cmd: [
      "deno",
      "run",
      "--allow-net",
      "--allow-read",
      "--allow-write",
      "--allow-env",
      "cli.ts",
      ...type,
      "-c",
      `./tests/cli/config/${dialect}.config.ts`,
      // "-d",
    ],
    stdout: "piped",
  });

  const { code } = await r.status();

  const rawOutput = await r.output();
  r.close();
  let result = decoder.decode(rawOutput).split("\n");

  if (code !== 0) {
    result.push(`Code was ${code}`);
  }
  return result;
};
