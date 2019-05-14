import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { linkifier } from 'react-linkifier';
import './analytics';
import 'normalize.css';
import 'animate.css';
import '../css/main.styl';
import img from '../img/phone.png';

const
  CMD_HELP = 'help',
  CMD_WHOAMI = 'whoami',
  CMD_PROJECTS = 'projects',
  CMD_GITHUB = 'github',
  CMD_LINKEDIN = 'linkedin',
  CMD_CLEAR = 'clear',
  CMD_OOPS = 'oops';

const
  ENTRY_LINES = 'entry-lines',
  ENTRY_PROJECTS = 'entry-projects';

class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      // entries: generateInitialEntries()
      entries: [generateProjects()]
      // entries: [generatePersonalInfo()]
    };
    this.history = [];
    this.historyIndex = -1;
    this.keysPressed = [];
  }

  render() {
    const { entries } = this.state;
    return <div id="terminal">
      <div>
        {entries.map(this.renderEntry)}
      </div>
      {this.renderPrompt()}
    </div>;
  }

  renderEntry = entry => {
    switch (entry.type) {
      case ENTRY_PROJECTS:
        return renderProjects();
      case ENTRY_LINES:
      default:
        return entry.lines.map(renderLine);
    }
  }

  renderPrompt() {
    const { input } = this.state;
    return (
      <form className="input-form" onSubmit={this.onSubmit}>
        <label className="prompt">> </label>
        <input
          autoFocus
          className="cli-input"
          type="text"
          value={input}
          onChange={this.onInputChange}
          onKeyPress={this.onKeyPress}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        />
      </form>
    );
  }

  componentDidUpdate() {
    scrollPromptToBottom();
  }

  componentDidMount() {
    document.body.addEventListener("keydown", this.onKeyDown);
  }

  onSubmit(event) {
    event.preventDefault();
  }

  onInputChange = event => {
    this.historyIndex = -1;
    this.setState({ input: event.target.value });
  }

  onKeyPress = event => {
    if (event.key === 'Enter') {
      this.processInput();
    }
  }

  processInput() {
    const input = this.state.input.trim();
    const command = getCommand(input);
    const newEntry = generateOutput(input);

    const oldEntries = command === CMD_CLEAR ? [] : this.state.entries;

    if (command === CMD_CLEAR) {
      scrollToTop();
    } else {
      // If all new lines' height under the last prompt are shorter than screen height, scroll the new prompt to bottom of screen
      // If they are logner than screen height, scroll the last prompt to top of the csreen
    }

    this.history = [...this.history, input].filter(i => i !== '');
    this.historyIndex = -1;
    this.setState({
      input: '',
      entries: [
        ...oldEntries,
        command !== CMD_CLEAR ? { type: ENTRY_LINES, lines: ['> ' + input] } : null,
        newEntry
      ].filter(entry => entry)
    });
  }

  onKeyDown = event => {
    // setPromptInView();
    // window.scrollTo({ left: 0, top: scrollHeight, behavior: 'smooth' });

    // TODO Scroll smoothly to prompt input

    scrollPromptToBottom();
    document.querySelector('#terminal input').focus({ preventScroll: true });

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
    else if (event.keyCode === 40) {
      this.navigateHistoryDown();
    }
  }

  processInterrupt() {
    this.historyIndex = -1;
    this.setState({
      input: '',
      entries: [
        ...this.state.entries,
        { type: ENTRY_LINES, lines: ['> ' + this.state.input] }
      ]
    });
  }

  onKeyUp = event => {
    this.keysPressed[event.keyCode] = false;
  }

  navigateHistoryUp() {
    const { history, historyIndex } = this;

    if (history.length === 0) {
      return;
    }

    let newIndex;
    if (historyIndex === -1) {
      newIndex = history.length - 1;
    } else {
      newIndex = Math.max(0, historyIndex - 1);
    }

    this.historyIndex = newIndex;
    this.setState({ input: history[newIndex] });
  }

  navigateHistoryDown() {
    const { history, historyIndex } = this;

    if (historyIndex !== -1) {
      const newIndex = Math.min(history.length - 1, historyIndex + 1);
      this.historyIndex = newIndex;
      this.setState({ input: history[newIndex] });
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
      return null;
    case CMD_HELP:
      return generateHelp();
    case CMD_WHOAMI:
      return generatePersonalInfo();
    case CMD_PROJECTS:
      return generateProjects();
    case CMD_GITHUB:
      return generateGithub();
    case CMD_LINKEDIN:
      return generateLinkedIn();
    case CMD_CLEAR:
      return null;
    case CMD_OOPS:
      return generateOops();
    default:
      return { type: ENTRY_LINES, lines: [`Command not found: ${command}`] };
  }
};

const generateInitialEntries = () => {
  return [{
    type: ENTRY_LINES, lines: [
      'Type \'help\' command to show the help menu'
    ]
  }];
};

