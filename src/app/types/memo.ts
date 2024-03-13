export type MemoInfo = {
    id: Readonly<number>;
    description: string;
    color?: string;
    deadline?: string;
    isComplete: boolean;
}
export type MemoInfoProps = keyof Omit<MemoInfo, "id">;
export type UpdateMemo = (memo: MemoInfo, propName: MemoInfoProps, newValue: MemoInfo[MemoInfoProps]) => void;
export type DeleteMemo = (memo: MemoInfo) => void;
export type CreateMemo = (id: number) => MemoInfo;
export type PartialMemoListInfo = {
    name: string
    isPermitCreatingNewMemo: boolean
    memos: MemoInfo[]
    startNum: number
    deadlineFunction?: () => string
}
export type CreatePartialMemoListInfo = {
    name: string,
    isPermitCreatingNewMemo: boolean,
    filter: (memo: MemoInfo) => boolean,
    deadlineFunction?: () => string
}
//export const DEFAULT_BACKGROUND_COLOR = "#ccffbb" as const;