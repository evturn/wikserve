import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM, { h, makeDOMDriver } from '@cycle/dom';
import { makeJSONPDriver } from '@cycle/jsonp';

const WIKI_URL = 'https://en.wikipedia.org/wiki/';
const API_URL = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=';

function searchRequest(responses) {
  return responses.DOM.select('.search-field')
    .events('input')
    .debounce(300)
    .map(e => e.target.value)
    .filter(val => val.length > 2)
    .map(search => API_URL + search);
}

function vtreeElements(results) {
  return h('div', [
    h('img', {
      attributes: {
        src: 'assets/img/wserve.png'
      }
    }),
    h('input', {
      className: 'search-field',
      attributes: { type: 'text' }
    }),
    h('hr'),
    h('div', results.map(result => {

      return h('div', [
        h('a', {
          href: WIKI_URL + result.title
        }, result.title)
      ]);
    }))
  ]);
}

function main(responses) {
  const vtree$ = responses.JSONP
    .filter(res$ => res$.request.indexOf(API_URL) === 0)
    .mergeAll()
    .pluck('query', 'search')
    .startWith([])
    .map(vtreeElements);

  return {
    DOM: vtree$,
    JSONP: searchRequest(responses)
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  JSONP: makeJSONPDriver()
};

Cycle.run(main, drivers);