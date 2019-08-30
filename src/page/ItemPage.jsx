import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ItemTable from '../component/ItemTable';
import {
  itemTableConfig,
} from '../config/tableConfig';

import {
  parse,
} from '../utils/utils';
import {
  CHOOSE_BASE,
} from '../constants/constants';
// css
require('../css/itemPage.css');

type Props = {
  allItems: any,
  baseItems: any,
  selected: Array<any>,
  selectItem: Function,
  removeItem: Function,
}

type State = {
  combinations: any
}

const getCombinations = (props) => {
  const {
    selected,
  } = props;
  let combinations = [];
  selected.forEach((item) => {
    combinations = [...combinations, ...item.connect];
  });
  return combinations;
};

class ItemPage extends React.Component<Props, State> {
  state: State = {
    combinations: getCombinations(this.props),
    expanded: 'panel1',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const combinations = getCombinations(nextProps);
    if (prevState.combinations !== combinations) {
      return {
        combinations,
      };
    }
    return null;
  }

  onExpand = (panel) => (event, newExpanded) => {
    this.setState({
      expanded: newExpanded ? panel : false,
    });
  }

  onSelectItem = (item) => {
    this.props.selectItem(item);
  }

  onRemoveItem = (index) => {
    const temp = [...this.props.selected];
    temp.splice(index, 1);
    this.props.removeItem(temp);
  }

  onReset = () => {
    this.props.removeItem([]);
  }

  renderCombinationList = (comboList) => comboList.map((combId) => {
    const combinedItem = this.props.allItems[combId];
    return combinedItem;
  })

  render() {
    const {
      allItems,
      baseItems,
      selected,
    } = this.props;
    const {
      combinations,
    } = this.state;
    const list = Object.keys(baseItems).map((key, index) => {
      const item = baseItems[key];
      return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className="item"
          key={`base-items-${index}`}
          onClick={this.onSelectItem.bind(this, item)}
        >
          <img
            alt={item.logo.alt}
            src={`${item.logo.src}`}
          />
          <p className="name">{item.name}</p>
        </div>
      );
    });

    const selectedList = selected.map((item, index) => (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        className="item"
        key={`selected-${index}`}
        onClick={this.onRemoveItem.bind(this, index)}
      >
        <img
          alt={item.logo.alt}
          src={`${item.logo.src}`}
        />
      </div>
    ));

    const {
      duplicate,
      nonDuplicate,
    } = parse(combinations, selected, allItems);

    return (
      <div className="item-page">
        <div className="item-container">
          <div className="base-items-title">Base Items</div>
          <div className="base-items">{list}</div>
        </div>
        <div className="item-selected-container">
          {
            selectedList.length === 0
              ? (<div className="item-page-message">{CHOOSE_BASE}</div>) : null
          }
          {
            selectedList.length !== 0
              ? (
                <div className="selected-items-wrapper">
                  <div className="selected-items-title">Selected Items</div>
                  <div className="selected-items">{selectedList}</div>
                  <button onClick={this.onReset} type="submit" className="reset-button">Reset Selection</button>
                </div>
              ) : null
          }
          {
            duplicate.length !== 0
              ? (
                <ExpansionPanel expanded={this.state.expanded === 'panel1'} onChange={this.onExpand('panel1')}>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="can-build-items-title"
                  >
                    <div className="can-build-items-title">Can Build Items</div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails
                    className="can-build-items"
                  >
                    <ItemTable
                      tableConfig={itemTableConfig}
                      items={this.renderCombinationList(duplicate)}
                    />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ) : null
          }
          {
            nonDuplicate.length !== 0
              ? (
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="could-build-items-title"
                  >
                    <div className="could-build-items-title">Could Build Items</div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails
                    className="could-build-items"
                  >
                    <ItemTable
                      tableConfig={itemTableConfig}
                      items={this.renderCombinationList(nonDuplicate)}
                    />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ) : null
          }

        </div>
      </div>
    );
  }
}

module.exports = ItemPage;
