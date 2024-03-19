import styles from "./datetime-local.module.css";

export default function DateTimeLocal({ styleName, datetime, blur }: {
    styleName?: string,
    datetime?: string,
    blur: (value: string) => void,
}) {
    return (
        <input name="deadline" type="datetime-local"
            className={`${styles.datetime} ${styleName ? styles[styleName] : ""}`}
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
            defaultValue={datetime}
            onBlur={(e) => blur(e.target.value)}
        />
    );
}