import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = () => (
	<header class={style.header}>
		<h1>
			<Link activeClassName={style.active} href="/">Jetzt</Link>
		</h1>
	</header>
);

export default Header;
