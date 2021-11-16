import messageHTML from './message.html';

export default class Message {
  constructor(data) {
    this.element = null;
    this.init(data);
  }

  init(data) {
    let tempWrapEl = document.createElement('div');
    tempWrapEl.insertAdjacentHTML('afterbegin', messageHTML);
    this.element = tempWrapEl.querySelector('.message-pooling');
    tempWrapEl = null;

    let subject = data.subject.trim();

    if (subject.length > 15) {
      subject = `${subject.slice(0, 15)}...`;
    }

    const created = new Date(data.received);
    const date = created.toLocaleDateString('ru');
    const time = created.toLocaleTimeString('ru', { hour: 'numeric', minute: 'numeric' });
    const received = `${time} ${date}`;

    this.element.querySelector('.message-pooling__from').textContent = data.from;
    this.element.querySelector('.message-pooling__subject').textContent = subject;
    this.element.querySelector('.message-pooling__received').textContent = received;
  }
}
