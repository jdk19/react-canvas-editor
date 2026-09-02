import { useState, useRef, useEffect } from 'react';
import React from 'react';
import styles from './Textarea.module.less';

interface PropsType
	extends 
	Omit<React.ComponentPropsWithRef<'div'>, 
		'value' | 'defauletValue' | 'editable' | 'onChange'> 
{
	value?: string;
	defaultValue?: string;
	onChange?: (v: string) => void;
	editable?: boolean;
}

function useControllableState(
	value?: string, defaultValue: string = '',
	onChange?: (value: string) => void)
{
	const [inner, setInner] = useState(defaultValue);
	const isControlled = value !== undefined;

	const currentValue = isControlled ? value : inner;
	const setValue = (v: string) => {
		if(!isControlled) setInner(v);
		onChange?.(v)
	}

	return [currentValue, setValue] as const;
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
	return (node: T | null) => {
		for(const ref of refs) {
			if(typeof ref === 'function') {
				ref(node);
			} else if(ref && typeof ref === 'object') {
				ref.current = node;
			}
		}
	}
}

const Textarea = ({ value, defaultValue, editable, onChange, ref, ...rest }: PropsType) => {
	const [content, setContent] = useControllableState(value, defaultValue, onChange)
	const internalRef = useRef<HTMLDivElement>(null);

	const handleInput = (e: React.InputEvent<HTMLDivElement>) => {
		setContent(e.currentTarget.textContent)
	}

	useEffect(() => {
		if(internalRef.current !== null) {
			internalRef.current.textContent = content;
		}
	}, [])

	const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
		e.preventDefault();	
		const text = e.clipboardData?.getData('text/plain');
		document.execCommand('insertText', false, text);
	}

	return (
		<div
			className={styles.textContainer}
			contentEditable={editable ? 'true' : 'false'}
			suppressContentEditableWarning
			onInput={handleInput}
			ref={mergeRefs(internalRef, ref)}
			onPaste={handlePaste}
			{...rest}
		>
		</div>
	)
}

export default Textarea;
