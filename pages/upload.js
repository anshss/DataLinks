// import React from 'react'
// import { Database } from "@tableland/sdk";

// // Default to grabbing a wallet connection in a browser
// const db = new Database();

// const tableName = "linko_links_80001_6226"

// // This is the table's `prefix`--a custom table value prefixed as part of the table's name

// const createTable = async () => {
//   const prefix = "linko_links";
//   const { meta: create } = await db
//     .prepare(`CREATE TABLE ${prefix} (id text primary key, link text);`)
//     .run();
  
//   // The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
//   console.log(create.txn.name); // e.g., my_sdk_table_80001_311
// }

// createTable()
//latest link- linko_links_80001_6516

// linko_links_3141_191

// linko_links_80001_6226


// const setLink = async() =>{
//   // Insert a row into the table
//   const { meta: insert } = await db
//   .prepare(`INSERT INTO ${tableName} (id, link) VALUES (?, ?);`)
//   .bind("link2", "https://www.youtube.com/")
//   .run();

//   // Wait for transaction finality  
//   await insert.txn.wait();

//   // Perform a read query, requesting all rows from the table
//   const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();

//   console.log(results)
// }

// setLink()

export default function upload() {
  return (
    <div>upload</div>
  )
}
