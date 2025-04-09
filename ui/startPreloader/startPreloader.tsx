import styles from './startPreloader.module.scss';
import Image from 'next/image';
import logo from '@/public/logos/logo.png'; // адаптуй шлях до свого логотипу

const StartPreloader = () => {
    return (
        <div className={styles.preloader}>
            <div className={styles.inner}>
                <div className={styles.logoWrap}>
                    <Image src={logo} alt="CoreFit logo" width={80} height={80} />
                    <h1 className={styles.title}>CoreFit</h1>
                </div>
                <div className={styles.loader}></div>
            </div>
        </div>
    );
};

export default StartPreloader;