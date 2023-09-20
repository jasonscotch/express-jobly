"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
  jobIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", () => {
  const newJob = {
    title: "New",
    salary: 1,
    equity: 0.25,
    companyHandle: "c1",
  };

  test("ok for users", async () => {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({job: {
        id: expect.any(Number),
        title: "New",
        salary: 1,
        equity: "0.25",
        companyHandle: "c1"
        }
    });
  });

  test("bad request with missing data", async () => {
    const resp = await request(app)
        .post("/jobs")
        .send({
          salary: 1,
          equity: 0.25
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async () => {
    const resp = await request(app)
        .post("/jobs")
        .send({
          ...newJob,
          salary: "hunred dollas"
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs */

describe("GET /jobs", () => {
  test("ok for anon", async () => {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
        [
            {
            id: expect.any(Number),
            title: "J1",
            salary: 100,
            equity: "0.1",
            companyHandle: 'c1'
            },
            {
            id: expect.any(Number),
            title: "J2",
            salary: 200,
            equity: "0.1",
            companyHandle: 'c2'
            },
            {
            id: expect.any(Number),
            title: "J3",
            salary: 300,
            equity: "0",
            companyHandle: 'c3'
            },
        ],
    });
  });

  test("correctly filters based on minSalary", async () => {
    const resp = await request(app).get("/jobs/?minSalary=200");
    expect(resp.body).toEqual({
      jobs:
        [
            {
            id: expect.any(Number),
            title: "J2",
            salary: 200,
            equity: "0.1",
            companyHandle: 'c2'
            },
            {
            id: expect.any(Number),
            title: "J3",
            salary: 300,
            equity: "0",
            companyHandle: 'c3'
            },
        ],
    });
  });
  
  test("correctly filters based on hasEquity", async () => {
    const resp = await request(app).get("/jobs/?hasEquity=true");
    expect(resp.body).toEqual({
      jobs:
        [
            {
            id: expect.any(Number),
            title: "J1",
            salary: 100,
            equity: "0.1",
            companyHandle: 'c1'
            },
            {
            id: expect.any(Number),
            title: "J2",
            salary: 200,
            equity: "0.1",
            companyHandle: 'c2'
            }
        ],
    });
  });

  test("correctly filters based on title", async () => {
    const resp = await request(app).get("/jobs/?title=J2");
    expect(resp.body).toEqual({
        jobs:
        [
            {
            id: expect.any(Number),
            title: "J2",
            salary: 200,
            equity: "0.1",
            companyHandle: 'c2'
            }
        ],
    });
  });
  
  test("correctly filters based on all 3 criteria", async () => {
    const resp = await request(app).get("/jobs/?minSalary=200&hasEquity=false&title=J2");
    expect(resp.body).toEqual({
        jobs:
        [
            {
            id: expect.any(Number),
            title: "J2",
            salary: 200,
            equity: "0.1",
            companyHandle: 'c2'
            }
        ],
    });
  });

  test("throws error if minSalary is not a number", async () => {
    const resp = await request(app).get("/jobs/?minSalary=onehundred");
    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.minSalary is not of a type(s) integer"
        ],
        "status": 400
      }
    });
  });

  test("fails: test next() handler", async () => {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE jobs CASCADE");
    const resp = await request(app)
        .get("/jobs")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /companies/:handle */

describe("GET /jobs/:id", () => {
  test("works for anon", async () => {
    const resp = await request(app).get(`/jobs/${jobIds[0]}`);
    expect(resp.body).toEqual({
        job: {
            id: jobIds[0],
            title: "J1",
            salary: 100,
            equity: "0.1",
            companyHandle: 'c1'
        },
    });
  });

  test("not found for no such job", async () => {
    const resp = await request(app).get(`/jobs/-1`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /companies/:handle */

describe("PATCH /jobs/:id", () => {
  test("works for users", async () => {
    const resp = await request(app)
        .patch(`/jobs/${jobIds[0]}`)
        .send({
          title: "J1-new",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
        job: {
            id: jobIds[0],
            title: "J1-new",
            salary: 100,
            equity: "0.1",
            companyHandle: 'c1'
        },
    });
  });

  test("unauth for anon", async () => {
    const resp = await request(app)
        .patch(`/jobs/${jobIds[0]}`)
        .send({
          title: "J1-new",
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such job", async () => {
    const resp = await request(app)
        .patch(`/jobs/-1`)
        .send({
          title: "new nope",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on handle change attempt", async () => {
    const resp = await request(app)
        .patch(`/jobs/${jobIds[0]}`)
        .send({
          handle: "j1-new",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async () => {
    const resp = await request(app)
        .patch(`/jobs/${jobIds[0]}`)
        .send({
          salary: "hundo dollas",
        })
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /companies/:handle */

describe("DELETE /companies/:handle", () => {
  test("works for users", async () => {
    const resp = await request(app)
        .delete(`/jobs/${jobIds[0]}`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: jobIds[0].toString() });
  });

  test("unauth for anon", async () => {
    const resp = await request(app)
        .delete(`/jobs/${jobIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such company", async () => {
    const resp = await request(app)
        .delete(`/jobs/-1`)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
}); 