import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style';

export default class Home extends Component {
	constructor() {
		super();		
	}	

	render(_, { geo, f, r }) {
		return (
			<div class={style.credits}>
				<p class="lead">
					<span class="title">Credits</span><br />
					leer.im ist <a href="https://github.com/abstand-io/leer" target="_blank">Open Source Software</a> von abstand.io, 
					gebaut von <a href="https://twitter.com/seveves" target="_blank">@seveves</a> und <a href="https://twitter.com/zebarto" target="_blank">@zebarto</a>. 
					Die den angezeigten Ergebnissen zugrunde liegenden
					Daten werden von Google bereitgestellt und
					von uns abgerufen. Wir übernehmen keinerlei Haftung 
					oder Gewährleistung für die Richtigkeit der Daten.
				</p>
				<p class="lead">
					Ein Dank geht an <a href="https://maps.google.com" target="_blank">Google</a>, <a href="https://preactjs.com" target="_blank">preact</a>, 
					<a href="https://undraw.co" target="_blank">undraw.co</a> und <a href="https://now.sh" target="_blank">now.sh</a>. 
				</p>
				<p class="lead">
					Die Nutzung ist für Euch kostenfrei. Der Betrieb von
					 leer kostet uns. Eine Spende zur
					  Aufrechterhaltung des Dienstes erheitert die Betreiber ;)
				</p>

				<img src="./assets/undraw_transfer_money_rywa.svg" style="width:50%;margin:auto;"/>
				
				<div class={style.group}>
					<button class="btn primary" onClick={this.search}>Jetzt spenden</button>
				</div>			
				<p class={style.safe}>#staysafe</p>
			</div>
		);
	}
}
