import ReactDOM from 'react-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'effector-react';
import Editor from '@monaco-editor/react';
import { GraphViz } from './components/graph-viz';
import { $diagram } from './models/graphite';
import { debouncedTransformCode, run } from './models/ide/transformer';
import { $unitsWatchList } from './models/ide/units-watch-list';
import { $mode, ViewSettings, setMode } from './models/ide/view-settings';
import { LS_CODE_KEY, save } from './models/ide/code';

import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Box, Checkbox, Divider, Stack } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { grey } from '@mui/material/colors';
import { StructurePanel } from './models/ide/view/structurePanel';

import { Autorenew, Menu, Minimize, PlayArrow } from '@mui/icons-material';
import { ViewSettingsPopup } from './models/ide/view/view-settings-popup';
import { toolbarButtonStyle } from './models/ide/view/styles';
import { theme } from './theme';
import { is } from 'effector';
import { getTimelineSeparatorUtilityClass } from '@mui/lab';
import { clamp } from 'lodash';

let timer: NodeJS.Timeout;
const MIN_HEIGHT = '150px';
const MAX_HEIGHT = '50vh';

export const POPUP_ELEMENT_ID = 'popup-root';
let popupTimer: NodeJS.Timeout;

let savedPoint = null;
let savedMinimized = false;
let popupId = 0;

export const clearRender = () => {
  clearTimeout(popupTimer);
  let root = document.querySelector(`#${POPUP_ELEMENT_ID}`);
  root && document.body.removeChild(root);
}

export const popup = (...content: any) => {
  clearRender();
  let root;
  root = createElement('div');
  root.id = POPUP_ELEMENT_ID;
  root.innerHTML = '';

  const popup = createDomElement(null, [content].flat());

  const PopupWindow = () => {
    const [minimized, toggleMinimized] = useState(savedMinimized);
    const graphRef = useRef(null);
    const ref = useRef<HTMLDivElement>(null);

    // useLayoutEffect(() => {
    //   if (!ref.current) return;
    //
    //   requestAnimationFrame(() => {
    //     if (!ref.current) return;
    //     const el = ref.current;
    //     console.log(el);
    //     const bounds = el!.getBoundingClientRect();
    //     console.log('bounds', el!.offsetWidth, bounds.width);
    //     // bounds.width += 24;
    //     bounds.x = clamp(bounds.x, 0, window.innerWidth - bounds.width - 2);
    //     bounds.y = clamp(bounds.y, 0, window.innerHeight - bounds.height - 2);
    //     el!.style.top = `${bounds.y}px`;
    //     el!.style.left = `${bounds.x}px`;
    //     el!.style.width = `${bounds.width}px`;
    //     el!.style.height = `${bounds.height}px`;
    //   });
    // }, [ref.current]);

    const popupBodyRef = useRef<HTMLDivElement>(null);

    return <div
      ref={ref}
      id="popup"
      // animate={{ height: minimized ? 33 : 'auto' }}
      style={{
        // left: savedPoint?.x || (window.innerWidth - 300),
        // top: savedPoint?.y || 50,
        height: minimized ? 34 : popupBodyRef.current?.offsetHeight ? popupBodyRef.current?.offsetHeight + 34 : 'fit-content',
        width: minimized ? 120 : 'fit-content',
      }}
      // drag="x"
      // dragMomentum={false}
      // // dragConstraints={graphRef}
      // onDragTransitionEnd={() => {
      //   savedPoint = ref.current.getBoundingClientRect();
      //   if (savedPoint.x < 0) {
      //     requestAnimationFrame(() => {
      //       console.log(ref.current.style.transform, ref.current.style.left, savedPoint.x);
      //       const tx = parseFloat(ref.current.style.transform.match(/translateX\((?<x>.*)px\)/)?.groups?.x, 10);
      //       // ref.current.style.transform = `translateX(${Math.floor(tx) - Math.floor(savedPoint.x) * 2})`;
      //       ref.current.style.transform = `translateX(0)`;
      //       console.log(ref.current.style.transform);
      //     });
      //     //   console.log('LEFT');
      //   }
      //   // if (savedPoint.x > window.innerWidth - savedPoint.window) {
      //   //   ref.current.style.left = `${window.innerWidth - savedPoint.window}px`;
      //   //   console.log('RIGHT');
      //   // }
      // }}
    >
      <Box
        sx={{
          display: 'flex',
          py: 0,
          pl: 2,
          alignItems: 'center',
          background: theme.palette.secondary.main,
          color: 'white',
        }}
      >
        {/*<IconButton size="small" edge="start" color="inherit" aria-label="menu">*/}
        {/*  <Menu />*/}
        {/*</IconButton>*/}
        <Typography variant="subtitle1" color="inherit" style={{ flexGrow: 1 }}>
          Render
        </Typography>
        <IconButton
          size="small" edge="end" color="inherit"
          onClick={() => {
            toggleMinimized(!minimized);
            savedMinimized = !minimized;
          }}
        >
          <Minimize />
        </IconButton>
      </Box>
      <div id="popup-body"
           ref={popupBodyRef}
           style={{
             maxHeight: `calc(100vh - 180px - ${MIN_HEIGHT})`,
           }}
      >
      </div>
      {/*</div>*/}
    </div>;
  };

  ReactDOM.render(<PopupWindow key={popupId++} />, root);
  document.body.appendChild(root);

  const body = document.getElementById('popup-body');
  body?.appendChild(popup.el);

  popup.close = () => {
    document.body.removeChild(popup.el);
    return popup;
  };
  popup.timeout = (ms: number) => {
    popupTimer = setTimeout(popup.close, ms);
    return popup;
  };
  popup.class = (className: string) => {
    popup.el.className = className;
    return popup;
  };
  popup.pos = (first: any, last?: any, width?: any, height?: any) => {
    if (typeof first === 'object') {
      Object.keys(first).forEach(key => {
        if (['left', 'right', 'top', 'left', 'width', 'height'].includes(key) && typeof first[key] === 'number') {
          first[key] = `${first[key]}px`;
        }
      });
      Object.assign(body.style, first);
    } else {
      body.style.left = typeof first === 'number' ? `${first}px` : first;
      body.style.top = typeof last === 'number' ? `${last}px` : last;
      body.style.width = typeof width === 'number' ? `${width}px` : width;
      body.style.height = typeof height === 'number' ? `${height}px` : height;
    }
    return popup;
  };

  return popup;
};

