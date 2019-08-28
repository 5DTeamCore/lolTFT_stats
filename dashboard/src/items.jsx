/* eslint-disable import/no-extraneous-dependencies */
/* @flow */
import React from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import ItemModal from './component/itemModal';

// css
require('./css/items.css');

type Props = {||};

type State = {
  items: any,
  selected: Object,
  modalOpen: boolean,
}

class Items extends React.Component<Props, State> {
  state: State = {
    items: [],
    selected: {

    },
    modalOpen: false,
  }

  componentDidMount() {
    axios.get('http://localhost:8001/items')
      .then((response) => {
        this.setState({
          items: response.data,
        });
      });
  }

  handleOpen = (item: any) => {
    this.setState({
      modalOpen: true,
      selected: item,
    });
  };

  handleClose = () => {
    this.setState({
      modalOpen: false,
    });
  };


  render() {
    const {
      items,
    } = this.state;
    return (
      <div>
        <div className="title">Items</div>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Icon</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>
                    {item.name}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell><img src={item.logo.src} /></TableCell>
                  <TableCell><button type="button" onClick={() => { this.handleOpen(item); }}>Edit</button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modalOpen}
          onClose={this.handleClose}
        >
          <div className="modal-container">
            <ItemModal selected={this.state.selected} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default Items;