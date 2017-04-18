/**
 * Created by slava on 16/04/17.
 */

import * as moment from 'moment';

export default class Logger {

    static log(text:string, prefix?:string, level?:string){
        let logWindow = document.querySelector('.logWindow');
        if (!logWindow){
            throw new Error('Log Window div was not found');
        }
        // create the paragraph
        let p = document.createElement('P');
        if (level === 'error') {
            p.className = 'error';
        }
        // Add date span
        let timeSpan = document.createElement('SPAN');
        timeSpan.className = 'time';
        timeSpan.innerHTML = moment().format('HH:mm:ss.SSS');
        p.appendChild(timeSpan);
        if (prefix) {
            let classSpan = document.createElement('SPAN');
            classSpan.className = level;
            classSpan.innerHTML = prefix;
            p.appendChild(classSpan);
        }

        let textNode = document.createTextNode(text);
        p.appendChild(textNode);

        logWindow.appendChild(p);
        logWindow.scrollTop = logWindow.scrollHeight;
    }

    static logWarning(text:string){
        Logger.log(text, 'Warning:', 'warning');
    }

    static logError(text:string){
        Logger.log(text, 'Error:', 'error');
    }

    static logGood(text:string){
        Logger.log(text, 'Log:', 'good');
    }
}