const setContent = (el: HTMLElement | DocumentFragment | undefined, value: any) => {
  switch (el?.nodeType) {
    case 1:
      if (el && el instanceof HTMLElement) {
        el.innerHTML = value;
      }
      break;
    case 11:
    case 3:
    default:
      if (el) {
        el.textContent = value;
      }
  }
};

const getParams = (values: any[], separator: string = ' '): string => {
  const result: string[] = [];
  values.forEach((val: any) => result.push(getValue(val)));
  return result.join(separator);
};

const getValue = (value: any): string => {
  if (typeof value === 'number') return `${value}px`;
  return value;
};

const buildComponent = (el: HTMLElement) => {
  function perform(...content: any) {
    // @ts-ignore
    const newComponent = buildComponent(perform.el.cloneNode(true));
    if ([content].flat().length !== 0) {
      newComponent.el.innerHTML = '';
    }
    newComponent.el = createDomElement(el.tagName, [content].flat(), newComponent.el).el;
    // @ts-ignore
    perform.el.style = el.style.cssText;
    return newComponent;
  }

  perform.el = el;

  const result = {
    el,
    clone(content: any) {
      // @ts-ignore
      // const newComponent = buildComponent(perform.el!.cloneNode(false));
      if (content) {
        return createDomElement('div', content);
      } else {
        // return newComponent;
      }
    },
    class(className: string) {
      perform.el.className = `${perform.el.className} ${className}`;
      return perform;
    },
    style(value: CSSStyleDeclaration | string | any) {
      if (typeof (value) === 'string') {
        // @ts-expect-error
        perform.el!.style = value;
      } else if (value instanceof CSSStyleDeclaration) {
        // @ts-expect-error
        perform.el!.style = value.cssText;
      } else if ('el' in value) {
        // @ts-expect-error
        perform.el!.style = value.el.style.cssText;
      }
      return perform;
    },
    onClick(handler: any) {
      const prevHandler = perform.el.onclick;
      perform.el.onclick = (e) => {
        handler && handler(e);
        // @ts-expect-error
        prevHandler && prevHandler(e);
      };
      return perform;
    },
    close() {
      document.body.removeChild(perform.el);
      return perform;
    },
    timeout(ms: number) {
      setTimeout(this.close, ms);
    },
    end() {
      perform.el.style.alignSelf = 'flex-end';
      return perform;
    },
    start() {
      perform.el.style.alignSelf = 'flex-start';
      return perform;
    },
    right(value?: any) {
      perform.el.style.display = 'flex';
      perform.el.style.justifyContent = 'flex-end';
      perform.el.style.alignSelf = 'flex-end';
      if (value) {
        return perform.pr(value);
      }
      return perform;
    },
    left(value?: any) {
      perform.el.style.display = 'flex';
      perform.el.style.justifyContent = 'flex-start';
      perform.el.style.alignSelf = 'flex-start';
      if (value) {
        return perform.pl(value);
      }
      return perform;
    },
    center() {
      perform.el.style.display = 'flex';
      perform.el.style.justifyContent = 'center';
      perform.el.style.alignItems = 'center';
      perform.el.style.alignSelf = 'center';
      return perform;
    },
    top(value?: any) {
      perform.el.style.display = 'flex';
      perform.el.style.alignItems = 'flex-start';
      if (value) {
        return perform.pt(value);
      }
      return perform;
    },
    bottom(value?: any) {
      perform.el.style.display = 'flex';
      perform.el.style.alignItems = 'flex-end';
      if (value) {
        return perform.pb(value);
      }
      return perform;
    },
    gap(value: any) {
      perform.el.style.gap = getValue(value);
      return perform;
    },
    p(...values: any) {
      perform.el.style.padding = getParams(values);
      return perform;
    },
    px(value: any) {
      perform.el.style.paddingLeft = getValue(value);
      perform.el.style.paddingRight = getValue(value);
      return perform;
    },
    pr(value: any) {
      perform.el.style.paddingRight = getValue(value);
      return perform;
    },
    pl(value: any) {
      perform.el.style.paddingLeft = getValue(value);
      return perform;
    },
    py(value: any) {
      perform.el.style.paddingTop = getValue(value);
      perform.el.style.paddingBottom = getValue(value);
      return perform;
    },
    pb(value: any) {
      perform.el.style.paddingBottom = getValue(value);
      return perform;
    },
    pt(value: any) {
      perform.el.style.paddingTop = getValue(value);
      return perform;
    },
    m(...values: any) {
      perform.el.style.margin = getParams(values);
      return perform;
    },
    mx(value: any) {
      perform.el.style.marginLeft = getValue(value);
      perform.el.style.marginRight = getValue(value);
      return perform;
    },
    mr(value: any) {
      perform.el.style.marginRight = getValue(value);
      return perform;
    },
    ml(value: any) {
      perform.el.style.marginLeft = getValue(value);
      return perform;
    },
    my(value: any) {
      perform.el.style.marginTop = getValue(value);
      perform.el.style.marginBottom = getValue(value);
      return perform;
    },
    mb(value: any) {
      perform.el.style.marginBottom = getValue(value);
      return perform;
    },
    mt(value: any) {
      perform.el.style.marginTop = getValue(value);
      return perform;
    },
    border(value: any, color?: any) {
      perform.el.style.border = `${getValue(value)} solid black`;
      if (color) {
        perform.el.style.borderColor = color;
      }
      return perform;
    },
    bg(value: any) {
      perform.el.style.background = value;
      return perform;
    },
    fg(value: any) {
      perform.el.style.color = value;
      return perform;
    },
    color(value: any) {
      perform.el.style.color = value;
      return perform;
    },
    size(value: any, value2?: any) {
      perform.w(value);
      perform.h(value);
      perform.h(value2);
      return perform;
    },
    w(value: any) {
      if (typeof value === 'undefined') return perform;
      perform.el.style.width = getValue(value);
      perform.el.style.maxWidth = getValue(value);
      return perform;
    },
    h(value: any) {
      if (typeof value === 'undefined') return perform;
      perform.el.style.height = getValue(value);
      perform.el.style.maxHeight = getValue(value);
      return perform;
    },
    bold(value: any) {
      perform.el.style.fontWeight = getValue(value) || 'bold';
      return perform;
    },
    fontSize(value: any) {
      perform.el.style.fontSize = getValue(value);
      return perform;
    },
  };

  Object.assign(perform, result);

  return perform;
};

