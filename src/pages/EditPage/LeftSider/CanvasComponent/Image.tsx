import type { ComponentWithKey } from 'src/store/editStoreTypes';

const Image = (props : ComponentWithKey) => {
	return (
		<>{props.value}</>
	);
}

export default Image;
