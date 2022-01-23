import { BabelFileResult } from '@babel/core';
import * as effector from 'effector';
import * as effectorReact from 'effector-react';
import { requestCreateIndex} from '../graphite';
import { is } from 'effector';
import * as patronum from 'patronum';
import * as foliage from 'foliage';
import * as forest from 'forest';
import React from 'react';
import ReactDOM from 'react-dom';
import { reset, units } from './units-watch-list';
import { clearRender, POPUP_ELEMENT_ID } from '../../app';

// import postcss from 'postcss';
// import autoprefixer from 'autoprefixer';

// postcss(['autoprefixer', 'tailwindcss']);

function style(tags: string | any[], ...attrs: string[]) {
  if (tags.length === 0) return '';
  let result = ' ' + tags[0];

  for (let i = 0; i < attrs.length; i++) {
    result += attrs[i];
    result += tags[i + 1];
  }
  return result;
}

function css(tags: any, ...attrs: any[]) {
  const value = style(tags, ...attrs);
  const node: HTMLStyleElement = document.createElement('style');
  node.id = 'insertedStyle';
  node.appendChild(document.createTextNode(value));
  // const sheet = document.getElementById('insertedStyle');
  //
  // if (sheet) {
  //   sheet.disabled = true;
  //   sheet.parentNode.removeChild(sheet);
  // }
  document.head.appendChild(node);
}

let id = 0;

export function execute(result: BabelFileResult) {
  const popup = document.querySelector(POPUP_ELEMENT_ID);
  popup && document.body.removeChild(popup);
  const node = document.getElementById('insertedStyle');
  node && document.head.removeChild(node);

  let ROOT = document.getElementById('root');
  if (ROOT) {
    document.body.removeChild(ROOT);
  }
  ROOT = document.createElement('div');
  ROOT.id = 'root';
  document.body.appendChild(ROOT);
//    ROOT.innerHTML = '';

  let timer;

  try {
    // @ts-ignore
    Object.keys(effector).forEach(e => window[e] = effector[e]);
    // @ts-ignore
    Object.keys(effectorReact).forEach(e => window[e] = effectorReact[e]);
    // Object.assign(window, effector);
    // Object.assign(window, effectorReact);
    Object.assign(window, {
      React,
      ReactDOM,
      ROOT,
      css,
      patronum,
    });

    // @ts-ignore
    window.clearNode = (unit, config) => {
      queueMicrotask(requestCreateIndex);
      switch (true) {
        case is.store(unit):
          units.stores.remove(unit);
          break;
        case is.domain(unit):
          units.domains.remove(unit);
          break;
        case is.event(unit):
          units.events.remove(unit);
          break;
        case is.effect(unit):
          units.effects.remove(unit);
          break;
      }
      return effector.clearNode(unit, config);
    };

    // @ts-ignore
    window.createStore = (...args) => {
      // @ts-ignore
      const store = effector.createStore(...args);
      // console.log('create store', store.shortName);
      units.stores.push(store);
      return store;
    };

    // @ts-ignore
    window.createEvent = (...args) => {
      const event = effector.createEvent(...args);
      // console.log('create event', event.shortName);
      units.events.push(event);
      return event;
    };

    // @ts-ignore
    window.createEffect = (...args) => {
      // @ts-ignore
      const effect = effector.createEffect(...args);
      // console.log('create effect', effect.shortName);
      units.effects.push(effect);
      return effect;
    };

    // @ts-ignore
    window.createDomain = (...args) => {
      // @ts-ignore
      const domain = effector.createDomain(...args);
      // console.log('create domain', domain.shortName);
      units.domains.push(domain);

      domain.onCreateDomain((domain) => {
        // console.log('create sub domain', domain.shortName);
        units.domains.push(domain);
      });
      domain.onCreateStore((store) => {
        // console.log('create sub store', store.shortName)
        units.stores.push(store);
      });
      domain.onCreateEvent((event) => {
        // console.log('create sub event', event.shortName)
        units.events.push(event);
      });
      domain.onCreateEffect((effect) => {
        // console.log('create sub effect', effect.shortName)
        units.effects.push(effect);
      });

      return domain;
    };

    return new Promise((resolve, reject) => {
      timer = setTimeout(() => {
        reject('stop');
        throw new Error('time limit');
      }, 10000);
      try {
        if (typeof result.code === 'string') {
          // console.log(result.code);
          reset();
          clearRender();
          const context = {};
          resolve({
            context, result: eval.call(
              context,
              `(async function () {\n${result.code}\n})()`,
            ),
          });
        }
      } catch (e) {
        clearTimeout(timer);
        reject(e);
      }
      clearTimeout(timer);
    });

  } catch (e) {
    clearTimeout(timer);
    console.error(e);
  }
}
