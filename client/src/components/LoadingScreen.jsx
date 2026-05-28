import styles from './LoadingScreen.module.css';

export default function LoadingScreen({ message, subtext, onRetry }) {
  if (onRetry) {
    return (
      <div className={styles.page}>
        <p className={styles.errorText}>{message ?? 'Failed to connect to server.'}</p>
        <button className="btn btn-primary" onClick={onRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.spinner} />
      <p className={styles.text}>{message ?? 'Loading...'}</p>
      {subtext && <p className={styles.subtext}>{subtext}</p>}
    </div>
  );
}
