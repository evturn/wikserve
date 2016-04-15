import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM, { h, makeDOMDriver } from '@cycle/dom';
import { makeJSONPDriver } from '@cycle/jsonp';
import SearchBox from './search';

const WIKI_URL = 'https://en.wikipedia.org/wiki/';
const API_URL = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=';

function main(responses) {
  const wpSearchBox = SearchBox({
    DOM: responses.DOM,
    props$: Rx.Observable.just({
      apiUrl: API_URL
    })
  });

  const searchDOM$ = wpSearchBox.DOMTree;
  const searchResults$ = responses.JSONP
    .filter(res$ => res$.request.indexOf(API_URL) === 0)
    .concatAll()
    .pluck('query', 'search')
    .startWith([]);

  return {
    JSONP: wpSearchBox.JSONPQuery,
    DOM: Rx.Observable.combineLatest(
      searchDOM$,
      searchResults$,
      (tree, results) => {
        return h('div', [
          h('header', [
            h('h1', {
              className: 'title'
            }, 'WikSERVE')
          ]),
          tree,
          h('hr'),
          h('div', {
            id: 'results',
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
      }
    )
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  JSONP: makeJSONPDriver()
});