import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM, { h, makeDOMDriver } from '@cycle/dom';

function searchBox(responses) {
  const apiUrl$ = responses.props$
    .map(props => props['apiUrl'])
    .first();

  const vtree$ = Rx.Observable.just(
    h('div', { className: 'search' }, [
      h('input', {
        className: 'search-field',
        attributes: { type: 'text' }
      })
    ])
  );

  const searchQuery$ = apiUrl$.flatMap(
    apiUrl => {
      return responses.DOM.select('.search-field')
        .events('input')
        .debounce(300)
        .map(e => e.target.value)
        .filter(val => val.length > 2)
        .map(term => apiUrl + term);
    }
  );

  return {
    DOMTree: vtree$,
    JSONPQuery: searchQuery$
  };
}

export default searchBox;