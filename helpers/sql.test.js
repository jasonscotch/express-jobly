const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");
const { sqlForPartialUpdate } = require("./sql");

describe("sqlForPartialUpdate", () => {
  test("should handle 1 item", () => {
    const dataToUpdate = {
      firstName: 'Steffi'
    };
    const jsToSql = {
      firstName: 'first_name',
      lastName: 'last_name'
    };
    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(setCols).toBe('"first_name"=$1');
    expect(values).toEqual(['Steffi']);
  });

  test('should handle an empty dataToUpdate object', () => {
    const dataToUpdate = {};
    expect(() => sqlForPartialUpdate(dataToUpdate)).toThrow('No data');
  });

  test('should handle 2 items', () => {
    const dataToUpdate = {
      firstName: 'Steffi',
      lastName: 'Thomann'
    };
    const jsToSql = {
      lastName: 'last_name'
    };
    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(setCols).toBe('"firstName"=$1, "last_name"=$2');
    expect(values).toEqual(['Steffi','Thomann']);
  });
});
