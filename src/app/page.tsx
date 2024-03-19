"use client";
import styles from "./page.module.css";
import { CreateMemo, CreatePartialMemoListInfo, MemoInfo, PartialMemoListInfo, UpdateMemo } from "./types/memo";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import PartialMemoList from "./ui/partial-memo-list";

//リマインダー全体の表示・データ保持を司る
export default function Home() {
  //メモ一覧をリアクティブに保持
  const [memos, setMemos] = useState<MemoInfo[]>([]);

  useEffect(() => {
    //データはlocalStorageで保持する。
    const startStr = localStorage.getItem("my-reminder");
    const start: MemoInfo[] = startStr ? JSON.parse(startStr) : [];
    setMemos(start);
  }, []);

  //メモ内の情報を更新する関数
  const updateDataInMemo: UpdateMemo = (memo, propName, newValue) => {

    if (memos.length === 0) return;
    const copyMemo = { ...memo };

    //もっと良い書き方はないか…？
    if (newValue == null) return;
    switch (propName) {
      case "color":
      case "deadline":
      case "description":
        if (typeof newValue === "string") copyMemo[propName] = newValue;
        break;
      case "isComplete":
        if (typeof newValue === "boolean") copyMemo[propName] = newValue;
        break;
    }
    //Reactの制約として『新しい配列』をsetMemosする必要があるので、シャローコピー
    const copyMemos = [...memos];
    copyMemos[copyMemos.findIndex(m => m.id === memo.id)] = copyMemo;
    recordAndSetMemos(copyMemos);
  }

  //メモを新規作成する関数
  const createMemo = (i: number, template: CreateMemo) => {

    if (memos.length === 0) {
      return recordAndSetMemos([template(0)]);
    }
    const id = Math.max(...memos.map(m => m.id)) + 1;
    const findMemoIndex = memos.findIndex(m => m.id === i) + 1;
    //メモリストをシャローコピーしながら、新しいメモを指定位置に挟み込む
    const copyMemos = [...memos].slice(0, findMemoIndex)?.concat(template(id), [...memos].slice(findMemoIndex));
    recordAndSetMemos(copyMemos);
  }

  //メモを削除する関数
  const deleteMemo = (memo: MemoInfo) => {
    //削除するMemoInfoオブジェクトを取り除いたコピー配列を作る
    const copyMemos = memos.filter(m => m !== memo);
    recordAndSetMemos(copyMemos);
  }
  //メモをストレージへ記録し、情報を更新する関数
  const recordAndSetMemos = (memos: MemoInfo[]) => {
    localStorage.setItem("my-reminder", JSON.stringify(memos));
    setMemos(memos);
  }

  //メモを特定のルールで分類する関数
  const createPartialMemoListInfo: (
    memos: MemoInfo[],
    startNum: number,
    options: CreatePartialMemoListInfo
  ) => PartialMemoListInfo =
    (memos, startNum, { name, isPermitCreatingNewMemo, filter, deadlineFunction }) => {
      const filteredMemos = memos.filter(filter);
      return {
        name,
        isPermitCreatingNewMemo,
        memos: filteredMemos,
        startNum,
        deadlineFunction
      }
    };

  //分類ルール一覧
  const createListInfo: CreatePartialMemoListInfo[] = [
    {
      name: "24時間以内",
      isPermitCreatingNewMemo: true,
      filter: (memo: MemoInfo) => {
        if (memo.isComplete) return false;
        if (memo.deadline == null || memo.deadline === "") return false;
        const now = dayjs().valueOf();
        const deadline = dayjs(memo.deadline).valueOf();
        return deadline - now < 1000 * 60 * 60 * 24 && deadline - now >= 0;
      },
      deadlineFunction: () => dayjs().add(2, "hour").format("YYYY-MM-DDTHH:mm")
    },
    {
      name: "期限切れ",
      isPermitCreatingNewMemo: false,
      filter: (memo: MemoInfo) => {
        if (memo.isComplete) return false;
        if (memo.deadline == null || memo.deadline === "") return false;
        const now = dayjs().valueOf();
        const deadline = dayjs(memo.deadline).valueOf();
        return deadline - now < 0;
      }
    },
    {
      name: "期限なし",
      isPermitCreatingNewMemo: true,
      filter: (memo: MemoInfo) => {
        if (memo.isComplete) return false;
        return memo.deadline == null || memo.deadline === "";
      },
    },
    {
      name: "タスク完了",
      isPermitCreatingNewMemo: false,
      filter: (memo: MemoInfo) => memo.isComplete,
    },
  ];

  //メモ新規作成時、配列内の挿入位置を特定する必要がある。そのために振り分け中のリストの個数を記録する。
  let startNum = 0;
  const partialMemoLists: PartialMemoListInfo[] = [];
  for (let c of createListInfo) {
    const lists = createPartialMemoListInfo(memos, startNum, c);
    startNum += lists.memos.length;
    partialMemoLists.push(lists);
  }

  const exclusionMemoList = partialMemoLists.map(ml => ml.memos).flat();
  //上記のルール一覧で振り分けられなかった、その他のメモを確保する。
  const otherMemoList = memos.filter(memo => !exclusionMemoList.includes(memo));
  partialMemoLists.push({
    name: "24時間以上",
    isPermitCreatingNewMemo: false,
    memos: otherMemoList,
    startNum
  });

  //コンポーネント群の新規作成
  const createPartialMemoListComponent = partialMemoLists.map((ml, i) =>
    <PartialMemoList
      name={ml.name}
      memos={ml.memos}
      updater={updateDataInMemo}
      deleter={deleteMemo}
      adder={ml.isPermitCreatingNewMemo ? createMemo : undefined}
      deadline={ml.deadlineFunction}
      key={i}
    />
  );

  //描画内容の返却
  return (
    <main className={styles.main}>
      {createPartialMemoListComponent}
    </main>
  );
}