const generateHelp = () => {
  return {
    type: ENTRY_LINES, lines: [
      ``,
      `${CMD_HELP}           Show help menu`,
      `${CMD_WHOAMI}         Show personal info`,
      `${CMD_PROJECTS}       Show some of my projects`,
      `${CMD_GITHUB}         Go to my Github page`,
      `${CMD_LINKEDIN}       Go to my LinkedIn page`,
      `${CMD_CLEAR}          Clear terminal output`,
      `${CMD_OOPS}           Oops`,
      ``
    ]
  };
};

const generatePersonalInfo = () => {
  return {
    type: ENTRY_LINES, lines: [
      '',
      'Hi! My name is Hugo Cárdenas.',
      'I am a Spanish software engineer living in Helsinki, Finland.',
      '',
      'While previously I\'ve been more focused on backend,',
      'nowadays I\'m mostly excited about building stuff with JS, React & React Native.',
      '',
    ]
  };
};

const generateProjects = () => {
  return { type: ENTRY_PROJECTS };
};

const renderProjects = () => {
  const a = [
    '',
    'Lickit - a desktop app for music study made with Electron',
    'https://github.com/hugo-cardenas/lickit',
    '',
    'IMDB movie stats',
    'https://imdb-movie-stats.now.sh',
    '',
    'Finnish tongue twisters',
    'https://finnishtonguetwisters.com',
    '',
  ];

  const projects = [
    {
      img,
      title: 'Frinkiac iOS app',
      description: 'A personal project, an iOS app built with React Native on top of http://frinkiac.com'
    },
    {
      img,
      title: 'Amino White Label app',
      description: 'I worked for Amino Communications on building our White Label application (React Native) customizable for multiple TV/cloud operators'
    }
  ]
  return (
    <Fragment>
      {projects.map(({img, title, description}) => renderMobileBlock(img, title, description))}      
    </Fragment>
  );
}

const renderMobileBlock = (img, title, description) => (
  <div className="mobile-block">
    <img src={img} />
    <div className="mobile-block-text">
      <div className="mobile-block-title">{title}</div>
      <div>{renderLine(description)}</div>
    </div>    
  </div>
);

const renderLine = line => {
  const isPrompt = line.substring(0, 2) === '> ';
  return (
    <div className={`line ${isPrompt ? 'line-prompt' : 'line-normal'}`}>
      {isPrompt ?
        <pre><span className="prompt">> </span>{linkify(line.substring(2))}</pre> :
        <pre>{linkify(line)}</pre>
      }
    </div>
  );
}

const generateGithub = () => {
  return openAndGenerateUrl('https://github.com/hugo-cardenas');
};

const generateLinkedIn = () => {
  return openAndGenerateUrl('https://linkedin.com/in/hugocardenas/?locale=en_US');
};

const openAndGenerateUrl = url => {
  window.open(url);
  return { type: ENTRY_LINES, lines: [url] };
}

const generateOops = () => {
  setInterval(modifyRandomElement.bind(this, effects.wobble), 100);
  setInterval(modifyRandomElement.bind(this, effects.hinge), 500);
  return { type: ENTRY_LINES, lines: ['Did I do that?'] };
};

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
    .map(item => createPre(item, elem.className));
};

const createPre = (text, className) => {
  const elem = document.createElement('pre');
  elem.innerText = text;
  elem.className = className;
  return elem;
};

const effects = {
  hinge: [splitIntoWords, item => item.className += ' animated hinge'],
  wobble: [splitIntoWords, item => item.className += ' animated wobble']
};

const modifyRandomElement = effect => {
  const [splitFunc, applyEffect] = effect;

  const elems = Array.from(document.querySelectorAll('pre:not(.hinge)'))
    // Select only elements with at least 1 character which is not space or line break
    .filter(elem => elem.innerText.replace(/[\s\r]/, '') !== '');

  if (elems.length === 0) {
    return;
  }

  const elem = elems[getRand(0, elems.length - 1)];
  const items = splitFunc(elem);

  elem.replaceWith(...items);
  const eligibleItems = items.filter(item => item.innerText !== ' ');
  applyEffect(eligibleItems[getRand(0, eligibleItems.length - 1)]);
};

const scrollPromptToBottom = () => {
  const prompt = document.querySelector('#terminal > form');
  const { height, top } = prompt.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // If prompt not fully in view, then scroll to bottom
  if (height + top > windowHeight) {
    prompt.scrollIntoView({ alignToTop: false, behavior: 'smooth' })
  }
};

const scrollToTop = () => {
  window.scrollTo({
    left: 0,
    top: 0
  });
}

const linkify = text => linkifier(text, { target: '_blank' });

ReactDOM.render(
  <Terminal />,
  document.getElementById('root')
);