const createElement = (tag: string) => {
  const el = document.createElement(tag);
  el.style.boxSizing = 'border-box';
  return el;
};

function createDomElement<T>(tag: string | null, content?: any, el?: T | DocumentFragment | undefined) {
  // @ts-expect-error
  el = el || (tag ? createElement(tag) : document.createDocumentFragment());

  // content = typeof content === 'function' ? content(content) : content;

  if (is.store(content)) {
    // @ts-ignore
    el = createElement('span');
    content.watch(value => {
      // console.log('watch', content.shortName, value, el, el?.nodeType);
      setContent(el, value);
    });
  } else if (is.event(content) || is.effect(content)) {
    const prevHandler = el.onclick;
    el.onclick = e => {
      console.log('onclick', content.shortName);
      prevHandler && prevHandler(e);
      content(e);
    };
  } else if (content?.$$typeof === Symbol.for('react.element')) {
    el = createElement('span');
    ReactDOM.render(content, el);
  } else if (Array.isArray(content)) {
    content.forEach(c => {
      const sub = createDomElement(null, c).el;
      el.appendChild(sub);
    });
  } else if (content instanceof HTMLElement || content?.el instanceof HTMLElement) {
    if (content?.el instanceof HTMLElement) {
      el.appendChild(content.el);
    } else {
      el.appendChild(createDomElement('div', content).el);
    }
  } else if (typeof content === 'function' || typeof content === 'object') {
    console.error(content);
  } else {
    setContent(el, content);
  }

  return buildComponent(el);
}

