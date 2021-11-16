import { ajax } from 'rxjs/ajax';
import { interval, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import poolingHTML from './pooling.html';
import './pooling.css';
import Message from '../Message/Message';

export default class Pooling {
  constructor(parent) {
    this.element = null;
    this.parentEl = null;
    this.els = {
      msgList: null,
    };

    this.messages = [];
    this.url = new URL('https://ahj-hw-rxjs-pollingt-backend.herokuapp.com/');

    this.init(parent);
  }

  init(parent) {
    let tempWrapEl = document.createElement('div');
    tempWrapEl.insertAdjacentHTML('afterbegin', poolingHTML);

    this.element = tempWrapEl.querySelector('.pooling');
    tempWrapEl = null;

    this.els.msgList = this.element.querySelector('.list-pooling');

    if (parent) this.bindToDOM(parent);
  }

  bindToDOM(parent) {
    this.parentEl = typeof parent === 'string' ? document.querySelector(parent) : parent;
    if (this.parentEl) this.parentEl.append(this.element);
  }

  getMessages() {
    const messages$ = interval(1000)
      .pipe(
        map(() => (this.messages.length === 0 ? '' : this.messages[this.messages.length - 1].id)),
        switchMap((id) => ajax.getJSON(`${this.url}messages/unread/${id}`)
          .pipe(
            catchError(() => of({
              status: 'ok',
              timestamp: Date.now(),
              messages: [],
            })),
          )),
      )
      .subscribe({
        next: (response) => {
          if (response.status === 'finish') messages$.unsubscribe();

          this.messages.push(...response.messages);
          this.showMessages(response.messages);
        },
        // eslint-disable-next-line no-console
        error: (error) => console.log('Error', error),
      });
  }

  showMessages(messages) {
    const messagesEls = messages
      .map((msgData) => new Message(msgData).element)
      .reverse();

    this.els.msgList.prepend(...messagesEls);
  }
}
