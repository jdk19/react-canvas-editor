import React, { memo, useRef, useState, useEffect } from "react";
import sharedStyles from './shared.module.less'
import styles from './Text.module.less';
import Textarea from "src/components/Textarea";
import classNames from "classnames";

interface CompPropsType {
	value: string,
	style: React.CSSProperties,
};

const moveCursorToEnd = (node: HTMLDivElement) => {
	const range = new Range();
	range.selectNodeContents(node)
	if(node.textContent === '') {
		range.collapse(false);
	}
	const selection = window.getSelection();
  selection?.removeAllRanges();  // 清掉浏览器可能已经选中的词
  selection?.addRange(range);    // 应用新的(光标在末尾的)选区
}

const Text = memo(({ value, style, }: CompPropsType ) => {
	const [isEditable, setIsEditable] = useState(false);
	const lastClickRef = useRef(0);
	const textareaRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isEditable && textareaRef.current !== null) {
			textareaRef.current.focus();
			// 这里同时调用上一轮提到的 moveCursorToEnd(textareaRef.current)
			moveCursorToEnd(textareaRef.current);
		}
	}, [isEditable]);

	const handlePointerDown = (e: React.PointerEvent) => {
		const now = Date.now();
		const interval = now - lastClickRef.current;
		lastClickRef.current = now;
		if(interval < 300) {
			e.preventDefault();
			setIsEditable(true);
			e.stopPropagation();
		}
	}

	return (
		<div style={{...style, textAlign: "center" }} 
			className={classNames(sharedStyles.container, styles.text)}
			onPointerDown={handlePointerDown}
			onBlur={() => { setIsEditable(false); document.getSelection()?.removeAllRanges(); }}
		>
			<Textarea value={value} editable={isEditable} ref={textareaRef}/>
		</div>
	);
})

export default Text;
