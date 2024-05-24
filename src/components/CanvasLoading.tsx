import Image from "next/image";
import styles from "./CanvasLoading.module.css";

export default function CanvasLoading() {
  return (
    <div className={styles.wrapper}>
      <Image src="/icons/loading.png" alt="loading" width={20} height={20} className={styles.loading} priority />
    </div>
  );
}
