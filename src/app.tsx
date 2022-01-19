import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Unit } from 'effector';
import { useStore } from 'effector-react';
import Editor, { Monaco, useMonaco } from '@monaco-editor/react';

import './examples/counter';
import { $counter, effect } from './examples/counter';
import { $fullName } from './examples/glitch';
import { $todos } from './examples/todo-list-with-validation';
import { GraphViz } from './components/graph-viz';
import { LabelModesMap } from './models';
import { LabelModes, LayoutSubMode, Presets } from './models/types';
import { $diagram } from './models/graphite';
import { FragmentOptions } from './models/diagram/renderFragment';
import { debouncedTransformCode, run } from './models/ide/transformer';
import { $unitsWatchList, UnitsWatchList } from './models/ide/units-watch-list';
import { $mode, setMode } from './models/ide/mode';
import { LS_CODE_KEY, save } from './models/ide/code';

const domains: { [key: string]: Unit<any> } = {
  'effect': effect,
  '$todos': $todos,
  '$counter': $counter,
  '$fullName': $fullName,
};

const subModeOptions = () => ['visible', 'transparent', 'removed'].map(m => <option key={m} value={m}>{m}</option>);

let timer: number;
const MIN_HEIGHT = '150px';
const MAX_HEIGHT = '50vh';

const buildOptionsWithGroups = ({ data }: { data: UnitsWatchList }) =>
  Object.entries(data).map(([group, units]) => (
    units.length !== 0 && <optgroup key={group} label={group}>
      {units.map((unit, i) => (
        // @ts-ignore
        <option key={`${unit.graphite.sid}_${i}`}>{unit.shortName}</option>
      ))}
    </optgroup>
  ));

const StructurePanel = ({ data, editor }: { data: UnitsWatchList, editor: any }) => {
  const setPos = (unit: Unit<any>) => {
    // @ts-ignore
    const loc = unit?.defaultConfig?.loc;
  };
  // editor.setPosition({ column: 3, lineNumber: 3 });
  const units = Object.entries(data).map(([group, units]) => (
    units.length !== 0 && <details key={group} open={true}>
      <summary>{group}</summary>
      {units.map((unit, i) => {
        return (
          // @ts-ignore
          <div className="structure__unit" key={`${unit.graphite.sid}_${i}`} onClick={() => setPos(unit)}>
            {/* @ts-ignore */}
            {unit.shortName}
          </div>
        );
      })}
    </details>
  ));

  return (
    <aside className="sidebar">
      <h2>Structure</h2>
      <div className="structure">
        {units.length ? units : <h3 style={{ color: '#aaa' }}>No units</h3>}
      </div>
    </aside>
  );
};

const POPUP_ELEMENT_ID = 'popup-message';
let popupTimer: number;

export const popup = (html: string | HTMLElement | HTMLElement[] = '', timeout: number = Infinity, color: string = 'white') => {
  clearTimeout(popupTimer);
  const popup: HTMLDivElement = document.querySelector(`#${POPUP_ELEMENT_ID}`) || document.createElement('div');

  popup.id = POPUP_ELEMENT_ID;
  if (typeof html === 'string') {
    popup.innerHTML = html;
  } else {
    if (Array.isArray(html)) {
      popup.innerHTML = '';
      html.forEach(el => popup.appendChild(el));
    } else {
      popup.replaceChildren(html);
    }
  }
  popup.style.backgroundColor = color;
  document.body.appendChild(popup);
  if (timeout !== Infinity) {
    popupTimer = setTimeout(() => document.body.removeChild(popup), timeout);
  }
  return {
    close() {
      document.body.removeChild(popup);
    },
  };
};

const button = (text: string, callback: () => void) => {
  const btn = document.createElement('button');
  btn.innerHTML = text;
  btn.onclick = () => {
    callback && callback();
  };
  return btn;
};

// @ts-ignore
Object.assign(window, { popup, button });

type ControlCenterProps = {
  value: string,
  onChange: (e) => void,
  data: UnitsWatchList,
  mode: FragmentOptions,
  onChange1: (e) => void,
  callbackfn: ([k, v]: readonly [any, any]) => JSX.Element,
  onChange2: (e) => void,
  onChange3: (e) => void,
  onChange4: (e) => void,
  onChange5: () => FragmentOptions,
  onChange6: () => FragmentOptions,
  onChange7: (e) => void,
  onChange8: () => FragmentOptions
}