const input = (...content: any) => {
  const event = content.find(c => is.event(c));
  const store = content.find(c => is.store(c));
  const label = content.find(c => typeof (c) === 'string') || store?.shortName;
  const i = createDomElement<HTMLInputElement>('input');
  i.el.className = 'popup-input';
  i.el.oninput = (e) => {
    // @ts-expect-error
    event && event(e.target?.value);
    e.preventDefault();
  };
  if (is.store(store)) {
    // @ts-expect-error
    store.watch((value: any) => i.el.value = value);
    if (typeof store.getState() === 'number') {
      i.el.type = 'number';
    } else {
      i.el.type = 'text';
    }
  }
  if (label) {
    const l = createElement('label');
    l.innerHTML = `<div class="popup-label">${label}</div>`;
    l.appendChild(i.el);
    return buildComponent(l);
  } else {
    return i;
  }
};

const button = (...content: any) => {
  let btn;
  const event = content.find((c: any) => is.event(c));
  if (content.length === 1 && event) {
    btn = createDomElement<HTMLButtonElement>('button', event.shortName);
    btn.onClick(event);
  } else if (event) {
    btn = createDomElement<HTMLButtonElement>('button', content.filter((c: any) => !is.event(c)));
    btn.onClick(event);
  } else {
    btn = createDomElement<HTMLButtonElement>('button', content);
  }
  btn.el.className = 'popup-button';
  return btn;
};

const use = (...content: any) => {
  const units = content.filter(c => is.unit(c));
  const rc = content.filter(c => c?.$$typeof === Symbol.for('react.element'));

};

const grid = (...content: any) => {
  const obj = createDomElement<HTMLDivElement>('grid', content);
  return obj;
};

const div = (...content: any) => {
  const obj = createDomElement<HTMLDivElement>('div', content);
  return obj;
};

const directContainer = (...content: any) => {
  let obj = null;
  if (content.length === 2) {
    // @ts-expect-error
    obj = repeat(...content);
  }
  if (!obj) {
    obj = createDomElement<HTMLDivElement>('div', content);
  }
  return obj;
};

