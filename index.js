import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM, { h } from '@cycle/dom';

function vtreeElements(results) {
  return h('div', [
    h('h1', 'It is illegal to eat 18 sandwiches in 1 hour'),
    h('input', {
      className: 'search-field',
      attributes: {
        type: 'text'
      }
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
  return {
    DOM: Rx.Observable.just(h('span', 'Man, those torillas smell good.'))
  };
}

const drivers = {
  DOM: CycleDOM.makeDOMDriver('#app')
};

Cycle.run(main, drivers);