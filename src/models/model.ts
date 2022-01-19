import { createEvent, createStore } from 'effector';
import { renderDot } from './diagram/renderDot';

export const setDiagram = createEvent<string>();
export const $diagram = createStore(renderDot(''));

$diagram.on(setDiagram, (_, value) => value);
