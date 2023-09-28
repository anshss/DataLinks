/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Database } from "@tableland/sdk";

const tableName = "linko_links_80001_6516";

export default function Files() {
    const router = useRouter();
    const { id } = router.query;
    const db = new Database();

    async function getLink(id) {
        const preparedStmt = await db
            .prepare(`SELECT * FROM ${tableName} WHERE id = ?1`)
            .bind(id)
            .all();
        console.log(id);
        return preparedStmt.results[0].link;
    }

    useEffect(() => {
        if (id) {
            getLink(id).then((link) => {
                window.location.href = link;
            });
        }
    }, [id]);

    return (
        <div className="pt-10 min-h-screen flex justify-center items-center text-3xl">
            Redirecting to the linked URL......
        </div>
    );
}
