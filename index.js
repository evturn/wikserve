import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM, { h, makeDOMDriver } from '@cycle/dom';
import { makeJSONPDriver } from '@cycle/jsonp';

const WIKI_URL = 'https://en.wikipedia.org/wiki/';
const API_URL = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=';

function intent(JSONP) {
  return JSONP
    .filter(res$ => res$.request.indexOf(API_URL) === 0)
    .concatAll()
    .pluck('query', 'search');
}

function model(actions) {
  return actions.startWith([]);
}

function view(state) {
  return state.map(results => {
    return h('div', [
      h('header', [
        h('h1', {
          className: 'title'
        }, 'WikSERVE')
      ]),
      h('input', {
        className: 'search-field',
        attributes: { type: 'text' }
      }),
      h('hr'),
      h('div', {
        className: 'results'
      }, results.map(result => {

        return h('div', {
          className: 'result'
        }, [
          h('a', {
            href: WIKI_URL + result.title
          }, result.title)
        ]);
      }))
    ]);
  })
}

function userIntent(DOM) {
  return DOM.select('.search-field')
    .events('input')
    .debounce(300)
    .map(e => e.target.value)
    .filter(val => val.length > 2)
    .map(search => API_URL + search);
}

function main(responses) {
  return {
    DOM: view(model(intent(responses.JSONP))),
    JSONP: userIntent(responses.DOM)
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  JSONP: makeJSONPDriver()
};

Cycle.run(main, drivers);