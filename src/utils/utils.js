// eslint-disable-next-line import/prefer-default-export
export const parse = (arr, selected, items) => {
  const duplicate = [];
  const filterSelected = selected.map((select) => select.id);
  const selectObj = {

  };
  filterSelected.forEach((select) => {
    if (selectObj[select] === undefined) {
      selectObj[select] = 1;
    } else {
      // eslint-disable-next-line no-plusplus
      selectObj[select]++;
    }
  });
  const newArrSet = new Set(arr);
  const newArr = [...newArrSet];
  const nonDuplicateSet = new Set();
  newArr.forEach((item) => {
    const base1 = items[item].connect[0];
    const base2 = items[item].connect[1];
    if (base1 === base2 && selectObj[base1] >= 2) {
      duplicate.push(item);
    } else if (
      base1 !== base2
      && filterSelected.includes(base1)
      && filterSelected.includes(base2)
    ) {
      duplicate.push(item);
    } else {
      nonDuplicateSet.add(item);
    }
  });

  return {
    duplicate,
    nonDuplicate: [...nonDuplicateSet],
  };
};

module.export = {
  parse,
};
