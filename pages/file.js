import React from 'react'
import { Database } from "@tableland/sdk";

const tableName = "linko_links_80001_6516"; 
const id = "link1"

const db = new Database();
async function getData(){
    // const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
    // console.log(results);

    const preparedStmt = await db
    .prepare(`SELECT * FROM ${tableName} WHERE id = ?1`)
    .bind(id).all();

    console.log(preparedStmt)
    console.log(preparedStmt.results)
}

getData()


export default function File() {
  return (
    <div>File</div>
  )
}