const row = (...content: any) => {
  const obj = directContainer(...content);
  obj.el.className = 'popup-row';
  return obj;
};

const col = (...content: any) => {
  const obj = directContainer(...content);
  obj.el.className = 'popup-column';
  return obj;
};

function repeat(n: any, cb: (i: number) => any): any {
  function getResult(count: number) {
    let result: any = [];
    for(let idx = 0; idx < clamp(count, 0, 300); idx++) {
      result.push(cb(idx));
    }
    return result;
  }

  if (cb || typeof cb !== 'function') {
    if (is.store(n)) {
      const obj = createDomElement<HTMLDivElement>('div', ['result']);
      n.watch(val => {
        const res = getResult(parseInt(val, 10));
        obj.el.innerHTML = '';
        res.forEach(item => obj.el.appendChild(item?.el));
      });
      return obj;
    } else if (typeof n === 'number'){
      return createDomElement<HTMLDivElement>('div', getResult(n));
    }
  }
  return null
}

// @ts-ignore
Object.assign(window, {
  render: popup,
  button,
  row,
  col,
  div,
  grid,
  input,
  use,
});

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    e.stopPropagation();
    run();
  }
};

const EDITOR_MINIMIZE_TIMEOUT = 2500;
export const App = () => {
  // @ts-ignore
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>(null);
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [hover, setHover] = useState(false);

  const refIde = useRef(null);

  const structure = useStore($unitsWatchList);
  const diagram = useStore($diagram);
  const mode = useStore<ViewSettings>($mode);

  function maximizeEditor() {
    clearTimeout(timer);
    setHeight(MAX_HEIGHT);
    setHover(true);
  }

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

  const handleEditorChange = useCallback((value: any, _event: any) => {
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  const toggleAutorun = () => setMode({ ...mode, autorun: !mode.autorun });

  return (
    <div>
      <AppBar position="static" sx={{ m: 0, p: 0 }}>
        <Toolbar variant="dense" sx={{ boxShadow: 5, justifyContent: 'space-between' }} style={{ paddingRight: 8 }}>
          <Stack direction="row" alignItems="center">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Playground
            </Typography>
          </Stack>

          <Stack direction="row"
                 alignItems="center"
                 divider={<Divider color="white" orientation="vertical" flexItem />}
                 spacing={1}
          >
            <ViewSettingsPopup
              data={structure}
              mode={mode}
              onChange={setMode}
            />

            <FormControlLabel
              label="Autorun"
              sx={{ pr: 2 }}
              control={
                <Checkbox
                  checked={mode.autorun}
                  onChange={toggleAutorun}
                  sx={{
                    color: grey[200],
                    '&.Mui-checked': {
                      color: grey[200],
                    },
                  }}
                />
              }
            />

            <Button
              onClick={() => run()}
              endIcon={mode.autorun ? <Autorenew /> : <PlayArrow />}
              sx={{ ...toolbarButtonStyle, width: 80 }}
            >
              Run
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <div id="graph"
           className="graph"
           style={{ height: `calc(100vh - 60px - ${MIN_HEIGHT})` }}
      >
        <GraphViz dot={diagram} />
      </div>

      <Box
        className="ide"
        style={{ height }}
        ref={refIde}
        onMouseDown={maximizeEditor}
        onMouseEnter={(e) => {
          if (e.buttons === 0) maximizeEditor();
        }}
        onMouseLeave={(e) => {
          if (e.buttons === 0) {
            timer = setTimeout(() => setHeight(MIN_HEIGHT), EDITOR_MINIMIZE_TIMEOUT);
            setHover(false);
          }
        }}
      >
        <StructurePanel
          data={structure}
          editor={editor}
        />

        <Editor
          className="editor"
          height="100%"
          defaultLanguage="javascript"
          onChange={handleEditorChange}
          theme="light"
          onMount={(editor) => {
            setEditor(editor);
            editor.focus();
          }}
          saveViewState={false}
          options={{
            fontSize: 16,
            mouseWheelZoom: true,
            fontLigatures: true,
            fontFamily: 'Fira Code',
            tabSize: 2,
          }}
        />
      </Box>
    </div>
  );
};
