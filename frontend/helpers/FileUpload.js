import React, {PropTypes, Component} from 'react';
import axios from 'axios';
import { send as create } from 'redux/modules/message';

export class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.handleUploadFile = this.handleUploadFile.bind(this);
  }
  componentDidMount() {

  }
  handleUploadFile(event, props) {
    const chatId = props.chat._id;
    const userId = props.user._id;
    const data = new FormData();
    data.append('file', event.target.files[0]);
    data.append('name', event.target.files[0].name);
    data.append('description', event.target.files[0].type);
    data.append('chatId', chatId);
    data.append('userId', userId);

    axios.post('http://localhost:3030/uploadFile', data).then(() => {
    }).catch((err) => {
      alert(err.response.data);
    });
  }

  render() {
    return (<div>
      <input type="file" className="fa fa-picture-o" accept="image/*" onChange={this.handleUploadFile}/>
    </div>);
  }
}
