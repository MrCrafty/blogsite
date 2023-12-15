"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const BlogList = () => {
  const [data, setData] = useState<any>();
  const query = useSearchParams();
  async function getUserData(id: string) {
    const supabase = createClientComponentClient();
    const res = await supabase
      .from("user_data")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();
    if (res.error) {
      return res.error.message;
    } else {
      return res.data;
    }
  }
  async function getData() {
    const supabase = createClientComponentClient();
    const res = await supabase
      .from("data")
      .select("*")
      .order("inserted_at", { ascending: false });
    if (res.error) {
      return res.error.message;
    } else {
      setData(res);
    }
  }
  useEffect(() => {
    getData();
  }, []);
  console.log(data?.data[0]?.categories.includes("SOmething"));
  return (
    <AnimatePresence>
      <motion.div className="w-11/12 lg:w-1/2 mx-auto">
        {data?.data
          .filter((item: { title: string; categories: string[] }) => {
            if (query.get("q")) {
              return item?.title?.toLowerCase().includes(query.get("q") ?? "");
            } else if (query.get("category")) {
              return item?.categories.includes(query.get("category") ?? "");
            } else {
              return true;
            }
          })
          .map(
            (
              data: {
                id: string;
                title: string;
                categories: string[];
                inserted_at: string;
                user_id: string;
              },
              index: number
            ) => {
              return (
                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    ease: "easeOut",
                    duration: 0.3,
                    delay: index / 15,
                  }}
                  key={index}
                  className="border-b-2 py-5 flex justify-between"
                >
                  <div>
                    <motion.h1
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.05 },
                      }}
                      whileTap={{ scale: 0.9 }}
                      className="text-3xl text-text-semibold my-4"
                    >
                      <Link
                        className="hover:text-red-300 transition-all"
                        href={`/blogs/${data?.id}`}
                      >
                        {data?.title}
                      </Link>
                    </motion.h1>
                    <div className="flex mb-4">
                      {data?.categories?.map((item, index) => (
                        <p
                          className={`px-3 text-gray-500 ${
                            index > 0 ? "border-black border-s-[1px]" : ""
                          }`}
                          key={index}
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-around flex-col min-w-fit text-right">
                    <p className="text-gray-300 text-sm">
                      {data?.inserted_at.slice(0, 10)}
                    </p>
                    <p className="capitalize">
                      by,{" "}
                      {getUserData(data?.user_id).then((res) => res.firstname)}{" "}
                      {getUserData(data?.user_id).then((res) => res.lastname)}
                    </p>
                  </div>
                </motion.div>
              );
            }
          )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogList;
