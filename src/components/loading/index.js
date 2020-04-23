import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Loading = ({ error }) => (
  <div class={style.loading}>
    { error
      ? <div class={style.error}>
          <p>Leider ergab unsere Suche keinen Treffer.</p>
          <Link href="/">Neue Suchanfrage</Link>
        </div>
      : <div class={style.wrapper}>
          <div class={style.line}></div>
          <div class={style.line}></div>
          <div class={style.line}></div>
        </div>
    }
    <img src="/assets/undraw_searching_p5ux.svg"/>
  </div>
);

export default Loading;