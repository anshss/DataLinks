import React, { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useState } from "react";
import { Database } from "@tableland/sdk";
import LinkCard from "@/components/linkCard";

export default function Dashboard() {
    const [inputLink, setInputLink] = useState("");
    const [linkData, setLinkData] = useState([]);
    const [location, setLocation] = useState();
    const [open, setOpen] = useState();
    console.log(linkData);
    useEffect(() => {
        setLocation(window.location);
    }, []);

    const tableName = "linko_links_80001_6516";
    const id = "link1";

    const db = new Database();
    async function getData() {
        try {
            const { results } = await db
                .prepare(`SELECT * FROM ${tableName};`)
                .all();
            setLinkData(results);
        } catch (e) {
            console.log(e);
        }
    }

    console.log(linkData);
    useEffect(() => {
        getData();
    }, []);

    console.log(open);

    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full min-h-screen">
                    {/* <button>Manage</button>
                    <input type="file" onChange={uploadWithSpheron} />
                    <input
                        type="name"
                        onChange={(e) => setInputLink(e.target.value)}
                    /> */}
                    <h2 className="text-center text-4xl font-bold mt-4">
                        Your LinkIt&apos;s
                    </h2>

                    {linkData.map((item, index) => {
                        return (
                            <LinkCard
                                getData={getData}
                                onClick={() => setOpen(index)}
                                open={index === open}
                                redirectTo={item.link}
                                key={item.id}
                                id={item.id}
                                link={location?.origin + "/" + item.id}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
