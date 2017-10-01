import 'normalize.css';
import '../css/main.css';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Terminal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            input: '',
            inputHistory: [],
            lines: generateInitialInfo()
        };
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
                />      
            </form>
        </div>;
    }

    onSubmit(event) {
        event.preventDefault();
    }

    onInputChange(event) {
        this.setState({input: event.target.value});
    }

    onKeyPress(event) {
        switch (event.key) {
            case 'Enter': 
                const input = this.state.input;
                const command = getCommand(input);
                const newLines = generateOutput(input);

                const oldLines = command === 'clear' ? [] : this.state.lines;

                this.setState({
                    input: '',
                    inputHistory: [...this.state.inputHistory, input],
                    lines: [
                        ...oldLines, 
                        '> ' + input, 
                        ...newLines
                    ]
                });
            default:
        }
    }
}

const getCommand = input => {
    const items = input.split(' ');
    if (items.length === 0) {
        return undefined;
    }
    return items.shift();
}

const generateOutput = input => {
    const command = getCommand(input);
    const items = input.split(' ').slice(1);
    switch (command) {
        case '':
            return [];
        case 'help':
            return generateHelp();
        case 'hello':
            return ['Hello there, Mr/Mrs ' + items.join(' ') + '!'];
        case 'github':
            return generateGithub();
        case 'linkedin':
            return generateLinkedIn();
        case 'whoami':
            return generatePersonalInfo();
        case 'clear':
            return [];
        default:
            return [`Unknown command "${command}"`];
    }
}

const generateInitialInfo = () => {
    return [
        'Type \'help\' command to show the help menu'
    ];
}

const generatePersonalInfo = () => {
    return [
        'Hi! My name is Hugo Cárdenas.',
        'I am a software engineer living in Helsinki, Finland.',
        'I love to write code.'
    ];
}

const generateHelp = () => {
    return [
        ' ',
        '   help           Show help menu',
        '   hello <name>   Show a personalized greeting',
        '   github         Go to my Github page',
        '   linkedin       Go to my LinkedIn page',
        '   whoami         Show personal info',
        '   clear          Clear terminal output',
        ' '
    ];
}

const generateGithub = () => {
    window.open('https://github.com/hugo-cardenas');
    return [
        'This is my Github page: https://github.com/hugo-cardenas'
    ];
}

const generateLinkedIn = () => {
    window.open(' https://linkedin.com/in/hugocardenas/?locale=en_US');
    return [
        'This is my LinkedIn page: https://linkedin.com/in/hugocardenas/?locale=en_US'
    ];
}

ReactDOM.render(
    <Terminal/>,
    document.getElementById('root')
);

document.body.addEventListener("click", () => {
    document.querySelector('#terminal input').focus()
});