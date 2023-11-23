'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react'
const Data = () => {
    const supabase = createClientComponentClient();
    const [data, setData] = useState<any>();
    const [markdown, setMarkdown] = useState<string>("");

    useEffect(() => {
        getData();
    }, [])
    const getData = async () => {
        // await supabase.from("data").select().then(data => setData(data?.data));
        const data = await supabase.auth.getSession();
        // console.log(data);

    }
    const addData = async () => {
        const id = await supabase.auth.getSession();
        await supabase.from("data").insert({ data: markdown, title: "Blog", user_id: id.data.session?.user?.id });
    }

    return (
        <div>
            <button onClick={() => { addData() }} className='bg-blue-500 px-4 py-1 rounded-lg'>Click</button>
            <button onClick={async () => {
                const { error } = await supabase.auth.signOut();
            }} className='bg-blue-500 px-4 py-1 rounded-lg'>Logout</button>
        </div>
    )
}

export default Data