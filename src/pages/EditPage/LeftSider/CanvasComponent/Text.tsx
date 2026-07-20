import type { ComponentWithKey } from 'src/store/editStoreTypes';

const Text = (props : ComponentWithKey) => {
	return (
		<i>{props.value}</i>
	);
}

export default Text;
