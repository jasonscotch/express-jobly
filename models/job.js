"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs. */

class Job {
   /** Create a job (from data), update db, return new job data.
   *
   * data should be { title, salary, equity, company_handle }
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws BadRequestError if job already in database.
   * */ 

   static async create({ title, salary, equity, companyHandle }) {
    const duplicateCheck = await db.query(
          `SELECT title
           FROM jobs
           WHERE title = $1`,
        [title]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate job: ${title}`);

    const result = await db.query(
          `INSERT INTO jobs
           (title, salary, equity, company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
        [
            title, 
            salary, 
            equity, 
            companyHandle
        ],
    );
    const job = result.rows[0];

    return job;
  }

  /** Find all jobs.
   * 
   * Returns [{ id, title, salary, equity, company_handle }, ...]
   * Will also allow for search filters based on job title and min salary and has equity.
   * All filters are optional and if none are provided code will run to find all jobs like normal. 
   */

  static async findAll(filters = {}) {
    let sql = `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
              FROM jobs`;
    
    const values = [];
    const whereClauses = [];
    const { minSalary, hasEquity, title } = filters;

    if (minSalary !== undefined) {
      whereClauses.push(`salary >= $${values.length + 1}`);
      values.push(minSalary);
    }

    if (hasEquity === true) {
      whereClauses.push(`equity > 0`);
    }

    if (title !== undefined) {
      whereClauses.push(`title iLIKE $${values.length + 1}`);
      values.push(`%${title}%`);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(` AND `)}`;
    }

    sql += ` ORDER BY title`;
    
    const results = await db.query(sql, values);

    return results.rows;
  }

  /** Given a job id, return data about that job.
   *   
   * Returns { id, title, salary, equity, company_handle }
   * 
   * Throws NotFoundError if not found.
   */

  static async get(id) {
    const jobRes = await db.query(
      `SELECT id,
              title,
              salary,
              equity,
              company_handle AS "companyHandle"
      FROM jobs
      WHERE id = $1`,
      [id]
    );

    const job = jobRes.rows[0];

    if (!job) throw new NotFoundError(`No job with id of: ${id}`);

    return job;
  }

  /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { title, salary, equity }
   *
   * Returns { id, title, salary, equity, company_handle }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        companyHandle: "company_handle"
      });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs
                      SET ${setCols}
                      WHERE id = ${idVarIdx}
                      RETURNING id,
                                title,
                                salary,
                                equity,
                                company_handle AS "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with id of: ${id}`);

    return job;
  }

  /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
          FROM jobs
          WHERE id = $1
          RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job with id of: ${id}`);
  }
}


module.exports = Job;