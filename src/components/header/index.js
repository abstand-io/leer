import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = () => (
	<header class={style.header}>
		<h1>
			<img src="/assets/undraw_social_distancing_2g0u.svg"/>
			<Link activeClassName={style.active} href="/">leer</Link>
		</h1>
	</header>
);

export default Header;
