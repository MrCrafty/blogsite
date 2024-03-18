import React from "react";
import BlogItem from "./BlogItem";
import { createServerClient } from "@/lib/db";
import { Metadata } from "next";
import CommentBox from "@/components/CommentBox";
import Comments from "@/components/Comments";
import { redirect } from "next/navigation";
import SocialShareButtons from "./SocialShareButtons";
import Head from "next/head";

export const metadata: Metadata = {
  description: "Blog Page",
};

const page = async ({ params }: { params: { id: string } }) => {
  const user = (await createServerClient().auth.getSession()).data.session
    ?.user;
  async function getData(id: string) {
    const res = await createServerClient()
      .from("data")
      .select()
      .eq("id", id)
      .limit(1)
      .single();
    if (res.error) {
      console.log(res.error);
      return null;
    } else {
      return res.data;
    }
  }
  const res = await createServerClient()
    .from("data")
    .select("comments")
    .eq("id", params.id)
    .limit(1)
    .single();
  const data = await getData(params.id);
  const blogUser = (await createServerClient()
    .from("user_data")
    .select("*")
    .eq("id", data?.user_id))!.data;
  if (data == null) {
    return redirect("/not-found");
  } else {
  }
  return (
    <>
      <Head>
        <title>{data?.data?.title}</title>
      </Head>
      <div className="text-black container dakr:text-white">
        <div className="p-4 lg:w-3/4 mx-auto dark:bg-[#1f1f1f] rounded-lg">
          <BlogItem
            data={data}
            isEditable={user?.id == data?.user_id}
            //@ts-ignore blogUser possibly "Null"
            user={blogUser[0]}
          />
          <SocialShareButtons />
          <CommentBox user={user} blog_id={params.id} />
          <h3 className="text-2xl py-3 my-3 dark:text-white">Comments</h3>
          <Comments blog_id={params.id} comments={res.data?.comments} />
        </div>
      </div>
    </>
  );
};

export default page;

export const generateStaticParams = async () => {
  const data = await fetch(
    (process.env.NEXT_PUBLIC_SUPABASE_URL as string) +
      "/rest/v1/data?select=id",
    {
      method: "GET",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      },
    }
  );
  const res = await data.json();
  const strId = await res?.map((item: { id: number }) => {
    return {
      id: String(item.id),
    };
  });

  if (res !== undefined) {
    return strId;
  } else {
    return [];
  }
};
