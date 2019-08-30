export default [
  {
    key: 'src',
    title: 'IMAGE',
    type: 'IMAGE',
    width: '50',
  },
  {
    key: 'alt',
    title: 'IMAGE_ALT',
    type: 'TEXT',
    width: '50',
  },
  {
    key: 'id',
    title: 'ID',
    type: 'TEXT',
    width: '50',
  },
  {
    key: 'name',
    title: 'NAME',
    type: 'TEXT',
    width: '50',
  },
  {
    key: 'description',
    title: 'DESCRIPTION',
    type: 'TEXTAREA',
    width: '50',
    options: {
      row: 9,
    },
  },
  {
    key: 'type',
    title: 'TYPE',
    type: 'SELECT',
    width: '50',
    options: {
      items: ['BASE', 'COMBINED'],
    },
  },
  {
    key: 'connect',
    title: 'CONNECT',
    type: 'TEXT',
    width: '50',
  },
];
