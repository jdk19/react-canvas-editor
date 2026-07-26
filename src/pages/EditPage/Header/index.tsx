import classNames from 'classnames';
import styles from './index.module.less'
import { Link, useSearchParams } from 'react-router';
import { saveCanvas } from 'src/store/editStore';
import useCanvasId from 'src/hooks/useCanvasId';
import useCanvasType from 'src/hooks/useCanvasType';
import { clearCanvas } from 'src/store/editStore';

const Header = (props : any) => {
	const [canvasId] = useCanvasId();
	const [canvasType] = useCanvasType();
	const [, setSearchParams] = useSearchParams();

	const save = () => {
		saveCanvas(canvasId, canvasType, (id: string, type: string) => {
			setSearchParams(prev => {
				prev.set('id', id);
				prev.set('type', type);
				return prev;
			});
		})
	}

  const saveAndPreview = () => {
	}

  const emptyCanvas = () => {
		clearCanvas();
	}

	return (
		<div className={styles.main}>
      <div className={classNames(styles.item)}>
        <Link to="/list" className="red">
          查看列表
        </Link>
      </div>

      <div className={classNames(styles.item)} onClick={save}>
        <span
          className={classNames("iconfont icon-baocun", styles.icon)}></span>
        <span className={styles.txt}>保存</span>
      </div>

      <div className={classNames(styles.item)} onClick={saveAndPreview}>
        <span
          className={classNames("iconfont icon-baocun", styles.icon)}></span>
        <span className={styles.txt}>保存并预览</span>
      </div>

      <div className={classNames(styles.item)}>
        <span
          className={classNames(
            "iconfont icon-chexiaofanhuichehuishangyibu",
            styles.icon
          )}></span>
        <span className={styles.txt}>上一步</span>
        <span className={styles.shortKey}>CMD+Z</span>
      </div>

      <div className={classNames(styles.item)}>
        <span
          className={classNames(
            "iconfont icon-chexiaofanhuichehuishangyibu",
            styles.icon
          )}
          style={{transform: `rotateY{180}deg`}}></span>
        <span className={styles.txt}>下一步 </span>
        <span className={styles.shortKey}>CMD+Shift+Z</span>
      </div>

			<div className={classNames(styles.item)} onClick={emptyCanvas}>
				<span
          className={classNames("iconfont icon-qingkong", styles.icon)}></span>
        <span className={styles.txt}>清空</span>
      </div>
    </div>
	)
}

export default Header;
