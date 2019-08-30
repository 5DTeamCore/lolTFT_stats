
/* eslint-disable import/no-extraneous-dependencies */
/* @flow */
import React from 'react';
import axios from 'axios';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import itemConfig from '../config/itemConfig';

type Props = {
  selected: any,
  closeModal: Function,
};

type State = {
  file: File | string,
  imagePreviewUrl: string,
  item: any,
  connectChanged: boolean,
}

class ItemModal extends React.Component<Props, State> {
  state: State = {
    file: '',
    imagePreviewUrl: '',
    item: {
      ...this.props.selected,
      ...this.props.selected.logo,
    },
    connectChanged: false,
  }

  handleInputChange = (key: any, event: any) => {
    const {
      item,
    } = this.state;
    const val = event.target.value;
    this.setState({
      item: {
        ...item,
        [key]: val,
      },
      connectChanged: key === 'connect',
    });
  }

  parsePayload(data: any) {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      type: data.type,
      logo: {
        src: data.src,
        alt: data.alt,
      },
      connect: JSON.parse(`[${data.connect}]`),
    };
  }

  handleSubmit() {
    const {
      file,
      item,
      connectChanged,
    } = this.state;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('item', JSON.stringify(this.parsePayload(item)));
    formData.append('itemOptions', JSON.stringify({
      connectChanged,
    }));
    axios.post('http://localhost:8001/update/item', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(() => { this.props.closeModal(true); });
  }

  handleImageChange(e) {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: `${reader.result}`,
      });
    };

    reader.readAsDataURL(file);
  }

  render() {
    const {
      item,
    } = this.state;

    const inputFields = itemConfig.map((config) => {
      const {
        key,
        title,
        type,
        options,
        width,
      } = config;
      let component = null;
      switch (type) {
      case 'TEXT':
        component = (
          <div>
            <InputLabel>{title}</InputLabel>
            <Input
              value={item[key]}
              onChange={(event) => { this.handleInputChange(key, event); }}
            />
          </div>
        );
        break;
      case 'TEXTAREA':
        component = (
          <div>
            <InputLabel>{title}</InputLabel>
            <TextareaAutosize
              className="text-area"
              rows={options.row}
              value={item[key]}
              onChange={(event) => { this.handleInputChange(key, event); }}
            />
          </div>
        );
        break;
      case 'IMAGE':
        component = (
          <div>
            <img src={item[key]} />
            <input
              className="fileInput"
              type="file"
              onChange={(e) => this.handleImageChange.call(this, e)}
            />
            <img src={this.state.imagePreviewUrl} />
          </div>
        );
        break;
      case 'SELECT':
        component = (
          <div>
            <InputLabel>{title}</InputLabel>
            <Select
              value={item[key]}
              onChange={(event) => { this.handleInputChange(key, event); }}
              inputProps={{
                name: 'age',
                id: 'age-simple',
              }}
            >
              {
                options.items.map((selectItem) => <MenuItem value={selectItem}>{selectItem}</MenuItem>)
              }
            </Select>
          </div>
        );
        break;
      default:
        return null;
      }
      return (
        <div
          className="input-row"
          style={{
            width: `${width}%`,
            display: 'inline-block',
            boxSizing: 'border-box',
          }}
        >
          {component}
        </div>
      );
    });
    return (
      <div>
        {inputFields}
        <div>
          <button
            type="button"
            onClick={(e) => this.handleSubmit.call(this, e)}
          >
Submit
          </button>
        </div>
      </div>
    );
  }
}

export default ItemModal;
