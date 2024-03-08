"use client";
import styles from "./page.module.css";
import Memo from "./ui/memo";
import { DEFAULT_BACKGROUND_COLOR, MemoInfo, UpdateFactory } from "./types/memo";
import { useEffect, useState } from "react";
import AddMemo from "./ui/add-memo";
import dayjs from "dayjs";

export default function Home() {
  const temp: MemoInfo = {
    id: 0,
    description: "Tesaaaat",
    color: DEFAULT_BACKGROUND_COLOR,
  }
  const [memos, setMemos] = useState<MemoInfo[]>([]);

  useEffect(() => {
    const startStr = localStorage.getItem("my-reminder");
    const start: MemoInfo[] = startStr ? JSON.parse(startStr) : [];
    setMemos(start);
  }, []);

  const updateFactory: UpdateFactory = (propName) => (memo, newValue, index) => {
    if (memos.length === 0) return;
    const copyMemo = Object.assign({}, memo);
    if (newValue !== undefined) copyMemo[propName] = newValue;
    const copyMemos = [...memos];
    copyMemos[index] = copyMemo;
    localStorage.setItem("my-reminder", JSON.stringify(copyMemos));
    setMemos(copyMemos);
  }
  const createMemo = (i: number) => {
    const create = (id: number) => ({
      id: id,
      description: "",
      color: DEFAULT_BACKGROUND_COLOR,
      deadline: dayjs().format("YYYY-MM-DDTHH:mm")
    });
    if (memos.length === 0) return setMemos([create(0)]);

    const id = Math.max(...memos.map(m => m.id)) + 1;
    const copyMemos = [...memos].slice(0, i)?.concat(create(id), [...memos].slice(i));
    setMemos(copyMemos);
  }

  const memoLists = memos?.map((memo, i) =>
    <div key={memo.id} className={styles.memoList}>
      <Memo i={i} info={memo} updateFactory={updateFactory} />
      <AddMemo i={i + 1} onclick={createMemo} />
    </div>
  );
  return (
    <main className={styles.main}>
      <AddMemo i={0} onclick={createMemo} />
      {memoLists}
    </main>
  );
}

