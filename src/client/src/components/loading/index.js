import { h } from 'preact';
import style from './style.css';

const Loading = () => (
  <div class={style.wrapper}>
    <div class={style.loading}>
      <div class={style.line}></div>
      <div class={style.line}></div>
      <div class={style.line}></div>
    </div>
  </div>
);

export default Loading;