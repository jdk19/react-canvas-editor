import styles from './Handles.module.less'
import classNames from 'classnames';

const HANDLE_POSITION = [
	'top-left', 'top', 'top-right',
	'left', 'right',
	'bottom-left', 'bottom', 'bottom-right',
] as const;

interface PropsType {
	onPointerDown: React.PointerEventHandler; 
}
const Handles = (props: PropsType) => {
	const {
		onPointerDown,
	} = props;

	return (
		<>
			{
				HANDLE_POSITION.map((pos) => {
					return (
						<div 
							className={classNames(styles[pos], styles.handle)}
							onPointerDown={onPointerDown}
							draggable={false}
							key={pos}
							onDragStart={(e) => { e.stopPropagation(); e.preventDefault(); } }
						>
						</div>
					);
				})
			}
		</>
	);
}

export default Handles;
