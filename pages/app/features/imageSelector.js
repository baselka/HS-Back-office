import React, { Component } from 'react';

export default class ImageUploadComponent extends Component {

    fileArray = [];
    fileObj = [];

    constructor(props) {
        super(props)
        this.state = {
            file: []
        }
        this.uploadFiles = this.uploadFiles.bind(this)
        // this.remove = this.remove.bind(this)
    }

    remove(index) {
        let newList = this.state.file;
        newList.splice(index, 1);
        this.fileArray = newList;
        this.setState({ file: this.fileArray });
        
        let newObjList = this.fileObj;
        newObjList.splice(index, 1);
        this.fileObj = newObjList;
        this.props.uploadImages(this.fileObj);
    }

    uploadFiles(e) {
        const fileUrl = e.target.files;
        let urls = [];
        for (let i = 0; i < fileUrl.length; i++) {
            urls.push(URL.createObjectURL(fileUrl[i]))
        }
        if(urls.length){
            this.fileArray.push(urls[0]);
            this.setState({ file: this.fileArray });
            this.fileObj.push(fileUrl[0]);
            this.props.uploadImages(this.fileObj);
        }
    }

    render() {
        return (
            <div className="clearfix" >
                <div className="form-group multi-preview addNewImageCont" >
                    {(this.fileArray || []).map((url, index) => (
                        <div key={index} className="border-8 border-transparent rounded shadow-sm w-5/5 h-48 imagecontainer relative">
                            <img src={url} className="w-5/5" alt="..." />
                            <i className="w-34 h-34 p-0 cursor-pointer rounded-full icon-close text-xl absolute right-0 top-0 text-white z-0" onClick={()=>this.remove(index)} />
                        </div>
                    ))}
                    {this.fileArray.length < 1 &&
                        <input type="file" accept="image/png, image/jpeg" className="float-right m-0 border-8 border-transparent rounded shadow-sm w-1/5 h-48 addNewImageBtn" style={{width:250}} onChange={this.uploadFiles}  />
                    }
                </div>
            </div>
        )
    }
}