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
import TablePagination from '@material-ui/core/TablePagination';
import ItemModal from './component/itemModal';

// css
require('./css/items.css');

type Props = {||};

type State = {
  items: any,
  selected: Object,
  lastId: number,
  modalOpen: boolean,
  rowsPerPage: number,
  page: number,
}

class Items extends React.Component<Props, State> {
  state: State = {
    items: [],
    selected: {

    },
    lastId: 0,
    modalOpen: false,
    rowsPerPage: 5,
    page: 0,
  }

  componentDidMount() {
    this.getItemData();
  }

  getItemData() {
    axios.get('http://localhost:8001/items')
      .then((response) => {
        let highestId = 0;
        response.data.forEach((item) => {
          if (item.id > highestId) {
            highestId = item.id;
          }
        });
        this.setState({
          items: response.data,
          lastId: highestId + 1,
        });
      });
  }

  handleOpen = (item: any) => {
    this.setState({
      modalOpen: true,
      selected: item,
    });
  };

  handleClose = (updateData: any) => {
    this.setState({
      modalOpen: false,
      selected: {

      },
    }, () => {
      if (updateData) {
        this.getItemData();
      }
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({
      page: 0,
      rowsPerPage: event.target.value,
    });
  }

  render() {
    const {
      items,
      lastId,
      rowsPerPage,
      page,
    } = this.state;
    return (
      <div>
        <div className="title">Items</div>
        <div className="create-btn-container">
          <button
            className="create-btn"
            type="submit"
            onClick={() => {
              this.handleOpen({
                id: lastId,
              });
            }}
          >
Create
          </button>
        </div>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Icon</TableCell>
                <TableCell>Combined</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                <TableRow key={item.name}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>
                    {item.name}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell><img src={item.logo.src} /></TableCell>
                  <TableCell>{JSON.stringify(item.connect)}</TableCell>
                  <TableCell><button type="button" onClick={() => { this.handleOpen(item); }}>Edit</button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={items.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'previous page',
            }}
            nextIconButtonProps={{
              'aria-label': 'next page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modalOpen}
          onClose={this.handleClose}
        >
          <div className="modal-container">
            <ItemModal selected={this.state.selected} closeModal={this.handleClose} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default Items;
