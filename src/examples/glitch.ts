import { combine, createDomain, createEvent, createStore, restore } from 'effector';

export const domain4 = createDomain('sub domain');
// export const domain5 = domain.createDomain('domain 5');

export const setName = domain4.createEvent<string>('setName');
export const rename = createEvent<string>('rename');
export const resetName = domain4.createEvent('resetName');

export const $fullName = domain4.createStore('', { name: 'fullName' });

$fullName.on(setName, (_, name) => name);
$fullName.on(rename, (_, name) => name);
$fullName.reset(resetName);

export const $firstName = $fullName.map(first => first.split(' ')[0] || '');
// @ts-ignore
// $firstName.graphite.meta.name = 'firstName';

export const $lastName = $fullName.map(last => last.split(' ')[1] || '');
// @ts-ignore
// $lastName.graphite.meta.name = 'lastName';

export const $reverseName = combine(
  $firstName,
  $lastName,
  (first, last) => `${last} ${first}`,
);
// @ts-ignore
// $reverseName.graphite.meta.name = 'reverseName';
// @ts-ignore
// $reverseName.updates.graphite.meta.name = 'reverseName_updates';

$reverseName.watch(name => {
  // console.log('reversed name:', name);
});

$reverseName.watch(name => {
  // console.log('reversed name:', name);
});

$reverseName.updates.watch(name => {
  console.log('reversed name:', name);
});

export const $store2 = restore($reverseName.updates, '');
// @ts-ignore
// $store2.graphite.meta.name = 'store2';
// $store2.watch(console.log);

export const $store3 = createStore('', { name: 'store3' });
$store3.on($reverseName.updates, () => '');
// $store3.watch(console.log);

// setName.watch(console.log);

const event = setName.filterMap(payload => payload);
