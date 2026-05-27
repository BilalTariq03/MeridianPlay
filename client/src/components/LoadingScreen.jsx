import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  return (
    <div className={styles.page}>
      <div className={styles.spinner} />
      <p className={styles.text}>Loading...</p>
    </div>
  );
}
