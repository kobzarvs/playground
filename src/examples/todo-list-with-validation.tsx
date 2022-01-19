import { createEvent, createStore, createEffect, restore, combine, sample } from 'effector';
import { useStore, useList } from 'effector-react';
import { MouseEvent } from 'react';

const submit = createEvent<MouseEvent>('submit');
const submitted = createEvent<string>('submitted');
const completed = createEvent<number>('completed');
const changed = createEvent<string>('changed');
const removed = createEvent<number>('removed');

type Todo = {
  text: string;
  completed: boolean;
}

const validateFx = createEffect({
  handler: ([todo, todos]: [string, Todo[]]): string | null => {
    if (todos.some(item => item.text === todo)) {
      return 'This todo is already on the list';
    }

    if (!todo.trim().length) {
      return 'Required field';
    }

    return null;
  },
  name: 'validateFx'
});

const $todo = restore(changed, '').reset(submitted);
// @ts-ignore
const $error = restore(validateFx.failData, null)
  .reset(changed);

export const $todos = createStore<Todo[]>([], { name: 'todos' })
.on(submitted, (prev, next) => [...prev, { text: next, completed: false }])
.on(completed, (state, index) => state.map((item, i) => ({
  ...item,
  completed: index === i ? !item.completed : item.completed,
})))
.on(removed, (state, index) => state.filter((_, i) => i !== index));

sample({
  clock: submit,
  source: [$todo, $todos],
  target: validateFx,
});

sample({
  clock: validateFx.done,
  source: $todo,
  target: submitted,
});

submit.watch((e) => e.preventDefault());

// export const TodoExample = () => {
//   // const tasks = useStore($todos);
//   const todo = useStore($todo);
//   // const error = useStore($error);
//
//   // const list = useList($todos, (item, index) => (
//   //   <li style={{ textDecoration: item.completed ? 'line-through' : '' }}>
//   //     <input
//   //       type="checkbox"
//   //       checked={item.completed}
//   //       onChange={() => completed(index)}
//   //     />
//   //     {item.text}
//   //     <button type="button" onClick={() => removed(index)} className="delete">
//   //       x
//   //     </button>
//   //   </li>
//   // ));
//
//   return (
//     <div>
//       <h1>Todos</h1>
//       <form>
//         <input
//           className="text"
//           type="text"
//           name="todo"
//           value={todo}
//           onChange={e => changed(e.target.value)}
//         />
//         <button type="submit" onClick={submit} className="submit">
//           Submit
//         </button>
//         {/*{error && <div className="error">{error}</div>}*/}
//       </form>
//
//       {/*<ul style={{ listStyle: 'none' }}>{list}</ul>*/}
//     </div>
//   );
// };