function ControlCenter(props: ControlCenterProps) {
  return <div className="actions">
    <div className="actions left">
      <label>
        Model
        <select value={props.value} onChange={props.onChange}>
          <option value="-all-">- All -</option>
          {buildOptionsWithGroups({ data: props.data })}
        </select>
      </label>
      <label>
        &nbsp;
        <select value={props.mode.labels} onChange={props.onChange1}>
          {Object.entries(LabelModesMap).map(props.callbackfn,
          )}
        </select>
      </label>
      <label>
        owners &nbsp;
        <select value={props.mode.owners} onChange={props.onChange2}>
          {subModeOptions()}
        </select>
      </label>

      <label>
        links &nbsp;
        <select value={props.mode.links} onChange={props.onChange3}>
          {subModeOptions()}
        </select>
      </label>

      <label>
        next &nbsp;
        <select value={props.mode.next} onChange={props.onChange4}>
          {subModeOptions()}
        </select>
      </label>

      <label>
        <input type="checkbox" checked={props.mode.shapes?.styled} onChange={props.onChange5} /> shapes
      </label>

      <label>
        <input type="checkbox" checked={props.mode.shapes?.colored} onChange={props.onChange6} /> colors
      </label>

      <label>
        &nbsp;
        <select value={props.mode.preset} onChange={props.onChange7}>
          <option value="show domains">show domains</option>
          <option value="show internals">show internals</option>
          <option value="hide domains">hide domains</option>
        </select>
      </label>
    </div>
    <div className="actions right">
      <label>
        &nbsp;
        <input type="checkbox" checked={props.mode.autorun} onChange={props.onChange8} />
        <button className="btn-run" onClick={run}>
          Run
        </button>
      </label>
    </div>
  </div>;
}

export const App = () => {
  const [editor, setEditor] = useState(null);
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [hover, setHover] = useState(false);
  const [domain, setDomain] = useState(Object.keys(domains)[1]);

  const refIde = useRef(null);

  const structure = useStore($unitsWatchList);
  const diagram = useStore($diagram);
  const mode = useStore<FragmentOptions>($mode);

  const toggleShapes = () => setMode({
    ...mode,
    shapes: { ...mode.shapes, styled: !mode.shapes?.styled },
  });

  const toggleColors = () => setMode({
    ...mode,
    shapes: { ...mode.shapes, colored: !mode.shapes?.colored },
  });

  const toggleAutorun = () => setMode({
    ...mode,
    autorun: !mode.autorun,
  });

  useEffect(() => {
    const handleClick = () => {
      !hover && setHeight(MIN_HEIGHT);
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [hover]);

  const [loaded, setLoaded] = useState(false);

  const handleEditorChange = useCallback((value: any, event: any) => {
    loaded && save(value);
  }, [loaded]);

  useEffect(() => {
    if (!editor) return;
    try {
      const text = localStorage.getItem(LS_CODE_KEY);
      const parsedValue = JSON.parse(text || '');
      editor.setValue(parsedValue);
      debouncedTransformCode(parsedValue);
    } catch (e) {
      //
      console.log(e);
    }
    setLoaded(true);
  }, [editor, setLoaded]);

  return (
    <div className="App">
      <ControlCenter
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        data={structure}
        mode={mode}
        onChange1={(e) => {
          setMode({
            ...mode,
            labels: e.target.value as LabelModes,
          });
        }}
        callbackfn={([k, v]) => (<option key={k} value={k}>{v}</option>)}
        onChange2={(e) => {
          setMode({
            ...mode,
            owners: e.target.value as LayoutSubMode,
          });
        }}
        onChange3={(e) => {
          setMode({
            ...mode,
            links: e.target.value as LayoutSubMode,
          });
        }}
        onChange4={(e) => {
          setMode({
            ...mode,
            next: e.target.value as LayoutSubMode,
          });
        }}
        onChange5={toggleShapes}
        onChange6={toggleColors}
        onChange7={(e) => {
          setMode({
            ...mode,
            preset: e.target.value as Presets,
          });
        }}
        onChange8={toggleAutorun}
      />

      <div className="graph">
        <GraphViz dot={diagram} />
      </div>

      <div className="ide" style={{ height }}
           ref={refIde}
           onMouseEnter={(e) => {
             if (e.buttons !== 0) return;

             clearTimeout(timer);
             setHeight(MAX_HEIGHT);
             setHover(true);
           }}
           onMouseLeave={() => {
             timer = setTimeout(() => setHeight(MIN_HEIGHT), 1000);
             setHover(false);
           }}
      >
        <StructurePanel
          data={structure}
          editor={editor}
        />
        <Editor
          className="editor"
          height="100%"
          defaultLanguage="typescript"
          // defaultValue=""
          onChange={handleEditorChange}
          theme="light"
          onMount={(editor) => setEditor(editor)}
          saveViewState={true}
          options={{
            fontSize: 16,
            mouseWheelZoom: true,
            fontLigatures: true,
            fontFamily: 'Fira Code',
            tabSize: 2
          }}
        />
      </div>
    </div>
  );
};
