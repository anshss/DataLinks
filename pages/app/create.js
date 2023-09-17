import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useEffect, useState } from "react";
import { Database } from "@tableland/sdk";
import Link from "next/link";

export default function Home() {
  const db = new Database();
  const tableName = "linko_links_80001_6516";
  const [backlink, setBacklink] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const createLink = (e) => {
    e.preventDefault();
    setLink(backlink);
  };

  const [location, setLocation] = useState();
  useEffect(() => {
    setLocation(window.location);
  }, []);

  console.log(location);

  console.log("data is",data)


  const setLink = async (id) => {
    setLoading(true);
    try {
      // Insert a row into the table
      const { meta: insert } = await db
        .prepare(`INSERT INTO ${tableName} (id, link) VALUES (?, ?);`)
        .bind(id, location.origin+ "/defaultRoute")
        .run();

      // Wait for transaction finality
      await insert.txn.wait();

      // Perform a read query, requesting all rows from the table
      const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();

      setData(results[results.length-1])
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="p-4 sm:ml-64 pt-20 bg-gray-900 w-full h-screen">
          <div className="text-white">
            <div className="mt-10">
              <h1 className="font-bold text-3xl text-center">
                Generate a Link
              </h1>
            </div>

            <div className="mt-8 w-3/4 mx-auto">
              <form onSubmit={createLink}>
                <div className="flex">
                  <div className="flex-shrink-0 cursor-default z-10 inline-flex items-center py-4 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700  dark:focus:ring-gray-700 dark:text-gray-400 dark:border-gray-600">
                    {location?.host}
                  </div>
                  <div className="relative w-full">
                    <input
                      type="search"
                      className="block p-4 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                      placeholder="Your custom back-link..."
                      required=""
                      value={backlink}
                      onChange={(e) => {
                        setBacklink(e.target.value);
                      }}
                    />
                    <button
                      type="submit"
                      className="absolute top-0 right-0 p-4 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      {
                      !loading
                      ? <svg
                                              className="w-5 h-5"
                                              fill="currentColor"
                                              xmlns="http://www.w3.org/2000/svg"
                                              height="40"
                                              viewBox="0 96 960 960"
                                              width="40s"
                                            >
                                              <path d="M450 856V606H200v-60h250V296h60v250h250v60H510v250h-60Z" />
                                            </svg>
                      :  <svg aria-hidden="true" role="status" className="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                      </svg>
                                        }
                      <span className="sr-only">Search</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {
          data
          ? <div className="mt-24">
                      <div className="block w-3/4 p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <div className="flex justify-between">
                          <div>
                            <a
                              target="_blank"
                              className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                              href={location?.origin + "/" + data.id}
                            >
                              {location?.origin + "/" + data.id}
                            </a>
                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(location?.origin + "/" + data.id)}
                              className="w-[30px] h-[30px] ml-3 text-gray-500 bg-white rounded-full border border-gray-200 dark:border-gray-600 hover:text-gray-900 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
                            >
                              <svg
                                aria-hidden="true"
                                className="w-5 h-5 mx-auto mt-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                              </svg>
                            </button>
                          </div>
                          <div>
                            <Link
                              href="/app/manage"
                              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              Add Routes
                              <svg
                                aria-hidden="true"
                                className="w-4 h-4 ml-2 -mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </Link>
                          </div>
                        </div>
          
                        <p className="font-normal text-gray-700 dark:text-gray-400 mt-2">
                          You have successfully generate a linko. To add routes, click on
                          Manage button
                        </p>
                      </div>
                    </div>
          : null
          }
        </div>
      </div>
    </div>
  );
}
