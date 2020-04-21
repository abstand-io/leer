import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = ({ text }) => (
	<header class={style.header}>
		<Link href="/">
			<img src="/assets/logo.svg"/>
		</Link>
		<h1>
			<Link activeClassName={style.active} href="/">
				{ text
					? <span class={style.text}>{text}</span>
					: <span class={style.title}>leer</span>
				}
			</Link>
		</h1>
	</header>
);

export default Header;
