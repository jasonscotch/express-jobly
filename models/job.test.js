"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  tokenAdmin,
  jobIds
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", () => {
  const newJob = {
    title: "New",
    salary: 1,
    equity: "0.25",
    companyHandle: "c1",
  };

  test("works", async () => {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      ...newJob,
      id: expect.any(Number)
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           WHERE title = 'New'`);
    expect(result.rows).toEqual([{
      ...newJob,
      id: expect.any(Number)
    }]);
  });

  test("bad request with dupe", async () => {
    try {
      await Job.create(newJob);
      await Job.create(newJob);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", () => {
  test("works: no filter", async () => {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: jobIds[0],
        title: "J1",
        salary: 100,
        equity: "0.10",
        companyHandle: 'c1'
      },
      {
        id: jobIds[1],
        title: "J2",
        salary: 200,
        equity: "0.10",
        companyHandle: 'c2'
      },
      {
        id: jobIds[2],
        title: "J3",
        salary: 300,
        equity: "0.10",
        companyHandle: 'c3'
      },
    ]);
  });
});

/************************************** get */

describe("get", () => {
  test("works", async () => {
    let job = await Job.get(jobIds[0]);
    expect(job).toEqual({
      id: jobIds[0],
      title: "J1",
      salary: 100,
      equity: "0.10",
      companyHandle: 'c1'
    });
  });

  test("not found if no such job", async () => {
    try {
      await Job.get(-1);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", () => {
  const updateData = {
    title: "NEW",
    salary: 100000,
    equity: "0.99",
  };

  test("works", async () => {
    let job = await Job.update(jobIds[2], updateData);
    expect(job).toEqual({
      id: jobIds[2],
      ...updateData,
      companyHandle: "c3",
    });

    const result = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
          FROM jobs
          WHERE id = ${jobIds[2]}`);
    expect(result.rows).toEqual([{
      id: jobIds[2],
      title: "NEW",
      salary: 100000,
      equity: "0.99",
      companyHandle: "c3"
    }]);
  });

  test("works: null fields", async () => {
    const updateDataSetNulls = {
      title: "NEW",
      salary: null,
      equity: null,
    };

    let job = await Job.update(jobIds[0], updateDataSetNulls);
    expect(job).toEqual({
      id: jobIds[0],
      ...updateDataSetNulls,
      companyHandle: "c1",
    });

    const result = await db.query(
      `SELECT id,
            title,
            salary,
            equity,
            company_handle AS "companyHandle"
      FROM jobs
      WHERE id = ${jobIds[0]}`);
    expect(result.rows).toEqual([{
      id: jobIds[0],
      title: "NEW",
      salary: null,
      equity: null,
      companyHandle: "c1"
    }]);
  });

  test("not found if no such job", async () => {
    try {
      await Job.update(-1, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async () => {
    try {
      await Job.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", () => {
  test("works", async () => {
    await Job.remove(jobIds[0]);
    const res = await db.query(
        `SELECT title FROM jobs WHERE id=${jobIds[0]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async () => {
    try {
      await Job.remove(-1);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
