import { h } from 'preact';
import style from './style.css';

const Gps = ({ error }) => (
  <div class={style.gps}>
    { error
      ? <p>
        Schade.<br/>
        Wir benötigen deinen aktuellen Standort um für dich nach Ladengeschäften
        in der Nähe suchen zu können.<br/><br/>
        Falls du es dir anders überlegst, kannst du die Freigabe wie folgt erteilen:<br/><br/>
        iOS:<br/>
        <span>Einstellungen > Safari > Standort</span><br/><br/>
        Android:<br/>
        <span>Chrome > Einstellungen > Website-Einstellungen > Ort</span>
        </p>
      : <p>
        Bitte erlaube jetzt den Standort-Zugriff.<br/><br/>
        Wir benötigen deinen aktuellen Standort um für dich nach Ladengeschäften
        in der Nähe suchen zu können.
      </p>
    }
    <img src="/assets/undraw_my_location_f9pr.svg"/>
  </div>
);

export default Gps;