import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './analytics';
import 'normalize.css';
import 'animate.css';
import '../css/main.css';

const 
    CMD_HELP = 'help',
    CMD_WHOAMI = 'whoami',
    CMD_GITHUB = 'github',
    CMD_LINKEDIN = 'linkedin',
    CMD_CLEAR = 'clear',
    CMD_OOPS = 'oops';

class Terminal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            history: [],
            historyIndex: -1,
            input: '',
            lines: generateInitialInfo()
        };
        this.keysPressed = [];
    }

    render() {
        const { input, lines } = this.state;

        return <div id="terminal">
            <ul>
                {lines.map(line => <li>
                    {line.substring(0, 2) === '> ' ? 
                        <pre><span className="prompt">> </span>{line.substring(2)}</pre> : 
                        <pre>{line}</pre>}
                </li>)}
            </ul>
            <form onSubmit={this.onSubmit}>      
                <label className="prompt">> </label>
                <input 
                    autoFocus 
                    type="text" 
                    value={input} 
                    onChange={this.onInputChange.bind(this)}
                    onKeyPress={this.onKeyPress.bind(this)}
                    onKeyDown={this.onKeyDown.bind(this)}
                    onKeyUp={this.onKeyUp.bind(this)}
                />      
            </form>
        </div>;
    }

    onSubmit(event) {
        event.preventDefault();
    }

    onInputChange(event) {
        this.setState({
            input: event.target.value,
            historyIndex: -1
        });
    }

    onKeyPress(event) {
        if (event.key === 'Enter') {
            this.processInput();
        }
    }

    processInput() {
        const input = this.state.input.trim();
        const command = getCommand(input);
        const newLines = generateOutput(input);

        const oldLines = command === CMD_CLEAR ? [] : this.state.lines;

        this.setState({
            input: '',
            history: [...this.state.history, input].filter(i => i !== ''),
            historyIndex: -1,
            lines: [
                ...oldLines, 
                '> ' + input, 
                ...newLines
            ]
        });
    }

    onKeyDown(event) {
        this.keysPressed[event.keyCode] = true;
        // Ctrl + c
        if (this.keysPressed[17] && this.keysPressed[67]) {
            this.processInterrupt();
        }
        // Up arrow
        else if (event.keyCode === 38) {
            this.navigateHistoryUp();
        } 
        // Down arrow
        else if (event.keyCode === 40){
            this.navigateHistoryDown();
        }
    }

    processInterrupt() {
        this.setState({
            input: '',
            historyIndex: -1,
            lines: [
                ...this.state.lines, 
                '> ' + this.state.input
            ]
        });
    }

    onKeyUp(event) {
        this.keysPressed[event.keyCode] = false;
    }

    navigateHistoryUp() {
        const { history, historyIndex } = this.state;

        if (history.length === 0) {
            return;
        }
        
        let newIndex;
        if (historyIndex === -1) {
            newIndex = history.length - 1;
        } else {
            newIndex = Math.max(0, historyIndex - 1);
        }

        this.setState({
            input: history[newIndex],
            historyIndex: newIndex
        });
    }

    navigateHistoryDown() {
        const { history, historyIndex } = this.state;

        if (historyIndex !== -1) {
            const newIndex = Math.min(history.length - 1, historyIndex + 1);
            this.setState({
                input: history[newIndex],
                historyIndex: newIndex
            });
        }
    }
};

const getCommand = input => {
    const items = input.split(' ').filter(i => i !== '');
    if (items.length === 0) {
        return undefined;
    }
    return items.shift();
};

const generateOutput = input => {
    const command = getCommand(input);
    const args = input.split(' ').slice(1);
    switch (command) {
        case undefined:
            return [];
        case CMD_HELP:
            return generateHelp();
        case CMD_GITHUB:
            return generateGithub();
        case CMD_LINKEDIN:
            return generateLinkedIn();
        case CMD_WHOAMI:
            return generatePersonalInfo();
        case CMD_CLEAR:
            return [];
        case CMD_OOPS:
            return generateOops();
        default:
            return [`Command not found: ${command}`];
    }
};

const generateInitialInfo = () => {
    return [
        'Welcome to the Internet™!',
        'Type \'help\' command to show the help menu'
    ];
};

const generateHelp = () => {
    return [
        ` `,
        `   ${CMD_HELP}           Show help menu`,
        `   ${CMD_WHOAMI}         Show personal info`,
        `   ${CMD_GITHUB}         Go to my Github page`,
        `   ${CMD_LINKEDIN}       Go to my LinkedIn page`,
        `   ${CMD_CLEAR}          Clear terminal output`,
        `   ${CMD_OOPS}           Oops`,
        ` `
    ];
};

const generatePersonalInfo = () => {
    return [
        'Hi! My name is Hugo Cárdenas.',
        'I am a software engineer living in Helsinki, Finland.',
        'I love to write code.'
    ];
};

const generateGithub = () => {
    window.open('https://github.com/hugo-cardenas');
    return [
        'This is my Github page: https://github.com/hugo-cardenas'
    ];
};

const generateLinkedIn = () => {
    window.open(' https://linkedin.com/in/hugocardenas/?locale=en_US');
    return [
        'This is my LinkedIn page: https://linkedin.com/in/hugocardenas/?locale=en_US'
    ];
};

const generateOops = () => {
    setInterval(modifyRandomElement.bind(this, effects.wobble), 100);
    setInterval(modifyRandomElement.bind(this, effects.hinge), 500);
    setInterval(modifyRandomElement.bind(this, effects.comic), 5000);
    return ['Did I do that?'];
};

ReactDOM.render(
    <Terminal/>,
    document.getElementById('root')
);

document.body.addEventListener("click", () => {
    document.querySelector('#terminal input').focus()
});

const getRand = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1 - min)) + min;
};

const splitIntoWords = elem => {
    let items = elem.innerText
        .split(' ')
        .map(i => [' ', i]);
    
    return []
        .concat(...items)
        .slice(1)
        .filter(i => i !== '')
        .map(createPre);
};

const splitIntoLetters = elem => {
    return elem.innerText
        .split('')
        .filter(i => i !== '')
        .map(createPre);
};

const createPre = text => {
    const elem = document.createElement('pre');
    elem.innerText = text;
    return elem;
};

const effects = {
    comic: [splitIntoWords, item => {
        item.innerText = 'Comic Sans is ♥ ';
        item.className += 'comic-font';
    }],
    hinge: [splitIntoWords, item => item.className += 'animated hinge'],
    wobble: [splitIntoWords, item => item.className += 'animated wobble']
};

const modifyRandomElement = effect => {
    const [ splitFunc, applyEffect ] = effect;
    
    const elems = Array.from(document.querySelectorAll('pre:not(.hinge)'))
        .filter(elem => elem.innerText !== ' ');

    if (elems.length === 0) {
        return;
    }
    
    const elem = elems[getRand(0, elems.length - 1)];
    const items = splitFunc(elem);

    elem.replaceWith(...items);
    const eligibleItems = items.filter(item => item.innerText !== ' ');
    applyEffect(eligibleItems[getRand(0, eligibleItems.length - 1)]);
};
