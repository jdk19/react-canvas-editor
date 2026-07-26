import type { Ref } from 'react';
import styles from './SelectBox.module.less';

interface PropsType {
	ref: Ref<HTMLDivElement>;
}
const SeletctBox = ({ ref } : PropsType) => {
	return (
		<div 
			className={styles.box}
			ref={ref}
		>
		</div>
	)
}

export default SeletctBox;
