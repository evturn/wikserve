import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

function main(responses) {
  return {
    DOM: Rx.Observable.just(CycleDOM.h('span', 'Man, those torillas smell good.'))
  };
}

const drivers = {
  DOM: CycleDOM.makeDOMDriver('#container')
};

Cycle.run(main, drivers);