const { BadRequestError } = require("../expressError");

/**
 Function to generate SQL query components for a partial update based on input data.
 
 @param {Object} dataToUpdate - An object containing the data to update.
 @param {Object} jsToSql - An optional mapping object to translate JavaScript keys to SQL column names.
  
 @returns {Object} - An object with two properties:
  - setCols: A string representing the SET clause for the SQL update statement - '"col1"=$1, "col2"=$2'
  - values: An array of values corresponding to the placeholders in the SET clause.
 
 @throws {BadRequestError} - If the 'dataToUpdate' object is empty (no data to update).
 
 Example usage:
 
   const dataToUpdate = {
     firstName: 'Aliya',
     age: 32
   };
   const jsToSql = {
     firstName: 'first_name'
   };
   const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);
   // setCols is '"first_name"=$1, "age"=$2'
   // values is ['Aliya', 32]
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // Map each key to a SQL column and create placeholders for values
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
