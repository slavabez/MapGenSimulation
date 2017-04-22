
// Importing the main page
import './index.html';
import './css/main.css';

// import Bulma css
import 'bulma/css/bulma.css';

import Logger from './modules/Logger';
import UI from './modules/UserInterface';


Logger.logGood('ha');
Logger.logError('Sample error');

// Start all UI related listeners

let ui = new UI();

ui.attachAllUIListeners();



