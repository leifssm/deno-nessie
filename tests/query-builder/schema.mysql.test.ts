import { assertEquals } from "../../deps.ts";
import { Schema } from "../../qb.ts";

const strings = [
  {
    name: "Schema create",
    string: (() => {
      const testSchema = new Schema("mysql");
      return testSchema.create("testTable", (table) => {
        table.id();
        table.timestamps();
      });
    })(),
    solution: [
      "CREATE TABLE testTable (id bigint AUTO_INCREMENT PRIMARY KEY, created_at timestamp (0) default current_timestamp, updated_at timestamp (0) default current_timestamp on update current_timestamp);",
    ],
  },
  {
    name: "Schema queryString",
    string: (() => {
      const testSchema = new Schema("mysql");
      return testSchema.queryString(
        `ALTER TABLE child_table ADD CONSTRAINT fk_child_table_parent_table FOREIGN KEY (parent_table_id) REFERENCES parent_table(id) ON DELETE CASCADE;`,
      );
    })(),
    solution: [
      `ALTER TABLE child_table ADD CONSTRAINT fk_child_table_parent_table FOREIGN KEY (parent_table_id) REFERENCES parent_table(id) ON DELETE CASCADE;`,
    ],
  },
  {
    name: "Schema queryString add ; to the end",
    string: (() => {
      const testSchema = new Schema("mysql");
      return testSchema.queryString(
        `ALTER TABLE child_table ADD CONSTRAINT fk_child_table_parent_table FOREIGN KEY (parent_table_id) REFERENCES parent_table(id) ON DELETE CASCADE`,
      );
    })(),
    solution: [
      `ALTER TABLE child_table ADD CONSTRAINT fk_child_table_parent_table FOREIGN KEY (parent_table_id) REFERENCES parent_table(id) ON DELETE CASCADE;`,
    ],
  },
  {
    name: "Schema drop",
    string: (() => {
      const testSchema = new Schema("mysql");
      return testSchema.drop("testTable");
    })(),
    solution: ["DROP TABLE testTable;"],
  },
  {
    name: "Schema drop if exists",
    string: (() => {
      const testSchema = new Schema("mysql");
      return testSchema.drop("testTable", true);
    })(),
    solution: ["DROP TABLE IF EXISTS testTable;"],
  },
  {
    name: "Schema drop cascade",
    string: (() => {
      const testSchema = new Schema("mysql");
      return testSchema.drop("testTable", false, true);
    })(),
    solution: ["DROP TABLE testTable CASCADE;"],
  },
  {
    name: "Schema drop if exists cascade",
    string: (() => {
      const testSchema = new Schema("mysql");
      return testSchema.drop("testTable", true, true);
    })(),
    solution: ["DROP TABLE IF EXISTS testTable CASCADE;"],
  },
  {
    name: "Schema hasTable",
    string: new Schema("mysql").hasTable("testTable"),
    solution: "show tables like 'testTable';",
  },
];

strings.forEach(({ name, string, solution }) =>
  Deno.test({
    name: "MySQL: " + (name || "Empty"),
    fn(): void {
      assertEquals(string, solution);
    },
  })
);
